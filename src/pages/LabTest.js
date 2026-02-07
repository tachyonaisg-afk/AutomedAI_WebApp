import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Search, Filter, Plus } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

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
    if (props.status === "Collected") return "#dcfce7";
    if (props.status === "Not Collected") return "#fee2e2";
    return "#f5f5f5";
  }};

  color: ${(props) => {
    if (props.status === "Collected") return "#16a34a";
    if (props.status === "Not Collected") return "#dc2626";
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
  usePageTitle("Lab Tests");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [labTestsData, setLabTestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sampleStatusMap, setSampleStatusMap] = useState({});

  // Fetch lab test count
  const fetchLabTestCount = async () => {
    try {
      const params = {
        doctype: "Lab Test",
        filters: JSON.stringify({ status: ["!=", "Completed"] }),
      };

      console.log("📊 Fetching lab test count with params:", params);

      const response = await api.get(API_ENDPOINTS.LAB_TEST.COUNT, params);

      console.log("📊 Count API Response:", response);

      const count = response.data?.message || response.data?.data || 0;
      console.log("📊 Total Lab Test Count:", count);

      setTotalCount(count);
    } catch (err) {
      console.error("❌ Error fetching lab test count:", err);
      setTotalCount(0);
    }
  };

  // Fetch lab tests from API
  const fetchLabTests = async (page, limit) => {
    try {
      setLoading(true);
      setError(null);

      const limitStart = (page - 1) * limit;

      const params = {
        fields: '["name","patient","patient_name","status","lab_test_name","sample"]',
        filters: '[["Lab Test","status","!=","Completed"]]',
        order_by: "creation desc",
        limit_start: limitStart,
        limit_page_length: limit,
      };

      console.log("📊 Fetching lab tests with params:", params);

      // Fetch count separately
      await fetchLabTestCount();

      const response = await api.get(API_ENDPOINTS.LAB_TEST.LIST, params);

      console.log("📊 Lab Tests API Response:", response);

      if (response.data && response.data.data) {
        const tests = response.data.data;
        setLabTestsData(tests);

        const sampleIds = tests.map((t) => t.sample);
        await fetchSampleStatuses(sampleIds);
      }

    } catch (err) {
      console.error("❌ Error fetching lab tests:", err);
      setError(err.message || "Failed to load lab tests");
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleStatuses = async (sampleIds = []) => {
    try {
      const uniqueSamples = [...new Set(sampleIds.filter(Boolean))];

      if (uniqueSamples.length === 0) return;

      const statusMap = {};

      // If your backend DOES NOT support bulk fetch
      await Promise.all(
        uniqueSamples.map(async (sampleId) => {
          const res = await api.get(
            `/resource/Sample Collection/${sampleId}`
          );

          const docstatus = res.data?.data?.docstatus ?? 0;
          statusMap[sampleId] = docstatus;
        })
      );

      setSampleStatusMap(statusMap);
    } catch (err) {
      console.error("❌ Error fetching sample status:", err);
    }
  };

  useEffect(() => {
    fetchLabTests(currentPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const columns = [
    { key: "name", label: "ID" },
    { key: "patient", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "lab_test_name", label: "TEST NAME" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTION" },
  ];

  const renderStatus = (_, row) => {
    const docstatus = sampleStatusMap[row.sample];

    const label = docstatus === 1 ? "Collected" : "Not Collected";

    return (
      <StatusBadge status={label}>
        {label}
      </StatusBadge>
    );
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

  // Client-side filtering for search
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
          sortableColumns={["name", "patient", "patient_name"]}
          renderStatus={renderStatus}
          renderActions={renderActions}
          serverSide={true}
          totalCount={totalCount}
          currentPageProp={currentPage}
          rowsPerPageProp={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </LabTestContainer>
    </Layout>
  );
};

export default LabTest;
