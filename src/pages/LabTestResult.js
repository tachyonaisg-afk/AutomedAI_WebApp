import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";

const ResultContainer = styled.div`
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

const PatientInfoCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  font-weight: 600;
`;

const ResultsTable = styled.div`
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
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #333333;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
    text-align: center;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

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
    font-weight: 500;
  }

  &:last-child {
    padding-right: 24px;
    text-align: center;
  }
`;

const ResultInput = styled.input`
  width: 100%;
  max-width: 150px;
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.isAbnormal ? "#dc2626" : "#e0e0e0")};
  border-radius: 6px;
  font-size: 14px;
  color: ${(props) => (props.isAbnormal ? "#dc2626" : "#333333")};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const FlagIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => {
    if (props.flag === "normal") return "#22c55e";
    if (props.flag === "high") return "#dc2626";
    if (props.flag === "low") return "#f59e0b";
    return "#d1d5db";
  }};
  margin: 0 auto;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const NotesCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const SideCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const Select = styled.select`
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
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

const DateInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

const AttachmentsCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4a90e2;
    background-color: #f8f9fa;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const UploadText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const UploadSubtext = styled.p`
  font-size: 12px;
  color: #999999;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
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
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #e0e0e0;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  &.outline {
    background-color: #ffffff;
    color: #4a90e2;
    border: 1px solid #4a90e2;

    &:hover {
      background-color: #f0f7ff;
    }
  }
`;

const LabTestResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample patient data - would come from API
  const patientData = {
    name: "John Doe",
    patientId: "P12345",
    age: "34",
    gender: "Male",
    referringDoctor: "Dr. Smith",
  };

  const [testResults, setTestResults] = useState([
    {
      parameter: "Hemoglobin",
      value: "14.5",
      unit: "g/dL",
      normalRange: "13.5 - 17.5",
      flag: "normal",
    },
    {
      parameter: "WBC Count",
      value: "12.2",
      unit: "x10³/μL",
      normalRange: "4.5 - 11.0",
      flag: "high",
    },
    {
      parameter: "Platelet Count",
      value: "",
      unit: "x10³/μL",
      normalRange: "150 - 450",
      flag: "none",
    },
  ]);

  const [formData, setFormData] = useState({
    technicianNotes: "",
    verifiedBy: "",
    reportDate: "2023-10-27",
    status: "Under Review",
  });

  const handleResultChange = (index, value) => {
    const updatedResults = [...testResults];
    updatedResults[index].value = value;

    // Determine flag based on normal range
    const range = updatedResults[index].normalRange.split(" - ");
    const min = parseFloat(range[0]);
    const max = parseFloat(range[1]);
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      if (numValue < min) {
        updatedResults[index].flag = "low";
      } else if (numValue > max) {
        updatedResults[index].flag = "high";
      } else {
        updatedResults[index].flag = "normal";
      }
    } else {
      updatedResults[index].flag = "none";
    }

    setTestResults(updatedResults);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    // TODO: Implement PDF download
  };

  const handlePreviewReport = () => {
    console.log("Previewing report...");
    // TODO: Implement report preview
  };

  const handlePublishReport = () => {
    console.log("Publishing report...", { testResults, formData });
    // TODO: Call API to publish report
    navigate("/pathlab/labtest");
  };

  const isAbnormal = (flag) => {
    return flag === "high" || flag === "low";
  };

  return (
    <Layout>
      <ResultContainer>
        <PageTitle>Lab Test Result Entry</PageTitle>

        <PatientInfoCard>
          <InfoItem>
            <InfoLabel>Patient Name</InfoLabel>
            <InfoValue>{patientData.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Patient ID</InfoLabel>
            <InfoValue>{patientData.patientId}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Age & Gender</InfoLabel>
            <InfoValue>
              {patientData.age} / {patientData.gender}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Referring Doctor</InfoLabel>
            <InfoValue>{patientData.referringDoctor}</InfoValue>
          </InfoItem>
        </PatientInfoCard>

        <ResultsTable>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Parameter Name</TableHeaderCell>
                <TableHeaderCell>Result Value</TableHeaderCell>
                <TableHeaderCell>Unit</TableHeaderCell>
                <TableHeaderCell>Normal Range</TableHeaderCell>
                <TableHeaderCell>Flag</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {testResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.parameter}</TableCell>
                  <TableCell>
                    <ResultInput
                      type="text"
                      value={result.value}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      placeholder="Enter value"
                      isAbnormal={isAbnormal(result.flag)}
                    />
                  </TableCell>
                  <TableCell>{result.unit}</TableCell>
                  <TableCell>{result.normalRange}</TableCell>
                  <TableCell>
                    <FlagIndicator flag={result.flag} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResultsTable>

        <BottomSection>
          <NotesCard>
            <CardTitle>Technician Notes</CardTitle>
            <Textarea
              name="technicianNotes"
              value={formData.technicianNotes}
              onChange={handleFormChange}
              placeholder="Add any relevant notes here..."
            />
          </NotesCard>

          <SideCard>
            <FormGroup>
              <Label>Verified By</Label>
              <Select
                name="verifiedBy"
                value={formData.verifiedBy}
                onChange={handleFormChange}
              >
                <option value="">Choose a supervisor</option>
                <option value="Dr. Johnson">Dr. Johnson</option>
                <option value="Dr. Smith">Dr. Smith</option>
                <option value="Dr. Williams">Dr. Williams</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Report Date</Label>
              <DateInput
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleFormChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select name="status" value={formData.status} onChange={handleFormChange}>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </Select>
            </FormGroup>
          </SideCard>
        </BottomSection>

        <AttachmentsCard>
          <CardTitle>Attachments</CardTitle>
          <UploadArea>
            <UploadIcon>
              <Upload />
            </UploadIcon>
            <UploadText>Click to upload or drag and drop</UploadText>
            <UploadSubtext>PDF, PNG, JPG (MAX. 5MB)</UploadSubtext>
          </UploadArea>
        </AttachmentsCard>

        <ButtonGroup>
          <Button className="secondary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button className="outline" onClick={handlePreviewReport}>
            Preview Report
          </Button>
          <Button className="primary" onClick={handlePublishReport}>
            Publish Report
          </Button>
        </ButtonGroup>
      </ResultContainer>
    </Layout>
  );
};

export default LabTestResult;
