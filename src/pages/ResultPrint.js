import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Printer, Download, ArrowLeft, MessageCircle } from "lucide-react";
import api, { API_ENDPOINTS, apiService } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";
import { createGlobalStyle } from "styled-components";
import rkmsHeader from "../assets/rkma_ltrhd_hdr.jpg";
import rkmsFooter from "../assets/rkma_ltrhd_ftr.jpg";
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
  width: 280px;
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

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;

  a {
    color: #4a90e2;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    margin: 0 8px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 8px 0 0 0;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectedCount = styled.span`
  color: #4a90e2;
  font-weight: 500;
`;

const GroupLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #999999;
  text-transform: uppercase;
  margin: 20px 0 12px 0;

  &:first-child {
    margin-top: 0;
  }
`;

const TestItem = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.selected ? "#f0f7ff" : "#ffffff")};
  border-color: ${(props) => (props.selected ? "#4a90e2" : "#e0e0e0")};

  &:hover {
    border-color: #4a90e2;
    background-color: #f0f7ff;
  }

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      border-color: #e0e0e0;
      background-color: #ffffff;
    }
  `}
`;

const TestItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const Checkbox = styled.input`
  margin-top: 2px;
  cursor: pointer;
`;

const TestItemContent = styled.div`
  flex: 1;
`;

const PatientName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
`;

const TestInfo = styled.div`
  font-size: 12px;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
`;

const TestId = styled.span`
  font-size: 11px;
  color: #999999;
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
    background-color: #4a90e2;
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
  color: #000000;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

const DownloadButton = styled(Button)`
  background-color: #4a90e2;
  color: #ffffff;

  &:hover {
    background-color: #357abd;
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
  color: #000000;
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

const ReportPreview = styled.div`
  padding: 0px 15px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 1005px;
  display: flex;
  flex-direction: column;
`;

const ReportHeader = styled.div`
  // margin-top: 120px;
  // margin-bottom: 40px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
`;

// const PatientInfoSection = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   // gap: 20px;
//   margin-bottom: 5px;
//   padding: 5px;
//   background-color: #ffffff;
//   border-radius: 4px;
// `;

// const InfoField = styled.div``;

// const InfoLabel = styled.div`
//   font-size: 14px;
//   color: #000000;
//   text-transform: uppercase;
//   letter-spacing: 0.5px;
//   margin-bottom: 4px;
// `;

// const InfoValue = styled.div`
//   font-size: 13px;
//   color: #000000;
//   font-weight: 500;
// `;

const PatientInfoSection = styled.div`
  border: 2px solid #000;
  padding: 5px 15px;
  // margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 145px 10px 1fr;
  font-size: 14px;
`;

const InfoLabel = styled.div`
  font-weight: 500;
`;

const InfoLabelC = styled.div`
  font-size: 10px;
`;

const Colon = styled.div`
  text-align: center;
`;

const ColonC = styled.div`
  text-align: center;
  font-size: 10px;
`;

const InfoValue = styled.div`
  font-weight: 600;
`;

const InfoValueC = styled.div`
  font-size: 10px;
`;

const TestSection = styled.div`
  margin-bottom: 40px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TestSectionHeader = styled.div`
  margin-bottom: 16px;
`;

const TestName = styled.h2`
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 4px 0;
  text-transform: uppercase;
`;

const TestCategory = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  text-align: center;
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px 12px;
  background-color: #ffffff;
  font-size: 12px;
  color: #000000;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
`;

const TableRow = styled.tr`
  // border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 4px;
  font-size: 12px;
  color: #000000;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;

const ReportFooter = styled.div`
  // margin-top: 60px;
  // margin-bottom: 100px;
  margin-top: auto;
  padding-top: 0px;
  border-top: 1px solid #e0e0e0;
