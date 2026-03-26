import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";
import { Plus, Calendar, Eye, CreditCard, FileText, ArrowLeft } from "lucide-react";
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
const SearchButton = styled.button`
  width: 100px;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #4a90e2;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #3c7edb;
  }
`;

/* ================= COMPONENT ================= */

const PathlabPatients = () => {
  usePageTitle("Patients");
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
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
  const dashboardDate = location.state?.date;
  const dashboardCompany = location.state?.company;
  const isDashboardFilter = location.state?.dashboardFilter;

  const columns = [
    { key: "name", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "age", label: "AGE" },
    // { key: "sex", label: "SEX" },
    { key: "mobile", label: "MOBILE" },
    // { key: "email", label: "EMAIL" },
    // { key: "uid", label: "UID" },
    { key: "actions", label: "ACTIONS" },
  ];

  const handleAddBilling = async (patientId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.PATIENTS.DETAIL(patientId)
      );

      const patientData = response.data?.data;

      if (!patientData) {
        console.error("Patient data not available");
        return;
      }

      navigate("/pathlab/billing/add", {
        state: {
          preselectedPatient: {
            name: patientData.name,
            patient_name:
              patientData.patient_name ||
              `${patientData.first_name || ""} ${patientData.middle_name || ""} ${patientData.last_name || ""}`.trim(),
            customer_name:
              patientData.customer ||
              `${patientData.first_name || ""} ${patientData.middle_name || ""} ${patientData.last_name || ""}`.trim(),
          },
          // defaultItemCode: "STO-ITEM-2025-00539",
        },
      });
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const renderActions = (row) => (
    <>
      <ViewButton
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/patients/${row.name}`);
        }}
      >
        <Eye />
        View
      </ViewButton>

      <ViewButton
        onClick={(e) => {
          e.stopPropagation();
          handleAddBilling(row.name);
        }}
      >
        <CreditCard />
        Bill
      </ViewButton>

      {/* {row.custom_company?.toLowerCase() === "ramakrishna mission sargachi" && ( */}
        <ViewButton
          onClick={(e) => {
            e.stopPropagation();
            handleTestResult(row.name);
          }}
        >
          <FileText />
          View Test Results
        </ViewButton>
      {/* )} */}
    </>
  );
  /* ========= DATA FETCH ========= */

  const fetchPatientCount = async () => {
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
          custom_company: companies[0],
        };
      }
      // 3️⃣ If multiple companies → "in" operator
      else {
        filters = [
          ["custom_company", "in", companies],
        ];
      }

      console.log("📊 Final Filters:", filters);

      // 4️⃣ Call get_count API
      const countResponse = await api.get(
        "/method/frappe.client.get_count",
        {
          doctype: "Patient",
          filters: JSON.stringify(filters),
        }
      );

      console.log("📊 Count API Response:", countResponse);

      const count =
        countResponse.data?.message || 0;

      console.log("📊 Total Patient Count:", count);

      setTotalCount(count);
    } catch (err) {
      console.error("❌ Error fetching patient count:", err);
      setTotalCount(0);
    }
  };

  const fetchDashboardPatientCount = async () => {
    try {
      if (!dashboardCompany || !dashboardDate) return;

      const res = await fetch(
        `https://midl.automedai.in/appointments/company-patient-count?company=${encodeURIComponent(
          dashboardCompany
        )}&appointment_date=${dashboardDate}`
      );

      const data = await res.json();

      if (data.success) {
        const count = data.data?.total_patients || 0;
        setTotalCount(count);
      } else {
        setTotalCount(0);
      }
    } catch (error) {
      console.error("❌ Dashboard count error:", error);
      setTotalCount(0);
    }
  };

  const fetchPatients = async (page, limit, patientId = null) => {
    try {
      setLoading(true);
      setError(null);

      // 🔵 DASHBOARD MODE (Total Patients Today)
      if (isDashboardFilter && dashboardDate && dashboardCompany) {

        const filters = [
          ["Sales Invoice Item", "item_code", "=", "STO-ITEM-2025-00539"],
          ["posting_date", "=", filterDate || dashboardDate],
          ["company", "=", dashboardCompany]
        ];

        const response = await api.get("/resource/Sales Invoice", {
          limit_page_length: 50,
          fields: JSON.stringify([
            "name",
            "patient",
            "patient_name",
            "posting_date",
            "company",
            "status",
            "total_qty",
            "net_total"
          ]),
          order_by: "posting_date desc",
          filters: JSON.stringify(filters)
        });

        const rawData = response.data?.data || [];

        const mappedPatients = await Promise.all(
          rawData.map(async (row) => {
            try {
              const patientId = row.patient;

              if (!patientId) {
                return {
                  name: "-",
                  patient_name: row.patient_name || "-",
                  age: "-",
                  sex: "-",
                  mobile: "-",
                  email: "-",
                  uid: row.name,
                };
              }

              const res = await api.get(
                `https://hms.automedai.in/api/resource/Patient/${patientId}`
              );

              const patientData = res.data?.data || {};

              return {
                name: patientData.name || patientId,
                custom_company: patientData.custom_company || "",
                patient_name: patientData.patient_name
                  ? `${patientData.patient_name} (${patientData.sex?.charAt(0) || "-"})`
                  : row.patient_name || "-",
                // sex: patientData.sex || "-",
                age: calculateAge(patientData.dob),
                mobile: patientData.mobile || "-",
                email: patientData.email || "-",
                uid: row?.uid || "-",
              };
            } catch (err) {
              console.error("Patient fetch error:", err);

              return {
                name: row.patient || "-",
                patient_name: row.patient_name || "-",
                age: "-",
                sex: "-",
                mobile: "-",
                email: "-",
                uid: row.name,
              };
            }
          })
        );

        setPatientsData(mappedPatients);
        // setTotalCount(mappedPatients.length);
        await fetchDashboardPatientCount();
        return;
      }

      // 🟢 NORMAL PATIENT API
      const fields = '["name","patient_name","sex","mobile","email","uid","dob","custom_company","modified"]';
      const limitStart = (page - 1) * limit;

      const params = {
        fields,
        limit_start: limitStart,
        limit_page_length: limit,
        order_by: "modified desc",
      };

      if (patientId) {
        params.filters = JSON.stringify([
          ["Patient", "name", "=", patientId]
        ]);
      }
      if (filterDate && !patientId) {
        params.filters = JSON.stringify([
          ["Patient", "creation", "like", `${filterDate}%`]
        ]);
      }

      if (searchQuery && !patientId) {
        params.or_filters = JSON.stringify([
          ["Patient", "name", "like", `%${searchQuery}%`],
          ["Patient", "patient_name", "like", `%${searchQuery}%`],
          ["Patient", "mobile", "like", `%${searchQuery}%`],
        ]);
      }

      await fetchPatientCount();

      const response = await api.get(API_ENDPOINTS.PATIENTS.LIST, params);

      const rawData = Array.isArray(response.data?.data) ? response.data.data : [];

      const normalizedData = rawData.map((patient) => ({
        ...patient,
        custom_company: patient.custom_company || "",
        patient_name: patient.patient_name
          ? `${patient.patient_name} (${patient.sex?.charAt(0) || "-"})`
          : "-",
        age: calculateAge(patient.dob), // ✅ NEW
        mobile: patient.mobile || "-",
        email: patient.email || "-",
        uid: patient.uid || "-"
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
    if (isDashboardFilter && dashboardCompany && dashboardDate) {
      fetchDashboardPatientCount();
    }
  }, [dashboardCompany, dashboardDate, isDashboardFilter]);

  useEffect(() => {
    fetchPatients(currentPage, rowsPerPage, selectedPatientId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    rowsPerPage,
    selectedPatientId,
    searchQuery,
    dashboardDate,
    dashboardCompany,
    filterDate
  ]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleClearFilter = () => {
    // Clear the filter by navigating without state
    navigate('/pathlab/patients', { replace: true });
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age > 70 ? `${age} yrs (Sr)` : `${age} yrs`;
  };

  const handleTestResult = (id) => {
    navigate(`/prescription/${id}`);
  };
  /* ================= UI ================= */

  return (
    <Layout>
      <PatientsContainer>
        {loading && <div>Loading patients...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        <SearchButton onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
          Back
        </SearchButton>
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

        {(selectedPatientId || searchQuery || isDashboardFilter) && (
          <FilterNotification>
            <FilterText>
              {selectedPatientId
                ? `Showing filtered results for patient: ${location.state?.selectedPatientDescription || selectedPatientId
                }`
                : searchQuery
                  ? `Search results for: "${searchQuery}"`
                  : `Showing patients for ${filterDate
                    ? new Date(filterDate).toLocaleDateString("en-IN")
                    : "today"
                  } (${dashboardCompany})`}
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
              <FilterInput
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
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
          onRowClick={(row) => navigate(`/patients/${row.name}`)}
        />
      </PatientsContainer>
    </Layout>
  );
};

export default PathlabPatients;
