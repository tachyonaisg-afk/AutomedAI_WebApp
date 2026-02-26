import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const TableContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  max-height: 500px;   /* adjust as needed */
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #333333;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 2;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

const SortableHeader = styled(TableHeaderCell)`
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #4a90e2;
  }
`;

const SortableHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortIcon = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  svg {
    width: 12px;
    height: 12px;
    color: ${(props) => (props.active ? "#4a90e2" : "#999999")};
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333333;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
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

const RowsPerPageSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  cursor: pointer;
  outline: none;

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
  align-items: center;
  gap: 8px;
`;

const PaginationButton = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
    border-color: #4a90e2;
    color: #4a90e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LabTestListTable = ({
    columns,
    data,
    sortableColumns = [],
    onSort,
    rowsPerPageOptions = [10, 25, 50, 100],
    defaultRowsPerPage = 10,
    renderCell,
    renderStatus,
    renderActions,
    // Server-side pagination props
    serverSide = false,
    totalCount = 0,
    currentPageProp,
    rowsPerPageProp,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (key) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    // Use controlled values if serverSide is true
    const effectiveCurrentPage = serverSide ? currentPageProp : currentPage;
    const effectiveRowsPerPage = serverSide ? rowsPerPageProp : rowsPerPage;

    const handleSort = (columnKey) => {
        if (!sortableColumns.includes(columnKey)) return;

        const direction =
            sortConfig.key === columnKey && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key: columnKey, direction });

        if (onSort) {
            onSort(columnKey, direction);
        }
    };

    // Calculate pagination values
    const totalPages = serverSide
        ? Math.ceil(totalCount / effectiveRowsPerPage)
        : Math.ceil(data.length / effectiveRowsPerPage);

    const startIndex = serverSide
        ? (effectiveCurrentPage - 1) * effectiveRowsPerPage
        : (currentPage - 1) * rowsPerPage;

    const endIndex = serverSide
        ? Math.min(startIndex + effectiveRowsPerPage, totalCount)
        : startIndex + rowsPerPage;

    const currentData = serverSide ? data : data.slice(startIndex, endIndex);

    const totalRecords = serverSide ? totalCount : data.length;

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = Number(e.target.value);
        if (serverSide && onRowsPerPageChange) {
            onRowsPerPageChange(newRowsPerPage);
        } else {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1);
        }
    };

    const handlePreviousPage = () => {
        if (effectiveCurrentPage > 1) {
            if (serverSide && onPageChange) {
                onPageChange(effectiveCurrentPage - 1);
            } else {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const handleNextPage = () => {
        if (effectiveCurrentPage < totalPages) {
            if (serverSide && onPageChange) {
                onPageChange(effectiveCurrentPage + 1);
            } else {
                setCurrentPage(currentPage + 1);
            }
        }
    };
    const groupLabTests = (rows) => {
        const grouped = {};

        rows.forEach((row) => {
            const key = `${row.patient}__${row.department}`;

            if (!grouped[key]) {
                grouped[key] = {
                    groupKey: key,
                    patient: row.patient,
                    patient_name: row.patient_name,
                    department: row.department,
                    tests: [],
                };
            }

            grouped[key].tests.push(row);
        });

        return Object.values(grouped);
    };

    const groupedData = groupLabTests(currentData);
    useEffect(() => {
        setExpandedGroups({});
    }, [currentData]);

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableHeaderRow>
                        {columns.map((column) => {
                            const isSortable = sortableColumns.includes(column.key);
                            const isActive = sortConfig.key === column.key;

                            if (isSortable) {
                                return (
                                    <SortableHeader key={column.key} onClick={() => handleSort(column.key)}>
                                        <SortableHeaderContent>
                                            {column.label}
                                            <SortIcon active={isActive}>
                                                <ChevronUp
                                                    style={{
                                                        opacity: isActive && sortConfig.direction === "asc" ? 1 : 0.3,
                                                    }}
                                                />
                                                <ChevronDown
                                                    style={{
                                                        opacity: isActive && sortConfig.direction === "desc" ? 1 : 0.3,
                                                    }}
                                                />
                                            </SortIcon>
                                        </SortableHeaderContent>
                                    </SortableHeader>
                                );
                            }

                            return (
                                <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
                            );
                        })}
                    </TableHeaderRow>
                </TableHeader>
                <TableBody>
                    {groupedData.map((group) => {
                        const isExpanded = expandedGroups[group.groupKey];

                        return (
                            <React.Fragment key={group.groupKey}>

                                {/* If multiple tests → show group header */}
                                {group.tests.length > 1 && (
                                    <TableRow
                                        style={{
                                            backgroundColor: "#f1f5f9",
                                            cursor: "pointer",
                                            fontWeight: 600,
                                        }}
                                        onClick={() => toggleGroup(group.groupKey)}
                                    >
                                        <TableCell colSpan={columns.length}>
                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}{" "}
                                            {group.patient_name} ({group.patient}) — {group.department}
                                            ({group.tests.length} Tests)
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Render individual tests */}
                                {(group.tests.length === 1 || isExpanded) &&
                                    group.tests.map((row, rowIndex) => (
                                        <TableRow key={row.name}>
                                            {columns.map((column) => {
                                                if (column.key === "status" && renderStatus) {
                                                    return (
                                                        <TableCell key={column.key}>
                                                            {renderStatus(row[column.key], row)}
                                                        </TableCell>
                                                    );
                                                }

                                                if (column.key === "actions" && renderActions) {
                                                    return (
                                                        <TableCell key={column.key}>
                                                            {renderActions(row, rowIndex)}
                                                        </TableCell>
                                                    );
                                                }

                                                return (
                                                    <TableCell key={column.key}>
                                                        {row[column.key]}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
            <PaginationContainer>
                <RowsPerPage>
                    <span>Rows per page:</span>
                    <RowsPerPageSelect value={effectiveRowsPerPage} onChange={handleRowsPerPageChange}>
                        {rowsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </RowsPerPageSelect>
                </RowsPerPage>
                <PaginationInfo>
                    <span>
                        {startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords}
                    </span>
                    <PaginationButtons>
                        <PaginationButton onClick={handlePreviousPage} disabled={effectiveCurrentPage === 1}>
                            <ChevronLeft />
                        </PaginationButton>
                        <PaginationButton onClick={handleNextPage} disabled={effectiveCurrentPage === totalPages}>
                            <ChevronRight />
                        </PaginationButton>
                    </PaginationButtons>
                </PaginationInfo>
            </PaginationContainer>
        </TableContainer>
    );
};

export default LabTestListTable;

