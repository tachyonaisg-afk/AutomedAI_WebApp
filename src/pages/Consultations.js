import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import usePageTitle from "../hooks/usePageTitle";
import { Plus } from "lucide-react";

const ConsultationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ScheduleButton = styled.button`
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
    width: 16px;
    height: 16px;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TableContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-child {
    width: 40px;
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
  background-color: ${(props) => (props.selected ? "#eaf4ff" : "transparent")};

  &:hover {
    background-color: ${(props) => (props.selected ? "#eaf4ff" : "#f8f9fa")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333333;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.status === "Issued") return "#e8f5e9";
    if (props.status === "Pending") return "#fff4e5";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.status === "Issued") return "#2e7d32";
    if (props.status === "Pending") return "#f57c00";
    return "#666666";
  }};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-right: 12px;
  transition: color 0.2s;

  &:hover {
    color: #357abd;
    text-decoration: underline;
  }
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const NotesCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 2px solid #e0e0e0;
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

const NotesTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
`;

const NoteItem = styled.div`
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NoteText = styled.p`
  font-size: 14px;
  color: #333333;
  margin: 0;
  line-height: 1.5;
`;

const NoteAuthor = styled.span`
  font-size: 12px;
  color: #666666;
`;

const NoteTextarea = styled.textarea`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const SaveNoteButton = styled.button`
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

const PreviewCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PreviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const VideoPreview = styled.div`
  width: 100%;
  height: 300px;
  background-color: #2d3748;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  position: relative;
`;

const VideoAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
`;

const Consultations = () => {
  usePageTitle("Consultations");
  const [selectedConsultation, setSelectedConsultation] = useState(1);
  const [activeTab, setActiveTab] = useState("notes");
  const [newNote, setNewNote] = useState("");

  const consultations = [
    {
      id: 0,
      date: "2024-10-28",
      doctor: "Dr. Evelyn Reed",
      patient: "Liam Gallagher",
      time: "10:00 AM",
      status: "Issued",
    },
    {
      id: 1,
      date: "2024-10-28",
      doctor: "Dr. Marcus Thorne",
      patient: "Olivia Chen",
      time: "10:30 AM",
      status: "Pending",
    },
    {
      id: 2,
      date: "2024-10-28",
      doctor: "Dr. Evelyn Reed",
      patient: "Benjamin Carter",
      time: "11:00 AM",
      status: "Not Required",
    },
    {
      id: 3,
      date: "2024-10-29",
      doctor: "Dr. Sofia Rossi",
      patient: "Ava Rodriguez",
      time: "09:00 AM",
      status: "Pending",
    },
  ];

  const notes = [
    {
      id: 1,
      text: "Patient reports mild chest discomfort. Scheduled an ECG next week. Follow-up on blood pressure medication.",
      author: "Dr. Thorne",
      date: "2024-10-21",
    },
    {
      id: 2,
      text: "Initial consultation. Patient has a family history of heart disease. Advised on diet and exercise changes.",
      author: "Dr. Thorne",
      date: "2024-09-15",
    },
  ];

  const handleScheduleNew = () => {
    console.log("Schedule new consultation");
  };

  const handleJoinCall = (patient) => {
    console.log("Join call with:", patient);
  };

  const handleUpload = (patient) => {
    console.log("Upload for:", patient);
  };

  const handleSaveNote = () => {
    if (newNote.trim()) {
      console.log("Saving note:", newNote);
      setNewNote("");
    }
  };

  const selectedPatient = consultations[selectedConsultation];

  return (
    <Layout>
      <ConsultationsContainer>
        <Header>
          <PageTitle>Manage Consultations</PageTitle>
          <ScheduleButton onClick={handleScheduleNew}>
            <Plus />
            Schedule New
          </ScheduleButton>
        </Header>

        <ContentWrapper>
          <MainContent>
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell></TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Doctor</TableHeaderCell>
                    <TableHeaderCell>Patient</TableHeaderCell>
                    <TableHeaderCell>Time</TableHeaderCell>
                    <TableHeaderCell>Prescription Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow
                      key={consultation.id}
                      selected={selectedConsultation === consultation.id}
                    >
                      <TableCell>
                        <Checkbox
                          type="checkbox"
                          checked={selectedConsultation === consultation.id}
                          onChange={() => setSelectedConsultation(consultation.id)}
                        />
                      </TableCell>
                      <TableCell>{consultation.date}</TableCell>
                      <TableCell>{consultation.doctor}</TableCell>
                      <TableCell>{consultation.patient}</TableCell>
                      <TableCell>{consultation.time}</TableCell>
                      <TableCell>
                        <StatusBadge status={consultation.status}>
                          {consultation.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ActionButton onClick={() => handleJoinCall(consultation.patient)}>
                          Join Call
                        </ActionButton>
                        <ActionButton onClick={() => handleUpload(consultation.patient)}>
                          Upload
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <PreviewCard>
              <PreviewTitle>Live Consultation Preview</PreviewTitle>
              <VideoPreview>
                <VideoAvatar>O</VideoAvatar>
                <VideoAvatar>D</VideoAvatar>
              </VideoPreview>
            </PreviewCard>
          </MainContent>

          <SidePanel>
            <NotesCard>
              <TabsContainer>
                <Tab active={activeTab === "notes"} onClick={() => setActiveTab("notes")}>
                  Patient Notes
                </Tab>
                <Tab active={activeTab === "documents"} onClick={() => setActiveTab("documents")}>
                  Shared Documents
                </Tab>
              </TabsContainer>

              {activeTab === "notes" && (
                <>
                  <NotesTitle>Notes for {selectedPatient?.patient}</NotesTitle>
                  <NotesList>
                    {notes.map((note) => (
                      <NoteItem key={note.id}>
                        <NoteText>{note.text}</NoteText>
                        <NoteAuthor>
                          {note.author} - {note.date}
                        </NoteAuthor>
                      </NoteItem>
                    ))}
                  </NotesList>
                  <NoteTextarea
                    placeholder="Add a new note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <SaveNoteButton onClick={handleSaveNote}>Save Note</SaveNoteButton>
                </>
              )}

              {activeTab === "documents" && (
                <div style={{ padding: "20px", textAlign: "center", color: "#666666" }}>
                  No shared documents available
                </div>
              )}
            </NotesCard>
          </SidePanel>
        </ContentWrapper>
      </ConsultationsContainer>
    </Layout>
  );
};

export default Consultations;
