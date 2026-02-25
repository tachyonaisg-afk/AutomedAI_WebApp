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
  background-color: #f9fbff;
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
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
            };
        }

        const qty = parseFloat(item.quantity_uom?.split(" ")[0]) || 0;

        grouped[key].total_qty += qty;
        grouped[key].items.push(item);
    });

    return Object.values(grouped);
};

const CollectionDataTable = ({ data, renderActions }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const groupedData = useMemo(() => groupCollections(data), [data]);

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
                        <Th>Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {groupedData.map((group, index) => (
                        <React.Fragment key={index}>
                            <OuterRow onClick={() => toggleRow(index)}>
                                <Td>
                                    <ExpandIcon>
                                        {expandedRows[index] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
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
                                <Td>
                                    {renderActions && renderActions(group.items)}
                                </Td>
                            </OuterRow>

                            {expandedRows[index] &&
                                group.items.map((item, subIndex) => (
                                    <InnerRow key={subIndex}>
                                        <Td></Td>
                                        <Td colSpan="2">{item.sample}</Td>
                                        <Td>{item.quantity_uom}</Td>
                                        <Td>{item.status}</Td>
                                        <Td>{item.collection_datetime}</Td>
                                    </InnerRow>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

export default CollectionDataTable;