import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Search, Filter, Plus, Check, X } from "lucide-react";
import apiService from "../services/api/apiService";
import API_ENDPOINTS from "../services/api/endpoints";
import usePageTitle from "../hooks/usePageTitle";
import CollectionDataTable from "../components/shared/CollectionDataTable";

const CollectionContainer = styled.div`
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
    if (props.status === "Collected") return "#e8f5e9";
    if (props.status === "Not Collected") return "#fff4e5";
    if (props.status === "Pending") return "#fff4e5";
    if (props.status === "Rejected") return "#ffebee";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.status === "Collected") return "#2e7d32";
    if (props.status === "Not Collected") return "#f57c00";
    if (props.status === "Pending") return "#f57c00";
    if (props.status === "Rejected") return "#c62828";
    return "#666666";
  }};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: #666666;
  font-size: 14px;
`;

const ErrorContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  background-color: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  color: #c62828;
`;

const ErrorMessage = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
`;

const ModalMessage = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.variant === "primary"
      ? `
    background-color: #4a90e2;
    color: white;
    &:hover {
      background-color: #357abd;
    }
  `
      : `
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #e0e0e0;
    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

const ActionButton = styled.button`
  padding: 6px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmployeeSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
  min-width: 150px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'confirm' && `
    background-color: #4caf50;
    color: white;

    &:hover {
      background-color: #45a049;
    }
  `}

  ${props => props.variant === 'cancel' && `
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #da190b;
    }
  `}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Collection = () => {
  usePageTitle("Sample Collection");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionsData, setCollectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const fields = JSON.stringify(["name", "user_id", "employee_name"]);
      const response = await apiService.get(API_ENDPOINTS.SAMPLE_COLLECTORS.LIST, {
        fields: fields,
        filters: JSON.stringify([
          ["designation", "=", "Phlebotomist"]
        ]),
        limit_page_length: 0,
      });
      if (response.data?.data) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Fetch collections data from API
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const fields = JSON.stringify([
        "name",
        "creation",
        "modified",
        "modified_by",
        "docstatus",
        "idx",
        "patient",
        "patient_name",
        "patient_age",
        "patient_sex",
        "referring_practitioner",
        "status",
        "sample",
        "sample_uom",
        "sample_qty",
        "collected_by",
        "collected_time",
        "_seen",
      ]);

      const response = await apiService.get(API_ENDPOINTS.SAMPLE_COLLECTION.LIST, {
        limit_start: 0,
        limit_page_length: 1200,
        fields: fields,
        order_by: "creation desc",
      });

      if (response.data?.data) {
        // Transform API response to match table format
        const transformedData = response.data.data.map((item, index) => ({
          id: index + 1,
          sample_id: item.name || "-",
          patient_id: item.patient || "-",
          patient_name: item.patient_name
            ? `${item.patient_name} (${(item.patient_sex || "").charAt(0).toUpperCase()})`
            : "-",
          gender: item.patient_sex || "-",
          age: item.patient_age || "-",
          referring_practitioner: item.referring_practitioner || "-",
          date: item.creation ? new Date(item.creation).toLocaleDateString("en-IN") : "-",
          status: item.docstatus === 0 ? "Not Collected" : item.docstatus === 1 ? "Collected" : "Not Collected",
          sample: item.sample || "-",
          quantity_uom: item.sample_qty && item.sample_uom
            ? `${item.sample_qty} ${item.sample_uom}`
            : "-",
          collection_datetime: item.docstatus === 1 && item.collected_time
            ? new Date(item.collected_time).toLocaleString("en-IN")
            : "-",
          collected_by: item.docstatus === 1 && item.collected_by ? item.collected_by.split("@")[0] : "",
          docstatus: item.docstatus,
          name: item.name,
        }));

        setCollectionsData(transformedData);
      } else {
        setCollectionsData([]);
      }
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError(err.message || "Failed to load collections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCollections();
    fetchEmployees();
  }, []);

  const columns = [
    { key: "sample_id", label: "SAMPLE ID" },
    { key: "patient_id", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "date", label: "DATE" },
    { key: "status", label: "STATUS" },
    { key: "sample", label: "SAMPLE" },
    { key: "quantity_uom", label: "SAMPLE QUANTITY & UOM" },
    { key: "collection_datetime", label: "COLLECTION DATE AND TIME" },
    { key: "collected_by", label: "COLLECTED BY" },
    { key: "actions", label: "ACTIONS" },
  ];
  const handleCollectAll = async (groupItems) => {
  try {
    if (!selectedEmployee) {
      alert("Please select an employee first");
      return;
    }

    const getISTDateTime = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      return istTime.toISOString().slice(0, 19).replace("T", " ");
    };

    const istDateTime = getISTDateTime();

    const uncollectedItems = groupItems.filter(
      (item) => item.docstatus === 0
    );

    if (uncollectedItems.length === 0) {
      alert("All samples already collected.");
      return;
    }

    // 🔥 SAME API — Loop for each sample
    await Promise.all(
      uncollectedItems.map((item) =>
        apiService.put(
          API_ENDPOINTS.SAMPLE_COLLECTION.UPDATE(item.name),
          {
            docstatus: 1,
            collected_by: selectedEmployee.user_id,
            collected_time: istDateTime,
          }
        )
      )
    );

    alert("All samples collected successfully!");

    setSelectedEmployee("");
    await fetchCollections();

  } catch (error) {
    console.error("Error collecting all:", error);
    alert("Failed to collect samples.");
  }
};
  const renderStatus = (status) => {
    return <StatusBadge status={status}>{status}</StatusBadge>;
  };

  const renderActions = (rowOrGroup) => {
    const isGroup = Array.isArray(rowOrGroup);

    // GROUP LEVEL (Collect All)
    if (isGroup) {
      const hasUncollected = rowOrGroup.some(
        (item) => item.docstatus === 0
      );

      if (!hasUncollected) return null;

      return (
        <ActionButton onClick={() => handleCollectAll(rowOrGroup)}>
          Collect All
        </ActionButton>
      );
    }

    // SINGLE ROW LEVEL
    const row = rowOrGroup;

    if (row.docstatus === 0) {
      if (editingRowId === row.name) {
        return (
          <ActionContainer>
            <EmployeeSelect
              value={selectedEmployee?.user_id || ""}
              onChange={(e) => {
                const emp = employees.find(
                  (emp) => emp.user_id === e.target.value
                );
                setSelectedEmployee(emp);
              }}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.user_id} value={emp.user_id}>
                  {emp.employee_name}
                </option>
              ))}
            </EmployeeSelect>

            <IconButton
              variant="confirm"
              onClick={() => handleConfirmCollect(row)}
            >
              <Check />
            </IconButton>

            <IconButton
              variant="cancel"
              onClick={handleCancelEdit}
            >
              <X />
            </IconButton>
          </ActionContainer>
        );
      }

      return (
        <ActionButton onClick={() => handleCollectClick(row)}>
          Collect
        </ActionButton>
      );
    }

    return null;
  };

  const handleCollectClick = (row) => {
    setEditingRowId(row.name);
    setSelectedEmployee("");
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setSelectedEmployee("");
  };

  const handleConfirmCollect = async (row) => {
    try {
      if (!selectedEmployee) {
        alert("Please select an employee");
        return;
      }

      const labTestResponse = await apiService.get(
        API_ENDPOINTS.LAB_TEST.LIST,
        {
          params: {
            fields: JSON.stringify(["name", "patient", "patient_name", "status"]),
            filters: JSON.stringify([
              ["sample", "=", row.name],
              ["docstatus", "=", 1]
            ]),
            limit_start: 0,
            limit_page_length: 1,
          },
        }
      );
      console.log("Lab test API response:", labTestResponse);

      const labTests = labTestResponse?.data?.data;

      if (!labTests || labTests.length === 0) {
        alert("No Lab Test found for this sample.");
        return;
      }

      const labTestId = labTests[0].name;

      // Assign employee
      // await apiService.put(API_ENDPOINTS.LAB_TEST.UPDATE(labTestId), {
      //   employee: selectedEmployee,
      // });

      const getISTDateTime = () => {
        const now = new Date();

        // Convert to IST (UTC +5:30)
        const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

        return istTime.toISOString().slice(0, 19).replace("T", " ");
      };

      // Mark sample as collected
      await apiService.put(API_ENDPOINTS.SAMPLE_COLLECTION.UPDATE(row.name), {
        docstatus: 1,
        collected_by: selectedEmployee.user_id,
        collected_time: getISTDateTime(),
      });

      setEditingRowId(null);
      setSelectedEmployee("");
      await fetchCollections();

      alert("Sample marked as collected successfully!");
    } catch (error) {
      console.error("Error marking as collected:", error);
      alert("Failed to mark sample as collected. Please try again.");
    }
  };

  const handleNewCollection = () => {
    navigate("/pathlab/collection/new");
  };

  const handleFilter = () => {
    console.log("Open filter modal");
    // TODO: Open filter modal
  };

  const filteredData = collectionsData.filter((collection) =>
    Object.values(collection).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Layout>
      <CollectionContainer>
        <PageTitle>Sample Collection List</PageTitle>

        <ToolbarSection>
          <SearchContainer>
            <SearchIcon>
              <Search />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <ButtonGroup>
            <FilterButton onClick={handleFilter}>
              <Filter />
              Filter
            </FilterButton>
            <NewButton onClick={handleNewCollection}>
              <Plus />
              New Collection
            </NewButton>
          </ButtonGroup>
        </ToolbarSection>

        {loading ? (
          <LoadingContainer>Loading collections...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={fetchCollections}>Retry</RetryButton>
          </ErrorContainer>
        ) : (
          <CollectionDataTable
            data={filteredData}
            renderActions={renderActions}
          />
        )}
      </CollectionContainer>
    </Layout>
  );
};

export default Collection;
