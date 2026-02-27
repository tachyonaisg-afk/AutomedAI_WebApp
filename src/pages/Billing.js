import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Download, IndianRupee, TrendingUp, FileText, Calendar, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import api from "../services/api";
import DataTable from "../components/shared/DataTable";
import { Search, Printer } from "lucide-react";
// import html2pdf from "html2pdf.js";
// import InvoiceTemplate from "../components/shared/InvoiceTemplate";

const BillingContainer = styled.div`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
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

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f7ff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const SummaryCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardLabel = styled.span`
  font-size: 14px;
  color: #666666;
  font-weight: 400;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.bgColor || "#f5f5f5"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color || "#333333"};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CardValue = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
`;

const CardChange = styled.span`
  font-size: 12px;
  color: ${(props) => (props.positive ? "#2e7d32" : "#c62828")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BillingSection = styled.div`
  display: grid;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecentInvoices = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ViewAllLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const InvoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InvoiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #e9ecef;
  }
`;

const InvoiceLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InvoiceId = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

const InvoicePatient = styled.span`
  font-size: 12px;
  color: #666666;
`;

const InvoiceRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const InvoiceAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
`;

const InvoiceStatus = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.variant === "paid") return "#e8f5e9";
    if (props.variant === "pending") return "#fff3e0";
    if (props.variant === "overdue") return "#ffebee";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.variant === "paid") return "#2e7d32";
    if (props.variant === "pending") return "#f57c00";
    if (props.variant === "overdue") return "#c62828";
    return "#666666";
  }};
`;

const QuickActions = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: #4a90e2;
    background-color: #f8f9fa;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #4a90e2;
  }
`;

const ActionLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;
const ActionLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;

  &:hover {
    color: #357abd;
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
const DateContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 60%;
  transform: translateY(-50%);
  color: #999999;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
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
`;
const DateInput = styled(SearchInput)`
  padding: 10px 12px;
`;
const DateLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-right: 8px;
`;

const PrintDropdown = styled.div`
  display: none;
  position: absolute;
  background: #ffffff;
  border: 1px solid #dddddd;
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 100;

  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.2s ease;
`;

const DropdownItem = styled.div`
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333333;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;
const ActionsContainer = styled.div`
  position: relative;

  &:hover ${PrintDropdown} {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }
`;

