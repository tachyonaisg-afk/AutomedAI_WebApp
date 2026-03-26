import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Search, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ================= STYLES =================

const PageWrapper = styled.div`
  padding: 24px;
`;

const Heading = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
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
  margin-top: 30px;
`;

const AddButton = styled.button`
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
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const EditButton = styled(Button)`
  background: #f1f5f9;
`;

const DeleteButton = styled(Button)`
  background: #ef4444;
  color: white;
`;

const EmptyMessage = styled.td`
  text-align: center;
  padding: 30px;
  color: #64748b;
`;

// Pagination
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 6px;
`;

const PageButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? "#4a90e2" : "white")};
  color: ${(props) => (props.active ? "white" : "black")};
  cursor: pointer;
`;

// ================= COMPONENT =================

function LabTestManage() {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate=useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, tests]);

  const fetchTests = async () => {
    try {
      const res = await fetch(
        `https://hms.automedai.in/api/resource/Lab%20Test?fields=["name","lab_test_name","department"]`
      );
      const data = await res.json();

      setTests(data.data || []);
      setFilteredTests(data.data || []);
    } catch (err) {
      console.error("Error fetching lab tests:", err);
    }
  };

  const handleSearch = () => {
    const filtered = tests.filter((test) =>
      test.lab_test_name.toLowerCase().includes(search.toLowerCase()) ||
      test.name.toLowerCase().includes(search.toLowerCase()) ||
      (test.department || "").toLowerCase().includes(search.toLowerCase())
    );

    setFilteredTests(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTests.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const currentData = filteredTests.slice(start, start + pageSize);

  return (
    <Layout>
      <PageWrapper>

        <Heading>Lab Test Management</Heading>

        {/* Search */}
        <SearchWrapper>
          <SearchBox>
            <SearchInput
              placeholder="Search by Test Name / ID / Department"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchButton>
              <Search size={16} />
              Search
            </SearchButton>
          </SearchBox>
        </SearchWrapper>

        {/* Add Button */}
        <TableHeader>
          <AddButton onClick={() => navigate("/pathlab/admin/test-manage/add")}>
            Add New Test
          </AddButton>
        </TableHeader>

        {/* Table */}
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th>Test ID</Th>
                <Th>Test Name</Th>
                <Th>Department</Th>
                <Th>Actions</Th>
              </tr>
            </Thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((test) => (
                  <tr key={test.name}>
                    <Td>{test.name}</Td>
                    <Td>{test.lab_test_name}</Td>
                    <Td>{test.department}</Td>
                    <Td>
                      <ActionButtons>
                        <EditButton>
                          <Edit size={14} />
                        </EditButton>
                        <DeleteButton>
                          <Trash size={14} />
                        </DeleteButton>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <EmptyMessage colSpan="4">
                    No lab tests found
                  </EmptyMessage>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationWrapper>
            {[...Array(totalPages)].map((_, i) => (
              <PageButton
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
          </PaginationWrapper>
        )}
      </PageWrapper>
    </Layout>
  );
}

export default LabTestManage;