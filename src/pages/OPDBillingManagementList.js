import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import api from "../services/api";

import {
  Search,
  Edit,
  Ban,
  ArrowLeft,
} from "lucide-react";
import DataTable from "../components/shared/DataTable";
import styled from "styled-components";

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;


function OPDBillingManagementList() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("https://hms.automedai.in/api/resource/Company");
        const companyList = res.data?.data || [];

        setCompanies(companyList);

        if (companyList.length > 0) {
          setSelectedCompany(companyList[0].name);
        }
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };

    fetchCompanies();
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);

      let filters = [
        ["status", "!=", "Cancelled"],
        ["company", "=", selectedCompany],
        ["Sales Invoice Item", "item_group", "in", ["OPD-Group", "Imaging"]],
      ];

      // Date filters
      if (fromDate && toDate) {
        filters.push([
          "posting_date",
          "between",
          [fromDate, toDate],
        ]);
      }

      // Search API filters
      const or_filters = searchText
        ? [
          ["name", "like", `%${searchText}%`],
          ["patient_name", "like", `%${searchText}%`],
          ["patient", "like", `%${searchText}%`],
        ]
        : [];

      const res = await api.get("/resource/Sales Invoice", {
        fields: JSON.stringify([
          "name",
          "patient",
          "patient_name",
          "posting_date",
          "posting_time",
          "status",
          "net_total",
          "creation",
          "`tabSales Invoice Item`.item_group",
        ]),
        filters: JSON.stringify(filters),
        or_filters: JSON.stringify(or_filters),
        order_by: "creation desc",
        limit_page_length: 100000,
      });

      const data = res.data?.data || [];

      // Remove duplicates
      const uniqueMap = {};

      data.forEach((item) => {
        if (!uniqueMap[item.name]) {
          uniqueMap[item.name] = item;
        }
      });

      const uniqueInvoices = Object.values(uniqueMap);

      // Sort newest first
      const sorted = uniqueInvoices.sort(
        (a, b) => new Date(b.creation) - new Date(a.creation)
      );

      setInvoices(sorted);

    } catch (error) {
      console.error("Invoice Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, searchText, selectedCompany]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCancelInvoice = async (row) => {
    try {
      const confirmCancel = window.confirm(
        `Are you sure you want to cancel invoice ${row.name}?`
      );

      if (!confirmCancel) return;

      // 1. Cancel Sales Invoice
      await api.post("/method/frappe.client.cancel", {
        doctype: "Sales Invoice",
        name: row.name,
      });

      // 2. Find linked payment entries
      const paymentRes = await api.get("/resource/Payment Entry Reference", {
        filters: JSON.stringify([
          ["reference_name", "=", row.name],
        ]),
        fields: JSON.stringify([
          "parent",
        ]),
      });

      const paymentEntries = paymentRes.data?.data || [];

      // 3. Cancel all linked payment entries
      for (const payment of paymentEntries) {
        await api.post("/method/frappe.client.cancel", {
          doctype: "Payment Entry",
          name: payment.parent,
        });
      }

      alert("Invoice cancelled successfully");

      fetchInvoices();

    } catch (error) {
      console.error("Cancel Error:", error);
      alert("Failed to cancel invoice");
    }
  };

  const handleEdit = (row) => {
    navigate(`/opd/admin/billing-management/edit/${row.name}`);
  };

  const columns = [
    {
      key: "name",
      label: "INVOICE ID",
    },
    {
      key: "patient",
      label: "PATIENT ID",
    },
    {
      key: "patient_name",
      label: "PATIENT NAME",
    },
    {
      key: "posting_date",
      label: "DATE",
    },
    {
      key: "net_total",
      label: "AMOUNT",
    },
    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "actions",
      label: "ACTION",
    },
  ];

  const renderStatus = (status) => {
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          background:
            status === "Paid"
              ? "#e8f5e9"
              : status === "Draft"
                ? "#fff3e0"
                : "#ffebee",
          color:
            status === "Paid"
              ? "#2e7d32"
              : status === "Draft"
                ? "#ef6c00"
                : "#c62828",
        }}
      >
        {status}
      </span>
    );
  };

  const renderActions = (row) => {
    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => handleEdit(row)}
          style={{
            border: "none",
            background: "#1976d2",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Edit size={16} />
          Edit Bill
        </button>

        <button
          onClick={() => handleCancelInvoice(row)}
          style={{
            border: "none",
            background: "#d32f2f",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Ban size={16} />
          Cancel Bill
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="billing-container">

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <SecondaryButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </SecondaryButton>
          <div>
            <h2>Invoice List</h2>
            <p>Manage all invoices</p>
          </div>
        </div>

        {/* TOOLBAR */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >

          {/* SEARCH */}
          <div>
            <label>Search Invoice</label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "0 12px",
                height: "42px",
                minWidth: "300px",
              }}
            >
              <Search size={16} />

              <input
                type="text"
                placeholder="Search invoice/patient..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "18px", justifyContent: "space-evenly" }}>

            {/* FROM DATE */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>From Date</label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  padding: "0 12px",
                }}
              />
            </div>

            {/* TO DATE */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>To Date</label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  padding: "0 12px",
                }}
              />
            </div>

            {/* RESET */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Reset Filter</label>

              <button
                onClick={() => {
                  setFromDate(today);
                  setToDate(today);
                }}
                style={{
                  height: "42px",
                  padding: "0 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#616161",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={invoices}
          loading={loading}
          renderStatus={renderStatus}
          renderActions={renderActions}
          sortableColumns={[
            "name",
            "patient_name",
            "posting_date",
          ]}
        />
      </div>
    </Layout>
  );
}

export default OPDBillingManagementList;