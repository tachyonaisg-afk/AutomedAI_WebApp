import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Printer, Download, ArrowLeft } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";
import Select from "react-select";

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

// const Select = styled.select`
//   width: 100%;
//   padding: 10px 12px;
//   border: 1px solid #e0e0e0;
//   border-radius: 6px;
//   font-size: 14px;
//   color: #333333;
//   background-color: #ffffff;
//   cursor: pointer;

//   &:focus {
//     outline: none;
//     border-color: #4a90e2;
//   }
// `;
const ReactSelect = styled(Select)`
  .react-select__control {
    min-height: 42px;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    font-size: 14px;
    box-shadow: none;
    cursor: pointer;

    &:hover {
      border-color: #4a90e2;
    }
  }

  .react-select__control--is-focused {
    border-color: #4a90e2;
    box-shadow: none;
  }

  .react-select__value-container {
    padding: 2px 10px;
  }

  .react-select__single-value {
    color: #333333;
  }

  .react-select__placeholder {
    color: #999999;
    font-size: 14px;
  }

  .react-select__menu {
    z-index: 1000;
    font-size: 14px;
  }

  .react-select__option {
    cursor: pointer;
  }

  .react-select__option--is-focused {
    background-color: #f0f6ff;
  }

  .react-select__option--is-selected {
    background-color: #4a90e2;
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

const PrescriptionHeader = styled.div`
  text-align: center;
  margin-bottom: 12px;
  padding: 12px;
  border-bottom: 2px solid #000;
`;

const HeaderTitle = styled.h1`
  font-size: ${props => props.paperSize === 'a5' ? '16px' : '18px'};
  font-weight: 700;
  color: #000;
  margin: 0 0 8px 0;
  text-transform: uppercase;
`;

const HeaderSubtitle = styled.h2`
  font-size: ${props => props.paperSize === 'a5' ? '12px' : '14px'};
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
`;

const HeaderAddress = styled.p`
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '11px'};
  color: #000;
  margin: 0;
  line-height: 1.5;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 8px;
  border: 1px solid #000;
  border-bottom: 2px solid #000;
  margin-bottom: 0;
  gap: 12px;
`;

const DoctorInfo = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '11px' : '13px'};
  font-weight: 500;
  color: #000;
  line-height: 1.4;
`;

const TicketInfo = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  color: #000;
  text-align: right;
  line-height: 1.5;
`;

const PatientInfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 12px;
  padding: 8px;
  border: 1px solid #000;
  border-top: none;
  margin-bottom: 8px;
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
`;

const PatientInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PatientLabel = styled.span`
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  color: #000;
  font-weight: 500;
`;

const PatientValue = styled.span`
  font-weight: 400;
  color: #000;
`;

