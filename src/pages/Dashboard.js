import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

import styled from "styled-components";
import { UserPlus, Users, Receipt, ClipboardCheck, Video, FileBarChart, Mountain, Sun, Search, Users as UsersIcon, IndianRupee, Clock, Pill, CreditCard } from "lucide-react";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: fadeInPage 0.4s ease;

  @keyframes fadeInPage {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? "0" : "12px")});
  transition: opacity 0.5s ease ${(props) => props.delay || 0}s, transform 0.5s ease ${(props) => props.delay || 0}s;
`;

const TopNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  padding: 20px;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const IconCircle = styled.div`
  width: 70px;
  height: 70px;
  background: ${(props) => props.bgColor || "#f1f5f9"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
`;

const IconWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);

  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.iconColor || "#475569"};
  }
`;

const IconWrapperBottom = styled(IconWrapper)`
  transform: translateY(100%);
`;

const NavItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation: navFade 0.45s ease forwards;

  @keyframes navFade {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border-width: 2.5px;
    border-color: ${(props) => props.borderColor || "#3b82f6"};
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${(props) => {
    const color = props.borderColor || "#3b82f6";
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  }};

    ${IconCircle} {
      background: ${(props) => props.hoverBgColor || "#eff6ff"};
      border-color: ${(props) => props.borderColor || "#3b82f6"};
      transform: scale(1.05);
      border-radius: 50%;
    }

    ${IconWrapper} {
      transform: translateY(-100%);
    }

    ${IconWrapperBottom} {
      transform: translateY(0);
    }
  }
`;

const NavLabel = styled.span`
  font-size: 15px;
  color: #475569;
  font-weight: 600;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  z-index: 1000;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  // max-width: 1200px;
  z-index: 1001;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 20px 24px;
  gap: 9px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  position: relative;
  z-index: 1002;

  &:focus-within {
    border-color: #4a90e2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  color: #64748b;
  position: relative;
  z-index: 1;

  svg {
    width: 25px;
    height: 25px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  color: #1e293b;
  background: transparent;
  position: relative;
  z-index: 1;
  font-weight: 500;

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1003;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SearchResultItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }

  &:active {
    background-color: #f1f5f9;
  }
`;

const ResultValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const ResultDescription = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const SearchResultEmpty = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const SearchResultLoading = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  position: relative;
  padding-left: 16px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background: #3b82f6;
    border-radius: 2px;
  }
`;

const DailyInsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 3px solid ${(props) => props.accentColor || "#3b82f6"};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  animation: fadeSlideIn 0.5s ease forwards;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const InsightTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const InsightIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.iconBg || "#f1f5f9"};
  color: ${(props) => props.iconColor || "#475569"};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const InsightValue = styled.span`
  font-size: 32px;
  font-weight: 600;
  color: ${(props) => {
    if (props.color === "orange") return "#f59e0b";
    if (props.color === "green") return "#10b981";
    return "#1e293b";
  }};
  line-height: 1.2;
`;

const DoctorAvailabilityCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 60px 40px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const PlaceholderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #cbd5e0;
  position: relative;
  z-index: 1;

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
  }
`;

const Skeleton = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #ededed 25%, #f7f7f7 37%, #ededed 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 8px;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const SkeletonLine = styled(Skeleton)`
  height: ${(props) => props.height || "12px"};
  width: ${(props) => props.width || "100%"};
`;

const SkeletonBlock = styled(Skeleton)`
  height: ${(props) => props.height || "160px"};
`;

const InsightSkeletonCard = styled.div`
  background-color: #f5f5f5;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f5f5f5",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};


const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const numeric = Number(String(value).replace(/[^0-9.-]+/g, ""));
    const isNumber = !Number.isNaN(numeric);
    if (!isNumber) {
      setDisplayValue(value);
      return;
    }

    const duration = 800;
    const start = performance.now();
    const formatter = String(value).trim().startsWith("₹")
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
      : new Intl.NumberFormat("en-US");

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = Math.floor(progress * numeric);
      setDisplayValue(formatter.format(current));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return displayValue;
};

