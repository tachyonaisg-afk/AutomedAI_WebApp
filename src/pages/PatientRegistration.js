import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Calendar } from "lucide-react";

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ProgressIndicator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

const ProgressStepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`;

const StepLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#4a90e2" : "#999999")};
  white-space: nowrap;
  cursor: default;
  transition: color 0.2s;
  margin-bottom: 12px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e3f2fd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #4a90e2;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${(props) => {
    if (props.currentStep === 1) return "33.33%";
    if (props.currentStep === 2) return "66.66%";
    if (props.currentStep === 3) return "100%";
    return "0%";
  }};
`;

const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const FormInput = styled.input`
  padding: 10px 12px;
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

const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 40px;
  }

  svg {
    position: absolute;
    right: 12px;
    width: 18px;
    height: 18px;
    color: #999999;
    pointer-events: none;
  }
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #999999;
  margin: -4px 0 0 0;
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333333;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
`;

const SaveLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 0;
  text-decoration: underline;

  &:hover {
    color: #357abd;
  }
`;

const NextButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    uid: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    company: "",
    allergies: "",
    existingConditions: "",
    visitType: "walk-in",
    assignedDoctor: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
    // Navigate to next step or save
  };

  return (
    <Layout>
      <RegistrationContainer>
        <Title>Patient Registration</Title>

        <ProgressIndicator>
          <ProgressStepsContainer>
            <ProgressStep>
              <StepLabel active>Step 1: Registration</StepLabel>
            </ProgressStep>
            <ProgressStep>
              <StepLabel>Step 2: Billing</StepLabel>
            </ProgressStep>
            <ProgressStep>
              <StepLabel>Step 3: Pre-Screening</StepLabel>
            </ProgressStep>
          </ProgressStepsContainer>
          <ProgressBarContainer>
            <ProgressBarFill currentStep={1} />
          </ProgressBarContainer>
        </ProgressIndicator>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>
            <FormGrid>
              <FormGroup>
                <FormLabel>First Name</FormLabel>
                <FormInput type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </FormGroup>

              <FormGroup>
                <FormLabel>Middle Name (Optional)</FormLabel>
                <FormInput type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <FormLabel>Last Name</FormLabel>
                <FormInput type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </FormGroup>

              <FormGroup>
                <FormLabel>Identification Number (UID)</FormLabel>
                <FormInput type="text" name="uid" value={formData.uid} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <FormLabel>Date of Birth</FormLabel>
                <DateInputWrapper>
                  <FormInput type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} placeholder="mm/dd/yyyy" />
                  <Calendar />
                </DateInputWrapper>
              </FormGroup>

              <FormGroup>
                <FormLabel>Gender</FormLabel>
                <FormSelect name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Mobile</FormLabel>
                <FormInput type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                <HelperText>Existing patient data will be fetched automatically.</HelperText>
              </FormGroup>

              <FormGroup>
                <FormLabel>Company</FormLabel>
                <FormSelect name="company" value={formData.company} onChange={handleInputChange}>
                  <option value="">Select company</option>
                  <option value="company1">Company 1</option>
                  <option value="company2">Company 2</option>
                  <option value="company3">Company 3</option>
                </FormSelect>
              </FormGroup>
            </FormGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>Medical Info</SectionTitle>
            <FormGroup fullWidth>
              <FormLabel>Allergies</FormLabel>
              <TextArea name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="Enter any known allergies..." />
            </FormGroup>

            <FormGroup fullWidth>
              <FormLabel>Existing Conditions</FormLabel>
              <TextArea name="existingConditions" value={formData.existingConditions} onChange={handleInputChange} placeholder="Enter any existing medical conditions..." />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Visit Details</SectionTitle>
            <FormGroup>
              <FormLabel>Visit Type</FormLabel>
              <RadioGroup>
                <RadioOption>
                  <RadioInput type="radio" name="visitType" value="walk-in" checked={formData.visitType === "walk-in"} onChange={handleInputChange} />
                  <span>Walk-in</span>
                </RadioOption>
                <RadioOption>
                  <RadioInput type="radio" name="visitType" value="telemedicine" checked={formData.visitType === "telemedicine"} onChange={handleInputChange} />
                  <span>Telemedicine</span>
                </RadioOption>
                <RadioOption>
                  <RadioInput type="radio" name="visitType" value="referral" checked={formData.visitType === "referral"} onChange={handleInputChange} />
                  <span>Referral</span>
                </RadioOption>
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <FormLabel>Assigned Doctor</FormLabel>
              <FormSelect name="assignedDoctor" value={formData.assignedDoctor} onChange={handleInputChange}>
                <option value="">Select a doctor</option>
                <option value="dr1">Dr. Smith</option>
                <option value="dr2">Dr. Johnson</option>
                <option value="dr3">Dr. Williams</option>
              </FormSelect>
            </FormGroup>
          </FormSection>

          <ActionButtons>
            <SaveLink type="button">Save & Continue</SaveLink>
            <NextButton type="submit">Next</NextButton>
          </ActionButtons>
        </form>
      </RegistrationContainer>
    </Layout>
  );
};

export default PatientRegistration;