`;

const EndOfReport = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  padding: 5px 0;
  border-top: 2px solid #e0e0e0;
  letter-spacing: 1px;

  @media print {
    page-break-after: always;
  }
`;
const PrintStyles = createGlobalStyle`
@media print {

  .department-block {
    page-break-inside: avoid;
    margin-bottom: 20px;
  }

  .page {
    height: 1122px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .pdf-body {
    min-height: 625px;
  }

  img {
    max-width: 100%;
    page-break-inside: avoid;
  }

  table {
    page-break-inside: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  tr {
    page-break-inside: avoid;
  }

}
`;
const WhatsAppButton = styled(Button)`
  background-color: #25D366;   /* WhatsApp green */
  color: #ffffff;

  &:hover {
    background-color: #1ebe5d;
  }
`;
const LetterheadToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-right: 10px;

  input {
    cursor: pointer;
  }

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
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

  &:disabled {
    background-color: #f5f5f5;
    color: #666666;
    cursor: not-allowed;
    border-color: #d0d0d0;
  }
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

const ResultPrint = () => {
  usePageTitle("Result Print");
  const navigate = useNavigate();
  const location = useLocation();

  const patientId = location.state?.patientId;
  const labTestId = location.state?.labTestId;
  const patientName = location.state?.patientName;
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestDetails, setSelectedTestDetails] = useState([]);
  const [sampleDetails, setSampleDetails] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [company, setCompany] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [sending, setSending] = useState(false);
  // Helper function to remove prefixes from test names
  const removeTestPrefix = (testName) => {
    if (!testName) return testName;
    return testName.replace(/^(PHC-|LAB-|PLB-)\s*/i, '');
  };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const normalizeRange = (range) => {
    if (!range) return "";

    return range
      .replace(/[–—−â€“]/g, "-")
      .replace(/≤/g, "<=")
      .replace(/≥/g, ">=")
      .replace(/,/g, "")
      .replace(/\/.*$/, "")
      .toLowerCase()
      .trim();
  };

  const extractGenderRange = (range, sex) => {
    if (!range || !sex) return range;

    const regex = new RegExp(
      `${sex.toLowerCase()}\\s*:\\s*([^,]+)`,
      "i"
    );

    const match = normalizeRange(range).match(regex);
    return match ? match[1].trim() : range;
  };
  const isOutOfRange = (value, range, sex) => {
    if (!value || !range) return false;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;

    const genderRange = extractGenderRange(range, sex);
    const r = normalizeRange(genderRange);

    // Text-only / qualitative results → never bold
    if (
      r.includes("negative") ||
      r.includes("non-reactive") ||
      r.includes("no growth") ||
      r.includes("adequate") ||
      r.includes("normal") ||
      r.includes("report-based")
    ) {
      return false;
    }

    // < 140
    const lessThan = r.match(/<\s*(\d+(\.\d+)?)/);
    if (lessThan) {
      return numValue > parseFloat(lessThan[1]);
    }

    // > 5
    const greaterThan = r.match(/>\s*(\d+(\.\d+)?)/);
    if (greaterThan) {
      return numValue < parseFloat(greaterThan[1]);
    }

    // 70-99
    const rangeMatch = r.match(/(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[3]);
      return numValue < min || numValue > max;
    }

    return false;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const isoString = dateString.replace(" ", "T");
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "-";

    const formatted = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Force AM / PM uppercase
    return formatted.replace(/\b(am|pm)\b/, (match) => match.toUpperCase());
  };

  const cleanWorksheetHTML = (html) => {
    if (!html) return "";

    return html
      .replace(/class="ql-editor read-mode"/g, "") // remove editor class
      .replace(/<div[^>]*>/i, "") // remove opening div
      .replace(/<\/div>\s*$/i, ""); // remove closing div
  };

  const worksheetInstructions = [
    ...new Set(
      selectedTestDetails
        .map(t => t.worksheet_instructions)
        .filter(Boolean)
    )
  ];

  // Helper function to format age (extract years only)
  const formatAge = (ageString) => {
    if (!ageString) return "N/A";
    // Extract the number of years from strings like "46 Year(s) 10 Month(s) 11 Day(s)"
    const yearMatch = ageString.match(/(\d+)\s*Year/i);
    if (yearMatch) {
      return `${yearMatch[1]} Years`;
    }
    return ageString;
  };

  // Helper function to format gender
  const formatGender = (gender) => {
    if (!gender) return "N/A";
    const genderLower = gender.toLowerCase();
    if (genderLower === 'female' || genderLower === 'f') return "Female";
    if (genderLower === 'male' || genderLower === 'm') return "Male";
    return gender;
  };

  // Fetch lab tests for the patient
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!patientId) {
        setError("Patient ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("https://hms.automedai.in/api/resource/Lab Test", {
          fields: '["name","patient_name","result_date","lab_test_name","department"]',
          filters: JSON.stringify([["Lab Test", "patient", "=", patientId], ["Lab Test", "status", "=", "Completed"]]),
          order_by: "department asc"
        });

        console.log("Lab Tests API Response:", response);

        if (response.data && response.data.data) {
          const formattedTests = response.data.data.map((test) => ({
            id: test.name,
            patientId: patientId,
            patientName: test.patient_name || patientName,
            testName: test.lab_test_name || "",
            date: test.result_date || "",
            selected: test.name === labTestId, // Select the current lab test by default
            disabled: false,
          }));
          setTests(formattedTests);
        }
      } catch (err) {
        console.error("Error fetching lab tests:", err);
        setError(err.message || "Failed to load lab tests");
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [patientId, labTestId, patientName]);

  // Fetch detailed lab test data for selected tests
  useEffect(() => {
    const fetchSelectedTestDetails = async () => {
      const selectedTestIds = tests.filter(test => test.selected).map(test => test.id);

      if (selectedTestIds.length === 0) {
        setSelectedTestDetails([]);
        return;
      }

      try {
        const detailsPromises = selectedTestIds.map(testId =>
          api.get(`https://hms.automedai.in/api/resource/Lab Test/${testId}`)
        );

        const responses = await Promise.all(detailsPromises);
        console.log("Selected Test Details API Responses:", responses);

        const details = responses.map(response => response.data?.data).filter(Boolean);
        setSelectedTestDetails(details);
      } catch (err) {
        console.error("Error fetching selected test details:", err);
      }
    };

    fetchSelectedTestDetails();
  }, [tests]);

  useEffect(() => {
    if (!selectedTestDetails?.length) return;

    const sampleId = selectedTestDetails[0]?.sample;
    if (!sampleId) return;

    const fetchSampleAndCollector = async () => {
      try {
        // 1️⃣ Fetch sample details
        const sampleResponse = await api.get(
          `https://hms.automedai.in/api/resource/Sample Collection/${sampleId}`
        );

        const sampleDetails = sampleResponse.data?.data;
        setSampleDetails(sampleDetails);

        if (sampleDetails?.company) {
          setCompany(sampleDetails.company.toLowerCase());
        }

        const collectedByUserId = sampleDetails?.collected_by;
        if (!collectedByUserId) return;

        // 2️⃣ Fetch employee (phlebotomist) using collected_by
        const fields = JSON.stringify(["name", "user_id", "employee_name"]);

        const employeeResponse = await apiService.get(
          API_ENDPOINTS.SAMPLE_COLLECTORS.LIST,
          {
            fields,
            filters: JSON.stringify([
              ["designation", "=", "Phlebotomist"],
              ["user_id", "=", collectedByUserId],
            ]),
            limit_page_length: 0,
          }
        );

        if (employeeResponse.data?.data) {
          setEmployees(employeeResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching sample / collector details:", err);
      }
    };

    fetchSampleAndCollector();
  }, [selectedTestDetails]);


  const toggleTestSelection = (testId) => {
    setTests(
      tests.map((test) =>
        test.id === testId && !test.disabled
          ? { ...test, selected: !test.selected }
          : test
      )
    );
  };

  const waitForImages = async () => {
    const images = document.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map(
        img =>
          img.complete
            ? Promise.resolve()
            : new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            })
      )
    );
  };

  const handlePrint = async () => {
    try {
      await waitForImages();

      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.querySelector("[data-pdf-content]");

      const opt = {
        margin: [10, 0, 15, 0],
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(element)
        .outputPdf("blob");

      const blobUrl = URL.createObjectURL(pdfBlob);

      const printWindow = window.open(blobUrl);

      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      const element = document.querySelector('[data-pdf-content]');

      if (!element) {
        console.error('PDF content element not found');
        return;
      }

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `lab-report-${patientId || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollY: 0,
          windowWidth: document.body.scrollWidth
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: {
          mode: ['css', 'legacy']
        }
      };


      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again or use the Print option.');
    }
  };

  const generatePdfBlob = async () => {
    await waitForImages(); // important for header/footer images

    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.querySelector("[data-pdf-content]");

    if (!element) {
      throw new Error("PDF content not found");
    }

    const opt = {
      margin: [0, 0, 0, 0],
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    const pdfBlob = await html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob");

    return pdfBlob;
  };

  const handleSendToWhatsapp = async () => {
    try {
      let mobile = phoneNumber || selectedTestDetails?.[0]?.mobile || "";

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

      // 🔥 START LOADING
      setSending(true);

      const pdfBlob = await generatePdfBlob();

      const selectedIds = selectedTests.map(t => t.id).join(",");

      const formData = new FormData();
      formData.append("user_id", patientId);
      formData.append("item_id", selectedIds);
      formData.append("patient_name", patientName || "");
      formData.append("phone", mobile);
      formData.append("company_name", sampleDetails?.company);
      formData.append("file_type", "report");
      formData.append("pdf", pdfBlob, `lab-report-${patientId}.pdf`);

      const response = await fetch("https://midl.automedai.in/send", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result?.success) {
        alert("Report sent successfully via WhatsApp ✅");
        setShowPhoneModal(false);
      } else {
        alert(result?.message || "Failed to send report ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Failed to send WhatsApp report ❌");
    } finally {
      // 🔥 STOP LOADING (always runs)
      setSending(false);
    }
  };

  const selectedTests = tests.filter((test) => test.selected);
  const activeTests = tests.filter((test) => !test.disabled);
  const disabledTests = tests.filter((test) => test.disabled);

  const groupedByDepartment = selectedTestDetails.reduce((acc, test) => {
    const dept = test.department || "Laboratory";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(test);
    return acc;
  }, {});

  const getLetterhead = () => {
    if (!company) return null;

    if (company.includes("ramakrishna mission sargachi")) {
      return rkmsHeader;
    }

    if (company.includes("alfa diagnostic centre")) {
      return alfaHeader;
    }

    return null;
  };

  const getFooterhead = () => {
    if (!company) return null;

    if (company.includes("ramakrishna mission sargachi")) {
      return rkmsFooter;
    }

    if (company.includes("alfa diagnostic centre")) {
      return null;
    }

    return null;
  };

  const footerImage = getFooterhead();

  const isAllSelected =
    activeTests.length > 0 &&
    activeTests.every((test) => test.selected);

  const isSomeSelected =
    activeTests.some((test) => test.selected) && !isAllSelected;

  const toggleSelectAll = () => {
    const shouldSelectAll = !isAllSelected;

    setTests(
      tests.map((test) =>
        !test.disabled
          ? { ...test, selected: shouldSelectAll }
          : test
      )
    );
  };

  return (
    <Container>
      <Sidebar>
        <Breadcrumb>
          <button type="button" onClick={() => navigate("/pathlab")} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>PathLab</button>
          <span>/</span>
          <span>Result Print</span>
        </Breadcrumb>

        <SectionTitle>
          Test Selection List
          <SelectedCount>{selectedTests.length} Selected</SelectedCount>
        </SectionTitle>

        {loading && <div style={{ padding: "20px", color: "#666" }}>Loading lab tests...</div>}
        {error && <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>}

        {!loading && !error && activeTests.length > 0 && (
          <>
            <GroupLabel>Active Group</GroupLabel>
            <TestItem>
              <TestItemHeader>
                <Checkbox
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected;
                  }}
                  onChange={toggleSelectAll}
                />
                <TestItemContent>
                  <PatientName>Select All</PatientName>
                </TestItemContent>
              </TestItemHeader>
            </TestItem>
            {activeTests.map((test) => (
              <TestItem
                key={test.id}
                selected={test.selected}
                onClick={() => toggleTestSelection(test.id)}
              >
                <TestItemHeader>
                  <Checkbox
                    type="checkbox"
                    checked={test.selected}
                    onChange={() => toggleTestSelection(test.id)}
                  />
                  <TestItemContent>
                    <PatientName>{test.patientName}</PatientName>
                    <TestInfo>
                      <span>{formatDate(test.date)}</span>
                      <span>-</span>
                      <span>{removeTestPrefix(test.testName)}</span>
                    </TestInfo>
                    <TestId>{test.id}</TestId>
                  </TestItemContent>
                </TestItemHeader>
              </TestItem>
            ))}

            {disabledTests.length > 0 && (
              <>
                <GroupLabel>Other Patients (Disabled)</GroupLabel>
                {disabledTests.map((test) => (
                  <TestItem key={test.id} disabled>
                    <TestItemHeader>
                      <Checkbox type="checkbox" disabled />
                      <TestItemContent>
                        <PatientName>{test.patientName}</PatientName>
                        <TestInfo>
                          <span>{formatDate(test.date)}</span>
                          <span>-</span>
                          <span>{removeTestPrefix(test.testName)}</span>
                        </TestInfo>
                        <TestId>{test.id}</TestId>
                      </TestItemContent>
                    </TestItemHeader>
                  </TestItem>
                ))}
              </>
            )}
          </>
        )}
      </Sidebar>

      <MainContent>
        <Header>
          <div>
            <BackButton onClick={() => navigate("/pathlab/results")}>
              <ArrowLeft />
              Back to Results
            </BackButton>
            <Title style={{ marginTop: "12px" }}>Result Print</Title>
            <Subtitle>Select patient tests to combine into a single report.</Subtitle>
          </div>
        </Header>

        <PreviewCard>
          <PreviewHeader>
            <PreviewTitle>Combined Report Preview</PreviewTitle>
            <LetterheadToggle>
              <label>
                <input
                  type="checkbox"
                  checked={includeLetterhead}
                  onChange={() => setIncludeLetterhead(prev => !prev)}
                />
                Include Letterhead in Print & PDF
              </label>
            </LetterheadToggle>

            <ButtonGroup>
              <PrintButton onClick={handlePrint}>
                <Printer />
                Print
              </PrintButton>

              <DownloadButton onClick={handleDownloadPDF}>
                <Download />
                Download PDF
              </DownloadButton>

              <WhatsAppButton onClick={handleSendToWhatsapp} disabled={sending}>
                {sending ? <Spinner /> : <MessageCircle />}
                {sending ? "Sending..." : "Send to WhatsApp"}
              </WhatsAppButton>
            </ButtonGroup>

          </PreviewHeader>

          <PrintStyles />

          <ReportPreview data-pdf-content>
            <div
              style={{
                width: "100%",
                height: "120px", // adjust to your header height
                marginBottom: "5px",
              }}
            >
              {includeLetterhead && (
                <img
                  src={getLetterhead()}
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

            <div className="pdf-body" style={{ display: "flex", flexDirection: "column", flex: 1 }}>

              <PatientInfoSection>

                {/* LEFT COLUMN */}
                <div>
                  <InfoRow>
                    <InfoLabel>Patient ID</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>{selectedTestDetails[0]?.patient || patientId || "N/A"}</InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Patient Name</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>{selectedTestDetails[0]?.patient_name || patientName || "N/A"}</InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Age / Gender</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>
                      {formatAge(selectedTestDetails[0]?.patient_age)} / {formatGender(selectedTestDetails[0]?.patient_sex)}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Ref By</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>{selectedTestDetails[0]?.practitioner_name || "N/A"}</InfoValue>
                  </InfoRow>
                </div>

                {/* RIGHT COLUMN */}
                <div>
                  <InfoRow>
                    <InfoLabel>Sample Collected on</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>{formatDateTime(sampleDetails?.collected_time)}</InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Sample Collected at</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>-</InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Report Generated on</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>{formatDateTime(selectedTestDetails[0]?.modified)}</InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Report Status</InfoLabel>
                    <Colon>:</Colon>
                    <InfoValue>Final</InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabelC>Collected By</InfoLabelC>
                    <ColonC>:</ColonC>
                    <InfoValueC>{employees[0]?.employee_name || "N/A"}</InfoValueC>
                  </InfoRow>
                </div>

              </PatientInfoSection>
              <ResultsTable>
                <colgroup>
                  <col style={{ width: "35%" }} />  
                  <col style={{ width: "15%" }} />  
                  <col style={{ width: "15%" }} />  
                  <col style={{ width: "35%" }} /> 
                </colgroup>
                <tbody>
                  {selectedTestDetails.map((testDetail, index) => {
                    const currentDept = testDetail.department || "Laboratory";
                    const prevDept = selectedTestDetails[index - 1]?.department;

                    const showDepartment = index === 0 || currentDept !== prevDept;
                    const isDescriptive = testDetail.descriptive_test_items?.length > 0;
                    return (
                      <React.Fragment key={testDetail.name}>

                        {/* Department Title */}
                        {showDepartment && (
                          <>
                            <tr>
                              <td colSpan="4">
                                <TestCategory>
                                  Department of {currentDept}
                                </TestCategory>
                              </td>
                            </tr>

                            {/* Table Header again */}
                            <tr>
                              <TableHeader>Test Parameter</TableHeader>
                              <TableHeader style={{ textAlign: "right" }}>Result</TableHeader>

                              {!isDescriptive && (
                                <>
                                  <TableHeader style={{ textAlign: "right" }}>Units</TableHeader>
                                  <TableHeader style={{ textAlign: "right" }}>Reference Interval</TableHeader>
                                </>
                              )}
                            </tr>
                          </>
                        )}

                        {/* Test Name */}
                        <TableRow>
                          <TableCell colSpan="4">
                            <TestName>
                              {testDetail.custom_display_name || removeTestPrefix(testDetail.lab_test_name)}
                            </TestName>
                          </TableCell>
                        </TableRow>

                        {/* Parameters */}
                        {isDescriptive
                          ? testDetail.descriptive_test_items.map((item, i) => {
                            const name = (item.lab_test_particulars || "").trim();
                            const isHtml = /<\/?[a-z][\s\S]*>/i.test(name);

                            // HTML-only row (like <hr>, <center>title</center>)
                            if (isHtml && !item.result_value) {
                              return (
                                <TableRow key={i}>
                                  <TableCell colSpan="4">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: removeTestPrefix(name),
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            }

                            // Normal row
                            return (
                              <TableRow key={i}>
                                <TableCell
                                  dangerouslySetInnerHTML={{
                                    __html: removeTestPrefix(name),
                                  }}
                                />

                                <TableCell style={{ textAlign: "right" }}>
                                  {item.result_value}
                                </TableCell>
                              </TableRow>
                            );
                          })
                          : testDetail.normal_test_items.map((item, i) => {
                            const name = (item.lab_test_name || "").trim();
                            const isHtmlOnly = /<\/?[a-z][\s\S]*>/i.test(name);

                            if (isHtmlOnly && !item.result_value) {
                              return (
                                <TableRow key={i}>
                                  <TableCell colSpan="4">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: removeTestPrefix(name),
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            }

                            return (
                              <TableRow key={i}>
                                <TableCell
                                  dangerouslySetInnerHTML={{
                                    __html: removeTestPrefix(name),
                                  }}
                                />

                                <TableCell
                                  style={{
                                    textAlign: "right",
                                    fontWeight: isOutOfRange(
                                      item.result_value,
                                      item.normal_range,
                                      selectedTestDetails[0]?.patient_sex
                                    )
                                      ? "700"
                                      : "400",
                                  }}
                                >
                                  {item.result_value}
                                </TableCell>

                                <TableCell style={{ textAlign: "right" }}>
                                  {item.lab_test_uom}
                                </TableCell>

                                <TableCell style={{ textAlign: "right" }}>
                                  {item.normal_range}
                                </TableCell>
                              </TableRow>
                            );
                          })}

                      </React.Fragment>
                    );
                  })}
                </tbody>
              </ResultsTable>

              {worksheetInstructions.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  {worksheetInstructions.map((html, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#000",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: cleanWorksheetHTML(html),
                      }}
                    />
                  ))}
                </div>
              )}

              <EndOfReport>*** END OF REPORT ***</EndOfReport>
              <ReportFooter>
                <div
                  style={{
                    width: "100%",
                    height: "100px", // adjust to your footer height
                  }}
                >
                  {includeLetterhead && footerImage && (
                    <img
                      src={footerImage}
                      alt="Footer Letterhead"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  )}
                </div>
              </ReportFooter>

            </div>
          </ReportPreview>
        </PreviewCard>
      </MainContent>
      {showPhoneModal && (
        <ModalBackdrop onClick={() => setShowPhoneModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "12px" }}>Enter Mobile Number</h3>

            <FormInput
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

export default ResultPrint;