import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import {
    Bell,
    User,
    UserPlus,
    ShieldCheck,
    Stethoscope,
    Clock,
    CreditCard,
    Download,
    Search,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import OpdRoomTab from "../components/modals/OpdRoomTab";
import DoctorAvailabilityTab from "../components/modals/DoctorAvailabilityTab";
import DoctorAssignmentTab from "../components/modals/DoctorAssignmentTab";

/* ---------------- Styled Components ---------------- */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  height: 100%;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ variant }) =>
        variant === "blue" &&
        `
    background-color: #eff6ff;
    color: #3b82f6;
  `}
  ${({ variant }) =>
        variant === "purple" &&
        `
    background-color: #faf5ff;
    color: #8b5cf6;
  `}
  ${({ variant }) =>
        variant === "green" &&
        `
    background-color: #f0fdf4;
    color: #22c55e;
  `}
  ${({ variant }) =>
        variant === "orange" &&
        `
    background-color: #fff7ed;
    color: #f97316;
  `}
  ${({ variant }) =>
        variant === "red" &&
        `
    background-color: #fef2f2;
    color: #ef4444;
  `}
  ${({ variant }) =>
        variant === "teal" &&
        `
    background-color: #f0fdfa;
    color: #14b8a6;
  `}
`;

const ActionTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ActionCard = styled.div`
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
&:hover ${IconWrapper} {
    transform: scale(1.1);
    border-radius: 50%;
  }
    &:hover ${ActionTitle} {
    scale: 1.1;
  }

  &:hover div {
    transform: scale(1.1);
  }
`;



const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 42rem;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background-color: #ffffff;
  border: none;
  border-radius: 9999px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 1100px;
  height: 85vh;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleMain = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Subtitle = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`;

const CloseBtn = styled.button`
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8fafc;
`;

const SecondaryBtn = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  cursor: pointer;
`;

const PrimaryBtn = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
`;
const TabBar = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 2rem;
  background: #f8fafc;
`;

const TabButton = styled.button`
  padding: 1rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ active }) => (active ? "#3b82f6" : "transparent")};
  color: ${({ active }) => (active ? "#3b82f6" : "#64748b")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const TabDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const OpdAdmin = () => {
    usePageTitle("OPD Admin Dashboard");
    const [isManageSlotsOpen, setIsManageSlotsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("opd");

    const [rooms, setRooms] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [assignments, setAssignments] = useState([]);

    return (
        <Layout>
            <Container>

                <ScrollableContent>
                    <QuickActionsGrid>
                        <ActionCard>
                            <IconWrapper variant="blue">
                                <UserPlus size={26} />
                            </IconWrapper>
                            <ActionTitle>Create Staff</ActionTitle>
                        </ActionCard>

                        <ActionCard>
                            <IconWrapper variant="purple">
                                <ShieldCheck size={26} />
                            </IconWrapper>
                            <ActionTitle>Manage Roles</ActionTitle>
                        </ActionCard>

                        <ActionCard>
                            <IconWrapper variant="green">
                                <Stethoscope size={26} />
                            </IconWrapper>
                            <ActionTitle>Register Doctor</ActionTitle>
                        </ActionCard>

                        <ActionCard onClick={() => setIsManageSlotsOpen(true)}>
                            <IconWrapper variant="orange">
                                <Clock size={26} />
                            </IconWrapper>
                            <ActionTitle>Manage OPD</ActionTitle>
                        </ActionCard>

                        <ActionCard>
                            <IconWrapper variant="red">
                                <CreditCard size={26} />
                            </IconWrapper>
                            <ActionTitle>Daily Collections</ActionTitle>
                        </ActionCard>

                        <ActionCard>
                            <IconWrapper variant="teal">
                                <Download size={26} />
                            </IconWrapper>
                            <ActionTitle>Export Reports</ActionTitle>
                        </ActionCard>
                    </QuickActionsGrid>

                    <SearchSection>
                        <SearchContainer>
                            <SearchIconWrapper>
                                <Search size={24} />
                            </SearchIconWrapper>
                            <SearchInput placeholder="Search for staff, doctor ID, role, or transaction number..." />
                        </SearchContainer>
                    </SearchSection>
                </ScrollableContent>
            </Container>


            {isManageSlotsOpen && (
                <Overlay>
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle>
                                <TitleMain>Manage OPD & Facilities</TitleMain>
                                <Subtitle>
                                    Configure rooms, doctor schedules and assignments
                                </Subtitle>
                            </ModalTitle>

                            <CloseBtn onClick={() => setIsManageSlotsOpen(false)}>
                                ✕
                            </CloseBtn>
                        </ModalHeader>

                        <ModalContent>
                            <TabBar>
                                <TabButton
                                    active={activeTab === "availability"}
                                    onClick={() => setActiveTab("availability")}
                                >
                                    <TabDot color="#14b8a6" />
                                    Doctor Availability
                                </TabButton>
                                <TabButton
                                    active={activeTab === "assignment"}
                                    onClick={() => setActiveTab("assignment")}
                                >
                                    <TabDot color="#8b5cf6" />
                                    Doctor Assignment
                                </TabButton>
                                <TabButton
                                    active={activeTab === "opd"}
                                    onClick={() => setActiveTab("opd")}
                                >
                                    <TabDot color="#3b82f6" />
                                    OPD Room Management
                                </TabButton>
                            </TabBar>
                        {activeTab === "opd" && (
                            <OpdRoomTab
                                rooms={rooms}
                                setRooms={setRooms}
                            />
                        )}
                        {activeTab === "availability" && (
                            <DoctorAvailabilityTab
                                availability={availability}
                                setAvailability={setAvailability}
                            />
                        )}
                        {activeTab === "assignment" && (
                            <DoctorAssignmentTab
                                assignments={assignments}
                                setAssignments={setAssignments}
                            />
                        )}
                        </ModalContent>
                        <ModalFooter>
                            <SecondaryBtn onClick={() => setIsManageSlotsOpen(false)}>
                                Cancel
                            </SecondaryBtn>
                            
                        </ModalFooter>
                    </ModalContainer>
                </Overlay>
            )}
        </Layout>
    );
};
export default OpdAdmin;