const MainContentArea = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 0;
  min-height: ${props => props.paperSize === 'a5' ? '200px' : '350px'};

  @media print {
    min-height: ${props => props.paperSize === 'a5' ? '70mm' : '130mm'};
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  border-right: 1px solid #000;
`;

const StaticInfoBox = styled.div`
  border-bottom: 1px solid #000;
  flex: 1;
  min-height: auto;
`;

const StaticInfoTitle = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '11px' : '13px'};
  font-weight: 600;
  color: #000;
  padding: 8px 10px;
  border-bottom: 1px solid #000;
  background-color: #f5f5f5;
`;

const StaticInfoContent = styled.div`
  padding: 12px 10px;
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '11px'};
  line-height: 1.8;
  color: #000;
`;

const RightColumn = styled.div`
  border: 1px solid #000;
  border-left: none;
  position: relative;
  min-height: 100%;
`;

const SignatureBox = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 12px;
  padding-top: 12px;
  border-top: 1px solid #000;
  font-size: ${props => props.paperSize === 'a5' ? '9px' : '10px'};
  text-align: center;
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
  const [appointmentId, setAppointmentId] = useState(null);
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

  useEffect(() => {
  const fetchPatientAppointment = async () => {
    try {
      if (!patientData?.name) return;

      const response = await api.get(
        "https://{{web_address}}/api/resource/Patient Appointment",
        {
          params: {
            filters: JSON.stringify([
              ["patient", "=", patientData.name],
            ]),
            fields: JSON.stringify(["name"]),
            limit_page_length: 1, // latest / first appointment
          },
        }
      );

      if (response.data?.data?.length > 0) {
        setAppointmentId(response.data.data[0].name);
      } else {
        setAppointmentId(null); // no appointment found
      }
    } catch (err) {
      console.error("Error fetching patient appointment:", err);
    }
  };

  fetchPatientAppointment();
}, [patientData]);


  // Fetch healthcare practitioners
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await api.get("https://hms.automedai.in/api/resource/Healthcare Practitioner", {
          fields: '["name", "practitioner_name", "department", "designation"]',
          limit_page_length: 1500,
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
  const doctorOptions = practitioners.map((p) => ({
    value: p.name,
    label: p.practitioner_name,
  }));


  // Update selected doctor data when selection changes
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (formData.selectedDoctor) {
        try {
          const response = await api.get(`https://hms.automedai.in/api/resource/Healthcare Practitioner/${formData.selectedDoctor}`);
          console.log("Doctor Details Response:", response.data);
          setSelectedDoctorData(response.data?.data);
        } catch (err) {
          console.error("Error fetching doctor details:", err);
          // Fallback to basic info from practitioners list
          const doctor = practitioners.find(p => p.name === formData.selectedDoctor);
          setSelectedDoctorData(doctor);
        }
      } else {
        setSelectedDoctorData(null);
      }
    };

    fetchDoctorDetails();
  }, [formData.selectedDoctor, practitioners]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatAge = (dob) => {
    if (!dob) return "00 Years 00 Months 00 Days";

    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return "00 Years 00 Months 00 Days";
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust days and months if negative
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(years)} Years ${pad(months)} Months ${pad(days)} Days`;
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

        <SidebarSection style={{ marginTop: "24px" }}>
          <SectionTitle>Doctor Selection</SectionTitle>
          <FormGroup>
            <Label>Select Doctor *</Label>

            <ReactSelect
              classNamePrefix="react-select"
              options={doctorOptions}
              placeholder="Choose a doctor"
              isClearable
              isSearchable
              value={doctorOptions.find(
                (opt) => opt.value === formData.selectedDoctor
              )}
              onChange={(selectedOption) =>
                handleFormChange({
                  target: {
                    name: "selectedDoctor",
                    value: selectedOption ? selectedOption.value : "",
                  },
                })
              }
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
            <PrescriptionHeader>
              <HeaderTitle paperSize={paperSize}>Ramakrishna Mission Ashrama Sargachi</HeaderTitle>
              <HeaderSubtitle paperSize={paperSize}>Charitable Dispensary & Diagnostic Centre ( ISO 9001:2008 Certified )</HeaderSubtitle>
              <HeaderAddress paperSize={paperSize}>
                P.0 - Sugachi Ashrama, Dist- Murshidabad, Pin-742408, West Bengal, India, Phone : (03482) 232301
              </HeaderAddress>
            </PrescriptionHeader>

            <TopRow>
              <DoctorInfo paperSize={paperSize}>
                [Dr. {selectedDoctorData?.practitioner_name || "Dlk, Biswas"}]<br />
                [Ex- H.M.o]<br />
                PM]
              </DoctorInfo>
              <TicketInfo paperSize={paperSize}>
                <div>SL NO:</div>
                <div>Appointment ID: {appointmentId}</div>
                <div>Ticket Date: [{formData.ticketDate} - {formData.ticketTime}]</div>
              </TicketInfo>
            </TopRow>

            <PatientInfoRow paperSize={paperSize}>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>[PT Reg No :</PatientLabel>
                <PatientValue>{patientData?.name || "0000000000"}]</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>[PT Name :</PatientLabel>
                <PatientValue>{patientData?.patient_name || "xxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxx"}]</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>Age</PatientLabel>
                <PatientValue>[{formatAge(patientData?.dob)}]</PatientValue>
              </PatientInfoItem>
            </PatientInfoRow>

            <MainContentArea paperSize={paperSize}>
              <LeftColumn>
                <StaticInfoBox>
                  <StaticInfoTitle paperSize={paperSize}>General Examinations</StaticInfoTitle>
                  <StaticInfoContent paperSize={paperSize}>
                    Temperature<br />
                    Blood Pressure<br />
                    Weight Height
                  </StaticInfoContent>
                </StaticInfoBox>
                <StaticInfoBox style={{ borderBottom: 'none' }}>
                  <StaticInfoTitle paperSize={paperSize}>Advice for Investigation</StaticInfoTitle>
                  <StaticInfoContent paperSize={paperSize}>
                    CBC/TC.DC,HB,ESR/PL-COUNT<br />
                    MP/MP DA/WIDAL/ASO/CRP/RA/ANF<br />
                    BT,CT/PT/APTT,FDP/D-<br />
                    DIMER/FIBRINOGEN<br />
                    URINE R/E,C/S, STOOL R/E<br />
                    SUGER R/PP,H/HBA1C, ACR, N+, K+<br />
                    CL-,CA+<br />
                    CR UREA/URIC/LFT/LIPID PRO<br />
                    T4,T3,TSH/PPL/FSH,LH, E, VIT D3<br />
                    RFT/CREATININE RATIO PARTIAL<br />
                    RD U/S ASC/PLY,ANO-PARTIAL
                  </StaticInfoContent>
                </StaticInfoBox>
              </LeftColumn>

              <RightColumn>
                <SignatureBox paperSize={paperSize}>
                  [Signature]
                </SignatureBox>
              </RightColumn>
            </MainContentArea>
          </PrescriptionPreview>
        </PreviewCard>
      </MainContent>
    </Container>
  );
};

export default Prescription;
