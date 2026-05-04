import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import { apiService } from "../../services/api";

const LayoutContainer = styled.div`
  min-height: 90vh;
  background-color: #F6F7F8;
`;

const MainContent = styled.main`
  margin-left: 250px;
  margin-top: 70px;
  padding: 30px;
  min-height: calc(100vh - 70px);
`;

const Layout = ({ children }) => {

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) return;

    const checkSession = () => {
      const expiry = localStorage.getItem("sessionExpiry");

      if (!expiry) return;

      if (Date.now() > Number(expiry)) {
        console.log("⏳ Session expired (client-side)");

        localStorage.clear();
        window.location.href = "/login";
      }
    };

    const interval = setInterval(() => {
      checkSession();

      // Optional: also validate session with backend
      apiService
        .get("/method/frappe.auth.get_logged_user")
        .catch(() => {
          console.log("Session check failed");
        });
    }, 10 * 1000); // every 10 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <LayoutContainer>
      <Sidebar />
      <Header />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default Layout;
