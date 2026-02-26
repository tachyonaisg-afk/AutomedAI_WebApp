import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { ChevronDown, ChevronRight } from "lucide-react";

const TableContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  background-color: #f8f9fa;
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
`;

const OuterRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const InnerRow = styled.tr`
  background-color: #a8bbe2;
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const InnerHeaderRow = styled.tr`
  background-color: #eef3ff;
  border-bottom: 1px solid #d0d7e2;
`;

const InnerHeaderCell = styled.td`
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #344054;
`;

const getBaseSampleName = (sample) => {
    if (!sample) return "-";
    return sample.split("(")[0].trim().toLowerCase();
};

const groupCollections = (data) => {
    const grouped = {};

    data.forEach((item) => {
        const baseSample = getBaseSampleName(item.sample);
        const key = `${item.patient_id}_${baseSample}`;

        if (!grouped[key]) {
            grouped[key] = {
                patient_id: item.patient_id,
                patient_name: item.patient_name,
                base_sample: baseSample,
                uom: item.quantity_uom?.split(" ")[1] || "",
                total_qty: 0,
                items: [],
                collected_by: item.collected_by,
            };
        }

        const qty = parseFloat(item.quantity_uom?.split(" ")[0]) || 0;

        grouped[key].total_qty += qty;
        grouped[key].items.push(item);
    });

    return Object.values(grouped);
};

const getCollectedByName = (email) => {
    if (!email) return "-";
    return email.split("@")[0];
};

const CollectionDataTable = ({ data, renderActions }) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const groupedData = useMemo(() => groupCollections(data), [data]);

    const totalRecords = groupedData.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const paginatedData = groupedData.slice(startIndex, endIndex);

    const toggleRow = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <Th></Th>
                        <Th>Patient ID</Th>
                        <Th>Patient Name</Th>
                        <Th>Sample</Th>
                        <Th>Total Quantity</Th>
                        <Th>Collected By</Th>
                        <Th>Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((group, index) => (
                        <React.Fragment key={index}>
                            <OuterRow onClick={() => toggleRow(index)}>
                                <Td>
                                    <ExpandIcon>
                                        {expandedRows[index] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </ExpandIcon>
                                </Td>
                                <Td>{group.patient_id}</Td>
                                <Td>{group.patient_name}</Td>
                                <Td style={{ textTransform: "capitalize" }}>
                                    {group.base_sample}
                                </Td>
                                <Td>
                                    {group.total_qty} {group.uom}
                                </Td>
                                <Td>{getCollectedByName(group.collected_by) || "-"}</Td>
                                <Td>
                                    {renderActions &&
                                        renderActions({
                                            items: group.items,
                                            groupKey: `${group.patient_id}_${group.base_sample}`
                                        })}
                                </Td>
                            </OuterRow>

                            {expandedRows[index] && (
                                <>
                                    {/* Inner Header */}
                                    <InnerHeaderRow>
                                        <InnerHeaderCell></InnerHeaderCell>
                                        <InnerHeaderCell>Sample ID</InnerHeaderCell>
                                        <InnerHeaderCell>Patient</InnerHeaderCell>
                                        <InnerHeaderCell>Sample</InnerHeaderCell>
                                        <InnerHeaderCell>Quantity</InnerHeaderCell>
                                        <InnerHeaderCell>Status / Date</InnerHeaderCell>
                                        <InnerHeaderCell>Actions</InnerHeaderCell>
                                    </InnerHeaderRow>

                                    {/* Inner Data Rows */}
                                    {group.items.map((item, subIndex) => (
                                        <InnerRow key={subIndex}>
                                            <Td></Td>
                                            <Td>{item.name}</Td>
                                            <Td>{item.patient_name}</Td>
                                            <Td>{item.sample}</Td>
                                            <Td>{item.quantity_uom}</Td>
                                            <Td>
                                                {item.status}
                                                <br />
                                                {item.collection_datetime}
                                            </Td>
                                            <Td>
                                                {item.status === "Collected" && renderActions && renderActions(item)}
                                            </Td>
                                        </InnerRow>
                                    ))}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderTop: "1px solid #e0e0e0"
            }}>
                <div>
                    Rows per page:
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        {[10, 25, 50, 100].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    {startIndex + 1}-
                    {Math.min(endIndex, totalRecords)} of {totalRecords}

                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        style={{ marginLeft: 16 }}
                    >
                        Prev
                    </button>

                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                        style={{ marginLeft: 8 }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </TableContainer>
    );
};

export default CollectionDataTable;