const Dashboard = () => {
  usePageTitle("Dashboard");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [doctorNameMap, setDoctorNameMap] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  const navItems = [
    { icon: UserPlus, label: "Patient Registration", bgColor: "#eff6ff", iconColor: "#3b82f6", borderColor: "#3b82f6", route: "/patient-registration" },
    { icon: Users, label: "All Patients", bgColor: "#f0f9ff", iconColor: "#0ea5e9", borderColor: "#0ea5e9", route: "/patients" },
    { icon: CreditCard, label: "Billing", bgColor: "#f5f3ff", iconColor: "#8b5cf6", borderColor: "#8b5cf6", route: "/billing" },
    { icon: ClipboardCheck, label: "Pre-Screening", bgColor: "#f0fdf4", iconColor: "#10b981", borderColor: "#10b981", route: "/appointments" },
    { icon: Video, label: "Telemedicine", bgColor: "#fff7ed", iconColor: "#f59e0b", borderColor: "#f59e0b", route: null },
    { icon: FileBarChart, label: "Reports", bgColor: "#fef2f2", iconColor: "#ef4444", borderColor: "#ef4444", route: null },
  ];
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const insights = [
    {
      title: "Total Patients Today",
      value: "124",
      color: "default",
      icon: UsersIcon,
      accentColor: "#3b82f6",
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
    },
    {
      title: "Fees Collected",
      value: "₹8,250",
      color: "default",
      icon: IndianRupee,
      accentColor: "#10b981",
      iconBg: "#f0fdf4",
      iconColor: "#10b981",
    },
    {
      title: "Pending Queue",
      value: "8",
      color: "orange",
      icon: Clock,
      accentColor: "#f59e0b",
      iconBg: "#fffbeb",
      iconColor: "#f59e0b",
    },
    {
      title: "New Prescriptions",
      value: "32",
      color: "green",
      icon: Pill,
      accentColor: "#10b981",
      iconBg: "#f0fdf4",
      iconColor: "#10b981",
    },
  ];
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("https://hms.automedai.in/api/resource/Company");
        const companyList = res.data?.data || [];

        setCompanies(companyList);

        if (companyList.length > 0) {
          setSelectedCompany(companyList[0].name); // ✅ default first company
        }
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };

    fetchCompanies();
  }, []);

  const fetchDoctorName = async (doctorId) => {
    try {
      const res = await fetch(
        `https://hms.automedai.in/api/resource/Healthcare Practitioner/${doctorId}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data?.data?.practitioner_name) {
        setDoctorNameMap((prev) => ({
          ...prev,
          [doctorId]: data.data.practitioner_name,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      if (!selectedCompany || !selectedDate) return;

      try {
        setIsLoading(true);

        const res = await fetch(
          `https://midl.automedai.in/doctor_available/fetch?company=${selectedCompany}&date=${selectedDate}`
        );

        const data = await res.json();

        if (data.success) {
          setAvailableSlots(data.available_slots || []);

          // 🔥 Fetch doctor names
          data.available_slots.forEach((slot) => {
            if (!doctorNameMap[slot.doctor_id]) {
              fetchDoctorName(slot.doctor_id);
            }
          });
        } else {
          setAvailableSlots([]);
        }

      } catch (error) {
        console.error("Doctor availability error:", error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorAvailability();
  }, [selectedCompany, selectedDate]);

  // Search patients function
  const searchPatients = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      console.log("🔍 Searching for patients with query:", query);

      const response = await api.get(API_ENDPOINTS.PATIENTS.SEARCH_LINK, {
        txt: query,
        doctype: "Patient",
        page_length: 500,
      });

      console.log("✅ Search API Response:", response);
      console.log("📊 Search results data:", response.data);

      const results = response.data?.message || response.data?.data || [];

      console.log("📋 Processed search results:", results);
      console.log("📝 First search result:", results[0]);

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error("❌ Error searching patients:", err);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle patient selection from dropdown
  const handlePatientSelect = (patient) => {
    const patientId = patient.value;
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
    // Navigate to patients page with selected patient info
    navigate('/patients', {
      state: {
        selectedPatientId: patientId,
        selectedPatientDescription: patient.description
      }
    });
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchPatients(query);
    }, 500); // Wait 500ms after user stops typing
  };

  useEffect(() => {
    const ids = ["nav", "search", "insights", "doctor"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.sectionid;
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    ids.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  const formatTimeToAMPM = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatSlotName = (slotName) => {
    if (!slotName) return "";

    const parts = slotName.split("_");

    // Remove last part (RKMS)
    parts.pop();

    return parts.join(" ");
  };

  return (
    <Layout>
      <PageWrapper>
        <FadeInWrapper ref={(el) => (sectionRefs.current.nav = el)} data-sectionid="nav" visible={visibleSections.nav} delay={0}>
          <TopNavigation>
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <NavItem
                  key={index}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  borderColor={item.borderColor}
                  hoverBgColor={item.bgColor}
                  onClick={() => item.route && navigate(item.route)}
                >
                  <IconCircle bgColor={item.bgColor}>
                    <>
                      <IconWrapper iconColor={item.iconColor}>
                        <IconComponent style={{ height: "25px", width: "25px" }} />
                      </IconWrapper>
                      <IconWrapperBottom iconColor={item.iconColor}>
                        <IconComponent />
                      </IconWrapperBottom>
                    </>
                  </IconCircle>
                  <NavLabel>{item.label}</NavLabel>
                </NavItem>
              );
            })}
          </TopNavigation>
        </FadeInWrapper>

        <FadeInWrapper ref={(el) => (sectionRefs.current.search = el)} data-sectionid="search" visible={visibleSections.search} delay={0.05} style={{ position: 'relative', zIndex: 1000 }}>
          <SearchBarContainer>
            <SearchWrapper>
              <SearchBar>
                <SearchIcon>
                  <Search />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Search for a patient by name, ID, or phone number"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length >= 2 && searchResults.length > 0 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
              </SearchBar>
              {showSearchResults && (
                <SearchResultsDropdown>
                  {isSearching ? (
                    <SearchResultLoading>Searching...</SearchResultLoading>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((patient, index) => (
                      <SearchResultItem
                        key={index}
                        onMouseDown={() => handlePatientSelect(patient)}
                      >
                        <ResultValue>{patient.description}</ResultValue>
                        <ResultDescription>{patient.value}</ResultDescription>
                      </SearchResultItem>
                    ))
                  ) : (
                    <SearchResultEmpty>No patients found</SearchResultEmpty>
                  )}
                </SearchResultsDropdown>
              )}
            </SearchWrapper>
          </SearchBarContainer>
        </FadeInWrapper>

        <FadeInWrapper ref={(el) => (sectionRefs.current.insights = el)} data-sectionid="insights" visible={visibleSections.insights} delay={0.1} style={{ position: 'relative', zIndex: 1 }}>
          <Section>
            <SectionTitle>Daily Insights</SectionTitle>
            {isLoading ? (
              <DailyInsightsGrid>
                {[0, 1, 2, 3].map((i) => (
                  <InsightSkeletonCard key={i}>
                    <SkeletonLine width="60%" />
                    <SkeletonLine width="40%" height="28px" />
                  </InsightSkeletonCard>
                ))}
              </DailyInsightsGrid>
            ) : (
              <DailyInsightsGrid>
                {insights.map((insight, index) => {
                  const IconComponent = insight.icon;
                  return (
                    <InsightCard key={index} style={{ animationDelay: `${index * 0.05}s` }} accentColor={insight.accentColor}>
                      <InsightTitle>
                        <InsightIconWrapper iconBg={insight.iconBg} iconColor={insight.iconColor}>
                          <IconComponent />
                        </InsightIconWrapper>
                        <span>{insight.title}</span>
                      </InsightTitle>
                      <InsightValue color={insight.color}>
                        <AnimatedNumber value={insight.value} />
                      </InsightValue>
                    </InsightCard>
                  );
                })}
              </DailyInsightsGrid>
            )}
          </Section>
        </FadeInWrapper>

        <FadeInWrapper ref={(el) => (sectionRefs.current.doctor = el)} data-sectionid="doctor" visible={visibleSections.doctor} delay={0.15} style={{ position: 'relative', zIndex: 1 }}>
          <Section>
            <SectionTitle>Doctor Availability</SectionTitle>

            {/* 🔥 Controls */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
              >
                {companies.map((company, index) => (
                  <option key={index} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
              />
            </div>

            {isLoading ? (
              <DoctorAvailabilityCard>
                <SkeletonBlock height="120px" style={{ width: "100%" }} />
              </DoctorAvailabilityCard>
            ) : (
              <DoctorAvailabilityCard>
                {availableSlots.length === 0 ? (
                  <p>No doctors available.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Doctor ID</th>
                        <th style={thStyle}>Doctor Name</th>
                        <th style={thStyle}>Company</th>
                        <th style={thStyle}>Available Date</th>
                        <th style={thStyle}>Start Time</th>
                        <th style={thStyle}>End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableSlots.map((slot) => (
                        <tr key={slot.id}>
                          <td style={tdStyle}>{slot.doctor_id}</td>
                          <td style={tdStyle}>
                            {doctorNameMap[slot.doctor_id] || "Loading..."}
                          </td>
                          <td style={tdStyle}>{slot.company}</td>
                          <td style={tdStyle}>
                            {new Date(slot.available_date).toLocaleDateString("en-IN")}
                          </td>
                          <td style={tdStyle}>{formatTimeToAMPM(slot.start_time)}</td>
                          <td style={tdStyle}>{formatTimeToAMPM(slot.end_time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </DoctorAvailabilityCard>
            )}
          </Section>

        </FadeInWrapper>
      </PageWrapper>
    </Layout>
  );
};

export default Dashboard;
