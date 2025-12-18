import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Search, Filter, Plus } from "lucide-react";

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
    if (props.status === "Pending") return "#fff4e5";
    if (props.status === "Rejected") return "#ffebee";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.status === "Collected") return "#2e7d32";
    if (props.status === "Pending") return "#f57c00";
    if (props.status === "Rejected") return "#c62828";
    return "#666666";
  }};
`;

const Collection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - replace with API call later
  const collectionsData = [
    {
      patient_id: "P00123",
      patient_name: "John Doe",
      gender: "Male",
      referring_practitioner: "Dr. Smith",
      date: "2023-10-27",
      status: "Collected",
      sample: "Blood",
      quantity_uom: "5 ml",
      collection_datetime: "2023-10-27 09:30 AM",
      collected_by: "Jane Austin",
    },
    {
      patient_id: "P00124",
      patient_name: "Emily White",
      gender: "Female",
      referring_practitioner: "Dr. Jones",
      date: "2023-10-27",
      status: "Pending",
      sample: "Urine",
      quantity_uom: "10 ml",
      collection_datetime: "2023-10-27 10:15 AM",
      collected_by: "Mike Ross",
    },
    {
      patient_id: "P00125",
      patient_name: "Michael Brown",
      gender: "Male",
      referring_practitioner: "Dr. Smith",
      date: "2023-10-26",
      status: "Collected",
      sample: "Blood",
      quantity_uom: "3 ml",
      collection_datetime: "2023-10-26 03:00 PM",
      collected_by: "Jane Austin",
    },
    {
      patient_id: "P00126",
      patient_name: "Jessica Green",
      gender: "Female",
      referring_practitioner: "Dr. Williams",
      date: "2023-10-26",
      status: "Rejected",
      sample: "Saliva",
      quantity_uom: "2 ml",
      collection_datetime: "2023-10-26 11:45 AM",
      collected_by: "Mike Ross",
    },
    {
      patient_id: "P00127",
      patient_name: "David Chen",
      gender: "Male",
      referring_practitioner: "Dr. Jones",
      date: "2023-10-25",
      status: "Collected",
      sample: "Blood",
      quantity_uom: "5 ml",
      collection_datetime: "2023-10-25 08:00 AM",
      collected_by: "Sarah Lee",
    },
  ];

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
  ];

  const renderStatus = (status) => {
    return <StatusBadge status={status}>{status}</StatusBadge>;
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

        <DataTable
          columns={columns}
          data={filteredData}
          sortableColumns={["patient_id", "patient_name", "date"]}
          renderStatus={renderStatus}
        />
      </CollectionContainer>
    </Layout>
  );
};

export default Collection;
