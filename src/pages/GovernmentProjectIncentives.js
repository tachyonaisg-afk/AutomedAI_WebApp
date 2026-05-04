import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Search, ArrowLeft } from "lucide-react";
import api from "../services/api";

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
  padding: 10px 10px;
  font-size: 14px;
  height: 35px;
  border: none;
  border-radius: 10px;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

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
  flex-wrap: wrap; /* 🔥 important */
`;

const PageButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? "#4a90e2" : "white")};
  color: ${(props) => (props.active ? "white" : "black")};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Grand Total Box
const TotalBox = styled.div`
  margin-top: 16px;
  padding: 14px;
  background: #f1f5f9;
  border-radius: 10px;
  font-weight: 600;
  text-align: right;
`;

// ================= COMPONENT =================

function GovernmentProjectIncentives() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, data]);

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/resource/Sales Invoice?limit_page_length=200000&fields=["name","patient","patient_name","posting_date","posting_time","company","status","total_qty","net_total"]&order_by=posting_date desc, posting_time desc&filters=[["Sales Invoice Item","item_group","in",["PHC"]]]`
      );

      setData(res.data.data || []);
      setFilteredData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      item.patient.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const currentData = filteredData.slice(start, start + pageSize);

  // Grand Total (IMPORTANT)
  // const grandTotal = filteredData.reduce(
  //   (sum, item) => sum + (item.net_total || 0),
  //   0
  // );

  const grandTotal = filteredData.reduce(
    (sum, item) => sum + Number(item.net_total || 0),
    0
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredData]);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <Layout>
      <PageWrapper>
        <div style={{ display: "flex", gap: "20px" }}>
          <SearchButton onClick={() => window.history.back()}>
            <ArrowLeft size={16} /> Back
          </SearchButton>

          <Heading>Government Project Incentives</Heading>
        </div>

        {/* Search */}
        <SearchWrapper>
          <SearchBox>
            <SearchInput
              placeholder="Search by Invoice / Patient / ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBox>
        </SearchWrapper>

        {/* Table */}
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th>Invoice ID</Th>
                <Th>Patient ID</Th>
                <Th>Patient Name</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Status</Th>
                <Th>Qty</Th>
                <Th>Amount</Th>
              </tr>
            </Thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item.name}>
                    <Td>{item.name}</Td>
                    <Td>{item.patient}</Td>
                    <Td>{item.patient_name}</Td>
                    <Td>{item.posting_date}</Td>
                    <Td>{item.posting_time?.slice(0, 8)}</Td>
                    <Td>{item.status}</Td>
                    <Td>{item.total_qty}</Td>
                    <Td>₹ {item.net_total}</Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <EmptyMessage colSpan="8">
                    No records found
                  </EmptyMessage>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        {/* Grand Total */}
        <TotalBox>
          Grand Total: ₹ {grandTotal.toFixed(2)}
        </TotalBox>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationWrapper>
            {/* PREV */}
            <PageButton
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </PageButton>

            {/* PAGE NUMBERS */}
            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span key={index} style={{ padding: "6px 10px" }}>...</span>
              ) : (
                <PageButton
                  key={index}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              )
            )}

            {/* NEXT */}
            <PageButton
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </PageButton>
          </PaginationWrapper>
        )}
      </PageWrapper>
    </Layout>
  );
}

export default GovernmentProjectIncentives;