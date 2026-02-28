import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Plus, Calendar, Eye } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";
import OpdPatientDataTable from "../components/shared/OpdPatientDataTable";

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

const RecentOPDPatients = () => {
    usePageTitle("Patients");
    const navigate = useNavigate();
    const location = useLocation();

    const [patientsData, setPatientsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [totalCount, setTotalCount] = useState(0);

    // const [filterDoctor, setFilterDoctor] = useState("");
    // const [filterDate, setFilterDate] = useState("");
    // const [filterVisitType, setFilterVisitType] = useState("");

    // Get selected patient from navigation state
    const selectedPatientId = location.state?.selectedPatientId;

    // const renderActions = (row) => (
    //     <ViewButton onClick={() => navigate(`/patients/${row.name}`)}>
    //         <Eye />
    //         View
    //     </ViewButton>
    // );

    /* ========= DATA FETCH ========= */

    // const fetchPatientCount = async () => {
    //     try {
    //         console.log("📊 Fetching company list...");

    //         // 1️⃣ Fetch company list
    //         const companyResponse = await api.get(
    //             "https://hms.automedai.in/api/resource/Company"
    //         );

    //         const companies =
    //             companyResponse.data?.data?.map((c) => c.name) || [];

    //         console.log("🏢 Companies:", companies);

    //         if (!companies.length) {
    //             setTotalCount(0);
    //             return;
    //         }

    //         let filters;

    //         // 2️⃣ If only one company → "=" operator
    //         if (companies.length === 1) {
    //             filters = {
    //                 custom_company: companies[0],
    //             };
    //         }
    //         // 3️⃣ If multiple companies → "in" operator
    //         else {
    //             filters = [
    //                 ["custom_company", "in", companies],
    //             ];
    //         }

    //         console.log("📊 Final Filters:", filters);

    //         // 4️⃣ Call get_count API
    //         const countResponse = await api.get(
    //             "/method/frappe.client.get_count",
    //             {
    //                 doctype: "Patient",
    //                 filters: JSON.stringify(filters),
    //             }
    //         );

    //         console.log("📊 Count API Response:", countResponse);

    //         const count =
    //             countResponse.data?.message || 0;

    //         console.log("📊 Total Patient Count:", count);

    //         setTotalCount(count);
    //     } catch (err) {
    //         console.error("❌ Error fetching patient count:", err);
    //         setTotalCount(0);
    //     }
    // };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(
                `/resource/Sales Invoice`,
                {
                    limit_page_length: 20,
                    fields: JSON.stringify([
                        "name",
                        "patient",
                        "patient_name",
                        "posting_date",
                        "company",
                        "status",
                        "total_qty",
                        "net_total",
                    ]),
                    order_by: "posting_date desc",
                    filters: JSON.stringify([
                        ["Sales Invoice Item", "item_code", "=", "STO-ITEM-2025-00539"],
                    ]),
                }
            );

            const rawData = response.data?.data || [];
            setPatientsData(rawData);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // const handlePageChange = (newPage) => {
    //     setCurrentPage(newPage);
    // };

    // const handleRowsPerPageChange = (newRowsPerPage) => {
    //     setRowsPerPage(newRowsPerPage);
    //     setCurrentPage(1); // Reset to first page when changing rows per page
    // };

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
                        <Title>Recent OPD Patient Records</Title>
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

                {/* <FiltersCard>
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
        </FiltersCard> */}

                <OpdPatientDataTable data={patientsData} />
            </PatientsContainer>
        </Layout>
    );
};

export default RecentOPDPatients;
