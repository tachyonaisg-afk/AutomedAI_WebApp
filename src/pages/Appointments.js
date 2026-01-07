import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Plus, Calendar, Clock, User, Video, MapPin, ChevronRight, Filter } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const AppointmentsContainer = styled.div`
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
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const StatCard = styled.div`
  background-color: #f5f5f5;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #666666;
  font-weight: 400;
`;

const StatValue = styled.span`
  font-size: 32px;
  font-weight: 600;
  color: ${(props) => props.color || "#333333"};
`;

const FiltersBar = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: ${(props) => (props.active ? "#4a90e2" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#333333")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4a90e2;
    background-color: ${(props) => (props.active ? "#357abd" : "#f5f5f5")};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AppointmentCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const AppointmentLeft = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex: 1;
`;

const AppointmentTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const TimeValue = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #4a90e2;
`;

const TimeLabel = styled.span`
  font-size: 12px;
  color: #666666;
  margin-top: 4px;
`;

const AppointmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666666;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AppointmentRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.variant === "confirmed") return "#e8f5e9";
    if (props.variant === "pending") return "#fff3e0";
    if (props.variant === "cancelled") return "#ffebee";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.variant === "confirmed") return "#2e7d32";
    if (props.variant === "pending") return "#f57c00";
    if (props.variant === "cancelled") return "#c62828";
    return "#666666";
  }};
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: #357abd;
  }
`;

const Appointments = () => {
  usePageTitle("Appointments");
  const [activeFilter, setActiveFilter] = useState("today");

  const stats = [
    { label: "Today's Appointments", value: "12", color: "#4a90e2" },
    { label: "Pending", value: "5", color: "#f57c00" },
    { label: "Completed", value: "8", color: "#2e7d32" },
    { label: "Cancelled", value: "2", color: "#c62828" },
  ];

  const appointments = [
    {
      time: "09:00",
      period: "AM",
      patient: "John Doe",
      doctor: "Dr. Smith",
      type: "Consultation",
      location: "Room 101",
      status: "confirmed",
    },
    {
      time: "10:30",
      period: "AM",
      patient: "Jane Smith",
      doctor: "Dr. Johnson",
      type: "Follow-up",
      location: "Telemedicine",
      status: "confirmed",
    },
    {
      time: "11:00",
      period: "AM",
      patient: "Michael Johnson",
      doctor: "Dr. Williams",
      type: "Consultation",
      location: "Room 205",
      status: "pending",
    },
    {
      time: "02:00",
      period: "PM",
      patient: "Emily Davis",
      doctor: "Dr. Smith",
      type: "Follow-up",
      location: "Room 101",
      status: "confirmed",
    },
    {
      time: "03:30",
      period: "PM",
      patient: "Robert Brown",
      doctor: "Dr. Johnson",
      type: "Telemedicine",
      location: "Online",
      status: "cancelled",
    },
  ];

  return (
    <Layout>
      <AppointmentsContainer>
        <HeaderSection>
          <TitleSection>
            <Title>Appointments</Title>
            <Subtitle>Manage and view all scheduled appointments.</Subtitle>
          </TitleSection>
          <AddButton>
            <Plus />
            New Appointment
          </AddButton>
        </HeaderSection>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue color={stat.color}>{stat.value}</StatValue>
            </StatCard>
          ))}
        </StatsGrid>

        <FiltersBar>
          <FilterButton active={activeFilter === "today"} onClick={() => setActiveFilter("today")}>
            <Calendar />
            Today
          </FilterButton>
          <FilterButton active={activeFilter === "week"} onClick={() => setActiveFilter("week")}>
            <Calendar />
            This Week
          </FilterButton>
          <FilterButton active={activeFilter === "month"} onClick={() => setActiveFilter("month")}>
            <Calendar />
            This Month
          </FilterButton>
          <FilterButton active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
            <Filter />
            All Appointments
          </FilterButton>
        </FiltersBar>

        <AppointmentsList>
          {appointments.map((appointment, index) => (
            <AppointmentCard key={index}>
              <AppointmentLeft>
                <AppointmentTime>
                  <TimeValue>{appointment.time}</TimeValue>
                  <TimeLabel>{appointment.period}</TimeLabel>
                </AppointmentTime>
                <AppointmentInfo>
                  <PatientName>{appointment.patient}</PatientName>
                  <AppointmentDetails>
                    <DetailItem>
                      <User />
                      {appointment.doctor}
                    </DetailItem>
                    <DetailItem>
                      <Clock />
                      {appointment.type}
                    </DetailItem>
                    <DetailItem>
                      {appointment.location === "Telemedicine" || appointment.location === "Online" ? <Video /> : <MapPin />}
                      {appointment.location}
                    </DetailItem>
                  </AppointmentDetails>
                </AppointmentInfo>
              </AppointmentLeft>
              <AppointmentRight>
                <StatusBadge variant={appointment.status}>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</StatusBadge>
                <ViewButton>
                  View
                  <ChevronRight />
                </ViewButton>
              </AppointmentRight>
            </AppointmentCard>
          ))}
        </AppointmentsList>
      </AppointmentsContainer>
    </Layout>
  );
};

export default Appointments;
