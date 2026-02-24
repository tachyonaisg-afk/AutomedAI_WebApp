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
const FilterModalOverlay = styled.div`
position: fixed;
inset: 0;
background: rgba(0,0,0,0.35);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
`;

const FilterModal = styled.div`
background: #fff;
width: 520px;
border-radius: 12px;
box-shadow: 0 10px 30px rgba(0,0,0,0.2);
animation: fadeIn 0.2s ease;

@keyframes fadeIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

const FilterHeader = styled.div`
font-size: 20px;
font-weight: 600;
padding: 20px 24px;
border-bottom: 1px solid #eee;
`;

const FilterBody = styled.div`
padding: 24px;
display: flex;
flex-direction: column;
gap: 20px;
`;

const FilterGroup = styled.div`
display: flex;
flex-direction: column;
gap: 8px;
`;

const FilterLabel = styled.label`
font-size: 14px;
font-weight: 500;
color: #444;
`;

const FilterSelect = styled.select`
padding: 12px;
border-radius: 8px;
border: 1px solid #ccc;
font-size: 14px;
outline: none;

&:focus {
border-color: #4CAF50;
box-shadow: 0 0 0 2px rgba(76,175,80,0.15);
}
`;

const FilterFooter = styled.div`
padding: 18px 24px;
border-top: 1px solid #eee;
display: flex;
justify-content: flex-end;
gap: 12px;
`;

const CancelButton = styled.button`
padding: 10px 20px;
font-size: 14px;
border-radius: 8px;
border: 1px solid #ccc;
background: #fff;
cursor: pointer;
transition: 0.2s;

&:hover {
background: #f5f5f5;
}
`;

const ApplyButton = styled.button`
padding: 10px 22px;
font-size: 14px;
border-radius: 8px;
border: none;
background: #4CAF50;
color: white;
font-weight: 500;
cursor: pointer;
transition: 0.2s;

&:hover {
background: #43a047;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [tempDepartment, setTempDepartment] = useState("");

  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/resource/Medical Department", {
        fields: '["name"]',
        limit_page_length: 1500,
      });

      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);
  // Fetch lab test count
  const fetchLabTestCount = async () => {
    try {
      console.log("📊 Fetching company list...");

      // 1️⃣ Fetch company list
      const companyResponse = await api.get(
        "https://hms.automedai.in/api/resource/Company"
      );

      const companies =
        companyResponse.data?.data?.map((c) => c.name) || [];

      console.log("🏢 Companies:", companies);

      if (!companies.length) {
        setTotalCount(0);
        return;
      }

      let filters;

      // 2️⃣ If only one company → "=" operator
      if (companies.length === 1) {
        filters = {
          company: companies[0],
        };
      }
      // 3️⃣ If multiple companies → "in" operator
      else {
        filters = [
          ["company", "in", companies],
        ];
      }

      console.log("📊 Final Filters:", filters);

      // 4️⃣ Call get_count API
      const countResponse = await api.get(
        "/method/frappe.client.get_count",
        {
          doctype: "Lab Test",
          filters: JSON.stringify(filters),
        }
      );

      console.log("📊 Count API Response:", countResponse);

      const count =
        countResponse.data?.message || 0;

      console.log("📊 Total Lab Test Count:", count);

      setTotalCount(count);
    } catch (err) {
      console.error("❌ Error fetching Lab Test count:", err);
      setTotalCount(0);
    }
  };

  const formatTestName = (name = "") => {
    return name.includes("-")
      ? name.split("-").slice(1).join("-").trim()
      : name;
  };


  // Fetch lab tests from API
  const fetchLabTests = async (page, limit) => {
    try {
      setLoading(true);
      setError(null);

      const limitStart = (page - 1) * limit;

      let filters = [
        ["Lab Test", "status", "!=", "Completed"],
      ];

      if (departmentFilter) {
        filters.push(["Lab Test", "department", "=", departmentFilter]);
      }

      const params = {
        fields:
          '["name","patient","patient_name","status","lab_test_name","sample","department"]',
        filters: JSON.stringify(filters),
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
        const tests = response.data.data.map((t) => ({
          ...t,
          lab_test_name: formatTestName(t.lab_test_name),
        }));

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
  }, [currentPage, rowsPerPage, departmentFilter]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const columns = [
    { key: "name", label: "TEST ID" },
    { key: "patient", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "lab_test_name", label: "TEST NAME" },
    { key: "department", label: "DEPARTMENT" },
    { key: "status", label: "SAMPLE STATUS" },
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
    const docstatus = sampleStatusMap[row.sample];
    return (
      <ActionsContainer>
        <ActionLink onClick={() => handleAddResult(row)}>
          {docstatus === 1 ? "Add Result" : ""}
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
    setTempDepartment(departmentFilter);
    setIsFilterOpen(true);
  };
  const applyFilter = () => {
    setDepartmentFilter(tempDepartment);
    setCurrentPage(1);
    setIsFilterOpen(false);
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
      {isFilterOpen && (
        <FilterModalOverlay>
          <FilterModal>

            <FilterHeader>
              Filter Lab Tests
            </FilterHeader>

            <FilterBody>

              <FilterGroup>
                <FilterLabel>Department</FilterLabel>

                <FilterSelect
                  value={tempDepartment}
                  onChange={(e) => setTempDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>

                  {departments.map((dept) => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}

                </FilterSelect>
              </FilterGroup>

            </FilterBody>


            <FilterFooter>

              <CancelButton
                onClick={() => setIsFilterOpen(false)}
              >
                Cancel
              </CancelButton>

              <ApplyButton
                onClick={applyFilter}
              >
                Apply Filter
              </ApplyButton>

            </FilterFooter>

          </FilterModal>
        </FilterModalOverlay>
      )}
    </Layout>
  );
};

export default LabTest;
