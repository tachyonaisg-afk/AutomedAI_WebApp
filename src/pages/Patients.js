import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Plus, Calendar, Eye } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

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

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: #eaf4ff;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterNotification = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FilterText = styled.span`
  font-size: 14px;
  color: #1976d2;
  font-weight: 500;
`;

const ClearFilterButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: #1565c0;
  }
`;

/* ================= COMPONENT ================= */

const Patients = () => {
  usePageTitle("Patients");
  const navigate = useNavigate();
  const location = useLocation();

  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterVisitType, setFilterVisitType] = useState("");

  // Get selected patient from navigation state
  const selectedPatientId = location.state?.selectedPatientId;

  const columns = [
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "sex", label: "SEX" },
    { key: "mobile", label: "MOBILE" },
    { key: "email", label: "EMAIL" },
    { key: "uid", label: "UID" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderActions = (row) => (
    <ViewButton onClick={() => navigate(`/patients/${row.name}`)}>
      <Eye />
      View
    </ViewButton>
  );

  /* ========= DATA FETCH ========= */

  const fetchPatientCount = async (patientId = null) => {
    try {
      const params = {
        doctype: "Patient",
      };

      // If a specific patient is selected, add filter
      if (patientId) {
        params.filters = JSON.stringify({ name: patientId });
      }

      console.log("📊 Fetching patient count with params:", params);

      const response = await api.get(API_ENDPOINTS.PATIENTS.COUNT, params);

      console.log("📊 Count API Response:", response);

      // The count is usually in response.data.message
      const count = response.data?.message || response.data?.data || 0;
      console.log("📊 Total Patient Count:", count);

      setTotalCount(count);
    } catch (err) {
      console.error("❌ Error fetching patient count:", err);
      setTotalCount(0);
    }
  };

  const fetchPatients = async (page, limit, patientId = null) => {
    try {
      setLoading(true);
      setError(null);

      const fields = '["name","patient_name","sex","mobile","email","uid","modified"]';
      const limitStart = (page - 1) * limit;

      // Build filters for specific patient if provided
      const params = {
        fields,
        limit_start: limitStart,
        limit_page_length: limit,
        order_by: "modified desc",
      };

      // If a specific patient is selected, add filter
      if (patientId) {
        params.filters = JSON.stringify([["Patient", "name", "=", patientId]]);
      }

      console.log("📊 Fetching patients with params:", params);

      // Fetch count separately
      await fetchPatientCount(patientId);

      const response = await api.get(API_ENDPOINTS.PATIENTS.LIST, params);

      console.log("📊 API Response:", response);

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
      console.error("❌ Error fetching patients:", err);
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage, rowsPerPage, selectedPatientId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, selectedPatientId]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleClearFilter = () => {
    // Clear the filter by navigating without state
    navigate('/patients', { replace: true });
  };

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

        {selectedPatientId && (
          <FilterNotification>
            <FilterText>
              Showing filtered results for patient: {location.state?.selectedPatientDescription || selectedPatientId}
            </FilterText>
            <ClearFilterButton onClick={handleClearFilter}>
              Clear Filter
            </ClearFilterButton>
          </FilterNotification>
        )}

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

        <DataTable
          columns={columns}
          data={patientsData}
          renderActions={renderActions}
          serverSide={true}
          totalCount={totalCount}
          currentPageProp={currentPage}
          rowsPerPageProp={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </PatientsContainer>
    </Layout>
  );
};

export default Patients;
