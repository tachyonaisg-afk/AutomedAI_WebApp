import React from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { ShieldCheck } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ContentCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 300px;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background-color: #fff3e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff9800;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const Message = styled.p`
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin: 0;
`;

const PathLabAdmin = () => {
  usePageTitle("PathLab Admin");
  return (
    <Layout>
      <Container>
        <Title>PathLab Admin</Title>
        <ContentCard>
          <IconWrapper>
            <ShieldCheck />
          </IconWrapper>
          <Message>PathLab Admin settings coming soon.</Message>
        </ContentCard>
      </Container>
    </Layout>
  );
};

export default PathLabAdmin;
