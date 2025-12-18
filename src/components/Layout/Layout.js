import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #F6F7F8;
`;

const MainContent = styled.main`
  margin-left: 250px;
  margin-top: 70px;
  padding: 30px;
  min-height: calc(100vh - 70px);
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <Header />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default Layout;
