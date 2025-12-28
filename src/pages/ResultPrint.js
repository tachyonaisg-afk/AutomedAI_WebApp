import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Printer, Download } from "lucide-react";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;

  @media print {
    background-color: #ffffff;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background-color: #ffffff;
  padding: 24px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media print {
    display: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  @media print {
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media print {
    display: none;
  }
`;

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;

  a {
    color: #4a90e2;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    margin: 0 8px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 8px 0 0 0;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectedCount = styled.span`
  color: #4a90e2;
  font-weight: 500;
`;

const GroupLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #999999;
  text-transform: uppercase;
  margin: 20px 0 12px 0;

  &:first-child {
    margin-top: 0;
  }
`;

const TestItem = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.selected ? "#f0f7ff" : "#ffffff")};
  border-color: ${(props) => (props.selected ? "#4a90e2" : "#e0e0e0")};

  &:hover {
    border-color: #4a90e2;
    background-color: #f0f7ff;
  }

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      border-color: #e0e0e0;
      background-color: #ffffff;
    }
  `}
`;

const TestItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const Checkbox = styled.input`
  margin-top: 2px;
  cursor: pointer;
`;

const TestItemContent = styled.div`
  flex: 1;
`;

const PatientName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
`;

const TestInfo = styled.div`
  font-size: 12px;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
`;

const TestId = styled.span`
  font-size: 11px;
  color: #999999;
`;

const PreviewCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media print {
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;

  @media print {
    display: none;
  }
`;

const PreviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #4a90e2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PrintButton = styled(Button)`
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

const DownloadButton = styled(Button)`
  background-color: #4a90e2;
  color: #ffffff;

  &:hover {
    background-color: #357abd;
  }
`;

const ReportPreview = styled.div`
  padding: 40px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 600px;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #333333;
`;

const ClinicInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const ClinicLogo = styled.div`
  width: 50px;
  height: 50px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &::after {
    content: "+";
    color: #ffffff;
    font-size: 32px;
    font-weight: 300;
  }
`;

const ClinicDetails = styled.div``;

const ClinicName = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  text-transform: uppercase;
`;

const ClinicAddress = styled.p`
  font-size: 11px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
`;

const ReportTitle = styled.div`
  text-align: right;
`;

const ReportLabel = styled.div`
  font-size: 14px;
  color: #999999;
  letter-spacing: 2px;
  font-weight: 300;
`;

const ReportId = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 4px;
`;

const ReportDate = styled.div`
  font-size: 11px;
  color: #666666;
  margin-top: 4px;
`;

const PatientInfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

const InfoField = styled.div``;

const InfoLabel = styled.div`
  font-size: 10px;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 500;
`;

const TestSection = styled.div`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TestSectionHeader = styled.div`
  margin-bottom: 16px;
`;

const TestName = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  text-transform: uppercase;
`;

const TestCategory = styled.div`
  font-size: 11px;
  color: #999999;
  text-align: right;
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px 12px;
  background-color: #f5f5f5;
  font-size: 11px;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e0e0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 13px;
  color: #333333;
`;

const AbnormalValue = styled.span`
  color: #dc2626;
  font-weight: 600;
`;

const ReportFooter = styled.div`
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const FooterNote = styled.div`
  font-size: 10px;
  color: #999999;
  max-width: 60%;
  line-height: 1.5;
`;

const Signature = styled.div`
  text-align: center;
`;

const SignatureName = styled.div`
  font-family: "Brush Script MT", cursive;
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const SignatureDetails = styled.div`
  border-top: 1px solid #333333;
  padding-top: 8px;
  font-size: 11px;
  color: #333333;
  font-weight: 600;
`;

const SignatureTitle = styled.div`
  font-size: 10px;
  color: #666666;
  margin-top: 2px;
`;

