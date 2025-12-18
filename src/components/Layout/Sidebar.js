import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LayoutDashboard, Users, Calendar, FileText, MessageSquare, Building2, FlaskConical, Settings, LogOut, Plus } from "lucide-react";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
`;

const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #4a90e2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333333;
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarBottom = styled.div`
  padding: 20px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 16px 10px 18px;
  color: #333333;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s, color 0.2s;
  gap: 12px;
  border-radius: 50px;
  position: relative;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #eaf4ff;
    color: #4a90e2;

    svg {
      color: #4a90e2;
    }
  }

  svg {
    width: 21px;
    height: 21px;
    color: #333333;
  }
`;

const IconBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.active ? "#d9ebff" : "transparent")};
  transition: background-color 0.2s;
`;

const NavLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/patients", label: "Patients", icon: Users },
    { path: "/pathlab", label: "PathLab", icon: FlaskConical },
    { path: "/consultations", label: "Consultations", icon: MessageSquare },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/billing", label: "Billing", icon: FileText },
    { path: "/clinic-details", label: "Clinic Details", icon: Building2 },
  ];

  const bottomItems = [
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/logout", label: "Logout", icon: LogOut },
  ];

  return (
    <SidebarContainer>
      <SidebarLogo>
        <LogoIcon>
          <Plus size={20} />
        </LogoIcon>
        <LogoText>AutoMedic</LogoText>
      </SidebarLogo>

      <SidebarNav>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          let isActive = location.pathname === item.path;

          // Highlight "Patients" menu item when on patient-related pages
          if (item.path === "/patients") {
            isActive = isActive ||
                      location.pathname === "/patient-registration" ||
                      location.pathname.startsWith("/patients/");
          }

          // Highlight "PathLab" menu item when on pathlab sub-pages
          if (item.path === "/pathlab") {
            isActive = isActive || location.pathname.startsWith("/pathlab/");
          }

          return (
            <NavItem key={item.path} to={item.path} className={isActive ? "active" : ""}>
              <IconBadge active={isActive}>
                <IconComponent />
              </IconBadge>
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          );
        })}
      </SidebarNav>

      <SidebarBottom>
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavItem key={item.path} to={item.path} className={isActive ? "active" : ""}>
              <IconBadge active={isActive}>
                <IconComponent />
              </IconBadge>
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          );
        })}
      </SidebarBottom>
    </SidebarContainer>
  );
};

export default Sidebar;
