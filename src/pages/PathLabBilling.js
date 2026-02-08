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
const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const PathLabBilling = () => {
  usePageTitle("PathLab Billing");
  const navigate = useNavigate();
  const location = useLocation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const invoiceRef = useRef();
  const [selectedInvoice, setSelectedInvoice] = useState(null);


  // Determine base path for navigation
  const basePath = "/pathlab/billing";

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
  const handlePrint = (row) => {
    setSelectedInvoice(row);

    setTimeout(() => {
      const printContent = invoiceRef.current;

      const printWindow = window.open("", "_blank");

      printWindow.document.write(`
      <!DOCTYPE html>

<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>Hospital Patient Invoice - Ramakrishna Mission Sargachi</title>
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com" rel="preconnect" />
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap"
    rel="stylesheet" />
  <!-- Material Symbols -->
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
    rel="stylesheet" />
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <!-- Tailwind Config -->
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#137fec",
            "primary-dark": "#0b5cb5",
            "background-light": "#f6f7f8",
            "background-dark": "#101922",
            "surface-light": "#ffffff",
            "surface-dark": "#1a2632",
            "text-main": "#111418",
            "text-secondary": "#617589",
            "border-light": "#dbe0e6",
          },
          fontFamily: {
            "display": ["Manrope", "sans-serif"]
          },
          borderRadius: {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "2xl": "1rem",
            "full": "9999px"
          },
        },
      },
    }
  </script>
  <style>
    /* Print Styles */
    @media print {
      body {
        background-color: white !important;
        -webkit-print-color-adjust: exact;
      }

      .no-print {
        display: none !important;
      }

      .print-container {
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        border: none !important;
      }
    }
  </style>
</head>

<body
  class="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex flex-col items-center py-8 px-4 sm:px-6">
  <!-- Top Actions (No Print) -->
  <div class="w-full max-w-[960px] flex justify-between items-center mb-6 no-print">
    
    
  </div>
  <!-- Invoice Container -->
  <main
    class="print-container w-full max-w-[960px] bg-white dark:bg-surface-dark shadow-xl rounded-xl overflow-hidden flex flex-col">
    <!-- Header Section -->
    <header class="p-8 md:p-12 border-b border-border-light dark:border-gray-700">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <!-- Hospital Branding -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-2xl">local_hospital</span>
            </div>
            <h1 class="text-2xl font-bold text-text-main dark:text-white leading-tight">Ramakrishna
              Mission<br />Sargachi</h1>
          </div>
          <div class="text-sm text-text-secondary dark:text-gray-400 pl-[52px]">
            <p>Sargachi, Murshidabad</p>
            <p>West Bengal, India - 742134</p>
            <p class="mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">call</span> +91 3482 232222
            </p>
          </div>
        </div>
        <!-- Invoice Meta -->
        <div class="flex flex-col items-start md:items-end text-left md:text-right">
          <h2 class="text-4xl font-black text-text-main dark:text-white tracking-tight text-primary">INVOICE</h2>
          <div class="mt-2 flex flex-col gap-1">
            <p class="text-text-secondary dark:text-gray-400 text-sm font-medium">Invoice # <span
                class="text-text-main dark:text-white font-bold">INV-2023-001</span></p>
            <p class="text-text-secondary dark:text-gray-400 text-sm font-medium">Date: <span
                class="text-text-main dark:text-white font-bold">Oct 24, 2023</span></p>
          </div>
          <div
            class="mt-4 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-green-200 dark:border-green-800">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            Paid
          </div>
        </div>
      </div>
    </header>
    <!-- Patient Details Grid -->
    <section
      class="bg-background-light/50 dark:bg-gray-800/30 px-8 py-6 md:px-12 border-b border-border-light dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="text-xs uppercase tracking-wider text-text-secondary dark:text-gray-500 font-bold mb-1">Patient Name
          </p>
          <p class="text-lg font-bold text-text-main dark:text-white">Rahul Roy</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-text-secondary dark:text-gray-500 font-bold mb-1">Patient ID
          </p>
          <p class="text-lg font-bold text-text-main dark:text-white">P-99823</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-text-secondary dark:text-gray-500 font-bold mb-1">Posting Date
          </p>
          <p class="text-lg font-bold text-text-main dark:text-white">Oct 20, 2023</p>
        </div>
      </div>
    </section>
    <!-- Billing Table -->
    <section class="p-8 md:p-12">
      <div class="w-full overflow-hidden rounded-lg border border-border-light dark:border-gray-700">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-background-light dark:bg-gray-800 border-b border-border-light dark:border-gray-700">
              <th class="px-6 py-4 font-bold text-text-secondary dark:text-gray-400 w-[45%]">Product Description</th>
              <th class="px-6 py-4 font-bold text-text-secondary dark:text-gray-400 text-center w-[15%]">Quantity</th>
              <th class="px-6 py-4 font-bold text-text-secondary dark:text-gray-400 text-right w-[20%]">Unit Rate</th>
              <th class="px-6 py-4 font-bold text-text-secondary dark:text-gray-400 text-right w-[20%]">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light dark:divide-gray-700">
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4 font-medium text-text-main dark:text-white">Consultation Fee (Gen. Medicine)</td>
              <td class="px-6 py-4 text-center text-text-secondary dark:text-gray-400">1</td>
              <td class="px-6 py-4 text-right text-text-secondary dark:text-gray-400">₹ 500.00</td>
              <td class="px-6 py-4 text-right font-semibold text-text-main dark:text-white">₹ 500.00</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4 font-medium text-text-main dark:text-white">X-Ray (Chest PA View)</td>
              <td class="px-6 py-4 text-center text-text-secondary dark:text-gray-400">1</td>
              <td class="px-6 py-4 text-right text-text-secondary dark:text-gray-400">₹ 350.00</td>
              <td class="px-6 py-4 text-right font-semibold text-text-main dark:text-white">₹ 350.00</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4 font-medium text-text-main dark:text-white">Blood Test (CBC)</td>
              <td class="px-6 py-4 text-center text-text-secondary dark:text-gray-400">1</td>
              <td class="px-6 py-4 text-right text-text-secondary dark:text-gray-400">₹ 250.00</td>
              <td class="px-6 py-4 text-right font-semibold text-text-main dark:text-white">₹ 250.00</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4 font-medium text-text-main dark:text-white">Pharmacy Charges</td>
              <td class="px-6 py-4 text-center text-text-secondary dark:text-gray-400">1</td>
              <td class="px-6 py-4 text-right text-text-secondary dark:text-gray-400">₹ 1,200.00</td>
              <td class="px-6 py-4 text-right font-semibold text-text-main dark:text-white">₹ 1,200.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Summary & Payment Info -->
      <div class="mt-8 flex flex-col md:flex-row justify-between gap-8">
        <!-- Payment Information -->
        <div
          class="w-full md:w-1/2 p-6 rounded-lg bg-background-light dark:bg-gray-800/30 border border-border-light dark:border-gray-700">
          <h3 class="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-4">Payment
            Details</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-text-secondary dark:text-gray-400">Payment Status</span>
              <span class="font-bold text-green-600 dark:text-green-400">Paid</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-text-secondary dark:text-gray-400">Date Paid</span>
              <span class="font-medium text-text-main dark:text-white">Oct 24, 2023 - 10:30 AM</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-text-secondary dark:text-gray-400">Payment Method</span>
              <span class="font-medium text-text-main dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">credit_card</span>
                Credit Card (**** 4242)
              </span>
            </div>
          </div>
        </div>
        <!-- Totals -->
        <div class="w-full md:w-5/12 flex flex-col justify-end">
          <div class="flex justify-between py-2 text-text-secondary dark:text-gray-400 text-sm">
            <span>Subtotal</span>
            <span class="font-medium text-text-main dark:text-white">₹ 2,300.00</span>
          </div>
          <div
            class="flex justify-between py-2 text-text-secondary dark:text-gray-400 text-sm border-b border-border-light dark:border-gray-700 pb-4">
            <span>Taxes (GST 18%)</span>
            <span class="font-medium text-text-main dark:text-white">₹ 414.00</span>
          </div>
          <div class="flex justify-between py-4 text-text-main dark:text-white">
            <span class="font-bold text-lg">Total Amount</span>
            <span class="font-black text-2xl text-primary">₹ 2,714.00</span>
          </div>
          <div
            class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded border border-blue-100 dark:border-blue-800 text-center">
            <p>Thank you for choosing Ramakrishna Mission Sargachi.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer Bar -->
    <footer
      class="bg-background-light dark:bg-gray-800 border-t border-border-light dark:border-gray-700 px-8 py-4 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-text-secondary dark:text-gray-500 gap-4">
      <p>© 2023 Ramakrishna Mission Sargachi. All rights reserved.</p>
      <div class="flex gap-4">
        <a class="hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a class="hover:text-primary transition-colors" href="#">Terms of Service</a>
        <a class="hover:text-primary transition-colors" href="#">Support</a>
      </div>
    </footer>
  </main>
</body>

</html>
    `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();

      // Cleanup
      setTimeout(() => {
        printWindow.close();
        setSelectedInvoice(null);
      }, 500);
    }, 100);
  };


  const handleDownloadPDF = async (row) => {
    console.log("📄 Download PDF:", row.name);
    // setSelectedInvoice(row);

    // // wait for DOM to render
    // setTimeout(() => {
    //   const element = invoiceRef.current;

    //   const options = {
    //     margin: 10,
    //     filename: `${row.name}.pdf`,
    //     image: { type: "jpeg", quality: 0.98 },
    //     html2canvas: {
    //       scale: 2,
    //       useCORS: true,
    //     },
    //     jsPDF: {
    //       unit: "mm",
    //       format: "a4",
    //       orientation: "portrait",
    //     },
    //   };

    //   html2pdf().set(options).from(element).save();
    // }, 100);
  };


  const renderActions = (row) => (
    <ActionsContainer>
      <ActionLink onClick={() => handlePrint(row)}>
        <Printer size={16} />
        Print
      </ActionLink>
      <ActionLink onClick={() => handleDownloadPDF(row)}>
        <Download size={16} />
        PDF
      </ActionLink>
    </ActionsContainer>
  );


  return (
    <Layout>
      <BillingContainer>
        <HeaderSection>
          <TitleSection>
            <Title>PathLab Billing</Title>
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
            <DateLabel>Search:</DateLabel>
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

export default PathLabBilling;