const ResultPrint = () => {
  const navigate = useNavigate();

  // Sample data - replace with API call later
  const [tests, setTests] = useState([
    {
      id: "LT001",
      patientId: "P00123",
      patientName: "John Doe",
      testName: "Complete Blood Count",
      date: "2023-10-27",
      selected: true,
      disabled: false,
    },
    {
      id: "LT002",
      patientId: "P00123",
      patientName: "John Doe",
      testName: "Lipid Panel",
      date: "2023-10-27",
      selected: true,
      disabled: false,
    },
    {
      id: "LT003",
      patientId: "P00124",
      patientName: "Emily White",
      testName: "Urinalysis",
      date: "2023-10-27",
      selected: false,
      disabled: true,
    },
    {
      id: "LT004",
      patientId: "P00125",
      patientName: "Michael Brown",
      testName: "Lipid Panel",
      date: "2023-10-26",
      selected: false,
      disabled: true,
    },
    {
      id: "LT005",
      patientId: "P00126",
      patientName: "Jessica Green",
      testName: "Thyroid Function Test",
      date: "2023-10-26",
      selected: false,
      disabled: true,
    },
  ]);

  const toggleTestSelection = (testId) => {
    setTests(
      tests.map((test) =>
        test.id === testId && !test.disabled
          ? { ...test, selected: !test.selected }
          : test
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log("Download PDF");
  };

  const selectedTests = tests.filter((test) => test.selected);
  const activeTests = tests.filter((test) => !test.disabled);
  const disabledTests = tests.filter((test) => test.disabled);

  return (
    <Container>
      <Sidebar>
        <Breadcrumb>
          <a onClick={() => navigate("/pathlab")}>PathLab</a>
          <span>/</span>
          <span>Result Print</span>
        </Breadcrumb>

        <SectionTitle>
          Test Selection List
          <SelectedCount>{selectedTests.length} Selected</SelectedCount>
        </SectionTitle>

        <GroupLabel>Active Group</GroupLabel>
        {activeTests.map((test) => (
          <TestItem
            key={test.id}
            selected={test.selected}
            onClick={() => toggleTestSelection(test.id)}
          >
            <TestItemHeader>
              <Checkbox
                type="checkbox"
                checked={test.selected}
                onChange={() => toggleTestSelection(test.id)}
              />
              <TestItemContent>
                <PatientName>{test.patientName}</PatientName>
                <TestInfo>
                  <span>{test.date}</span>
                  <span>-</span>
                  <span>{test.testName}</span>
                </TestInfo>
                <TestId>{test.id}</TestId>
              </TestItemContent>
            </TestItemHeader>
          </TestItem>
        ))}

        {disabledTests.length > 0 && (
          <>
            <GroupLabel>Other Patients (Disabled)</GroupLabel>
            {disabledTests.map((test) => (
              <TestItem key={test.id} disabled>
                <TestItemHeader>
                  <Checkbox type="checkbox" disabled />
                  <TestItemContent>
                    <PatientName>{test.patientName}</PatientName>
                    <TestInfo>
                      <span>{test.date}</span>
                      <span>-</span>
                      <span>{test.testName}</span>
                    </TestInfo>
                    <TestId>{test.id}</TestId>
                  </TestItemContent>
                </TestItemHeader>
              </TestItem>
            ))}
          </>
        )}
      </Sidebar>

      <MainContent>
        <Header>
          <div>
            <Title>Result Print</Title>
            <Subtitle>Select patient tests to combine into a single report.</Subtitle>
          </div>
        </Header>

        <PreviewCard>
          <PreviewHeader>
            <PreviewTitle>Combined Report Preview</PreviewTitle>
            <ButtonGroup>
              <PrintButton onClick={handlePrint}>
                <Printer />
                Print
              </PrintButton>
              <DownloadButton onClick={handleDownloadPDF}>
                <Download />
                Download PDF
              </DownloadButton>
            </ButtonGroup>
          </PreviewHeader>

          <ReportPreview>
            <ReportHeader>
              <ClinicInfo>
                <ClinicLogo />
                <ClinicDetails>
                  <ClinicName>Automedic Clinic</ClinicName>
                  <ClinicAddress>
                    123 Healthcare Ave, Medical District, NY 10012
                    <br />
                    Phone: (555) 123-4567 | Email: info@automedic.com
                  </ClinicAddress>
                </ClinicDetails>
              </ClinicInfo>
              <ReportTitle>
                <ReportLabel>LAB REPORT</ReportLabel>
                <ReportId>#RPT-2023-R021</ReportId>
                <ReportDate>Date: Oct 27, 2023</ReportDate>
              </ReportTitle>
            </ReportHeader>

            <PatientInfoSection>
              <InfoField>
                <InfoLabel>Patient Name</InfoLabel>
                <InfoValue>John Doe</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Ref Doctor</InfoLabel>
                <InfoValue>Dr. Sarah Smith</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Patient ID</InfoLabel>
                <InfoValue>P00123</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Sample Date</InfoLabel>
                <InfoValue>2023-10-27 09:45 AM</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Age / Gender</InfoLabel>
                <InfoValue>35 Yrs / Male</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Report Status Date</InfoLabel>
                <InfoValue>2023-10-27</InfoValue>
              </InfoField>
            </PatientInfoSection>

            {selectedTests.map((test, index) => (
              <TestSection key={test.id}>
                <TestSectionHeader>
                  <TestName>{test.testName}</TestName>
                  <TestCategory>
                    {test.testName === "Complete Blood Count"
                      ? "Hematol. Automated Cell Counter"
                      : "Medical Spectrophotometry"}
                  </TestCategory>
                </TestSectionHeader>

                {test.testName === "Complete Blood Count" && (
                  <ResultsTable>
                    <thead>
                      <tr>
                        <TableHeader>Test Parameter</TableHeader>
                        <TableHeader>Result</TableHeader>
                        <TableHeader>Units</TableHeader>
                        <TableHeader>Reference Interval</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow>
                        <TableCell>Hemoglobin</TableCell>
                        <TableCell>14.5</TableCell>
                        <TableCell>g/dL</TableCell>
                        <TableCell>13.5 - 17.5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Red Blood Cell Count (RBC)</TableCell>
                        <TableCell>5.1</TableCell>
                        <TableCell>mill/mm3</TableCell>
                        <TableCell>4.5 - 5.5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>White Blood Cell Count (WBC)</TableCell>
                        <TableCell>7.2</TableCell>
                        <TableCell>thou/mm3</TableCell>
                        <TableCell>4.5 - 11.0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Platelet Count</TableCell>
                        <TableCell>250</TableCell>
                        <TableCell>thou/mm3</TableCell>
                        <TableCell>150 - 450</TableCell>
                      </TableRow>
                    </tbody>
                  </ResultsTable>
                )}

                {test.testName === "Lipid Panel" && (
                  <ResultsTable>
                    <thead>
                      <tr>
                        <TableHeader>Test Parameter</TableHeader>
                        <TableHeader>Result</TableHeader>
                        <TableHeader>Units</TableHeader>
                        <TableHeader>Reference Interval</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow>
                        <TableCell>Total Cholesterol</TableCell>
                        <TableCell>
                          <AbnormalValue>220 (High)</AbnormalValue>
                        </TableCell>
                        <TableCell>mg/dL</TableCell>
                        <TableCell>&lt; 200</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>HDL Cholesterol</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>mg/dL</TableCell>
                        <TableCell>&gt; 40</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>LDL Cholesterol (Calc)</TableCell>
                        <TableCell>
                          <AbnormalValue>135 (High)</AbnormalValue>
                        </TableCell>
                        <TableCell>mg/dL</TableCell>
                        <TableCell>&lt; 100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Triglycerides</TableCell>
                        <TableCell>140</TableCell>
                        <TableCell>mg/dL</TableCell>
                        <TableCell>&lt; 150</TableCell>
                      </TableRow>
                    </tbody>
                  </ResultsTable>
                )}
              </TestSection>
            ))}

            <ReportFooter>
              <FooterNote>
                This report is electronically generated by AutoMedic Assistant and is
                valid without a physical signature. Verified by system as per of 10-27.
              </FooterNote>
              <Signature>
                <SignatureName>James Wilson</SignatureName>
                <SignatureDetails>
                  JAMES WILSON, M.SC
                  <SignatureTitle>Senior Lab Technician</SignatureTitle>
                </SignatureDetails>
              </Signature>
            </ReportFooter>
          </ReportPreview>
        </PreviewCard>
      </MainContent>
    </Container>
  );
};

export default ResultPrint;
