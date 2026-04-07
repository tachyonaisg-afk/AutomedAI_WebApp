import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PatientCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: fit-content;
`;

const PatientHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const PatientAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PatientInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 4px 0;
`;

const PatientMRN = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const PatientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #666666;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

const FormCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #e8eef5;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #e8eef5;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.primary {
    background-color: #4a90e2;
    color: white;

    &:hover {
      background-color: #357abd;
    }
  }

  &.secondary {
    background-color: #f5f5f5;
    color: #333333;
    border: 1px solid #e0e0e0;

    &:hover {
      background-color: #e8e8e8;
    }
  }
`;

const NewLabTest = () => {
  usePageTitle("New Lab Test");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    test_template: "",
    requesting_practitioner: "",
    patient: "",
    employee: "",
    notes: "",
  });

  // Sample patient data - in real app, this would come from context or props
  const patientData = {
    name: "John Appleseed",
    mrn: "123456789",
    dateOfBirth: "01/20/1985",
    gender: "Male",
    contact: "(555) 123-4567",
    avatar: null, // You can add actual avatar URL here
  };

  const testTemplates = [
    "Complete Blood Count (CBC)",
    "Urinalysis",
    "Lipid Panel",
    "Thyroid Function Test",
    "Glucose Tolerance Test",
    "Liver Function Test",
  ];

  const practitioners = [
    "Dr. Evelyn Reed",
    "Dr. Smith",
    "Dr. Jones",
    "Dr. Williams",
  ];

  const patients = [
    "John Appleseed",
    "Jane Doe",
    "Emily White",
    "Michael Brown",
  ];

  const employees = [
    "Alice Johnson",
    "Jane Austin",
    "Mike Ross",
    "Sarah Lee",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Call API to save lab test data
    // After successful save, navigate back to lab test list
    navigate("/pathlab/labtest");
  };

  const handleCancel = () => {
    navigate("/pathlab/labtest");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <LabTestContainer>
        <PageTitle>Add Lab Test</PageTitle>

        <ContentWrapper>
          <PatientCard>
            <PatientHeader>
              <PatientAvatar>
                {patientData.avatar ? (
                  <img src={patientData.avatar} alt={patientData.name} />
                ) : (
                  getInitials(patientData.name)
                )}
              </PatientAvatar>
              <PatientInfo>
                <PatientName>{patientData.name}</PatientName>
                <PatientMRN>MRN: {patientData.mrn}</PatientMRN>
              </PatientInfo>
            </PatientHeader>

            <PatientDetails>
              <DetailRow>
                <DetailLabel>Date of Birth</DetailLabel>
                <DetailValue>{patientData.dateOfBirth}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Gender</DetailLabel>
                <DetailValue>{patientData.gender}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Contact</DetailLabel>
                <DetailValue>{patientData.contact}</DetailValue>
              </DetailRow>
            </PatientDetails>
          </PatientCard>

          <FormCard>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Test Template</Label>
                <Select
                  name="test_template"
                  value={formData.test_template}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select test template</option>
                  {testTemplates.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Requesting Practitioner</Label>
                <Select
                  name="requesting_practitioner"
                  value={formData.requesting_practitioner}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select practitioner</option>
                  {practitioners.map((practitioner) => (
                    <option key={practitioner} value={practitioner}>
                      {practitioner}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Patient</Label>
                <Select
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient} value={patient}>
                      {patient}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Employee (Lab Technician)</Label>
                <Select
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Additional Notes</Label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any relevant notes..."
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" className="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="primary">
                  Submit
                </Button>
              </ButtonGroup>
            </form>
          </FormCard>
        </ContentWrapper>
      </LabTestContainer>
    </Layout>
  );
};

export default NewLabTest;
