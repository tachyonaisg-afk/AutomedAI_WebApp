import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Upload } from "lucide-react";
import api from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

const ResultContainer = styled.div`
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

const PatientInfoCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #666666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #333333;
  font-weight: 600;
`;

const ResultsTable = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #333333;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
    text-align: center;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333333;

  &:first-child {
    padding-left: 24px;
    font-weight: 500;
  }

  &:last-child {
    padding-right: 24px;
    text-align: center;
  }
`;

const ResultInput = styled.input`
  width: 100%;
  max-width: 150px;
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.isAbnormal ? "#dc2626" : "#e0e0e0")};
  border-radius: 6px;
  font-size: 14px;
  color: ${(props) => (props.isAbnormal ? "#dc2626" : "#333333")};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const FlagIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => {
    if (props.flag === "normal") return "#22c55e";
    if (props.flag === "high") return "#dc2626";
    if (props.flag === "low") return "#f59e0b";
    return "#d1d5db";
  }};
  margin: 0 auto;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const NotesCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const SideCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const Select = styled.select`
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const DateInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

const AttachmentsCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4a90e2;
    background-color: #f8f9fa;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const UploadText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const UploadSubtext = styled.p`
  font-size: 12px;
  color: #999999;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.primary {
    background-color: #4a90e2;
    color: white;

    &:hover:not(:disabled) {
      background-color: #357abd;
    }

    &:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #e0e0e0;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  &.outline {
    background-color: #ffffff;
    color: #4a90e2;
    border: 1px solid #4a90e2;

    &:hover {
      background-color: #f0f7ff;
    }
  }
