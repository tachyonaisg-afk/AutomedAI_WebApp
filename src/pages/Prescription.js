import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Printer, Download, ArrowLeft } from "lucide-react";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";
import Select from "react-select";
import { MessageCircle } from "lucide-react";
import rkmsHeader from "../assets/rkma_ltrhd_hdr.jpg";
import alfaHeader from "../assets/alfa_hdr.jpg.jpeg";

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
  padding: 10px 8px;
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
  padding: ${props => props.paperSize === 'a5' ? '3px' : '3px'};
  min-height: ${props => props.paperSize === 'a5' ? '420px' : '595px'};
  width: 100%;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;

  @media print {
    border: none;
    padding: 3mm;
    min-height: auto;
    width: 100%;
    height: 100%;
  }
`;

const PrescriptionHeader = styled.div`
  text-align: center;
  margin-bottom: 2px;
  border-bottom: 2px solid #000;
`;

const HeaderTitle = styled.h1`
  font-size: ${props => props.paperSize === 'a5' ? '24px' : '26px'};
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
`;

const HeaderSubtitle = styled.h2`
  font-size: ${props => props.paperSize === 'a5' ? '12px' : '14px'};
  font-weight: 600;
  color: #000;
`;

const HeaderAddress = styled.p`
  font-size: ${props => props.paperSize === 'a5' ? '12px' : '13px'};
  color: #000;
  line-height: 1.5;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr 1fr auto;
  padding: 3px;
  border: 1px solid #000;
  border-bottom: 2px solid #000;
  margin-bottom: 0;
  gap: 5px;
`;

const DoctorInfo = styled.div`
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
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
  grid-template-columns: auto auto auto auto;
  gap: 5px;
  padding: 3px;
  border: 1px solid #000;
  border-top: none;
  margin-bottom: 2px;
  font-size: ${props => props.paperSize === 'a5' ? '8px' : '10px'};
`;

const PatientInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const PatientLabel = styled.span`
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  color: #000;
  font-weight: 500;
`;

const PatientValue = styled.span`
  font-weight: 400;
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  color: #000;
`;

const MainContentArea = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
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
  font-size: ${props => props.paperSize === 'a5' ? '10px' : '12px'};
  font-weight: 600;
  color: #000;
  padding: 3px 10px;
  border-bottom: 1px solid #000;
  background-color: #ffffff;
`;

