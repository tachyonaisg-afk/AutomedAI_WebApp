import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { RotateCw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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

  const [filters, setFilters] = useState({
    company: "Ramakrishna Mission Sargachi",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    account: ["Sales - RKMS", "Cash - RKMS"],
  });

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

  // Define the columns we want to display
  const displayColumns = [
    { label: "POSTING DATE", fieldname: "posting_date" },
    { label: "ACCOUNT", fieldname: "account" },
    { label: "AMOUNT BALANCE", fieldname: "credit" },
    { label: "CUSTOMER", fieldname: "against" },
    { label: "INVOICE NUMBER", fieldname: "against_voucher" },
    { label: "VOUCHER NUMBER", fieldname: "voucher_no" },
  ];

  const getColumnIndex = (fieldname) => {
    const index = columns.findIndex(col => col.fieldname === fieldname);
    if (index === -1) {
      console.warn(`Column '${fieldname}' not found in API response`);
    }
    return index;
  };

  const getCellValue = (row, fieldname) => {
    const index = getColumnIndex(fieldname);
    if (index === -1) return "";
    return row[index] ?? "";
  };

  const calculateTotals = () => {
    if (!reportData || reportData.length === 0) return 0;

    const creditIndex = getColumnIndex("credit");

    let total = 0;
    reportData.forEach(row => {
      if (creditIndex !== -1 && row[creditIndex]) {
        total += parseFloat(row[creditIndex]) || 0;
      }
    });

    return total;
  };

  const totalAmount = calculateTotals();
  const totalRecords = reportData.length;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);
  const paginatedData = reportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchReport = async () => {
    setLoading(true);
    setError("");

    try {
      // Prepare filters for the API
      const apiFilters = {
        company: filters.company,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        account: filters.account,
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
        setReportData(result || []);
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

  const handleRunReport = () => {
    console.log("Running report with filters:", filters);
    fetchReport();
  };

  const handleRefresh = () => {
    console.log("Refreshing report...");
    fetchReport();
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
              <FormSelect disabled>
                <option>Sales & Cash Accounts</option>
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
                            const isInvoiceLink = col.fieldname === "against_voucher";

                            // Format based on field type
                            let formattedValue = cellValue;

                            if (col.fieldname === "credit" && cellValue) {
                              const numValue = parseFloat(cellValue);
                              formattedValue = !isNaN(numValue) ? `$${numValue.toFixed(2)}` : "$0.00";
                            } else if (col.fieldname === "credit") {
                              formattedValue = "$0.00";
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
                        <TableCell colSpan={displayColumns.length - 1} style={{ textAlign: "right" }}>
                          ${totalAmount.toFixed(2)}
                        </TableCell>
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
