import React from "react";
import styled from "styled-components";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= STYLES ================= */

const TableContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;           /* IMPORTANT */
  max-height: 500px;        /* Adjust as needed */
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
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #f8f9fa;   /* IMPORTANT to prevent overlap transparency */
  
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #333333;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

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
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: #eaf4ff;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ================= COMPONENT ================= */

const OpdPatientDataTable = ({ data }) => {
    const navigate = useNavigate();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableHeaderRow>
                        <TableHeaderCell>Patient ID</TableHeaderCell>
                        <TableHeaderCell>Patient Name</TableHeaderCell>
                        <TableHeaderCell>Company</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                    </TableHeaderRow>
                </TableHeader>

                <tbody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.patient}</TableCell>
                            <TableCell>{row.patient_name}</TableCell>
                            <TableCell>{row.company}</TableCell>
                            <TableCell>
                                <ViewButton onClick={() => navigate(`/patients/${row.patient}`)}>
                                    <Eye size={16} />
                                    View
                                </ViewButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

export default OpdPatientDataTable;