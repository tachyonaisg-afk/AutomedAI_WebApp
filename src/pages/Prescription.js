import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Printer, Download, ArrowLeft } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;

  @media print {
    background-color: #ffffff;
  }
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #ffffff;
  padding: 24px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media print {
    display: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  @media print {
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media print {
    display: none;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin: 12px 0 0 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 8px 0 0 0;
`;

const SidebarSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #666666;
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const PreviewCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media print {
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;

  @media print {
    display: none;
  }
`;

const PreviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #22c55e;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PrintButton = styled(Button)`
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

const DownloadButton = styled(Button)`
  background-color: #22c55e;
  color: #ffffff;

  &:hover {
    background-color: #16a34a;
  }
`;

const PaperSizeSelect = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  @media print {
    display: none;
  }
`;

const PaperSizeButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${props => props.active ? '#22c55e' : '#e0e0e0'};
  background-color: ${props => props.active ? '#f0fdf4' : '#ffffff'};
  color: ${props => props.active ? '#22c55e' : '#666666'};

  &:hover {
    border-color: #22c55e;
  }
`;

// Prescription Preview Styles
const PrescriptionPreview = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: ${props => props.paperSize === 'a5' ? '15px' : '20px'};
  min-height: ${props => props.paperSize === 'a5' ? '420px' : '595px'};
  width: 100%;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;

  @media print {
    border: none;
    padding: 10mm;
    min-height: auto;
    width: 100%;
    height: 100%;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
`;

const DoctorInfo = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '11px' : '13px'};
  font-weight: 600;
  color: #333;
`;

const TicketInfo = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  color: #333;
  text-align: right;
`;

const AddressRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.paperSize === 'a5' ? '9px' : '11px'};
  color: #555;
  margin-bottom: 8px;
`;

const PatientInfoRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
`;

const PatientInfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const PatientLabel = styled.span`
  font-size: ${props => props.paperSize === 'a5' ? '8px' : '9px'};
  color: #666;
  text-transform: uppercase;
`;

const PatientValue = styled.span`
  font-weight: 600;
  color: #333;
`;

const ExaminationSection = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 8px;
`;

const ExaminationTitle = styled.div`
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  font-size: ${props => props.paperSize === 'a5' ? '9px' : '10px'};
  font-weight: 600;
`;

const ExaminationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  background-color: #ddd;
`;

const ExaminationItem = styled.div`
  background-color: #fff;
  padding: 6px 8px;
  font-size: ${props => props.paperSize === 'a5' ? '9px' : '11px'};
`;

const ExamLabel = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '8px' : '9px'};
  color: #666;
`;

const ExamValue = styled.div`
  font-weight: 600;
  color: #333;
  min-height: 14px;
`;

const MainContentArea = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 8px;
  min-height: ${props => props.paperSize === 'a5' ? '250px' : '380px'};

  @media print {
    min-height: ${props => props.paperSize === 'a5' ? '100mm' : '150mm'};
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DiagnosisBox = styled.div`
  border: 1px solid #ddd;
  flex: 1;
`;

const DiagnosisTitle = styled.div`
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  font-size: ${props => props.paperSize === 'a5' ? '9px' : '10px'};
  font-weight: 600;
`;

const DiagnosisContent = styled.div`
  padding: 8px;
  font-size: ${props => props.paperSize === 'a5' ? '9px' : '11px'};
  min-height: 60px;
  white-space: pre-wrap;
`;

const PrescriptionArea = styled.div`
  border: 1px solid #ddd;
  position: relative;
  background-color: #fff;
`;

const RxSymbol = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: ${props => props.paperSize === 'a5' ? '24px' : '32px'};
  font-weight: bold;
  color: #333;
  font-family: serif;
`;

const PrescriptionContent = styled.div`
  padding: ${props => props.paperSize === 'a5' ? '40px 12px 12px 50px' : '50px 16px 16px 60px'};
  min-height: 100%;
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  white-space: pre-wrap;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #666666;
`;

const Prescription = () => {
  usePageTitle("Prescription");
  const { id } = useParams();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paperSize, setPaperSize] = useState('a5');

  const [formData, setFormData] = useState({
    selectedDoctor: "",
    ticketDate: new Date().toLocaleDateString('en-GB'),
    ticketTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    grade: "",
    pulse: "",
    bp: "",
    weight: "",
    rr: "",
    temp: "",
    grbs: "",
    chiefPresent: "",
    provisionalDiagnosis: "",
    prescription: "",
  });

  const [selectedDoctorData, setSelectedDoctorData] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
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
      fetchPatientData();
    }
  }, [id]);

  // Fetch healthcare practitioners
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await api.get("https://hms.automedai.in/api/resource/Healthcare Practitioner", {
          fields: '["name", "practitioner_name", "department", "designation"]',
          limit_page_length: 100,
        });

        if (response.data?.data) {
          setPractitioners(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching practitioners:", err);
      }
    };

    fetchPractitioners();
  }, []);

  // Update selected doctor data when selection changes
  useEffect(() => {
    if (formData.selectedDoctor) {
      const doctor = practitioners.find(p => p.name === formData.selectedDoctor);
      setSelectedDoctorData(doctor);
    } else {
      setSelectedDoctorData(null);
    }
  }, [formData.selectedDoctor, practitioners]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatAge = (ageString) => {
    if (!ageString) return "N/A";
    const yearMatch = ageString.match(/(\d+)\s*Year/i);
    if (yearMatch) {
      return `${yearMatch[1]}Y`;
    }
    return ageString;
  };

  const handlePrint = () => {
    // Set print styles based on paper size
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        @page {
          size: ${paperSize === 'a5' ? 'A5 landscape' : 'A4 landscape'};
          margin: 5mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

    // Remove existing print style if any
    const existingStyle = document.getElementById('print-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.querySelector('[data-pdf-content]');

      if (!element) {
        console.error('PDF content element not found');
        return;
      }

      const opt = {
        margin: 5,
        filename: `prescription-${patientData?.name || id}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: 'mm',
          format: paperSize === 'a5' ? 'a5' : 'a4',
          orientation: 'landscape'
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again or use the Print option.');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading patient details...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <LoadingContainer style={{ color: '#ef4444' }}>Error: {error}</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar>
        <BackButton onClick={() => navigate(`/patients/${id}`)}>
          <ArrowLeft />
          Back to Patient
        </BackButton>

        <Title style={{ fontSize: '18px', marginTop: '16px' }}>Prescription</Title>
        <Subtitle>Fill in the details for the prescription</Subtitle>

        <SidebarSection style={{ marginTop: '24px' }}>
          <SectionTitle>Doctor Selection</SectionTitle>
          <FormGroup>
            <Label>Select Doctor *</Label>
            <Select
              name="selectedDoctor"
              value={formData.selectedDoctor}
              onChange={handleFormChange}
            >
              <option value="">Choose a doctor</option>
              {practitioners.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.practitioner_name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Grade</Label>
            <Input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleFormChange}
              placeholder="e.g., 1"
            />
          </FormGroup>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle>General Examination</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormGroup style={{ marginBottom: '8px' }}>
              <Label>Pulse</Label>
              <Input
                type="text"
                name="pulse"
                value={formData.pulse}
                onChange={handleFormChange}
                placeholder="/min"
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '8px' }}>
              <Label>BP</Label>
              <Input
                type="text"
                name="bp"
                value={formData.bp}
                onChange={handleFormChange}
                placeholder="mmHg"
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '8px' }}>
              <Label>Weight</Label>
              <Input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleFormChange}
                placeholder="kg"
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '8px' }}>
              <Label>RR</Label>
              <Input
                type="text"
                name="rr"
                value={formData.rr}
                onChange={handleFormChange}
                placeholder="/min"
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '8px' }}>
              <Label>Temp</Label>
              <Input
                type="text"
                name="temp"
                value={formData.temp}
                onChange={handleFormChange}
                placeholder="F"
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '8px' }}>
              <Label>GRBS</Label>
              <Input
                type="text"
                name="grbs"
                value={formData.grbs}
                onChange={handleFormChange}
                placeholder="mg/dl"
              />
            </FormGroup>
          </div>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle>Diagnosis</SectionTitle>
          <FormGroup>
            <Label>Chief Present</Label>
            <Textarea
              name="chiefPresent"
              value={formData.chiefPresent}
              onChange={handleFormChange}
              placeholder="Enter chief complaints..."
            />
          </FormGroup>
          <FormGroup>
            <Label>Provisional Diagnosis</Label>
            <Textarea
              name="provisionalDiagnosis"
              value={formData.provisionalDiagnosis}
              onChange={handleFormChange}
              placeholder="Enter diagnosis..."
            />
          </FormGroup>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle>Prescription</SectionTitle>
          <FormGroup>
            <Label>Medications / Instructions</Label>
            <Textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleFormChange}
              placeholder="Enter prescription details..."
              style={{ minHeight: '120px' }}
            />
          </FormGroup>
        </SidebarSection>
      </Sidebar>

      <MainContent>
        <Header>
          <div>
            <Title>Prescription Preview</Title>
            <Subtitle>Preview and print the prescription</Subtitle>
          </div>
        </Header>

        <PreviewCard>
          <PreviewHeader>
            <PreviewTitle>Prescription Document</PreviewTitle>
            <ButtonGroup>
              <PaperSizeSelect>
                <PaperSizeButton
                  active={paperSize === 'a5'}
                  onClick={() => setPaperSize('a5')}
                >
                  A5 Landscape
                </PaperSizeButton>
                <PaperSizeButton
                  active={paperSize === 'a4'}
                  onClick={() => setPaperSize('a4')}
                >
                  A4 Landscape
                </PaperSizeButton>
              </PaperSizeSelect>
              <PrintButton onClick={handlePrint}>
                <Printer />
                Print
              </PrintButton>
              <DownloadButton onClick={handleDownloadPDF}>
                <Download />
                Download PDF
              </DownloadButton>
            </ButtonGroup>
          </PreviewHeader>

          <PrescriptionPreview data-pdf-content paperSize={paperSize}>
            <TopRow>
              <DoctorInfo paperSize={paperSize}>
                Dr. {selectedDoctorData?.practitioner_name || "[Select Doctor]"}
                {selectedDoctorData?.designation && ` (${selectedDoctorData.designation})`}
              </DoctorInfo>
              <TicketInfo paperSize={paperSize}>
                <div>Ticket Date: {formData.ticketDate} - {formData.ticketTime}</div>
                <div>Generated By: [Employee Name]</div>
              </TicketInfo>
            </TopRow>

            <AddressRow paperSize={paperSize}>
              <span>[Hospital/Clinic Address]</span>
            </AddressRow>

            <PatientInfoRow paperSize={paperSize}>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>Patient Name</PatientLabel>
                <PatientValue>{patientData?.patient_name || "N/A"}</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>Age / Sex</PatientLabel>
                <PatientValue>
                  {formatAge(patientData?.age)} / {patientData?.sex?.charAt(0) || "N/A"}
                </PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>Grade</PatientLabel>
                <PatientValue>{formData.grade || "-"}</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>Mobile</PatientLabel>
                <PatientValue>{patientData?.mobile || "N/A"}</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>PIN</PatientLabel>
                <PatientValue>{patientData?.pincode || "N/A"}</PatientValue>
              </PatientInfoItem>
            </PatientInfoRow>

            <ExaminationSection>
              <ExaminationTitle paperSize={paperSize}>General Examination</ExaminationTitle>
              <ExaminationGrid>
                <ExaminationItem paperSize={paperSize}>
                  <ExamLabel paperSize={paperSize}>Pulse</ExamLabel>
                  <ExamValue>{formData.pulse || "-"}</ExamValue>
                </ExaminationItem>
                <ExaminationItem paperSize={paperSize}>
                  <ExamLabel paperSize={paperSize}>BP</ExamLabel>
                  <ExamValue>{formData.bp || "-"}</ExamValue>
                </ExaminationItem>
                <ExaminationItem paperSize={paperSize}>
                  <ExamLabel paperSize={paperSize}>Wt</ExamLabel>
                  <ExamValue>{formData.weight || "-"}</ExamValue>
                </ExaminationItem>
                <ExaminationItem paperSize={paperSize}>
                  <ExamLabel paperSize={paperSize}>RR</ExamLabel>
                  <ExamValue>{formData.rr || "-"}</ExamValue>
                </ExaminationItem>
                <ExaminationItem paperSize={paperSize}>
                  <ExamLabel paperSize={paperSize}>Temp</ExamLabel>
                  <ExamValue>{formData.temp || "-"}</ExamValue>
                </ExaminationItem>
                <ExaminationItem paperSize={paperSize}>
                  <ExamLabel paperSize={paperSize}>GRBS</ExamLabel>
                  <ExamValue>{formData.grbs || "-"}</ExamValue>
                </ExaminationItem>
              </ExaminationGrid>
            </ExaminationSection>

            <MainContentArea paperSize={paperSize}>
              <LeftColumn>
                <DiagnosisBox>
                  <DiagnosisTitle paperSize={paperSize}>Chief Present</DiagnosisTitle>
                  <DiagnosisContent paperSize={paperSize}>
                    {formData.chiefPresent || ""}
                  </DiagnosisContent>
                </DiagnosisBox>
                <DiagnosisBox>
                  <DiagnosisTitle paperSize={paperSize}>Provisional Diagnosis</DiagnosisTitle>
                  <DiagnosisContent paperSize={paperSize}>
                    {formData.provisionalDiagnosis || ""}
                  </DiagnosisContent>
                </DiagnosisBox>
              </LeftColumn>

              <PrescriptionArea>
                <RxSymbol paperSize={paperSize}>Rx</RxSymbol>
                <PrescriptionContent paperSize={paperSize}>
                  {formData.prescription || ""}
                </PrescriptionContent>
              </PrescriptionArea>
            </MainContentArea>
          </PrescriptionPreview>
        </PreviewCard>
      </MainContent>
    </Container>
  );
};

export default Prescription;
