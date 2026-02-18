import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { RotateCw, ChevronLeft, ChevronRight, Loader2, FileDown, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import usePageTitle from "../hooks/usePageTitle";
import apiService from "../services/api/apiService";
import API_ENDPOINTS from "../services/api/endpoints";

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
  padding: 12px 16px;
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
  padding: 12px 16px;
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
`;

const InvoiceLink = styled.a`
  color: #4a90e2;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
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

const SalesReport = () => {
  usePageTitle("Sales Report");
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState(null);

  const [filters, setFilters] = useState({
    // company: "Ramakrishna Mission Sargachi",
    company: "",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    accountType: "Sales",
  });
  const [customerMap, setCustomerMap] = useState({});
  const [companies, setCompanies] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Determine the amount column based on account type
  const appliedAccountType = appliedFilters?.accountType;

  const amountField = appliedAccountType === "Cash" ? "debit" : "credit";
  const amountLabel = appliedAccountType === "Cash" ? "DEBIT" : "CREDIT";

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
      { label: "POSTING DATE", fieldname: "posting_date" },
      { label: "ACCOUNT", fieldname: "account" },
      { label: amountLabel, fieldname: amountField },
      { label: "CUSTOMER", fieldname: "against" },
      { label: "INVOICE NUMBER", fieldname: "gl_entry" },
      { label: "VOUCHER NUMBER", fieldname: "voucher_no" },
    ];
  }, [appliedFilters, amountField, amountLabel]);


  const getCellValue = (row, fieldname) => {
    return row[fieldname] ?? "";
  };

  const calculateTotals = () => {
    if (!reportData || reportData.length === 0) return { amount: 0 };

    let totalAmount = 0;

    reportData.forEach(row => {
      if (row[amountField]) {
        totalAmount += parseFloat(row[amountField]) || 0;
      }
    });

    return { amount: totalAmount };
  };

  const totals = calculateTotals();
  const totalRecords = reportData.length;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);
  const paginatedData = reportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchReport = async (activeFilters) => {

    setLoading(true);
    setError("");

    try {
      // Prepare filters for the API
      const selectedAccount = activeFilters.accountType === "Cash" ? (activeFilters.company === "Ramakrishna Mission Sargachi" ? "Cash - RKMS" : "Cash - ADC&P") : (activeFilters.company === "Ramakrishna Mission Sargachi" ? "Sales - RKMS" : "Sales - ADC&P");  //Todo make this dynamic and the accounts will be fetched from api
      const apiFilters = {
        company: activeFilters.company,
        from_date: activeFilters.fromDate,
        to_date: activeFilters.toDate,
        account: [selectedAccount],
        party: [],
        categorize_by: "Categorize by Voucher (Consolidated)",
        cost_center: [],
        project: [],
        include_dimensions: 1,
        include_default_book_entries: 1,
      };

      // Make the API call
      const response = await apiService.get(API_ENDPOINTS.REPORTS.RUN_QUERY_REPORT, {
        report_name: API_ENDPOINTS.REPORTS.GENERAL_LEDGER,
        filters: JSON.stringify(apiFilters),
        ignore_prepared_report: false,
        are_default_filters: true,
      });

      console.log("Report Response:", response.data);

      // Process the response
      if (response.data?.message) {
        const { result, columns } = response.data.message;
        console.log("Columns from API:", columns);
        console.log("Sample row data:", result?.[0]);

        // Filter to only include rows with gl_entry field
        const filteredResults = result ? result.filter(row => row.gl_entry) : [];
        console.log("Filtered results with gl_entry:", filteredResults);

        setReportData(filteredResults);
        await fetchCustomerNames(filteredResults);
        setColumns(columns || []);
        setCurrentPage(1); // Reset to first page
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err.response?.data?.message || "Failed to fetch report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomerNames = async (rows) => {
    try {
      // Get unique customer IDs from "against"
      const customerIds = [
        ...new Set(
          rows
            .map(row => row.against)
            .filter(id => id && id.startsWith("CUST"))
        )
      ];

      if (customerIds.length === 0) return;

      const customerPromises = customerIds.map(id =>
        apiService.get(`/resource/Customer/${id}`)
      );

      const responses = await Promise.all(customerPromises);

      const map = {};
      responses.forEach(res => {
        if (res.data?.data) {
          map[res.data.data.name] = res.data.data.customer_name;
        }
      });

      setCustomerMap(map);
    } catch (err) {
      console.error("Error fetching customer names:", err);
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


  const handleExportPDF = () => {
    if (reportData.length === 0) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);

    // Date range
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Period: ${(appliedFilters || filters).fromDate} to ${filters.toDate}`, 14, 28);
    doc.text(`Company: ${(appliedFilters || filters).company}`, 14, 34);

    // Table headers and rows
    const headers = displayColumns.map((col) => col.label);
    const rows = reportData.map((row) =>
      displayColumns.map((col) => {
        const val = row[col.fieldname] ?? "";
        if (col.fieldname === "posting_date" && val) {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          }
        }
        if (col.fieldname === "debit" || col.fieldname === "credit") {
          const num = parseFloat(val);
          return !isNaN(num) ? `Rs. ${num.toFixed(2)}` : "Rs. 0.00";
        }
        return String(val);
      })
    );

    // Total row
    rows.push(["Total", "", `Rs. ${totals.amount.toFixed(2)}`, "", "", ""]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [74, 144, 226] },
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

    const rows = reportData.map((row) =>
      displayColumns.map((col) => {
        let value = row[col.fieldname] ?? "";

        // Replace customer ID with name
        if (col.fieldname === "against" && value) {
          value = customerMap[value] || value;
        }

        // Format date
        if (col.fieldname === "posting_date" && value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            value = `${day}/${month}/${year}`;
          }
        }
        // Format amount
        if (col.fieldname === "debit" || col.fieldname === "credit") {
          const num = parseFloat(value);
          value = !isNaN(num) ? num.toFixed(2) : "0.00";
        }

        return `"${String(value).replace(/"/g, '""')}"`;
      })
    );

    // Add total row
    rows.push([
      `"Total"`,
      `""`,
      `"${totals.amount.toFixed(2)}"`,
      `""`,
      `""`,
      `""`
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
        </div>

        <FiltersCard>
          <FiltersGrid>
            <FormGroup>
              <FormLabel>Select Company</FormLabel>
              <FormSelect
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
              >
                {companies.length === 0 ? (
                  <option value="">Loading companies...</option>
                ) : (
                  companies.map((company) => (
                    <option key={company.name} value={company.name}>
                      {company.company_name || company.name}
                    </option>
                  ))
                )}
              </FormSelect>
            </FormGroup>

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

            <FormGroup>
              <FormLabel>Account Type</FormLabel>
              <FormSelect
                name="accountType"
                value={filters.accountType}
                onChange={handleFilterChange}
              >
                <option value="Sales">Sales</option>
                <option value="Cash">Cash</option>
              </FormSelect>
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
                            const isInvoiceLink = col.fieldname === "gl_entry";

                            // Format based on field type
                            let formattedValue = cellValue;
                            if (col.fieldname === "against" && cellValue) {
                              formattedValue = customerMap[cellValue] || cellValue;
                            }

                            // Format date to dd/mm/yyyy
                            if (col.fieldname === "posting_date" && cellValue) {
                              const date = new Date(cellValue);
                              if (!isNaN(date.getTime())) {
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                formattedValue = `${day}/${month}/${year}`;
                              }
                            }

                            // Format monetary values
                            if ((col.fieldname === "debit" || col.fieldname === "credit") && cellValue !== null && cellValue !== undefined) {
                              const numValue = parseFloat(cellValue);
                              formattedValue = !isNaN(numValue) ? `₹${numValue.toFixed(2)}` : "₹0.00";
                            } else if (col.fieldname === "debit" || col.fieldname === "credit") {
                              formattedValue = "₹0.00";
                            }

                            return (
                              <TableCell key={colIndex}>
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
                        <TableCell>₹{totals.amount.toFixed(2)}</TableCell>
                        <TableCell colSpan={3}></TableCell>
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