`;
const ReadOnlyField = styled.div`
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
`;


const LabTestResult = () => {
  usePageTitle("Lab Test Result");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const patientId = location.state?.patientId;
  const patientName = location.state?.patientName;

  const [patientData, setPatientData] = useState(null);
  const [labTestData, setLabTestData] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(false);

  // Fetch patient details and lab test details
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) {
        setError("Patient ID not provided");
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Lab Test ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch patient details
        const patientResponse = await api.get(`https://hms.automedai.in/api/resource/Patient/${patientId}`);
        console.log("Patient API Response:", patientResponse);

        if (patientResponse.data && patientResponse.data.data) {
          setPatientData(patientResponse.data.data);
        }

        // Fetch lab test details
        const labTestResponse = await api.get(`https://hms.automedai.in/api/resource/Lab Test/${id}`);
        console.log("Lab Test API Response:", labTestResponse);

        if (labTestResponse.data && labTestResponse.data.data) {
          setLabTestData(labTestResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, id]);

  const [testResults, setTestResults] = useState([]);
  // Helper function to remove prefixes from test names
  const removeTestPrefix = (testName) => {
    if (!testName) return testName;
    return testName.replace(/^(PHC-|LAB-|PLB-)\s*/i, '');
  };

  // Populate test results from lab test data
  useEffect(() => {
    if (labTestData && labTestData.normal_test_items) {
      const formattedResults = labTestData.normal_test_items.map((item) => ({
        parameter: removeTestPrefix(item.lab_test_name) || "",
        value: item.result_value || "",
        unit: item.lab_test_uom || "",
        normalRange: item.normal_range || "",
        flag: "none",
      }));
      setTestResults(formattedResults);
    }
  }, [labTestData]);

  const [formData, setFormData] = useState({
    practitioner_name: labTestData?.practitioner_name || "",
    technicianNotes: "",
    verifiedBy: "",
    reportDate: new Date().toISOString().split('T')[0],
    status: "Under Review",
  });

  // Fetch healthcare practitioners
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await api.get("https://hms.automedai.in/api/resource/Healthcare Practitioner", {
          fields: '["name", "practitioner_name"]',
          limit_page_length: 100,
        });

        console.log("Healthcare Practitioners API Response:", response);

        if (response.data && response.data.data) {
          setPractitioners(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching healthcare practitioners:", err);
      }
    };

    fetchPractitioners();
  }, []);

  // Update form data when lab test data is loaded
  useEffect(() => {
    if (labTestData) {
      setFormData((prev) => ({
        ...prev,
        status: labTestData.status || "Under Review",
        reportDate: labTestData.result_date || new Date().toISOString().split('T')[0],
      }));
    }
  }, [labTestData]);

  const normalizeRange = (range) => {
    if (!range) return "";

    return range
      .replace(/[–—−â€“]/g, "-")
      .replace(/≤/g, "<=")
      .replace(/≥/g, ">=")
      .replace(/,/g, "") 
      .replace(/\/.*$/, "") 
      .toLowerCase()
      .trim();
  };

  const extractGenderRange = (range, sex) => {
    if (!range || !sex) return range;

    const normalized = normalizeRange(range);

    // Match: Male: 7-20 ... OR Female: 7-20 ...
    const regex = new RegExp(
      `${sex.toLowerCase()}\\s*:\\s*([^,]+)`,
      "i"
    );

    const match = normalized.match(regex);
    return match ? match[1].trim() : range;
  };

  const getFlagFromRange = (value, range, sex) => {
    if (value === "" || value === null) return "none";

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "none";

    // 👇 extract correct range first
    const genderRange = extractGenderRange(range, sex);
    const r = normalizeRange(genderRange);

    // ---- Text-based tests ----
    if (
      r.includes("negative") ||
      r.includes("non-reactive") ||
      r.includes("no growth") ||
      r.includes("adequate") ||
      r.includes("normal") ||
      r.includes("report-based")
    ) {
      return "none";
    }

    // ---- Less than ----
    const lessThanMatch = r.match(/<\s*(\d+(\.\d+)?)/);
    if (lessThanMatch) {
      const max = parseFloat(lessThanMatch[1]);
      return numValue > max ? "high" : "normal";
    }

    // ---- Greater than ----
    const greaterThanMatch = r.match(/>\s*(\d+(\.\d+)?)/);
    if (greaterThanMatch) {
      const min = parseFloat(greaterThanMatch[1]);
      return numValue < min ? "low" : "normal";
    }

    // ---- Standard range ----
    const rangeMatch = r.match(/(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[3]);

      if (numValue < min) return "low";
      if (numValue > max) return "high";
      return "normal";
    }

    return "none";
  };

  const handleResultChange = (index, value) => {
    const updatedResults = [...testResults];
    updatedResults[index].value = value;

    updatedResults[index].flag = getFlagFromRange(
      value,
      updatedResults[index].normalRange,
      patientData?.sex
    );

    setTestResults(updatedResults);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    // TODO: Implement PDF download
  };

  const handlePreviewReport = () => {
    console.log("Previewing report...");
    // TODO: Implement report preview
  };

  const handlePublishReport = async () => {
    try {
      setPublishing(true);

      // Map testResults to normal_test_items format expected by the API
      const normal_test_items = testResults.map((result) => ({
        lab_test_name: result.parameter,
        result_value: result.value,
        lab_test_uom: result.unit,
        normal_range: result.normalRange,
      }));

      // Prepare the request body
      const requestBody = {
        normal_test_items,
        status: formData.status,
        result_date: formData.reportDate,
      };

      // Add verified_by if selected
      if (formData.verifiedBy) {
        requestBody.employee = formData.verifiedBy;
      }

      // Add technician notes if provided
      if (formData.technicianNotes) {
        requestBody.lab_test_comment = formData.technicianNotes;
      }

      console.log("Publishing report with data:", requestBody);

      // Call the API to update the lab test
      const response = await api.put(
        `https://hms.automedai.in/api/resource/Lab Test/${id}`,
        requestBody
      );

      console.log("Publish response:", response);

      if (response.data) {
        // After successful publish, submit the document (docstatus = 1)
        console.log("Submitting Lab Test document...");
        const submitResponse = await api.put(
          `https://hms.automedai.in/api/resource/Lab Test/${id}`,
          { docstatus: 1 }
        );

        console.log("Submit response:", submitResponse);

        if (submitResponse.data) {
          alert("Report published successfully!");
          navigate("/pathlab/labtest");
        }
      }
    } catch (err) {
      console.error("Error publishing report:", err);
      alert("Failed to publish report. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const isAbnormal = (flag) => {
    return flag === "high" || flag === "low";
  };

  const calculateAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return "";

    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  return (
    <Layout>
      <ResultContainer>
        <PageTitle>Lab Test Result Entry</PageTitle>

        {loading && <div>Loading patient details...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        {!loading && !error && patientData && (
          <PatientInfoCard>
            <InfoItem>
              <InfoLabel>Patient Name</InfoLabel>
              <InfoValue>{patientData.patient_name || patientName || "N/A"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Patient ID</InfoLabel>
              <InfoValue>{patientData.name || patientId || "N/A"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Age & Gender</InfoLabel>
              <InfoValue>
                {patientData.dob
                  ? `${calculateAgeFromDOB(patientData.dob)} years`
                  : "N/A"} / {patientData.sex || "N/A"}

              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Mobile</InfoLabel>
              <InfoValue>{patientData.mobile || "N/A"}</InfoValue>
            </InfoItem>
          </PatientInfoCard>
        )}

        <ResultsTable>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Parameter Name</TableHeaderCell>
                <TableHeaderCell>Result Value</TableHeaderCell>
                <TableHeaderCell>Unit</TableHeaderCell>
                <TableHeaderCell>Normal Range</TableHeaderCell>
                <TableHeaderCell>Flag</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {testResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.parameter}</TableCell>
                  <TableCell>
                    <ResultInput
                      type="text"
                      value={result.value}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      placeholder="Enter value"
                      isAbnormal={isAbnormal(result.flag)}
                    />
                  </TableCell>
                  <TableCell>{result.unit}</TableCell>
                  <TableCell>{result.normalRange}</TableCell>
                  <TableCell>
                    <FlagIndicator flag={result.flag} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResultsTable>

        <BottomSection>
          <NotesCard>
            <CardTitle>Technician Notes</CardTitle>
            <Textarea
              name="technicianNotes"
              value={formData.technicianNotes}
              onChange={handleFormChange}
              placeholder="Add any relevant notes here..."
            />
          </NotesCard>

          <SideCard>
            <FormGroup>
              <Label>Referred By</Label>
              <ReadOnlyField>
                {labTestData?.practitioner_name || "N/A"}
              </ReadOnlyField>
            </FormGroup>

            <FormGroup>
              <Label>Verified By</Label>
              <Select
                name="verifiedBy"
                value={formData.verifiedBy}
                onChange={handleFormChange}
              >
                <option value="">Choose a supervisor</option>
                {practitioners.map((practitioner) => (
                  <option key={practitioner.name} value={practitioner.name}>
                    {practitioner.practitioner_name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Report Date</Label>
              <DateInput
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleFormChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select name="status" value={formData.status} onChange={handleFormChange}>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </Select>
            </FormGroup>
          </SideCard>
        </BottomSection>

        <AttachmentsCard>
          <CardTitle>Attachments</CardTitle>
          <UploadArea>
            <UploadIcon>
              <Upload />
            </UploadIcon>
            <UploadText>Click to upload or drag and drop</UploadText>
            <UploadSubtext>PDF, PNG, JPG (MAX. 5MB)</UploadSubtext>
          </UploadArea>
        </AttachmentsCard>

        <ButtonGroup>
          <Button className="secondary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button className="outline" onClick={handlePreviewReport}>
            Preview Report
          </Button>
          <Button
            className="primary"
            onClick={handlePublishReport}
            disabled={publishing}
          >
            {publishing ? "Publishing..." : "Publish Report"}
          </Button>
        </ButtonGroup>
      </ResultContainer>
    </Layout>
  );
};

export default LabTestResult;
