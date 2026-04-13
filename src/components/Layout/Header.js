import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { User, Bell } from "lucide-react";
import api from "../../services/api";

const HeaderContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  padding-top: 4px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  margin-left: 250px;
`;

const Breadcrumbs = styled.div`
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 40px;
    object-fit: contain;
  }
`;

const BreadcrumbHome = styled.span`
  color: #999999;
`;

const BreadcrumbSeparator = styled.span`
  color: #999999;
`;

const BreadcrumbPage = styled.span`
  color: #000000;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    width: 25px;
    height: 25px;
    color: #666666;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #ffffff;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d4a574;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AvatarIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Header = () => {
  const location = useLocation();
  const [logo, setLogo] = useState(
    () => localStorage.getItem("company_logo") || ""
  );

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        // ✅ 1. Check cache first
        const cachedLogo = localStorage.getItem("company_logo");
        if (cachedLogo) {
          setLogo(cachedLogo);
          return; // 🚀 stop here (no API call)
        }

        // Step 2: Get company name
        const res = await api.get(
          "https://hms.automedai.in/api/resource/Company"
        );

        const companyName = res.data.data[0]?.name;
        if (!companyName) return;

        // Step 3: Get company details
        const companyRes = await api.get(
          `https://hms.automedai.in/api/resource/Company/${encodeURIComponent(
            companyName
          )}`
        );

        const logoPath = companyRes.data.data.company_logo;

        if (logoPath) {
          const fullLogo = `https://hms.automedai.in${logoPath}`;

          // ✅ 2. Save in cache
          localStorage.setItem("company_logo", fullLogo);

          setLogo(fullLogo);
        }
      } catch (error) {
        console.error("Error fetching company logo:", error);
      }
    };

    fetchCompanyLogo();
  }, []);

  const getBreadcrumbs = () => {
    const path = location.pathname;
    // Hide breadcrumbs for patient detail pages (they have their own custom breadcrumbs)
    if (path.startsWith("/patients/") && path !== "/patients") return { pages: [] };

    // Handle lab test result pages
    if (path.match(/^\/pathlab\/labtest\/.*\/result$/)) return { pages: ["PathLab", "Lab Test Results"] };

    if (path === "/login") return { pages: ["Login"] };
    if (path === "/dashboard") return { pages: ["Dashboard"] };
    if (path === "/patients") return { pages: ["Patients"] };
    if (path === "/patient-registration") return { pages: ["Patients", "Patient Registration"] };

    // OPD routes
    if (path === "/opd") return { pages: ["OPD", "Dashboard"] };
    if (path === "/opd/patient-registration") return { pages: ["OPD", "Patient Registration"] };
    if (path === "/opd/billing") return { pages: ["OPD", "Billing"] };
    if (path === "/opd/billing/add") return { pages: ["OPD", "Billing", "Add Billing"] };
    if (path === "/opd/appointments") return { pages: ["OPD", "Appointments"] };
    if (path === "/opd/consultation") return { pages: ["OPD", "Consultation"] };
    if (path === "/opd/telemedicine") return { pages: ["OPD", "Telemedicine"] };
    if (path === "/opd/recent-opd-patients") return { pages: ["OPD", "Recent OPD Patients"] };
    if (path === "/opd/admin") return { pages: ["OPD", "Admin"] };
    if (path === "/opd/admin/empanel-doctors") return { pages: ["OPD", "Admin", "Empanel Doctors"] };

    if (path === "/pathlab") return { pages: ["PathLab", "Dashboard"] };
    if (path === "/pathlab/patient-registration") return { pages: ["PathLab", "Patient Registration"] };
    if (path === "/pathlab/billing") return { pages: ["PathLab", "Billing"] };
    if (path === "/pathlab/recent-pathlab-patients") return { pages: ["OPD", "Recent PathLab Patients"] };
    if (path === "/pathlab/patients") return { pages: ["PathLab", "Patients"] };
    if (path === "/pathlab/collection") return { pages: ["PathLab", "Sample Collection"] };
    if (path === "/pathlab/collection/new") return { pages: ["PathLab", "Sample Collection"] };
    if (path === "/pathlab/labtest") return { pages: ["PathLab", "Lab Test List"] };
    if (path === "/pathlab/labtest/new") return { pages: ["PathLab", "Add Lab Test"] };
    if (path === "/pathlab/results") return { pages: ["PathLab", "Lab Test Results"] };
    if (path === "/pathlab/admin") return { pages: ["PathLab", "Admin"] };
    if (path === "/pathlab/admin/test-manage") return { pages: ["PathLab", "Admin", "Test Manage"] };
    if (path === "/pathlab/admin/test-manage/add") return { pages: ["PathLab", "Admin", "Test Manage", "Add Test"] };

    if (path === "/consultations") return { pages: ["Consultations"] };
    if (path === "/appointments") return { pages: ["Appointments"] };
    if (path === "/billing") return { pages: ["Billing"] };
    if (path === "/clinic-details") return { pages: ["Clinic Details"] };
    if (path === "/settings") return { pages: ["Settings"] };
    return { pages: [] };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* LEFT - Breadcrumbs */}
        <Breadcrumbs>
          <BreadcrumbHome>Home</BreadcrumbHome>
          {breadcrumbs.pages.map((page, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              {index === breadcrumbs.pages.length - 1 ? <BreadcrumbPage>{page}</BreadcrumbPage> : <BreadcrumbHome>{page}</BreadcrumbHome>}
            </React.Fragment>
          ))}
        </Breadcrumbs>
        {/* CENTER - LOGO */}
        <LogoWrapper>
          {logo && <img src={logo} alt="Company Logo" />}
        </LogoWrapper>
        <HeaderRight>
          <NotificationIcon onClick={() => console.log("Notifications clicked")}>
            <Bell />
            <NotificationBadge />
          </NotificationIcon>
          <UserAvatar>
            <AvatarIconWrapper>
              <User />
            </AvatarIconWrapper>
          </UserAvatar>
        </HeaderRight>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
