import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Search, Filter, Printer } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ToolbarSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999999;
  display: flex;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.status === "Completed") return "#dcfce7";
    if (props.status === "In Progress") return "#dbeafe";
    if (props.status === "Pending") return "#fef3c7";
    if (props.status === "Cancelled") return "#fee2e2";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.status === "Completed") return "#16a34a";
    if (props.status === "In Progress") return "#2563eb";
    if (props.status === "Pending") return "#d97706";
    if (props.status === "Cancelled") return "#dc2626";
    return "#666666";
  }};
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;

  &:hover {
    color: #357abd;
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PathLabResults = () => {
  usePageTitle("Test Results");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsData, setResultsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch completed lab tests from API
  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        setLoading(true);
        const response = await api.get("https://hms.automedai.in/api/resource/Lab Test", {
          fields: '["name","patient","patient_name","status"]',
          filters: '[["Lab Test","status","=","Completed"]]',
        });

        console.log("Completed Lab Tests API Response:", response);

        if (response.data && response.data.data) {
          setResultsData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching completed lab tests:", err);
        setError(err.message || "Failed to load completed lab tests");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTests();
  }, []);

  const columns = [
    { key: "name", label: "ID" },
    { key: "patient", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTION" },
  ];

  const renderStatus = (status) => {
    return <StatusBadge status={status}>{status}</StatusBadge>;
  };

  const renderActions = (row) => {
    return (
      <ActionsContainer>
        <ActionLink onClick={() => handlePrint(row)}>
          <Printer />
          Print
        </ActionLink>
      </ActionsContainer>
    );
  };

  const handlePrint = (row) => {
    navigate("/pathlab/result-print", {
      state: {
        labTestId: row.name,
        patientId: row.patient,
        patientName: row.patient_name,
      }
    });
  };

  const handleFilter = () => {
    console.log("Open filter modal");
    // TODO: Open filter modal
  };

  const filteredData = resultsData.filter((test) =>
    Object.values(test).some((value) =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Layout>
      <ResultsContainer>
        <PageTitle>Lab Test Results</PageTitle>

        {loading && <div>Loading completed lab tests...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        <ToolbarSection>
          <SearchContainer>
            <SearchIcon>
              <Search />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <ButtonGroup>
            <FilterButton onClick={handleFilter}>
              <Filter />
              Filter
            </FilterButton>
          </ButtonGroup>
        </ToolbarSection>

        <DataTable
          columns={columns}
          data={filteredData}
          sortableColumns={["name", "patient", "patient_name"]}
          renderStatus={renderStatus}
          renderActions={renderActions}
        />
      </ResultsContainer>
    </Layout>
  );
};

export default PathLabResults;
