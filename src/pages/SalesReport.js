import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { RotateCw, ChevronLeft, ChevronRight, Loader2, FileDown, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import usePageTitle from "../hooks/usePageTitle";
import apiService from "../services/api/apiService";
import API_ENDPOINTS from "../services/api/endpoints";
import Select from "react-select";

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  margin: 8px 0 0 0;
`;

const FiltersCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #333333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const FormInput = styled.input`
  padding: 10px 12px;
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

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RunButton = styled.button`
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

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #666666;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #4a90e2;
    color: #4a90e2;
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
  color: #333333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #4a90e2;
    color: #4a90e2;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TableCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TotalRow = styled.tr`
  border-top: 2px solid #e0e0e0;
  background-color: #f8f9fa;
  font-weight: 600;
`;

const TableHeader = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InvoiceLink = styled.a`
color: #333333;
  // color: #4a90e2;
  // text-decoration: none;
  // cursor: pointer;

  // &:hover {
  //   text-decoration: underline;
  // }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;
`;

const RowsSelect = styled.select`
  padding: 6px 28px 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;

  &:focus {
    border-color: #4a90e2;
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666666;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #ffffff;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
    border-color: #4a90e2;
    color: #4a90e2;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
`;

const BreadcrumbLink = styled.span`
  color: #4a90e2;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #999999;
`;
const FilterNotification = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  padding: 12px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FilterText = styled.span`
  font-size: 14px;
  color: #1976d2;
  font-weight: 500;
`;

const SalesReport = () => {
  usePageTitle("Sales Report");
  const navigate = useNavigate();
  const location = useLocation();
  const dashboardFilters = location.state;
  const [appliedFilters, setAppliedFilters] = useState(null);

  const [filters, setFilters] = useState({
    company: dashboardFilters?.company || "",
    fromDate: dashboardFilters?.from_date || new Date().toISOString().split("T")[0],
    toDate: dashboardFilters?.to_date || new Date().toISOString().split("T")[0],
    accountType: "Sales",
  });
  const [companies, setCompanies] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");

  useEffect(() => {
    if (filters.company) {
      fetchUsers(filters.company);
    }
  }, [filters.company]);

  const fetchUsers = async (companyName) => {
    try {
      // Step 1: Get users from User Permission
      const res = await apiService.get(
        "/resource/User Permission",
        {
          fields: JSON.stringify(["user", "for_value", "is_default"]),
          filters: JSON.stringify([
            ["allow", "=", "Company"],
            ["for_value", "=", companyName],
          ]),
          limit_page_length: 10000,
        }
      );

      const usersList = res.data?.data || [];

      // Step 2: Fetch full_name for each user
      const userDetailsPromises = usersList.map((u) =>
        apiService.get(`/resource/User/${encodeURIComponent(u.user)}`)
      );

      const userDetailsResponses = await Promise.all(userDetailsPromises);

      // Step 3: Map final users
      const formattedUsers = userDetailsResponses.map((res) => ({
        user_id: res.data.data.name,
        full_name:
          res.data.data.full_name ||
          `${res.data.data.first_name || ""} ${res.data.data.last_name || ""}`.trim(),
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch companies on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.COMPANY.LIST, {
        fields: '["name", "company_name"]',
        limit_page_length: 100,
      });
      if (response.data?.data) {
        setCompanies(response.data.data);
        // Set first company as default if available
        if (response.data.data.length > 0 && filters.company === "") {
          setFilters((prev) => ({
            ...prev,
            company: response.data.data[0].name,
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    if (dashboardFilters?.dashboardFilter) {
      const autoFilters = {
        company: dashboardFilters.company,
        fromDate: dashboardFilters.from_date,
        toDate: dashboardFilters.to_date,
        accountType: "Sales",
      };

      setFilters(autoFilters);
      setAppliedFilters(autoFilters);
      fetchReport(autoFilters);
    }
  }, [dashboardFilters]);
  // Determine the amount column based on account type
  const appliedAccountType = appliedFilters?.accountType;

  // Define the columns we want to display
  // const displayColumns = [
  //   { label: "POSTING DATE", fieldname: "posting_date" },
  //   { label: "ACCOUNT", fieldname: "account" },
  //   { label: amountLabel, fieldname: amountField },
  //   { label: "CUSTOMER", fieldname: "against" },
  //   { label: "INVOICE NUMBER", fieldname: "gl_entry" },
  //   { label: "VOUCHER NUMBER", fieldname: "voucher_no" },
  // ];

  const displayColumns = useMemo(() => {
    if (!appliedFilters) return [];

    return [
      { label: "SL NO", fieldname: "sl_no" },
      { label: "INVOICE NUMBER", fieldname: "name" },
      { label: "DATE", fieldname: "posting_date" },
      { label: "USER", fieldname: "owner" },
      { label: "REFERRED BY", fieldname: "referred_by" },
      { label: "PATIENT NAME", fieldname: "patient_name" },
      { label: "ITEMS", fieldname: "items" },
      { label: "TOTAL QTY", fieldname: "total_qty" },
      { label: "DISCOUNT", fieldname: "discount_amount" },
      { label: "TOTAL AMOUNT", fieldname: "net_total" },
    ];
  }, [appliedFilters]);

  const getCellValue = (row, fieldname) => {
    return row[fieldname] ?? "";
  };

  const calculateTotals = () => {
    let totalAmount = 0;

    reportData.forEach(row => {
      totalAmount += parseFloat(row.net_total) || 0;
    });

    return { amount: totalAmount };
  };

  const totals = calculateTotals();
  const totalRecords = reportData.length;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);
  const paginatedData = reportData
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((item, index) => ({
      ...item,
      sl_no: (currentPage - 1) * rowsPerPage + index + 1,
    }));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const practitionerCache = {};

  const fetchReport = async (activeFilters) => {
    setLoading(true);
    setError("");

    try {
      const filtersArray = [
        ["posting_date", ">=", activeFilters.fromDate],
        ["posting_date", "<=", activeFilters.toDate],
        ["docstatus","=", "1"]
      ];

      // Apply user filter only if not "All"
      if (selectedUser !== "All") {
        filtersArray.push(["owner", "=", selectedUser]);
      }

      const response = await apiService.get(
        "/resource/Sales Invoice",
        {
          limit_page_length: 1000,
          fields: JSON.stringify([
            "docstatus",
            "name",
            "posting_date",
            "owner",
            "patient_name",
            "total_qty",
            "discount_amount",
            "net_total",
          ]),
          filters: JSON.stringify(filtersArray),
        }
      );

      if (response.data?.data) {
        const invoices = response.data.data;

        const enrichedData = await Promise.all(
          invoices.map(async (inv) => {
            try {
              // Step 1: Get full invoice
              const invoiceRes = await apiService.get(
                `/resource/Sales Invoice/${encodeURIComponent(inv.name)}`
              );

              const invoiceDetails = invoiceRes.data?.data;

              // ✅ ITEMS (join names)
              const items =
                invoiceDetails?.items
                  ?.map((item) => {
                    let name = item.item_name || "";

                    // Remove prefixes LAB-, PLB-, PHC-
                    return name.replace(/^(LAB-|PLB-|PHC-)/, "").trim();
                  })
                  .join(", ") || "";

              // ✅ PRACTITIONER NAME (with cache)
              let practitionerName = "";

              const practitionerId = invoiceDetails?.ref_practitioner;

              if (practitionerId) {
                if (practitionerCache[practitionerId]) {
                  practitionerName = practitionerCache[practitionerId];
                } else {
                  const pracRes = await apiService.get(
                    `/resource/Healthcare Practitioner/${encodeURIComponent(practitionerId)}`
                  );

                  practitionerName =
                    pracRes.data?.data?.practitioner_name || "";

                  practitionerCache[practitionerId] = practitionerName;
                }
              }

              return {
                ...inv,
                items,
                referred_by: practitionerName,
              };
            } catch (err) {
              console.error("Error enriching invoice:", inv.name, err);
              return {
                ...inv,
                items: "",
                referred_by: "",
              };
            }
          })
        );

        setReportData(enrichedData);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const handleRunReport = () => {
    console.log("Running report with filters:", filters);
    setAppliedFilters({ ...filters });
    fetchReport({ ...filters });
  };

  const handleRefresh = () => {
    if (!appliedFilters) return;
    fetchReport(appliedFilters);
  };

  const getExportData = () => {
    return reportData.map((item, index) => ({
      ...item,
      sl_no: index + 1, // global SL NO (not paginated)
    }));
  };

  const handleExportPDF = () => {
    if (reportData.length === 0) return;

    const doc = new jsPDF("landscape");

    // Title
    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);

    // Date range
    doc.setFontSize(10);
    doc.setTextColor(100);
    const active = appliedFilters || filters;

    doc.text(`Period: ${active.fromDate} to ${active.toDate}`, 14, 28);
    doc.text(`Company: ${active.company}`, 14, 34);

    // Table headers and rows
    const headers = displayColumns.map((col) => col.label);
    const exportData = getExportData();

    const rows = exportData.map((row) =>
      displayColumns.map((col) => {
        const val = row[col.fieldname] ?? "";

        if (col.fieldname === "posting_date") {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
          }
        }

        if (col.fieldname === "items") {
          return val || "";
        }

        if (col.fieldname === "referred_by") {
          return val || "";
        }

        // ✅ USER NAME FIX
        if (col.fieldname === "owner") {
          return (
            users.find((u) => u.user_id === val)?.full_name || val
          );
        }

        if (["discount_amount", "net_total"].includes(col.fieldname)) {
          const num = parseFloat(val);
          return !isNaN(num) ? `Rs. ${num.toFixed(2)}` : "Rs. 0.00";
        }
        return String(val);
      })
    );

    // Total row
    rows.push([
      "Total", // SL NO
      "",      // Invoice
      "",      // Date
      "",      // User
      "",      // Referred By
      "",      // Patient
      "",      // Items
      "",      // Qty
      "",      // Discount
      `Rs. ${totals.amount.toFixed(2)}`, // Total Amount
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [74, 144, 226] },
      columnStyles: {
        6: { cellWidth: 40 },
      },
    });

    doc.save(`Sales_Report_${filters.fromDate}_to_${filters.toDate}.pdf`);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) return;

    const headers = displayColumns.map(col => col.label);

    const exportData = getExportData();

    const rows = exportData.map((row) =>
      displayColumns.map((col) => {
        let value = row[col.fieldname] ?? "";

        // ✅ DATE
        if (col.fieldname === "posting_date" && value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            value = `${day}/${month}/${year}`;
          }
        }

        // ✅ USER FULL NAME FIX (MISSING)
        if (col.fieldname === "owner") {
          value =
            users.find((u) => u.user_id === value)?.full_name || value;
        }

        // ✅ ITEMS
        if (col.fieldname === "items") {
          value = value || "";
        }

        // ✅ REFERRED BY
        if (col.fieldname === "referred_by") {
          value = value || "";
        }

        // ✅ AMOUNT FORMAT (OPTIONAL but better)
        if (["discount_amount", "net_total"].includes(col.fieldname)) {
          const num = parseFloat(value);
          value = !isNaN(num) ? `Rs. ${num.toFixed(2)}` : "Rs. 0.00";
        }

        return `"${String(value).replace(/"/g, '""')}"`;
      })
    );

    // Add total row
    rows.push([
      `"Total"`, // SL NO
      `""`,      // Invoice
      `""`,      // Date
      `""`,      // User
      `""`,      // Referred By
      `""`,      // Patient
      `""`,      // Items
      `""`,      // Qty
      `""`,      // Discount
      `"Rs. ${totals.amount.toFixed(2)}"` // Total Amount
    ]);

    const csvContent =
      [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Sales_Report_${filters.fromDate}_to_${filters.toDate}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <ReportContainer>
        <div>
          <Breadcrumb>
            <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbLink onClick={() => navigate("/reports")}>Reports</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <span>Sales Report</span>
          </Breadcrumb>
          <Title>Sales Report</Title>
          <Subtitle>Generate and analyze clinic financial data.</Subtitle>
          {dashboardFilters?.dashboardFilter && (
            <FilterNotification>
              <FilterText>
                Showing today's sales report for {filters.company}
              </FilterText>
            </FilterNotification>
          )}
        </div>

        <FiltersCard>
          <FiltersGrid>

            {/* <FormGroup>
              <FormLabel>Select Clinic</FormLabel>
              <FormSelect
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
              >
                {companies.length === 0 ? (
                  <option value="">Loading clinic...</option>
                ) : (
                  companies.map((company) => (
                    <option key={company.name} value={company.name}>
                      {company.company_name || company.name}
                    </option>
                  ))
                )}
              </FormSelect>
            </FormGroup> */}

            <FormGroup>
              <FormLabel>From Date</FormLabel>
              <FormInput
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>To Date</FormLabel>
              <FormInput
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
              />
            </FormGroup>

            {/* <FormGroup>
              <FormLabel>Account Type</FormLabel>
              <FormSelect
                name="accountType"
                value={filters.accountType}
                onChange={handleFilterChange}
              >
                <option value="Sales">Sales</option>
                <option value="Cash">Cash</option>
              </FormSelect>
            </FormGroup> */}

            <FormGroup>
              <FormLabel>Select User</FormLabel>
              <Select
                options={[
                  { value: "All", label: "All" },
                  ...users.map((user) => ({
                    value: user.user_id,
                    label: user.full_name || user.user_id,
                  })),
                ]}
                value={
                  selectedUser === "All"
                    ? { value: "All", label: "All" }
                    : users
                      .map((u) => ({
                        value: u.user_id,
                        label: u.full_name || u.user_id,
                      }))
                      .find((opt) => opt.value === selectedUser)
                }
                onChange={(selected) => setSelectedUser(selected?.value || "All")}
                placeholder="Search user..."
                isSearchable
              />
            </FormGroup>
          </FiltersGrid>

          <ButtonGroup>
            <RunButton onClick={handleRunReport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Run Report
            </RunButton>
            <RefreshButton onClick={handleRefresh}>
              <RotateCw />
            </RefreshButton>
            <ExportButton onClick={handleExportPDF} disabled={reportData.length === 0}>
              <FileDown />
              Export PDF
            </ExportButton>
            <ExportButton onClick={handleExportCSV} disabled={reportData.length === 0}>
              <FileText />
              Export CSV
            </ExportButton>
          </ButtonGroup>
        </FiltersCard>

        {error && (
          <div style={{ padding: "16px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        <TableCard>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px" }}>
              <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ marginLeft: "12px", color: "#666" }}>Loading report...</span>
            </div>
          ) : (
            <>
              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableRow>
                      {displayColumns.map((col, index) => (
                        <TableHeader key={index}>{col.label}</TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={displayColumns.length} style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                          {reportData.length === 0
                            ? "No data available. Click 'Run Report' to fetch data."
                            : "No records found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {displayColumns.map((col, colIndex) => {
                            const cellValue = getCellValue(row, col.fieldname);

                            // Check if this is an invoice number column (make it a link)
                            const isInvoiceLink = col.fieldname === "name";

                            // Format based on field type
                            let formattedValue = cellValue;

                            // Format date to dd/mm/yyyy
                            if (col.fieldname === "posting_date") {
                              const date = new Date(cellValue);
                              formattedValue = !isNaN(date)
                                ? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")
                                }/${date.getFullYear()}`
                                : "";
                            }

                            if (["discount_amount", "net_total"].includes(col.fieldname)) {
                              const num = parseFloat(cellValue);
                              formattedValue = !isNaN(num) ? `Rs. ${num.toFixed(2)}` : "Rs. 0.00";
                            }

                            if (col.fieldname === "owner") {
                              formattedValue =
                                users.find((u) => u.user_id === cellValue)?.full_name || cellValue;
                            }

                            if (col.fieldname === "items") {
                              formattedValue = cellValue || "-";
                            }

                            if (col.fieldname === "referred_by") {
                              formattedValue = cellValue || "-";
                            }

                            return (
                              <TableCell key={colIndex}
                                style={
                                  col.fieldname === "items"
                                    ? {
                                      maxWidth: "250px",
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }
                                    : {}
                                }
                              >
                                {isInvoiceLink && cellValue ? (
                                  <InvoiceLink>{cellValue}</InvoiceLink>
                                ) : (
                                  formattedValue || ""
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    )}
                    {paginatedData.length > 0 && (
                      <TotalRow>
                        <TableCell>Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>Rs. {totals.amount.toFixed(2)}</TableCell>
                      </TotalRow>
                    )}
                  </TableBody>
                </Table>
              </TableWrapper>
            </>
          )}

          {!loading && reportData.length > 0 && (
            <PaginationWrapper>
              <RowsPerPage>
                <span>Rows per page:</span>
                <RowsSelect value={rowsPerPage} onChange={handleRowsPerPageChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </RowsSelect>
              </RowsPerPage>

              <PaginationInfo>
                <span>{startRecord}-{endRecord} of {totalRecords} records</span>
                <PaginationButtons>
                  <PaginationButton
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft />
                  </PaginationButton>
                  <PaginationButton
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalRecords / rowsPerPage)}
                  >
                    <ChevronRight />
                  </PaginationButton>
                </PaginationButtons>
              </PaginationInfo>
            </PaginationWrapper>
          )}
        </TableCard>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </ReportContainer>
    </Layout>
  );
};

export default SalesReport;
