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
        (item) => `
      <tr>
        <td>${formatTestName(item.item_name)}</td>
        <td class="center">${item.qty}</td>
        <td class="right">₹ ${item.rate.toFixed(2)}</td>
        <td class="right"><strong>₹ ${item.amount.toFixed(2)}</strong></td>
      </tr>
    `
      )
      .join("");
  };

  const handlePrint = (invoice) => {
    const itemsHTML = buildItemsRows(invoice.items);

    setTimeout(() => {
      const printContent = invoiceRef.current;

      const printWindow = window.open("", "_blank");
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-GB");


      printWindow.document.write(`
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hospital Patient Invoice - Ramakrishna Mission Sargachi</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

  <!-- Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

  <style>
    :root {
      --primary: #137fec;
      --primary-dark: #0b5cb5;
      --bg-light: #f6f7f8;
      --surface: #ffffff;
      --text-main: #111418;
      --text-secondary: #617589;
      --border-light: #dbe0e6;
      --success: #16a34a;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: "Manrope", sans-serif;
      background: var(--bg-light);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 16px 16px;
    }
    @page {
      size: A4 portrait;
      margin: 15mm;
    }

    .invoice-wrapper {
      width: 100%;
      max-width: 148mm;
      background: var(--surface);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    /* Header */
    .invoice-header {
      padding: 30px;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 32px;
    }

    .hospital-info {
      max-width: 60%;
    }

    .hospital-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .hospital-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(19,127,236,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }

    .hospital-name {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.2;
    }

    .hospital-address {
      font-size: 14px;
      color: var(--text-secondary);
      margin-left: 52px;
    }

    .hospital-address p {
      margin: 4px 0;
    }

    .invoice-meta {
      text-align: right;
    }

    .invoice-title {
      font-size: 36px;
      font-weight: 900;
      color: var(--primary);
      margin: 0;
    }

    .invoice-meta p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 4px 0;
    }

    .paid-badge {
      margin-top: 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: #dcfce7;
      color: var(--success);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      border: 1px solid #bbf7d0;
    }

    /* Patient Info */
    .patient-section {
      background: #f1f3f5;
      padding: 12px 48px;
      border-bottom: 1px solid var(--border-light);
    }

    .patient-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .value {
      font-size: 16px;
      font-weight: 700;
    }

    /* Table */
    .table-section {
      padding: 30px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      overflow: hidden;
    }

    thead {
      background: #f6f7f8;
    }

    th, td {
      padding: 16px;
      font-size: 14px;
    }

    th {
      text-align: left;
      font-weight: 700;
      color: var(--text-secondary);
    }

    th.center, td.center {
      text-align: center;
    }

    th.right, td.right {
      text-align: right;
    }

    tbody tr {
      border-top: 1px solid var(--border-light);
    }

    tbody tr:hover {
      background: #fafafa;
    }

    td strong {
      font-weight: 700;
    }

    /* Summary */
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 32px;
      margin-top: 32px;
    }

    .payment-box {
      flex: 1;
      padding: 24px;
      background: #f6f7f8;
      border-radius: 8px;
      border: 1px solid var(--border-light);
    }

    .payment-box h3 {
      font-size: 13px;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    .payment-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .totals {
      flex: 0.6;
      align-self: flex-end;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .totals-row strong {
      color: var(--text-main);
    }

    .grand-total {
      font-size: 20px;
      font-weight: 900;
      color: var(--primary);
    }

    .thank-you {
      margin-top: 16px;
      padding: 12px;
      text-align: center;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 12px;
      border-radius: 6px;
      border: 1px solid #dbeafe;
    }

    /* Footer */
    .invoice-footer {
      padding: 16px 48px;
      border-top: 1px solid var(--border-light);
      font-size: 12px;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-links a {
      margin-left: 16px;
      color: inherit;
      text-decoration: none;
    }

    .footer-links a:hover {
      color: var(--primary);
    }

    /* Print */
    @media print {
      body {
        background: #fff;
      }
      .invoice-wrapper {
        box-shadow: none;
        border: none;
      }
    }

    @media (max-width: 768px) {
      .invoice-header {
        padding: 32px;
      }
      .table-section {
        padding: 32px;
      }
    }
  </style>
</head>

<body>

  <main class="invoice-wrapper">

    <!-- Header -->
    <header class="invoice-header">
      <div class="hospital-info">
        <div class="hospital-title">
          <div class="hospital-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
              10-4.48 10-10S17.52 2 12 2zm1 
              11h4v-2h-4V7h-2v4H7v2h4v4h2v-4z"/>
            </svg>
          </div>
          <div class="hospital-name">
            Ramakrishna Mission<br>Sargachi
          </div>
        </div>
        <div class="hospital-address">
          <p>Sargachi, Murshidabad</p>
          <p>West Bengal, India - 742134</p>
          <p>📞 +91 3482 232222</p>
        </div>
      </div>

      <div class="invoice-meta">
        <h1 class="invoice-title">INVOICE</h1>
        <p>Invoice # <strong>${invoice.name})</strong></p>
        <p>Date: <strong>${formattedDate}</strong></p>
        <div class="paid-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 
              10 10 10-4.48 10-10S17.52 2 
              12 2zm-1.2 14.4L6.6 
              12.2l1.4-1.4 2.8 2.8 
              5.8-5.8 1.4 1.4-7.2 7.2z"/>
            </svg>
           ${invoice.status}
        </div>
      </div>
    </header>

    <!-- Patient -->
    <section class="patient-section">
      <div class="patient-grid">
        <div>
          <div class="label">Patient Name</div>
          <div class="value">${invoice.patient_name}</div>
        </div>
        <div>
          <div class="label">Patient ID</div>
          <div class="value">${invoice.patient}</div>
        </div>
      </div>
    </section>

    <!-- Table -->
    <section class="table-section">
      <table>
        <thead>
          <tr>
            <th>Product Description</th>
            <th class="center">Quantity</th>
            <th class="right">Unit Rate</th>
            <th class="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="summary">
        <div class="payment-box">
          <h3>Payment Details</h3>
          <div class="payment-row"><span>Status</span><strong>${invoice.status}</strong></div>
          <div class="payment-row"><span>Date</span><strong>${invoice.posting_date}</strong></div>
          <div class="payment-row"><span>Method</span><strong>Cash</strong></div>
        </div>

        <div class="totals">
          
          <div class="totals-row">
            <span>Total</span>
            <span class="grand-total">₹ ${invoice.net_total}</span>
          </div>
          <div class="thank-you">
            Thank you for choosing Ramakrishna Mission Sargachi.
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="invoice-footer">
      <p>© 2023 Ramakrishna Mission Sargachi. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
        <a href="#">Support</a>
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

export default PathLabBilling;
