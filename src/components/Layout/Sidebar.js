import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  FlaskConical,
  Settings,
  LogOut,
  ChevronDown,
  TestTubes,
  ClipboardList,
  FileCheck,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Video,
  BarChart3
} from "lucide-react";

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

const SidebarLogo = styled(Link)`
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
`;

const LogoIcon = styled.img`
  width: 180px;
  height: auto;
  object-fit: contain;
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 4px;
  }
`;

const SidebarBottom = styled.div`
  padding: 20px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #555555;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 12px;
  border-radius: 10px;
  position: relative;

  &:hover {
    background-color: #f5f7fa;
    color: #333333;
  }

  &.active {
    background-color: #eef4ff;
    color: #4a90e2;

    svg {
      color: #4a90e2;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #555555;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
  border-radius: 10px;
  position: relative;
  user-select: none;

  &:hover {
    background-color: #f5f7fa;
    color: #333333;
  }

  &.active {
    background-color: #eef4ff;
    color: #4a90e2;

    & > svg {
      color: #4a90e2;
    }
  }

  & > svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const DropdownArrow = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};

  svg {
    width: 16px;
    height: 16px;
    color: #888888;
  }
`;

const DropdownContent = styled.div`
  overflow: hidden;
  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  height: ${(props) => props.$height}px;
`;

const DropdownInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0 8px 16px;
  margin-left: 10px;
  border-left: 2px solid #e8e8e8;
`;

const SubNavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  color: #666666;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 10px;
  border-radius: 8px;
  font-size: 13px;
  position: relative;

  &:hover {
    background-color: #f5f7fa;
    color: #333333;
  }

  &.active {
    background-color: #eef4ff;
    color: #4a90e2;

    svg {
      color: #4a90e2;
    }

    &::before {
      content: '';
      position: absolute;
      left: -18px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background-color: #4a90e2;
      border-radius: 50%;
    }
  }

  svg {
    width: 18px;
    height: 18px;
    color: #888888;
    flex-shrink: 0;
  }
`;

const NavLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubNavLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sidebar = () => {
  const location = useLocation();

  // OPD dropdown state
  const isOPDActive = location.pathname.startsWith("/opd");
  const [isOPDOpen, setIsOPDOpen] = useState(isOPDActive);
  const [opdDropdownHeight, setOPDDropdownHeight] = useState(isOPDActive ? "auto" : 0);
  const opdDropdownRef = useRef(null);
  const isOPDInitialMount = useRef(true);

  // PathLab dropdown state
  const isPathLabActive = location.pathname.startsWith("/pathlab");
  const [isPathLabOpen, setIsPathLabOpen] = useState(isPathLabActive);
  const [dropdownHeight, setDropdownHeight] = useState(isPathLabActive ? "auto" : 0);
  const dropdownRef = useRef(null);
  const isInitialMount = useRef(true);

  const menuItems = [
    { path: "/patients", label: "Patients", icon: Users },
  ];

  // OPD submenu items
  const opdSubItems = [
    { path: "/opd", label: "Dashboard", icon: LayoutDashboard },
    { path: "/opd/patient-registration", label: "Patient Registration", icon: UserPlus },
    { path: "/opd/billing", label: "Billing", icon: FileText },
    { path: "/opd/appointments", label: "Appointments", icon: Calendar },
    { path: "/opd/consultation", label: "Consultation", icon: MessageSquare },
    { path: "/opd/telemedicine", label: "Telemedicine", icon: Video },
  ];

  const pathLabSubItems = [
    { path: "/pathlab", label: "Dashboard", icon: LayoutDashboard },
    { path: "/pathlab/patient-registration", label: "Patient Registration", icon: UserPlus },
    { path: "/pathlab/billing", label: "Billing", icon: FileText },
    { path: "/pathlab/collection", label: "Sample Collection", icon: TestTubes },
    { path: "/pathlab/labtest", label: "Lab Tests", icon: ClipboardList },
    { path: "/pathlab/results", label: "Test Results", icon: FileCheck },
    { path: "/pathlab/admin", label: "Admin", icon: ShieldCheck },
  ];

  const menuItemsAfterPathLab = [
    // { path: "/consultations", label: "Consultations", icon: MessageSquare },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    // { path: "/clinic-details", label: "Clinic Details", icon: Building2 },
  ];

  const bottomItems = [
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/logout", label: "Logout", icon: LogOut },
  ];

  // Calculate OPD dropdown height for smooth animation
  useEffect(() => {
    if (opdDropdownRef.current) {
      if (isOPDOpen) {
        const height = opdDropdownRef.current.scrollHeight;
        setOPDDropdownHeight(height);
      } else {
        setOPDDropdownHeight(0);
      }
    }
  }, [isOPDOpen]);

  // Set initial height on mount if OPD is active
  useEffect(() => {
    if (isOPDInitialMount.current && opdDropdownRef.current && isOPDActive) {
      setOPDDropdownHeight(opdDropdownRef.current.scrollHeight);
      isOPDInitialMount.current = false;
    }
  }, [isOPDActive]);

  // Calculate PathLab dropdown height for smooth animation
  useEffect(() => {
    if (dropdownRef.current) {
      if (isPathLabOpen) {
        const height = dropdownRef.current.scrollHeight;
        setDropdownHeight(height);
      } else {
        setDropdownHeight(0);
      }
    }
  }, [isPathLabOpen]);

  // Set initial height on mount if pathlab is active
  useEffect(() => {
    if (isInitialMount.current && dropdownRef.current && isPathLabActive) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
      isInitialMount.current = false;
    }
  }, [isPathLabActive]);

  const renderNavItem = (item) => {
    const IconComponent = item.icon;
    let isActive = location.pathname === item.path;

    if (item.path === "/patients") {
      isActive = isActive ||
                location.pathname === "/patient-registration" ||
                location.pathname.startsWith("/patients/");
    }

    return (
      <NavItem key={item.path} to={item.path} className={isActive ? "active" : ""}>
        <IconComponent />
        <NavLabel>{item.label}</NavLabel>
      </NavItem>
    );
  };

  return (
    <SidebarContainer>
      <SidebarLogo to="/opd">
        <LogoIcon src="/Logo_light_web.png" alt="Logo" />
      </SidebarLogo>

      <SidebarNav>
        {menuItems.map(renderNavItem)}

        {/* OPD Dropdown */}
        <DropdownWrapper>
          <DropdownHeader
            className={isOPDActive ? "active" : ""}
            onClick={() => setIsOPDOpen(!isOPDOpen)}
          >
            <Stethoscope />
            <NavLabel>OPD</NavLabel>
            <DropdownArrow $isOpen={isOPDOpen}>
              <ChevronDown />
            </DropdownArrow>
          </DropdownHeader>

          <DropdownContent $height={opdDropdownHeight}>
            <DropdownInner ref={opdDropdownRef}>
              {opdSubItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SubNavItem
                    key={item.path}
                    to={item.path}
                    className={isActive ? "active" : ""}
                  >
                    <IconComponent />
                    <SubNavLabel>{item.label}</SubNavLabel>
                  </SubNavItem>
                );
              })}
            </DropdownInner>
          </DropdownContent>
        </DropdownWrapper>

        {/* PathLab Dropdown */}
        <DropdownWrapper>
          <DropdownHeader
            className={isPathLabActive ? "active" : ""}
            onClick={() => setIsPathLabOpen(!isPathLabOpen)}
          >
            <FlaskConical />
            <NavLabel>PathLab</NavLabel>
            <DropdownArrow $isOpen={isPathLabOpen}>
              <ChevronDown />
            </DropdownArrow>
          </DropdownHeader>

          <DropdownContent $height={dropdownHeight}>
            <DropdownInner ref={dropdownRef}>
              {pathLabSubItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SubNavItem
                    key={item.path}
                    to={item.path}
                    className={isActive ? "active" : ""}
                  >
                    <IconComponent />
                    <SubNavLabel>{item.label}</SubNavLabel>
                  </SubNavItem>
                );
              })}
            </DropdownInner>
          </DropdownContent>
        </DropdownWrapper>

        {menuItemsAfterPathLab.map(renderNavItem)}
      </SidebarNav>

      <SidebarBottom>
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavItem key={item.path} to={item.path} className={isActive ? "active" : ""}>
              <IconComponent />
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          );
        })}
      </SidebarBottom>
    </SidebarContainer>
  );
};

export default Sidebar;
