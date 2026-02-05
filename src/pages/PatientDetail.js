import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

const PatientDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Breadcrumbs = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;

  a {
    color: #666666;
    text-decoration: none;

    &:hover {
      color: #4a90e2;
    }
  }

  span {
    margin: 0 8px;
  }
`;

const PatientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
`;

const PatientInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ProfilePicture = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PatientBasicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PatientName = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const PatientId = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const EditButton = styled.button`
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
`;

const BookButton = styled.button`
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
`;

const PrescriptionButton = styled.button`
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #16a34a;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 32px;
  border-bottom: 2px solid #e0e0e0;
  margin-top: 8px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#4a90e2" : "#666666")};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #4a90e2;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #4a90e2;
    opacity: ${(props) => (props.active ? 1 : 0)};
    transition: opacity 0.2s;
  }
`;

const ContentSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #666666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #666666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #ef4444;
`;

const PatientDetail = () => {
  usePageTitle("Patient Details");
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch patient detail from API
        const response = await api.get(API_ENDPOINTS.PATIENTS.DETAIL(id));

        if (response.data?.data) {
          setPatientData(response.data.data);
        } else {
          setError("Patient not found");
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError(err.message || "Failed to load patient details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientDetail();
    }
  }, [id]);

  const tabs = [
    { key: "personal", label: "Personal Details" },
    { key: "medical", label: "Medical History" },
    { key: "family", label: "Family History" },
    { key: "consultation", label: "Previous Consultation History" },
  ];

  const handleEditProfile = () => {
    console.log("Edit profile for patient:", id);
    // Navigate to edit page or open edit modal
  };

  const handleBookAppointment = () => {
    if (!patientData) {
      console.error("Patient data not available");
      return;
    }

    console.log("Book appointment for patient:", id);
    // Navigate to OPD billing page with patient data preselected
    navigate("/opd/billing/add", {
      state: {
        preselectedPatient: {
          name: patientData.name,
          patient_name: patientData.patient_name || `${patientData.first_name || ''} ${patientData.middle_name || ''} ${patientData.last_name || ''}`.trim(),
          customer_name: patientData.customer || `${patientData.first_name || ''} ${patientData.middle_name || ''} ${patientData.last_name || ''}`.trim(),
        },
        defaultItemCode: "STO-ITEM-2025-00539"
      }
    });
  };

  const handlePrescription = () => {
    navigate(`/prescription/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <LoadingContainer>Loading patient details...</LoadingContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorContainer>Error: {error}</ErrorContainer>
      </Layout>
    );
  }

  if (!patientData) {
    return (
      <Layout>
        <ErrorContainer>Patient not found</ErrorContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PatientDetailContainer>
        <Breadcrumbs>
          <button type="button" onClick={() => navigate("/dashboard")} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>
            Home
          </button>
          <span>/</span>
          <button type="button" onClick={() => navigate("/patients")} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>
            Patients
          </button>
          <span>/</span>
          <span style={{ color: "#333333" }}>{patientData.patient_name || "Patient"}</span>
        </Breadcrumbs>

        <PatientHeader>
          <PatientInfo>
            <ProfilePicture>
              <img
                src={patientData.image || "https://via.placeholder.com/80x80?text=Patient"}
                alt={patientData.patient_name}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </ProfilePicture>
            <PatientBasicInfo>
              <PatientName>{patientData.patient_name || "N/A"}</PatientName>
              <PatientId>Patient ID: {patientData.name || patientData.uid || "N/A"}</PatientId>
            </PatientBasicInfo>
          </PatientInfo>
          <ActionButtons>
            <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
            <BookButton onClick={handleBookAppointment}>Book Appointment/Billing</BookButton>
            <PrescriptionButton onClick={handlePrescription}>Prescription</PrescriptionButton>
          </ActionButtons>
        </PatientHeader>

        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabsContainer>

        {activeTab === "personal" && (
          <>
            <ContentSection>
              <SectionTitle>Personal Information</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>First Name</InfoLabel>
                  <InfoValue>{patientData.first_name || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Last Name</InfoLabel>
                  <InfoValue>{patientData.last_name || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Date of Birth</InfoLabel>
                  <InfoValue>{patientData.dob || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Gender</InfoLabel>
                  <InfoValue>{patientData.sex || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Blood Group</InfoLabel>
                  <InfoValue>{patientData.blood_group || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Govt. ID Number</InfoLabel>
                  <InfoValue>{patientData.uid || "N/A"}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>

            <ContentSection>
              <SectionTitle>Address Details</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Address Type</InfoLabel>
                  <InfoValue>{patientData.address_type || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Phone Number</InfoLabel>
                  <InfoValue>{patientData.mobile || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Address</InfoLabel>
                  <InfoValue>{patientData.address || "N/A"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Patient Relation</InfoLabel>
                  <InfoValue>{patientData.patient_relation || "N/A"}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>
          </>
        )}

        {activeTab === "medical" && (
          <ContentSection>
            <SectionTitle>Medical History</SectionTitle>
            <InfoValue style={{ color: "#666666" }}>Medical history information coming soon...</InfoValue>
          </ContentSection>
        )}

        {activeTab === "family" && (
          <ContentSection>
            <SectionTitle>Family History</SectionTitle>
            <InfoValue style={{ color: "#666666" }}>Family history information coming soon...</InfoValue>
          </ContentSection>
        )}

        {activeTab === "consultation" && (
          <ContentSection>
            <SectionTitle>Previous Consultation History</SectionTitle>
            <InfoValue style={{ color: "#666666" }}>Consultation history information coming soon...</InfoValue>
          </ContentSection>
        )}
      </PatientDetailContainer>
    </Layout>
  );
};

export default PatientDetail;
