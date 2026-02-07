import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Download, IndianRupee, TrendingUp, FileText, Calendar, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import api from "../services/api";

const BillingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const AddButton = styled.button`
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
    width: 18px;
    height: 18px;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f7ff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const SummaryCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardLabel = styled.span`
  font-size: 14px;
  color: #666666;
  font-weight: 400;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.bgColor || "#f5f5f5"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color || "#333333"};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CardValue = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
`;

const CardChange = styled.span`
  font-size: 12px;
  color: ${(props) => (props.positive ? "#2e7d32" : "#c62828")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BillingSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecentInvoices = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ViewAllLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const InvoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InvoiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #e9ecef;
  }
`;

const InvoiceLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InvoiceId = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

const InvoicePatient = styled.span`
  font-size: 12px;
  color: #666666;
`;

const InvoiceRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const InvoiceAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
`;

const InvoiceStatus = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.variant === "paid") return "#e8f5e9";
    if (props.variant === "pending") return "#fff3e0";
    if (props.variant === "overdue") return "#ffebee";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.variant === "paid") return "#2e7d32";
    if (props.variant === "pending") return "#f57c00";
    if (props.variant === "overdue") return "#c62828";
    return "#666666";
  }};
`;

const QuickActions = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: #4a90e2;
    background-color: #f8f9fa;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #4a90e2;
  }
`;

const ActionLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const Billing = () => {
  usePageTitle("Billing");
  const navigate = useNavigate();
  const location = useLocation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);


  // Determine base path for navigation (handles both /billing and /opd/billing)
  const basePath = location.pathname.startsWith("/opd") ? "/opd/billing" : "/billing";

  const summaryData = [
    {
      label: "Total Revenue",
      value: "₹45,250",
      change: "+12.5%",
      positive: true,
      icon: IndianRupee,
      bgColor: "#e8f5e9",
      color: "#2e7d32",
    },
    {
      label: "Pending Payments",
      value: "₹8,500",
      change: "+5.2%",
      positive: false,
      icon: Clock,
      bgColor: "#fff3e0",
      color: "#f57c00",
    },
    {
      label: "Paid This Month",
      value: "₹36,750",
      change: "+18.3%",
      positive: true,
      icon: CheckCircle,
      bgColor: "#e3f2fd",
      color: "#1976d2",
    },
    {
      label: "Overdue",
      value: "₹2,100",
      change: "-8.1%",
      positive: true,
      icon: XCircle,
      bgColor: "#ffebee",
      color: "#c62828",
    },
  ];

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const params = {
        fields: JSON.stringify([
          "name",
          "patient",
          "patient_name",
          "posting_date",
          "company",
          "status",
          "total_qty",
          "net_total",
        ]),
        order_by: "posting_date desc",
        limit_page_length: 10, 
      };

      const res = await api.get("/api/resource/Sales Invoice", params);

      setInvoices(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);


  const quickActions = [
    { label: "Generate Invoice", icon: FileText },
    { label: "View Reports", icon: TrendingUp },
    { label: "Payment History", icon: Calendar },
  ];

  return (
    <Layout>
      <BillingContainer>
        <HeaderSection>
          <TitleSection>
            <Title>Billing</Title>
            <Subtitle>Manage invoices, payments, and financial records.</Subtitle>
          </TitleSection>
          <ButtonGroup>
            <AddButton onClick={() => navigate(`${basePath}/add`)}>
              <Plus />
              Add Billing
            </AddButton>
            <ExportButton>
              <Download />
              Export Report
            </ExportButton>
          </ButtonGroup>
        </HeaderSection>

        <SummaryCards>
          {summaryData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <SummaryCard key={index}>
                <CardHeader>
                  <CardLabel>{item.label}</CardLabel>
                  <CardIcon bgColor={item.bgColor} color={item.color}>
                    <IconComponent />
                  </CardIcon>
                </CardHeader>
                <CardValue>{item.value}</CardValue>
                <CardChange positive={item.positive}>
                  <TrendingUp size={12} />
                  {item.change}
                </CardChange>
              </SummaryCard>
            );
          })}
        </SummaryCards>

        <BillingSection>
          <RecentInvoices>
            <SectionHeader>
              <SectionTitle>Recent Invoices</SectionTitle>
              <ViewAllLink>View All</ViewAllLink>
            </SectionHeader>
            <InvoiceList>
              {loading && <div>Loading invoices...</div>}

              {!loading &&
                invoices.map((invoice) => (
                  <InvoiceItem key={invoice.name}>
                    <InvoiceLeft>
                      <InvoiceId>{invoice.name}</InvoiceId>
                      <InvoicePatient>{invoice.patient_name}</InvoicePatient>
                    </InvoiceLeft>

                    <InvoiceRight>
                      <InvoiceAmount>₹{invoice.net_total.toFixed(2)}</InvoiceAmount>
                      <InvoiceStatus variant={invoice.status.toLowerCase()}>
                        {invoice.status}
                      </InvoiceStatus>
                    </InvoiceRight>
                  </InvoiceItem>
                ))}
            </InvoiceList>

          </RecentInvoices>

          <QuickActions>
            <SectionTitle>Quick Actions</SectionTitle>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <ActionButton key={index}>
                  <IconComponent />
                  <ActionLabel>{action.label}</ActionLabel>
                </ActionButton>
              );
            })}
          </QuickActions>
        </BillingSection>
      </BillingContainer>
    </Layout>
  );
};

export default Billing;
