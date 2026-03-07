import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Search, Edit, ArrowLeft } from "lucide-react";
import EmpanelDoctorModal from "../components/modals/EmpanelDoctorModal";

const PageWrapper = styled.div`
  padding: 24px;
`;

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const SearchBox = styled.div`
  width: 90%;
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 50px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4a90e2;
  }
`;

const SearchButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #4a90e2;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #3c7edb;
  }
`;
const TableHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  margin-top: 50px;
`;

const NewDoctorButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #4a90e2;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #3c7edb;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #bbd9f8;
`;

const Th = styled.th`
  padding: 14px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 14px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  cursor: pointer;
`;

const EditButton = styled(Button)`
  background: #f1f5f9;
`;

const EmpanelButton = styled(Button)`
  background: #10b981;
  color: white;
`;

function EmpanelDoctor() {
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);

    const doctors = [
        {
            name: "Dr. Amit Sharma (M)",
            mobile: "9876543210",
            reg: "WB12345",
            qualification: "MBBS, MD",
        },
        {
            name: "Dr. Priya Sen (F)",
            mobile: "9123456780",
            reg: "WB67890",
            qualification: "MBBS, DNB",
        },
        {
            name: "Dr. Rahul Verma (M)",
            mobile: "9988776655",
            reg: "DL54321",
            qualification: "MBBS, MS",
        },
    ];

    const filteredDoctors = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <SearchButton onClick={() => window.history.back()}>
                <ArrowLeft size={16} />
                Back
            </SearchButton>
            <PageWrapper>
                <SearchWrapper>
                    <SearchBox>
                        <SearchInput
                            placeholder="Search doctor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* <SearchButton>
              <Search size={16} />
              Search Doctor
            </SearchButton> */}
                    </SearchBox>
                </SearchWrapper>

                <TableHeader>
                    <NewDoctorButton onClick={() => setOpenModal(true)}>
                        Empanel New Doctor
                    </NewDoctorButton>
                </TableHeader>

                <TableWrapper>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Sl No.</Th>
                                <Th>Doctor Name</Th>
                                <Th>Mobile</Th>
                                <Th>Reg No</Th>
                                <Th>Qualification</Th>
                                <Th>Action</Th>
                            </tr>
                        </Thead>

                        <tbody>
                            {filteredDoctors.map((doc, index) => (
                                <tr key={index}>
                                    <Td>{index + 1}</Td>
                                    <Td>{doc.name}</Td>
                                    <Td>{doc.mobile}</Td>
                                    <Td>{doc.reg}</Td>
                                    <Td>{doc.qualification}</Td>
                                    <Td>
                                        <ActionButtons>
                                            <EditButton>
                                                <Edit size={14} />
                                            </EditButton>
                                            <EmpanelButton>Empanel</EmpanelButton>
                                        </ActionButtons>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
                {openModal && (
                    <EmpanelDoctorModal onClose={() => setOpenModal(false)} />
                )}
            </PageWrapper>
        </Layout>
    );
}

export default EmpanelDoctor;