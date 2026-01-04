import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Search, Filter, Plus } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";

const LabTestContainer = styled.div`
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

const NewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
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

const LabTest = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [labTestsData, setLabTestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lab tests from API
  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        setLoading(true);
        const response = await api.get("https://hms.automedai.in/api/resource/Lab Test", {
          fields: '["name","patient","patient_name","status","lab_test_name"]',
          filters: '[["Lab Test","status","!=","Completed"]]',
        });

        console.log("Lab Tests API Response:", response);

        if (response.data && response.data.data) {
          setLabTestsData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching lab tests:", err);
        setError(err.message || "Failed to load lab tests");
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, []);

  const columns = [
    { key: "name", label: "ID" },
    { key: "patient", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "lab_test_name", label: "TEST NAME" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTION" },
  ];

  const renderStatus = (status) => {
    return <StatusBadge status={status}>{status}</StatusBadge>;
  };

  const renderActions = (row) => {
    return (
      <ActionsContainer>
        <ActionLink onClick={() => handleAddResult(row)}>
          Add result
        </ActionLink>
      </ActionsContainer>
    );
  };

  const handleAddResult = (row) => {
    navigate(`/pathlab/labtest/${row.name}/result`, {
      state: {
        patientId: row.patient,
        patientName: row.patient_name,
      }
    });
  };

  const handleNewTest = () => {
    navigate("/pathlab/labtest/new");
  };

  const handleFilter = () => {
    console.log("Open filter modal");
    // TODO: Open filter modal
  };

  const filteredData = labTestsData.filter((test) =>
    Object.values(test).some((value) =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Layout>
      <LabTestContainer>
        <PageTitle>Lab Test List</PageTitle>

        {loading && <div>Loading lab tests...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        <ToolbarSection>
          <SearchContainer>
            <SearchIcon>
              <Search />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <ButtonGroup>
            <FilterButton onClick={handleFilter}>
              <Filter />
              Filter
            </FilterButton>
            <NewButton onClick={handleNewTest}>
              <Plus />
              New Test
            </NewButton>
          </ButtonGroup>
        </ToolbarSection>

        <DataTable
          columns={columns}
          data={filteredData}
          sortableColumns={["id", "patient_id", "patient_name", "date", "time"]}
          renderStatus={renderStatus}
          renderActions={renderActions}
        />
      </LabTestContainer>
    </Layout>
  );
};

export default LabTest;
