import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import usePageTitle from "../hooks/usePageTitle";

const ClinicDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  background-color: #ffffff;
  color: #666666;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

const SaveButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const Section = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  background-color: #ffffff;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const FormTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;
  background-color: #ffffff;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OperatingHoursContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DayRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
`;

const DayLabel = styled.span`
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

const TimeInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;
  background-color: ${(props) => (props.disabled ? "#f5f5f5" : "#ffffff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

  &:focus {
    border-color: ${(props) => (props.disabled ? "#e0e0e0" : "#4a90e2")};
  }

  &:disabled {
    color: #999999;
  }
`;

const SuccessMessage = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #333333;
  color: #ffffff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CheckIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #4caf50;
  border-radius: 50%;
  font-size: 12px;

  &::before {
    content: "✓";
  }
`;

const ClinicDetails = () => {
  usePageTitle("Clinic Details");
  const [showSuccess, setShowSuccess] = useState(false);

  const [generalInfo, setGeneralInfo] = useState({
    clinicName: "HealWell Clinic",
    clinicAddress: "123 Wellness Avenue, Suite 100, Mediville, State, 54321",
  });

  const [contactInfo, setContactInfo] = useState({
    mainPhone: "(555) 123-4567",
    publicEmail: "contact@healwell.com",
  });

  const [operatingHours, setOperatingHours] = useState([
    { day: "Monday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Friday", enabled: true, startTime: "09:00", endTime: "13:00" },
    { day: "Saturday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Sunday", enabled: false, startTime: "09:00", endTime: "17:00" },
  ]);

  const handleGeneralInfoChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayToggle = (index) => {
    setOperatingHours((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const handleTimeChange = (index, field, value) => {
    setOperatingHours((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSave = () => {
    console.log("Saving clinic details:", {
      generalInfo,
      contactInfo,
      operatingHours,
    });
    // Handle save logic here
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    // Reset to initial values or navigate away
    console.log("Cancelled changes");
  };

  return (
    <Layout>
      <ClinicDetailsContainer>
        <Header>
          <PageTitle>Clinic Details</PageTitle>
          <HeaderButtons>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <SaveButton onClick={handleSave}>Save Changes</SaveButton>
          </HeaderButtons>
        </Header>

        {/* General Information Section */}
        <Section>
          <SectionTitle>General Information</SectionTitle>
          <FormGroup>
            <FormLabel>Clinic Name</FormLabel>
            <FormInput
              type="text"
              name="clinicName"
              value={generalInfo.clinicName}
              onChange={handleGeneralInfoChange}
              placeholder="Enter clinic name"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Clinic Address</FormLabel>
            <FormTextarea
              name="clinicAddress"
              value={generalInfo.clinicAddress}
              onChange={handleGeneralInfoChange}
              placeholder="Enter clinic address"
            />
          </FormGroup>
        </Section>

        {/* Contact Information Section */}
        <Section>
          <SectionTitle>Contact Information</SectionTitle>
          <ContactGrid>
            <FormGroup>
              <FormLabel>Main Phone Number</FormLabel>
              <FormInput
                type="tel"
                name="mainPhone"
                value={contactInfo.mainPhone}
                onChange={handleContactInfoChange}
                placeholder="(555) 123-4567"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Public Email Address</FormLabel>
              <FormInput
                type="email"
                name="publicEmail"
                value={contactInfo.publicEmail}
                onChange={handleContactInfoChange}
                placeholder="contact@clinic.com"
              />
            </FormGroup>
          </ContactGrid>
        </Section>

        {/* Operating Hours Section */}
        <Section>
          <SectionTitle>Operating Hours</SectionTitle>
          <OperatingHoursContainer>
            {operatingHours.map((day, index) => (
              <DayRow key={day.day}>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => handleDayToggle(index)}
                  />
                  <DayLabel>{day.day}</DayLabel>
                </CheckboxContainer>
                <TimeInput
                  type="time"
                  value={day.startTime}
                  onChange={(e) =>
                    handleTimeChange(index, "startTime", e.target.value)
                  }
                  disabled={!day.enabled}
                />
                <TimeInput
                  type="time"
                  value={day.endTime}
                  onChange={(e) =>
                    handleTimeChange(index, "endTime", e.target.value)
                  }
                  disabled={!day.enabled}
                />
              </DayRow>
            ))}
          </OperatingHoursContainer>
        </Section>
      </ClinicDetailsContainer>

      {showSuccess && (
        <SuccessMessage>
          <CheckIcon />
          Changes saved successfully!
        </SuccessMessage>
      )}
    </Layout>
  );
};

export default ClinicDetails;