const Billing = () => {
  usePageTitle("Billing");
  const navigate = useNavigate();
  const location = useLocation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const invoiceRef = useRef();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Determine base path for navigation (handles both /billing and /opd/billing)
  const basePath = location.pathname.startsWith("/opd") ? "/opd/billing" : "/billing";

  const summaryData = [
    {
      label: "Total Revenue",
      value: "₹45,250",
      change: "+12.5%",
      positive: true,
      icon: IndianRupee,
      bgColor: "#e8f5e9",
      color: "#2e7d32",
    },
    {
      label: "Pending Payments",
      value: "₹8,500",
      change: "+5.2%",
      positive: false,
      icon: Clock,
      bgColor: "#fff3e0",
      color: "#f57c00",
    },
    {
      label: "Paid This Month",
      value: "₹36,750",
      change: "+18.3%",
      positive: true,
      icon: CheckCircle,
      bgColor: "#e3f2fd",
      color: "#1976d2",
    },
    {
      label: "Overdue",
      value: "₹2,100",
      change: "-8.1%",
      positive: true,
      icon: XCircle,
      bgColor: "#ffebee",
      color: "#c62828",
    },
  ];

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);

      let filters = [];

      if (fromDate && toDate) {
        filters.push([
          "posting_date",
          "between",
          [fromDate, toDate],
        ]);
      }

      if (searchCustomer) {
        filters.push([
          "patient",
          "=",
          searchCustomer,
        ]);
      }

      const params = {
        fields: JSON.stringify([
          "name",
          "patient",
          "patient_name",
          "posting_date",
          "company",
          "status",
          "total_qty",
          "net_total",
        ]),
        order_by: "posting_date desc",
        filters: filters.length ? JSON.stringify(filters) : undefined,
        limit_page_length: 10,
      };

      const res = await api.get("/resource/Sales Invoice", params);
      setInvoices(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, searchCustomer]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const columns = [
    { key: "name", label: "INVOICE ID" },
    { key: "patient", label: "PATIENT ID" },
    { key: "patient_name", label: "PATIENT NAME" },
    { key: "posting_date", label: "DATE" },
    { key: "net_total", label: "AMOUNT" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTION" },
  ];
  const renderStatus = (status) => (
    <InvoiceStatus variant={status.toLowerCase()}>
      {status}
    </InvoiceStatus>
  );
  const printInvoice = async (row) => {
    try {
      const res = await api.get(`/resource/Sales Invoice/${row.name}`);
      const invoice = res.data?.data;

      if (!invoice) {
        console.error("Invoice not found");
        return;
      }

      handlePrint(invoice);
    } catch (err) {
      console.error("❌ Failed to fetch invoice", err);
    }
  };
  const formatTestName = (name = "") => {
    return name.includes("-")
      ? name.split("-").slice(1).join("-").trim()
      : name;
  };
  const buildItemsRows = (items = []) => {
    return items
      .map(
        (item, index) => `
      <tr>
        <td class="border border-gray-800">${index + 1}</td>
        
        <td class="border border-gray-800">
          ${formatTestName(item.item_name)}
        </td>
        
        <td class="border border-gray-800 text-right">
          ₹ ${item.rate.toFixed(2)}
        </td>
        
        <td class="border border-gray-800 text-right">
          ₹ ${item.discount_amount.toFixed(2)}
        </td>
        
        <td class="border border-gray-800 text-right">
          ₹ ${item.amount.toFixed(2)}
        </td>
        
      </tr>
    `
      )
      .join("");
  };

  const handlePrint = async (invoice) => {
    let patientDOB = "";
    let patientGender = "";
    let patientMobile = "";
    let patientAge = "";

    try {
      const patientRes = await api.post(
        "/method/healthcare.healthcare.doctype.patient.patient.get_patient_detail",
        {
          patient: invoice.patient,
        }
      );

      const patientData = patientRes.data;

      if (patientData.message) {
        patientDOB = patientData.message.dob;
        patientGender = patientData.message.sex;
        patientMobile = patientData.message.mobile;

        // ✅ Calculate Age
        if (patientDOB) {
          const dob = new Date(patientDOB);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();

          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }

          patientAge = age;
        }
      }
    } catch (error) {
      console.error("Patient Fetch Error:", error);
    }

    let practitionerName = invoice.ref_practitioner;

    try {
      if (invoice.ref_practitioner) {
        const pracRes = await api.get(
          `/resource/Healthcare Practitioner/${invoice.ref_practitioner}`
        );

        const pracData = pracRes.data;

        if (pracData.data?.practitioner_name) {
          practitionerName = pracData.data.practitioner_name;
        }
      }
    } catch (error) {
      console.error("Practitioner Fetch Error:", error);
    }

    const itemsHTML = buildItemsRows(invoice.items);
    const companyAddressMap = {
      "Ramakrishna Mission Sargachi": {
        heading: "RAMAKRISHNA MISSION SARGACHI",
        subHeading: "Charitable Dispensary & Diagnostic Centre",
        area: "Sargachi, P.O. Sargachi Ashram, Dist. Murshidabad, West Bengal - 742134",
        iso: "ISO 9001:2008 Certified",
        state: "West Bengal, India - 742134",
        phone: "03482-232222",
        email: "rkm.sargachi@gmail.com",
      },
      "ALFA DIAGNOSTIC CENTRE & POLYCLINIC": {
        heading: "ALFA DIAGNOSTIC CENTRE & POLYCLINIC",
        subHeading: "VILL-BAHARAN, P.O-BARUIPARA, P.S-HARIHARPARA, DIST-MURSHIDABAD",
        area: "CONTACT NO: +91-9475353302     EMAIL: alfadiagnosticcentrebaharan@gmail.com",
        iso: "WEST BENGAL, PIN-742165",
        state: "West Bengal, India - 742165",
        phone: "+91-9475353302",
        email: "alfadiagnosticcentrebaharan@gmail.com",
      },
    };

    const companyDetails = companyAddressMap[invoice.company] || {
      heading: "",
      subHeading: "",
      iso: "",
      area: "",
      state: "",
      phone: "",
      email: "",
    };

    setTimeout(() => {
      const printWindow = window.open("", "_blank");

      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-GB");
      let category = "";

      if (invoice.items && invoice.items.length > 0) {
        const itemName = invoice.items[0].item_name || "";

        // Split by "-" and take first part
        category = itemName.split("-")[0].trim();
      }

      printWindow.document.write(`
     <!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Medical Bill - ${invoice.patient_name}</title>
    <!-- Tailwind CSS CDN with plugins -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <!-- BEGIN: Custom Styling -->
    <style data-purpose="layout">
        @media print {
            @page {
                size: 210mm 148mm;
                margin: 0;
            }

            html,
            body {
                width: 210mm;
                height: 148mm;
                margin: 0;
                padding: 0;
            }

            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                overflow: hidden;
            }
        }

        /* Fixed height for the A5 Landscape container to simulate the paper size */
        .a5-landscape-container {
            width: 210mm;
            height: 148mm;
            padding: 5mm;
            margin: 0;
            border: 1px solid #e5e7eb;
            background-color: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Control table cell padding for tight medical look */
        th,
        td {
            padding: 2px 8px;
        }
    </style>
    <style data-purpose="typography">
        .font-header {
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .text-xs-custom {
            font-size: 0.6rem;
            line-height: 1rem;
        }

        .text-sm-custom {
            font-size: 0.8rem;
            line-height: 1.25rem;
        }
    </style>
    <!-- END: Custom Styling -->
</head>

<body class="bg-gray-100">
    <!-- BEGIN: Medical Bill Main Container -->
    <main class="a5-landscape-container shadow-lg flex flex-col justify-between" id="medical-bill-a5">
        <!-- BEGIN: Header Section -->
        <header class="border-b-2 border-black pb-2 mb-2">
            <div class="flex justify-between items-start">
                <div class="flex-1 text-center">
                    <h1 class="text-xl font-header text-gray-900">${companyDetails.heading}</h1>
                    <h2 class="font-semibold text-gray-800">${companyDetails.subHeading}</h2>
                    <p class="text-xs font-medium">${companyDetails.iso}</p>
                    <p class="text-xs italic">${companyDetails.area}
                    </p>
                </div>
            </div>
        </header>
        <!-- END: Header Section -->
        <!-- BEGIN: Patient Information Grid -->
        <section class="grid grid-cols-3 gap-y-2 gap-x-4 mb-2 text-xs-custom border-b pb-4">

    <!-- Row 1 -->
    <div class="flex gap-1">
        <span class="font-bold">Patient ID:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">${invoice.patient}</span>
    </div>

    <div class="flex gap-1">
        <span class="font-bold">Invoice No.:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">${invoice.name}</span>
    </div>

    <div class="flex gap-1">
        <span class="font-bold">Invoice Date:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">${formattedDate}</span>
    </div>

    <!-- Row 2 -->

    <div class="flex gap-1">
        <span class="font-bold">Patient Name:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">
            ${invoice.customer_name}
        </span>
    </div>

    <div class="flex gap-1">
        <span class="font-bold">Age:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">
            ${patientAge ? patientAge + " Yrs" : "-"}
        </span>
    </div>

    <div class="flex gap-1">
        <span class="font-bold">Gender:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">
            ${patientGender || "-"}
        </span>
    </div>

    <!-- Row 3 -->

    <div class="flex gap-1">
        <span class="font-bold">Ref By Prac:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">
            ${practitionerName || "-"}
        </span>
    </div>

    <div class="flex gap-1">
        <span class="font-bold">Category:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">
            ${category || "-"}
        </span>
    </div>

    <div class="flex gap-1">
        <span class="font-bold">Mobile:</span>
        <span class="border-b border-dotted border-gray-400 flex-grow">
            ${patientMobile || "-"}
        </span>
    </div>

</section>
        <!-- END: Patient Information Grid -->
        <!-- BEGIN: Billing Table -->
        <section class="flex-grow" data-purpose="billing-table" >
            <table class="w-full border-collapse border border-gray-800 text-xs-custom">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-gray-800 text-left w-12">Sl.</th>
                        <th class="border border-gray-800 text-left">TEST DESCRIPTION</th>
                        <th class="border border-gray-800 text-right w-24">TEST AMT (₹)</th>
                        <th class="border border-gray-800 text-right w-24">DISCOUNT (₹)</th>
                        <th class="border border-gray-800 text-right w-24">NET AMT (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        </section>
        <!-- END: Billing Table -->
        <!-- BEGIN: Billing Summary and Footer -->
        <footer class="mt-2 border-t-2 border-black pt-2">
            <div class="flex justify-between items-end">
                <!-- Contact Info & Sign -->
                <div class="text-[10px]">
                    <p class="font-bold">Contact: 03482-232222 | Email: ${companyDetails.email}</p>
                    <p>Consultation Hours: 8:00 AM - 12:00 PM &amp; 4:00 PM - 6:00 PM</p>
                    <div class="mt-8 flex gap-20">
                        <div class="text-center">
                            <div class="w-32 border-b border-black mb-1"></div>
                            <p>Patient's Signature</p>
                        </div>
                        <div class="text-center">
                            <div class="w-32 border-b border-black mb-1"></div>
                            <p>Authorized Signatory</p>
                        </div>
                    </div>
                </div>
                <!-- Summary Totals -->
                <div class="w-1/3 text-xs-custom">
                    <div class="flex justify-between border-b">
                        <span>Total Amount:</span>
                        <span class="font-semibold">₹ ${invoice.total}</span>
                    </div>
                    <div class="flex justify-between border-b">
                        <span>(-) Discount:</span>
                        <span class="font-semibold">₹ ${invoice.discount_amount || 0}</span>
                    </div>
                    <div class="flex justify-between border-b bg-gray-50">
                        <span class="font-bold">Net Amount:</span>
                        <span class="font-bold">₹ ${invoice.net_total}</span>
                    </div>
                    <div class="flex justify-between border-b">
                        <span>(-) Paid:</span>
                        <span class="font-semibold">₹ ${invoice.paid_amount}</span>
                    </div>
                    <div class="flex justify-between border-b border-black text-xs">
                        <span class="font-black">Due Amount:</span>
                        <span class="font-black">₹ 0.00</span>
                    </div>
                </div>
            </div>
            <p class="text-[9px] text-center mt-1 italic text-gray-600">This is a computer-generated receipt and does
                not require a physical stamp for validation.</p>
        </footer>
        <!-- END: Billing Summary and Footer -->
    </main>
    <!-- END: Toggle Notification -->
</body>

</html>
    `);

      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.document.body.style.zoom = "100%";
        printWindow.focus();
        printWindow.print();

        setTimeout(() => {
          printWindow.close();
          setSelectedInvoice(null);
        }, 500);
      };

    }, 100);
  };

  const renderActions = (row) => (
    <ActionsContainer>
      <ActionLink onClick={() => printInvoice(row)}>
        <Printer size={16} />
        Print
      </ActionLink>
    </ActionsContainer>
  );

  return (
    <Layout>
      <BillingContainer>
        <HeaderSection>
          <TitleSection>
            <Title>OPD Billing</Title>
            <Subtitle>Manage invoices, payments, and financial records.</Subtitle>
          </TitleSection>
          <ButtonGroup>
            <AddButton onClick={() => navigate(`${basePath}/add`)}>
              <Plus />
              Add Billing
            </AddButton>
            <ExportButton>
              <Download />
              Export Report
            </ExportButton>
          </ButtonGroup>
        </HeaderSection>

        <SummaryCards>
          {summaryData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <SummaryCard key={index}>
                <CardHeader>
                  <CardLabel>{item.label}</CardLabel>
                  <CardIcon bgColor={item.bgColor} color={item.color}>
                    <IconComponent />
                  </CardIcon>
                </CardHeader>
                <CardValue>{item.value}</CardValue>
                <CardChange positive={item.positive}>
                  <TrendingUp size={12} />
                  {item.change}
                </CardChange>
              </SummaryCard>
            );
          })}
        </SummaryCards>
        <ToolbarSection>
          {/* Search */}
          <SearchContainer>
            <DateLabel>Search by Patient ID:</DateLabel>
            <SearchIcon>
              <Search />
            </SearchIcon>
            <SearchInput
              placeholder="Search by Patient ID..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </SearchContainer>

          {/* From Date */}
          <DateContainer>

            <DateLabel>From Date:</DateLabel>
            <DateInput
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </DateContainer>

          {/* To Date */}
          <DateContainer>
            <DateLabel>To Date:</DateLabel>
            <DateInput
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </DateContainer>
          <DateContainer>
            <DateLabel>Reset Date Filter:</DateLabel>
            <DateInput
              type="button"
              value="Reset"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            />
          </DateContainer>
        </ToolbarSection>



        <BillingSection>
          <DataTable
            columns={columns}
            data={invoices}
            renderStatus={renderStatus}
            renderActions={renderActions}
            loading={loading}
            sortableColumns={["name", "patient_name", "posting_date"]}
          />

        </BillingSection>
      </BillingContainer>
      {/* {selectedInvoice && (
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
              <InvoiceTemplate
                ref={invoiceRef}
                invoice={selectedInvoice}
              />
            </div>
          )} */}
    </Layout>
  );
};

export default Billing;
