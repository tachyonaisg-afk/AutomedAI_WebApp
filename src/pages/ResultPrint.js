import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Printer, Download, ArrowLeft } from "lucide-react";
import api from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }

  svg {
    width: 16px;
    height: 16px;
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
  margin-top: 120px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
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
  font-size: 16px;
  color: #999999;
  text-align: center;
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

const ReportFooter = styled.div`
  margin-top: 60px;
  margin-bottom: 100px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const EndOfReport = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 2px solid #e0e0e0;
  letter-spacing: 1px;

  @media print {
    page-break-after: always;
  }
`;

const ResultPrint = () => {
  usePageTitle("Result Print");
  const navigate = useNavigate();
  const location = useLocation();

  const patientId = location.state?.patientId;
  const labTestId = location.state?.labTestId;
  const patientName = location.state?.patientName;

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestDetails, setSelectedTestDetails] = useState([]);

  // Helper function to remove prefixes from test names
  const removeTestPrefix = (testName) => {
    if (!testName) return testName;
    return testName.replace(/^(PHC-|LAB-|PLB-)\s*/i, '');
  };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to format age (extract years only)
  const formatAge = (ageString) => {
    if (!ageString) return "N/A";
    // Extract the number of years from strings like "46 Year(s) 10 Month(s) 11 Day(s)"
    const yearMatch = ageString.match(/(\d+)\s*Year/i);
    if (yearMatch) {
      return `${yearMatch[1]} Years`;
    }
    return ageString;
  };

  // Helper function to format gender
  const formatGender = (gender) => {
    if (!gender) return "N/A";
    const genderLower = gender.toLowerCase();
    if (genderLower === 'female' || genderLower === 'f') return "Female";
    if (genderLower === 'male' || genderLower === 'm') return "Male";
    return gender;
  };

  // Fetch lab tests for the patient
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!patientId) {
        setError("Patient ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("https://hms.automedai.in/api/resource/Lab Test", {
          fields: '["name","patient_name","result_date","lab_test_name"]',
          filters: JSON.stringify([["Lab Test", "patient", "=", patientId],["Lab Test","status","=","Completed"]]),
        });

        console.log("Lab Tests API Response:", response);

        if (response.data && response.data.data) {
          const formattedTests = response.data.data.map((test) => ({
            id: test.name,
            patientId: patientId,
            patientName: test.patient_name || patientName,
            testName: test.lab_test_name || "",
            date: test.result_date || "",
            selected: test.name === labTestId, // Select the current lab test by default
            disabled: false,
          }));
          setTests(formattedTests);
        }
      } catch (err) {
        console.error("Error fetching lab tests:", err);
        setError(err.message || "Failed to load lab tests");
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [patientId, labTestId, patientName]);

  // Fetch detailed lab test data for selected tests
  useEffect(() => {
    const fetchSelectedTestDetails = async () => {
      const selectedTestIds = tests.filter(test => test.selected).map(test => test.id);

      if (selectedTestIds.length === 0) {
        setSelectedTestDetails([]);
        return;
      }

      try {
        const detailsPromises = selectedTestIds.map(testId =>
          api.get(`https://hms.automedai.in/api/resource/Lab Test/${testId}`)
        );

        const responses = await Promise.all(detailsPromises);
        console.log("Selected Test Details API Responses:", responses);

        const details = responses.map(response => response.data?.data).filter(Boolean);
        setSelectedTestDetails(details);
      } catch (err) {
        console.error("Error fetching selected test details:", err);
      }
    };

    fetchSelectedTestDetails();
  }, [tests]);

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

  const handleDownloadPDF = async () => {
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      const element = document.querySelector('[data-pdf-content]');

      if (!element) {
        console.error('PDF content element not found');
        return;
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `lab-report-${patientId || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: [ 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again or use the Print option.');
    }
  };

  const selectedTests = tests.filter((test) => test.selected);
  const activeTests = tests.filter((test) => !test.disabled);
  const disabledTests = tests.filter((test) => test.disabled);

  return (
    <Container>
      <Sidebar>
        <Breadcrumb>
          <button type="button" onClick={() => navigate("/pathlab")} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>PathLab</button>
          <span>/</span>
          <span>Result Print</span>
        </Breadcrumb>

        <SectionTitle>
          Test Selection List
          <SelectedCount>{selectedTests.length} Selected</SelectedCount>
        </SectionTitle>

        {loading && <div style={{ padding: "20px", color: "#666" }}>Loading lab tests...</div>}
        {error && <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>}

        {!loading && !error && activeTests.length > 0 && (
          <>
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
                      <span>{formatDate(test.date)}</span>
                      <span>-</span>
                      <span>{removeTestPrefix(test.testName)}</span>
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
                          <span>{formatDate(test.date)}</span>
                          <span>-</span>
                          <span>{removeTestPrefix(test.testName)}</span>
                        </TestInfo>
                        <TestId>{test.id}</TestId>
                      </TestItemContent>
                    </TestItemHeader>
                  </TestItem>
                ))}
              </>
            )}
          </>
        )}
      </Sidebar>

      <MainContent>
        <Header>
          <div>
            <BackButton onClick={() => navigate("/pathlab/results")}>
              <ArrowLeft />
              Back to Results
            </BackButton>
            <Title style={{ marginTop: "12px" }}>Result Print</Title>
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

          <ReportPreview data-pdf-content>
            <ReportHeader>
              {/* Space reserved for letterhead */}
            </ReportHeader>

            <PatientInfoSection>
              <InfoField>
                <InfoLabel>Patient Name</InfoLabel>
                <InfoValue>{selectedTestDetails[0]?.patient_name || patientName || "N/A"}</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Ref Doctor</InfoLabel>
                <InfoValue>{selectedTestDetails[0]?.referring_practitioner || "N/A"}</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Patient ID</InfoLabel>
                <InfoValue>{selectedTestDetails[0]?.patient || patientId || "N/A"}</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Sample Date</InfoLabel>
                <InfoValue>{formatDate(selectedTestDetails[0]?.submitted_date)}</InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Age / Gender</InfoLabel>
                <InfoValue>
                  {formatAge(selectedTestDetails[0]?.patient_age)} / {formatGender(selectedTestDetails[0]?.patient_sex)}
                </InfoValue>
              </InfoField>
              <InfoField>
                <InfoLabel>Report Status Date</InfoLabel>
                <InfoValue>{formatDate(selectedTestDetails[0]?.result_date)}</InfoValue>
              </InfoField>
            </PatientInfoSection>

            {selectedTestDetails.map((testDetail, index) => (
              <TestSection key={testDetail.name}>
                <TestSectionHeader>
                  <TestName>{removeTestPrefix(testDetail.lab_test_name) || "N/A"}</TestName>
                  <TestCategory>
                    {testDetail.department || "Laboratory Test"}
                  </TestCategory>
                </TestSectionHeader>

                {testDetail.normal_test_items && testDetail.normal_test_items.length > 0 && (
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
                      {testDetail.normal_test_items.map((item, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell>{removeTestPrefix(item.lab_test_name) || "N/A"}</TableCell>
                          <TableCell>{item.result_value || "N/A"}</TableCell>
                          <TableCell>{item.lab_test_uom || ""}</TableCell>
                          <TableCell>{item.normal_range || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </ResultsTable>
                )}
              </TestSection>
            ))}

            <ReportFooter>
              {/* Space reserved for signature */}
            </ReportFooter>

            <EndOfReport>*** END OF REPORT ***</EndOfReport>
          </ReportPreview>
        </PreviewCard>
      </MainContent>
    </Container>
  );
};

export default ResultPrint;
