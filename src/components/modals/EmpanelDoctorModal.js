import React, { useState } from "react";
import styled from "styled-components";
import { X, User, Camera, Stethoscope, UserCheck } from "lucide-react";

// --- Styled Components ---

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999999;
  padding: 2rem 1rem;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  width: 100%;
  max-width: 960px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  font-family: 'Inter', sans-serif;
  padding: 0rem 0rem 0rem 1rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
`;

const TitleBlock = styled.div``;

const ModalTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #475569;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`;

const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Section = styled.section``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #2563eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const GridLayoutMain = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const ColSpan9 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-column: span 9 / span 9;
  }
`;

const ColSpan3 = styled.div`
  @media (min-width: 768px) {
    grid-column: span 3 / span 3;
  }
`;

const GridLayoutInner = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GridLayout2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &.col-span-2 {
    @media (min-width: 768px) {
      grid-column: span 2 / span 2;
    }
  }
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;

  span {
    color: #ef4444;
  }
`;

const FormControl = styled.input`
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 0.625rem 1rem;
  color: #0f172a;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 0.625rem 1rem;
  color: #0f172a;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  appearance: auto;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  background-color: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.5rem;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.375rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${(props) => (props.$active ? "#ffffff" : "transparent")};
  color: ${(props) => (props.$active ? "#2563eb" : "#64748b")};
  box-shadow: ${(props) => (props.$active ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none")};

  &:hover {
    color: ${(props) => (props.$active ? "#2563eb" : "#334155")};
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  height: 100%;
`;

const ProfileLabel = styled(InputLabel)`
  text-align: left;
  @media (min-width: 768px) {
    text-align: center;
  }
`;

const ProfileUploadArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
`;

const ProfileOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(37, 99, 235, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileAvatarWrapper = styled.label`
  position: relative;
  cursor: pointer;
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  border: 4px solid #f1f5f9;
  background-color: #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  overflow: hidden;

  &:hover ${ProfileOverlay} {
    opacity: 1;
  }
`;

const UploadText = styled.span`
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  margin-top: 2px;
`;

const UploadHint = styled.p`
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  max-width: 160px;
  line-height: 1.25;
  margin: 0;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  border-radius: 0 0 16px 16px;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: #475569;

  &:hover {
    background-color: #e2e8f0;
  }
`;

const SubmitButton = styled.button`
  padding: 0.625rem 2rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1d4ed8;
  }
`;

function EmpanelDoctorModal({ onClose }) {
  const [classification, setClassification] = useState("allopathy");

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <TitleBlock>
            <ModalTitle>Doctor Empanelment</ModalTitle>
            <ModalSubtitle>
              Add a new medical professional to the AutoMed AI healthcare network.
            </ModalSubtitle>
          </TitleBlock>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormContent>
            {/* Personal Info Section */}
            <Section>
              <SectionHeader>
                <User size={20} />
                <SectionTitle>Personal Info</SectionTitle>
              </SectionHeader>

              <GridLayoutMain>
                <ColSpan9>
                  <GridLayoutInner>
                    <InputGroup>
                      <InputLabel>
                        First Name<span>*</span>
                      </InputLabel>
                      <FormControl placeholder="Sarah" type="text" />
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>Middle Name</InputLabel>
                      <FormControl placeholder="Jane" type="text" />
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>
                        Last Name<span>*</span>
                      </InputLabel>
                      <FormControl placeholder="Jenkins" type="text" />
                    </InputGroup>
                  </GridLayoutInner>
                  <GridLayoutInner>
                    <InputGroup>
                      <InputLabel>
                        Gender<span>*</span>
                      </InputLabel>
                      <FormSelect>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="transgender">Transgender</option>
                        <option value="prefer_not_to_say">Prefer Not to Say</option>
                        <option value="non_confirming">Non-Confirming</option>
                      </FormSelect>
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>
                        Mobile Number<span>*</span>
                      </InputLabel>
                      <FormControl placeholder="+1 (555) 123-4567" type="tel" />
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>Email-ID</InputLabel>
                      <FormControl placeholder="sarah.jenkins@example.com" type="email" />
                    </InputGroup>
                  </GridLayoutInner>
                </ColSpan9>

                <ColSpan3>
                  <ProfileSection>
                    <ProfileLabel>Profile Pic</ProfileLabel>
                    <ProfileUploadArea>
                      <ProfileAvatarWrapper>
                        <User size={28} strokeWidth={1.5} />
                        <UploadText>Upload</UploadText>
                        <ProfileOverlay>
                          <Camera size={20} color="#2563eb" />
                        </ProfileOverlay>
                        <input type="file" style={{ display: "none" }} />
                      </ProfileAvatarWrapper>
                      <UploadHint>
                        JPG or PNG, max 2MB.
                        <br />
                        Recommended 400x400px.
                      </UploadHint>
                    </ProfileUploadArea>
                  </ProfileSection>
                </ColSpan3>
              </GridLayoutMain>
            </Section>

            <Divider />

            {/* Medical Credentials Section */}
            <Section>
              <SectionHeader>
                <Stethoscope size={20} />
                <SectionTitle>Medical Credentials</SectionTitle>
              </SectionHeader>

              <GridLayout2Col>
                <InputGroup>
                  <InputLabel>
                    Medical Classification<span>*</span>
                  </InputLabel>
                  <ToggleContainer>
                    <ToggleButton
                      type="button"
                      $active={classification === "allopathy"}
                      onClick={() => setClassification("allopathy")}
                    >
                      Allopathy
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={classification === "ayush"}
                      onClick={() => setClassification("ayush")}
                    >
                      AYUSH
                    </ToggleButton>
                  </ToggleContainer>
                </InputGroup>
                <InputGroup>
                  <InputLabel>AYUSH Stream</InputLabel>
                  <FormSelect disabled={classification !== "ayush"}>
                    <option value="">Select Stream</option>
                    <option value="homeopathy">Homeopathy</option>
                    <option value="ayurveda">Ayurveda</option>
                  </FormSelect>
                </InputGroup>
                <InputGroup>
                  <InputLabel>Medical Department</InputLabel>
                  <FormSelect>
                    <option value="">Select Department</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="paediatrics">Paediatrics</option>
                    <option value="dental">Dental</option>
                    <option value="general_medicine">General Medicine</option>
                    <option value="orthopaedics">Orthopaedics</option>
                  </FormSelect>
                </InputGroup>
                <InputGroup>
                  <InputLabel>
                    Registration Number / License ID<span>*</span>
                  </InputLabel>
                  <FormControl placeholder="MD-992034-X" type="text" />
                </InputGroup>
                <InputGroup>
                  <InputLabel>
                    Consultation Fee<span>*</span>
                  </InputLabel>
                  <FormControl placeholder="0" type="number" />
                </InputGroup>
                <InputGroup className="col-span-2">
                  <InputLabel>Specialized Qualification</InputLabel>
                  <FormControl placeholder="MD Cardiology - Stanford University" type="text" />
                </InputGroup>
              </GridLayout2Col>
            </Section>
          </FormContent>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton>
            <UserCheck size={18} />
            Empanel Doctor
          </SubmitButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default EmpanelDoctorModal;