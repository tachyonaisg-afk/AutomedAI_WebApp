import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { FlaskConical, ClipboardList } from "lucide-react";

const PathLabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 250px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: #4a90e2;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "#eff6ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.1);
  }

  svg {
    width: 40px;
    height: 40px;
    color: ${(props) => props.iconColor || "#4a90e2"};
  }
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  text-align: center;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666666;
  text-align: center;
  margin: 0;
`;

const PathLab = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Collection",
      description: "Manage sample collections and patient data",
      icon: ClipboardList,
      iconColor: "#4a90e2",
      bgColor: "#eff6ff",
      route: "/pathlab/collection",
    },
    {
      title: "Lab Test",
      description: "View and manage laboratory test results",
      icon: FlaskConical,
      iconColor: "#10b981",
      bgColor: "#f0fdf4",
      route: "/pathlab/labtest",
    },
  ];

  return (
    <Layout>
      <PathLabContainer>
        <PageTitle>PathLab</PageTitle>
        <CardsGrid>
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} onClick={() => navigate(card.route)}>
                <IconWrapper bgColor={card.bgColor} iconColor={card.iconColor}>
                  <IconComponent />
                </IconWrapper>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            );
          })}
        </CardsGrid>
      </PathLabContainer>
    </Layout>
  );
};

export default PathLab;