const StaticInfoContent = styled.div`
  padding: 1px 10px;
  font-size: ${props => props.paperSize === 'a5' ? '12px' : '13px'};
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

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const WhatsAppButton = styled(Button)`
  background-color: #25D366;
  color: #ffffff;

  &:hover {
    background-color: #1ebe5d;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);

  z-index: 9999;
`;

const ModalBox = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 10px;
  width: 320px;
  max-width: 90%;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  animation: fadeInScale 0.2s ease;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ModalPrimaryButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #25d366;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModalSecondaryButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #eeeeee;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Prescription = () => {
  usePageTitle("Prescription");
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const todayISO = new Date().toISOString().split("T")[0];
  const [patientData, setPatientData] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paperSize, setPaperSize] = useState('a5');
  const [appointmentId, setAppointmentId] = useState(null);
  const [appointmentDoctor, setAppointmentDoctor] = useState(null);
  const [queueNumber, setQueueNumber] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [patientAddress, setPatientAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [doctorLocked, setDoctorLocked] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    selectedDoctor: "",
    selectedClinic: "",
    selectedDate: todayISO,
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

  const formatAddress = (address) => {
    if (!address) return "-";

    return [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.country,
      address.pincode
    ]
      .filter(Boolean)
      .join(", ");
  };

  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) return;

      const parsedUser = JSON.parse(userData);

      if (parsedUser?.full_name) {
        setCurrentUser(parsedUser.full_name);
      }

    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("https://hms.automedai.in/api/resource/Company");
        const companyList = res.data?.data || [];

        if (companyList.length > 0) {
          const defaultCompany = companyList[0].name;

          setCompany(defaultCompany); // ✅ THIS is key
          setSelectedClinic({
            value: defaultCompany,
            label: defaultCompany,
          });

          setFormData(prev => ({
            ...prev,
            selectedClinic: defaultCompany,
          }));
        }
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCompanyOptions = async () => {
      try {
        const response = await fetch(
          "https://hms.automedai.in/api/resource/Company",
          {
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data?.data) {

          const options = data.data.map((c) => ({
            value: c.name,
            label: c.name,
          }));

          setCompanyOptions(options);

          // ✅ Auto select if only one clinic
          if (options.length === 1) {
            setSelectedClinic(options[0]);

            setFormData(prev => ({
              ...prev,
              selectedClinic: options[0].value
            }));
          }

        }

      } catch (error) {
        console.error("Error fetching company options:", error);
      }
    };

    fetchCompanyOptions();
  }, []);

  useEffect(() => {
    if (location.state?.selectedDoctor) {
      const doctor = location.state.selectedDoctor;

      setAppointmentDoctor({
        id: doctor.id,
        name: doctor.name,
      });

      setFormData((prev) => ({
        ...prev,
        selectedDoctor: doctor.id,
      }));
    }
  }, [location.state]);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.PATIENTS.DETAIL(id));
        console.log("Patient Data", response.data?.data);
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
    const fetchAppointmentAndDoctor = async () => {
      try {
        if (!patientData?.name) return;

        const passedAppointmentId = location.state?.appointmentId;
        const passedDoctor = location.state?.selectedDoctor;

        // =========================
        // ✅ PRIORITY 1: Use passed appointmentId
        // =========================
        if (passedAppointmentId) {
          console.log("Using passed appointmentId");

          const res = await api.get(
            `/resource/Patient Appointment/${passedAppointmentId}`
          );

          const appointment = res.data?.data;

          if (appointment) {
            setAppointmentId(appointment.name);
            setCompany(appointment.company);

            const doctor = {
              id: appointment.practitioner,
              name: appointment.practitioner_name,
            };

            setAppointmentDoctor(doctor);

            setFormData((prev) => ({
              ...prev,
              selectedDoctor: doctor.id,
              selectedClinic: appointment.company,
              selectedDate: appointment.appointment_date,
            }));
          }
          setDoctorLocked(true);
          return; // 🚀 STOP EVERYTHING
        }

        // =========================
        // ✅ PRIORITY 2: Use passed doctor (NO FETCH)
        // =========================
        if (passedDoctor) {
          console.log("Using doctor from billing");

          setAppointmentDoctor({
            id: passedDoctor.id,
            name: passedDoctor.name,
          });

          setFormData((prev) => ({
            ...prev,
            selectedDoctor: passedDoctor.id,
          }));
          setDoctorLocked(true);
          return; // 🚀 STOP FALLBACK
        }

        // =========================
        // 🚫 PREVENT OVERRIDE
        // =========================
        if (doctorLocked) {
          console.log("Doctor locked, skipping fallback");
          return;
        }

        // =========================
        // ✅ FALLBACK: FETCH TODAY'S LATEST APPOINTMENT
        // =========================
        console.log("Fetching today's latest appointment");

        const today = new Date().toISOString().split("T")[0];

        const appointmentRes = await api.get(
          `/resource/Patient Appointment`,
          {
            filters: JSON.stringify([
              ["patient", "=", patientData.name],
              // ["appointment_date", "=", today],
            ]),
            fields: JSON.stringify([
              "name",
              "practitioner",
              "practitioner_name",
              "appointment_date",
              "creation",
              "company"
            ]),
            order_by: "creation desc",
            limit_page_length: 20,
          }
        );

        const fetchedAppointments = appointmentRes.data?.data || [];

        setAppointments(fetchedAppointments);

        if (fetchedAppointments.length === 0) return;

        const latest = fetchedAppointments[0];

        setAppointmentId(latest.name);
        setCompany(latest.company);

        const doctor = {
          id: latest.practitioner,
          name: latest.practitioner_name,
        };

        setAppointmentDoctor(doctor);

        setFormData((prev) => ({
          ...prev,
          selectedDoctor: doctor.id,
          selectedDate: latest.appointment_date,
        }));

      } catch (err) {
        console.error("Error fetching appointment:", err);
      }
    };

    fetchAppointmentAndDoctor();
  }, [patientData]);

  useEffect(() => {
    const fetchPatientAddress = async () => {
      try {
        if (!patientData?.name) return;

        const response = await api.get(
          `https://hms.automedai.in/api/resource/Address`,
          {
            filters: JSON.stringify([
              ["address_title", "=", patientData.name]
            ]),
            fields: JSON.stringify(["*"]),
            limit_page_length: 1
          }
        );

        if (response.data?.data?.length > 0) {
          setPatientAddress(response.data.data[0]);
        }

      } catch (error) {
        console.error("Error fetching patient address:", error);
      }
    };

    fetchPatientAddress();
  }, [patientData]);

  useEffect(() => {
    if (appointmentDoctor?.id) {
      setFormData((prev) => ({
        ...prev,
        selectedDoctor: appointmentDoctor.id,
      }));
    }
  }, [appointmentDoctor]);

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

  // Fetch queue number
  useEffect(() => {
    if (!appointmentId || !company) return;

    const fetchQueueNumber = async () => {
      try {
        console.log("🚀 Calling Queue API with:", { appointmentId, company });

        const response = await api.get(
          `https://midl.automedai.in/appointments/queue/${company}/${appointmentId}`
        );

        console.log("📌 Queue API Response:", response.data);

        if (response.data?.success) {
          setQueueNumber(response.data.data.queue_no);
        } else {
          setQueueNumber(null);
        }

      } catch (error) {
        console.error("Error fetching queue number:", error);
        setQueueNumber(null);
      }
    };

    fetchQueueNumber();
  }, [appointmentId, company]);

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

  const doctorOptions = useMemo(() => {
    const unique = new Map();

    (appointments || []).forEach((a) => {
      if (a.practitioner) {
        unique.set(a.practitioner, {
          value: a.practitioner,
          label: a.practitioner_name,
        });
      }
    });

    if (appointmentDoctor && !unique.has(appointmentDoctor.id)) {
      unique.set(appointmentDoctor.id, {
        value: appointmentDoctor.id,
        label: appointmentDoctor.name,
      });
    }

    return Array.from(unique.values());
  }, [appointments, appointmentDoctor]);

  const clinicDropdownOptions = companyOptions.map((c) => ({
    value: c.name,
    label: c.name,
  }));

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

  useEffect(() => {
    const fetchDoctorRoom = async () => {
      try {
        if (
          !formData.selectedDoctor ||
          !formData.selectedDate ||
          !formData.selectedClinic
        ) return;

        const url = `https://midl.automedai.in/doctor_room/doctor_room?doctor_id=${encodeURIComponent(formData.selectedDoctor)}&schedule_date=${encodeURIComponent(formData.selectedDate)}&company=${encodeURIComponent(formData.selectedClinic)}`;

        const response = await api.get(url);

        console.log("🏥 Doctor Room API:", response.data);

        if (response.data?.success && response.data.data.length > 0) {
          setRoomName(response.data.data[0].room_name);
        } else {
          setRoomName(null);
        }

      } catch (error) {
        console.error("Error fetching doctor room:", error);
        setRoomName(null);
      }
    };

    fetchDoctorRoom();
  }, [
    formData.selectedDoctor,
    formData.selectedDate,
    formData.selectedClinic
  ]);

  const handlePrint = () => {
    // Set print styles based on paper size
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        @page {
          size: ${paperSize === 'a5' ? 'A5 landscape' : 'A4 landscape'};
          margin: 1mm;
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

  useEffect(() => {
    if (location.state?.autoPrint && patientData && !loading) {
      setTimeout(() => {
        handlePrint();

        // Remove state so refresh doesn't re-trigger
        navigate(location.pathname, {
          replace: true,
          state: {
            selectedDoctor: appointmentDoctor,
            appointmentId: appointmentId,
          },
        });
      }, 800);
    }
  }, [location.state, patientData, loading]);

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

  const generatePdfBlob = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.querySelector("[data-pdf-content]");

    const opt = {
      margin: 5,
      image: { type: "jpeg", quality: 0.7 },
      html2canvas: {
        scale: 1,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: paperSize === "a5" ? "a5" : "a4",
        orientation: "landscape",
      },
    };

    return await html2pdf().set(opt).from(element).outputPdf("blob");
  };

  const handleSendToWhatsapp = async () => {
    try {
      let mobile = phoneNumber || patientData?.mobile || "";

      if (!mobile) {
        setShowPhoneModal(true);
        return;
      }

      mobile = mobile.replace(/\D/g, "");

      if (mobile.length === 10) {
        mobile = `91${mobile}`;
      }

      if (mobile.length !== 12 || !mobile.startsWith("91")) {
        alert("Please enter a valid mobile number");
        setShowPhoneModal(true);
        return;
      }

      setSending(true);

      const pdfBlob = await generatePdfBlob();

      const formData = new FormData();
      formData.append("user_id", patientData?.name);
      formData.append("encounter_id", appointmentId);
      formData.append("patient_name", patientData?.patient_name || "");
      formData.append("phone", mobile);
      formData.append("file_type", "prescription");
      formData.append("pdf", pdfBlob, `prescription-${patientData?.name}.pdf`);

      const response = await fetch("https://midl.automedai.in/send", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result?.success) {
        alert("Prescription sent via WhatsApp ✅");
        setShowPhoneModal(false);
      } else {
        alert(result?.message || "Failed to send ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Failed to send WhatsApp ❌");
    } finally {
      setSending(false);
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

  // const companyAddressMap = {
  //   "Ramakrishna Mission Sargachi": {
  //     heading: "RAMAKRISHNA MISSION SARGACHI",
  //     subHeading: "Charitable Dispensary & Diagnostic Centre",
  //     area: "P.O - Sargachi Ashrama, Dist- Murshidabad, Pin-742408, West Bengal, India",
  //     iso: "( ISO 9001:2008 Certified, LIC No.:S/PC/27 )",
  //     state: "West Bengal, India - 742134",
  //     phone: "9775831847",
  //     email: "rkm.sargachi@gmail.com",
  //   },
  //   "ALFA DIAGNOSTIC CENTRE & POLYCLINIC": {
  //     heading: "ALFA DIAGNOSTIC CENTRE & POLYCLINIC",
  //     subHeading: "VILL-BAHARAN, P.O-BARUIPARA, P.S-HARIHARPARA, DIST-MURSHIDABAD",
  //     area: "CONTACT NO: +91-9475353302  EMAIL: alfadiagnosticcentrebaharan@gmail.com",
  //     iso: "WEST BENGAL, PIN-742165",
  //     state: "West Bengal, India - 742165",
  //     phone: "+91-9475353302",
  //     email: "alfadiagnosticcentrebaharan@gmail.com",
  //   },
  // };
  // const companyDetails = companyAddressMap[company] || {
  //   heading: "",
  //   subHeading: "",
  //   iso: "",
  //   area: "",
  //   state: "",
  //   phone: "",
  //   email: "",
  // };

  const getLetterhead = () => {
    if (!company) return null;

    const name = company.toLowerCase();

    if (name.includes("ramakrishna mission sargachi")) {
      return {
        type: "text",
      };
    }

    if (name.includes("alfa diagnostic centre")) {
      return {
        type: "image",
        value: alfaHeader,
      };
    }

    return null;
  };

  const letterhead = getLetterhead();

  const handleAddBilling = async (patientId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.PATIENTS.DETAIL(patientId)
      );

      const patientData = response.data?.data;

      if (!patientData) {
        console.error("Patient data not available");
        return;
      }

      navigate("/opd/billing/add", {
        state: {
          preselectedPatient: {
            name: patientData.name,
            patient_name:
              patientData.patient_name ||
              `${patientData.first_name || ""} ${patientData.middle_name || ""} ${patientData.last_name || ""}`.trim(),
            customer_name:
              patientData.customer ||
              `${patientData.first_name || ""} ${patientData.middle_name || ""} ${patientData.last_name || ""}`.trim(),
          },
          defaultItemCode: "STO-ITEM-2025-00539",
        },
      });
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  return (
    <Container>
      <Sidebar>
        <div>
          <BackButton onClick={() => window.history.back()}>
          <ArrowLeft />
          Back
        </BackButton>
        <BackButton onClick={() => handleAddBilling(patientData?.name)}>
          Add Another Bill
        </BackButton>
        </div>
        

        <Title style={{ fontSize: '18px', marginTop: '16px' }}>Prescription</Title>
        <Subtitle>Fill in the details for the prescription</Subtitle>

        <SidebarSection style={{ marginTop: "24px" }}>
          <SectionTitle>Doctor Selection</SectionTitle>

          <FormGroup>
            <Label>Doctor</Label>

            <ReactSelect
              classNamePrefix="react-select"
              options={doctorOptions}
              placeholder="Choose a doctor"
              isSearchable
              isClearable={false}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  selectedDoctor: selected.value,
                }));

                setAppointmentDoctor({
                  id: selected.value,
                  name: selected.label,
                });

                // ✅ FIND MATCHING APPOINTMENT
                const selectedAppointment = appointments.find(
                  (a) => a.practitioner === selected.value
                );

                if (selectedAppointment) {
                  setAppointmentId(selectedAppointment.name);
                  setCompany(selectedAppointment.company);
                }
              }}
              // isDisabled={true}
              value={doctorOptions.find(
                (doc) => doc.value === formData.selectedDoctor
              )}
            />
          </FormGroup>
          <SidebarSection>
            <FormGroup>
              <Label>Clinic</Label>

              <ReactSelect
                classNamePrefix="react-select"
                options={companyOptions}
                placeholder="Choose a clinic"
                isSearchable
                isClearable={false}
                value={selectedClinic}
                isDisabled={true}
                onChange={(selected) => {
                  setSelectedClinic(selected);

                  setCompany(selected.value);

                  setFormData(prev => ({
                    ...prev,
                    selectedClinic: selected.value
                  }));
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                name="selectedDate"
                value={formData.selectedDate}
                onChange={handleFormChange}
                min={new Date().toISOString().split("T")[0]}
                disabled
              />
            </FormGroup>
          </SidebarSection>

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

              {/* <WhatsAppButton onClick={handleSendToWhatsapp} disabled={sending}>
                {sending ? <Spinner /> : <MessageCircle />}
                {sending ? "Sending..." : "Send to WhatsApp"}
              </WhatsAppButton> */}
              {/* <DownloadButton onClick={handleDownloadPDF}>
                <Download />
                Download PDF
              </DownloadButton> */}
            </ButtonGroup>
          </PreviewHeader>

          <PrescriptionPreview data-pdf-content paperSize={paperSize}>

            {letterhead?.type === "text" && (
              <PrescriptionHeader>
                <HeaderTitle paperSize={paperSize}>Ramakrishna Mission Ashrama Sargachi</HeaderTitle>
                <HeaderSubtitle paperSize={paperSize}>Charitable Dispensary & Diagnostic Centre ( ISO 9001:2008 Certified, LIC No.:S/PC/27 )</HeaderSubtitle>
                <HeaderAddress paperSize={paperSize}>
                  P.O - Sargachi Ashrama, Dist- Murshidabad, Pin-742408, West Bengal, India, Mobile : 9775831847
                </HeaderAddress>
              </PrescriptionHeader>
            )}

            {letterhead?.type === "image" && (
              <div
                style={{
                  width: "100%",
                  height: paperSize === "a5" ? "120px" : "120px",
                  marginBottom: "2px",
                }}
              >
                {letterhead && (
                  <img
                    src={letterhead.value}
                    alt="Letterhead"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )}
              </div>
            )}

            <TopRow>
              <DoctorInfo paperSize={paperSize}>
                <b style={{ fontSize: "12px" }}>{selectedDoctorData?.practitioner_name || "-"}</b><br />
                [{selectedDoctorData?.custom_specializedqualification || "-"}]<br />
                [{selectedDoctorData?.custom_registration_number || "-"}]
              </DoctorInfo>
              <DoctorInfo paperSize={paperSize}>
                [<b>Room: {roomName || "-"}</b>]
              </DoctorInfo>
              <DoctorInfo paperSize={paperSize}>
                [<b>SL NO: {queueNumber !== null ? queueNumber : "-"}</b>]
              </DoctorInfo>
              <TicketInfo paperSize={paperSize}>
                <div>Ticket Date: [<b>{formData.ticketDate} - {formData.ticketTime}</b>]</div>
                <div style={{ fontSize: "8px" }}>[Generated by : {currentUser}]<br /></div>
              </TicketInfo>
            </TopRow>

            <PatientInfoRow paperSize={paperSize}>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>[PT Reg No :</PatientLabel>
                <PatientValue><b>{patientData?.name || "0000000000"}</b>]</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>[PT Name :</PatientLabel>
                <PatientValue><b>{patientData?.patient_name || "xxxxxxxxxxxx xxxxxxxxxxxxxxx"}</b>]</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>[Mobile :</PatientLabel>
                <PatientValue><b>{patientData?.mobile || "xxxxxxxxxxx"}</b>]</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <PatientLabel paperSize={paperSize}>[Age :</PatientLabel>
                <PatientValue><b>{formatAge(patientData?.dob)}</b>]</PatientValue>
              </PatientInfoItem>
              <PatientInfoItem style={{ gridColumn: "1 / -1" }}>
                <PatientLabel paperSize={paperSize}>[Address :</PatientLabel>
                <PatientValue>
                  <b>{formatAddress(patientAddress)}</b>
                </PatientValue>
                ]
              </PatientInfoItem>
            </PatientInfoRow>

            <MainContentArea paperSize={paperSize}>
              <LeftColumn>
                <StaticInfoBox>
                  <StaticInfoTitle paperSize={paperSize}>General Examinations</StaticInfoTitle>
                  <StaticInfoContent paperSize={paperSize}>
                    Temperature<br />
                    Blood Pressure<br />
                    <div style={{ display: "flex", gap: "55px" }}>
                      <div>Weight</div>
                      <div>Height</div>
                    </div>
                  </StaticInfoContent>
                </StaticInfoBox>
                <StaticInfoBox style={{ borderBottom: 'none' }}>
                  <StaticInfoTitle paperSize={paperSize}>Advice for Investigation</StaticInfoTitle>
                  <StaticInfoContent paperSize={paperSize}>
                    Pathology-<br /><br /> <br />
                    X-Ray-<br /><br />
                    USG-<br /><br />
                    ECG-<br />
                    OPG-
                  </StaticInfoContent>
                </StaticInfoBox>
              </LeftColumn>

              <RightColumn>
                <SignatureBox paperSize={paperSize}>
                  [Doctor Signature]
                </SignatureBox>
              </RightColumn>
            </MainContentArea>
          </PrescriptionPreview>
        </PreviewCard>
      </MainContent>
      {showPhoneModal && (
        <ModalBackdrop onClick={() => setShowPhoneModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "12px" }}>Enter Mobile Number</h3>

            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneNumber}
              maxLength={10}
              style={{ marginBottom: "12px", width: "100%" }}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhoneNumber(value);
              }}
            />

            <ModalButtonGroup>
              <ModalPrimaryButton
                disabled={sending}
                onClick={handleSendToWhatsapp}
              >
                {sending ? "Sending..." : "Send"}
              </ModalPrimaryButton>

              <ModalSecondaryButton
                onClick={() => setShowPhoneModal(false)}
              >
                Cancel
              </ModalSecondaryButton>
            </ModalButtonGroup>
          </ModalBox>
        </ModalBackdrop>
      )}
    </Container>
  );
};

export default Prescription;