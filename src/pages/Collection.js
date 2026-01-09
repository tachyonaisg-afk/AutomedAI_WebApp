import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Search, Filter, Plus } from "lucide-react";
import apiService from "../services/api/apiService";
import API_ENDPOINTS from "../services/api/endpoints";
import usePageTitle from "../hooks/usePageTitle";

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

const Collection = () => {
  usePageTitle("Sample Collection");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionsData, setCollectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

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
          patient_id: item.patient || "-",
          patient_name: item.patient_name || "-",
          gender: item.patient_sex || "-",
          age: item.patient_age || "-",
          referring_practitioner: item.referring_practitioner || "-",
          date: item.creation ? new Date(item.creation).toLocaleDateString("en-IN") : "-",
          status: item.docstatus === 0 ? "Not Collected" : item.docstatus === 1 ? "Collected" : "Not Collected",
          sample: item.sample || "-",
          quantity_uom: item.sample_qty && item.sample_uom
            ? `${item.sample_qty} ${item.sample_uom}`
            : "-",
          collection_datetime: item.creation
            ? new Date(item.creation).toLocaleString("en-IN")
            : "-",
          collected_by: item.collected_by ? item.collected_by.split("@")[0] : "-",
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
  }, []);

  const columns = [
    { key: "patient_id", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "gender", label: "GENDER" },
    { key: "referring_practitioner", label: "REFERRING PRACTITIONER" },
    { key: "date", label: "DATE" },
    { key: "status", label: "STATUS" },
    { key: "sample", label: "SAMPLE" },
    { key: "quantity_uom", label: "SAMPLE QUANTITY & UOM" },
    { key: "collection_datetime", label: "COLLECTION DATE AND TIME" },
    { key: "collected_by", label: "COLLECTED BY" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderStatus = (status) => {
    return <StatusBadge status={status}>{status}</StatusBadge>;
  };

  const renderActions = (row) => {
    // Show button only if docstatus === 0 (Not Collected)
    if (row.docstatus === 0) {
      return (
        <ActionButton onClick={() => handleCollectClick(row)}>
          Collected
        </ActionButton>
      );
    }
    return null;
  };

  const handleCollectClick = (collection) => {
    setSelectedCollection(collection);
    setShowConfirmModal(true);
  };

  const handleConfirmCollect = async () => {
    try {
      console.log("Marking as collected:", selectedCollection);

      // Call API to update docstatus to 1
      await apiService.put(API_ENDPOINTS.SAMPLE_COLLECTION.UPDATE(selectedCollection.name), {
        docstatus: 1
      });

      console.log("✅ Successfully marked as collected");

      // Close modal
      setShowConfirmModal(false);
      setSelectedCollection(null);

      // Refresh the list
      await fetchCollections();
    } catch (error) {
      console.error("❌ Error marking as collected:", error);
      alert("Failed to mark sample as collected. Please try again.");

      // Keep modal open on error
      setShowConfirmModal(false);
      setSelectedCollection(null);
    }
  };

  const handleCancelCollect = () => {
    setShowConfirmModal(false);
    setSelectedCollection(null);
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
          <DataTable
            columns={columns}
            data={filteredData}
            sortableColumns={["patient_id", "patient_name", "date"]}
            renderStatus={renderStatus}
            renderActions={renderActions}
          />
        )}

        {showConfirmModal && (
          <ConfirmationModal onClick={handleCancelCollect}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Confirm Collection</ModalTitle>
              <ModalMessage>
                Are you sure you want to mark this sample as collected?
              </ModalMessage>
              <ModalButtonGroup>
                <ModalButton onClick={handleCancelCollect}>
                  Cancel
                </ModalButton>
                <ModalButton variant="primary" onClick={handleConfirmCollect}>
                  Continue
                </ModalButton>
              </ModalButtonGroup>
            </ModalContent>
          </ConfirmationModal>
        )}
      </CollectionContainer>
    </Layout>
  );
};

export default Collection;
