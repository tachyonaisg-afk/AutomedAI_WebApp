import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Plus, Calendar, MoreVertical } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";

/* ================= STYLES ================= */

const PatientsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #357abd;
  }
`;

const FiltersCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #666666;
  text-transform: uppercase;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`;

const DateInputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    right: 12px;
    top: 10px;
    color: #999;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #4a90e2;
  }
`;

/* ================= COMPONENT ================= */

const Patients = () => {
  const navigate = useNavigate();

  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterVisitType, setFilterVisitType] = useState("");

  const columns = [
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "sex", label: "SEX" },
    { key: "mobile", label: "MOBILE" },
    { key: "email", label: "EMAIL" },
    { key: "uid", label: "UID" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderActions = (row) => (
    <ActionButton onClick={() => console.log("Actions for", row.patient_name)}>
      <MoreVertical />
    </ActionButton>
  );

  /* ========= DATA FETCH ========= */

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const fields = '["name","patient_name","sex","mobile","email","uid"]';

        const response = await api.get(API_ENDPOINTS.PATIENTS.LIST, {
          fields,
          limit_start: 0,
          limit_page_length: 2000,
        });

        const rawData = Array.isArray(response.data?.data) ? response.data.data : [];

        // 🔹 NORMALIZE NULL VALUES
        const normalizedData = rawData.map((patient) => ({
          ...patient,
          mobile: patient.mobile || "-",
          email: patient.email || "-",
          uid: patient.uid || "-",
        }));

        setPatientsData(normalizedData);
      } catch (err) {
        setError(err.message || "Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  /* ================= UI ================= */

  return (
    <Layout>
      <PatientsContainer>
        {loading && <div>Loading patients...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        <HeaderSection>
          <TitleSection>
            <Title>Patient Records</Title>
            <Subtitle>Manage all patient information in one place.</Subtitle>
          </TitleSection>

          <AddButton onClick={() => navigate("/patient-registration")}>
            <Plus />
            Add New Patient
          </AddButton>
        </HeaderSection>

        <FiltersCard>
          <FilterGroup>
            <FilterLabel>Doctor</FilterLabel>
            <FilterSelect value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
              <option value="">All</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Date</FilterLabel>
            <DateInputWrapper>
              <FilterInput placeholder="mm/dd/yyyy" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              <Calendar />
            </DateInputWrapper>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Visit Type</FilterLabel>
            <FilterSelect value={filterVisitType} onChange={(e) => setFilterVisitType(e.target.value)}>
              <option value="">All</option>
            </FilterSelect>
          </FilterGroup>
        </FiltersCard>

        <DataTable columns={columns} data={patientsData} renderActions={renderActions} />
      </PatientsContainer>
    </Layout>
  );
};

export default Patients;
