import React from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import usePageTitle from "../hooks/usePageTitle";
import { Clock } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background-color: #eef4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  svg {
    width: 40px;
    height: 40px;
    color: #4a90e2;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0;
`;

const ComingSoon = () => {
  usePageTitle("Coming Soon");
  return (
    <Layout>
      <Container>
        <IconWrapper>
          <Clock />
        </IconWrapper>
        <Title>Coming Soon</Title>
        <Subtitle>This feature is under development and will be available soon.</Subtitle>
      </Container>
    </Layout>
  );
};

export default ComingSoon;
