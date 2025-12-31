import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Calendar, Plus, Minus } from "lucide-react";

const RegistrationContainer = styled.div`
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

const ProgressIndicator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

const ProgressStepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`;

const StepLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#4a90e2" : "#999999")};
  white-space: nowrap;
  cursor: default;
  transition: color 0.2s;
  margin-bottom: 12px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e3f2fd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #4a90e2;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${(props) => {
    if (props.currentStep === 1) return "33.33%";
    if (props.currentStep === 2) return "66.66%";
    if (props.currentStep === 3) return "100%";
    // if (props.currentStep === 4) return "100%";
    return "0%";
  }};
`;

const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const FormInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 40px;
  }

  svg {
    position: absolute;
    right: 12px;
    width: 18px;
    height: 18px;
    color: #999999;
    pointer-events: none;
  }
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #999999;
  margin: -4px 0 0 0;
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999999;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333333;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
`;

const SaveLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 0;
  text-decoration: underline;

  &:hover {
    color: #357abd;
  }
`;

const NextButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const BackButton = styled.button`
  background-color: #f5f5f5;
  color: #333333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333333;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
`;

const ItemsSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 20px;
`;

const ItemsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ItemsTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const ItemButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #4a90e2;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #333333;
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;

  &:first-child {
    padding-left: 16px;
    width: 50px;
  }

  &:last-child {
    text-align: right;
    padding-right: 16px;
  }
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #333333;

  &:first-child {
    padding-left: 16px;
    color: #666666;
  }

  &:last-child {
    text-align: right;
    padding-right: 16px;
    font-weight: 500;
  }
`;

const ItemInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  outline: none;

  &:focus {
    border-color: #4a90e2;
  }
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333333;
`;

const FooterLabel = styled.span`
  font-weight: 500;
`;

const FooterValue = styled.span`
  font-weight: 600;
`;

const DiscountInput = styled.input`
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  outline: none;

  &:focus {
    border-color: #4a90e2;
  }
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CalculationCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
`;

const CalculationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
    padding-top: 16px;
    margin-top: 8px;
    border-top: 2px solid #e0e0e0;
  }
`;

const CalculationLabel = styled.span`
  font-size: 14px;
  color: #666666;
  font-weight: ${(props) => (props.bold ? "600" : "400")};
`;

const CalculationValue = styled.span`
  font-size: 14px;
  color: ${(props) => (props.highlight ? "#4a90e2" : "#333333")};
  font-weight: ${(props) => (props.bold ? "600" : "500")};
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #357abd;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  min-height: 48px;
  align-items: center;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #1565c0;
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 150px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333333;
  padding: 4px;

  &::placeholder {
    color: #999999;
  }
`;

const RiskFactorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RiskFactorOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.selected ? "#e3f2fd" : "#ffffff")};
  border-color: ${(props) => (props.selected ? "#1976d2" : "#e0e0e0")};

  &:hover {
    border-color: #1976d2;
  }
`;

const RiskFactorCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
`;

const RiskFactorLabel = styled.span`
  font-size: 14px;
  color: #333333;
`;

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    uid: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    company: "",
    bloodGroup: "",
    allergies: "",
    existingConditions: "",
    visitType: "walk-in",
    assignedDoctor: "",
  });

  const [medicalHistory, setMedicalHistory] = useState({
    occupation: "",
    maritalStatus: "",
    allergies: "",
    preExistingConditions: "",
    regularMedication: "",
    surgeryHistory: "",
    riskFactors: ["Alcohol Consumption"],
    tobaccoPastUse: "",
    tobaccoCurrentUse: "",
    alcoholPastUse: "",
    alcoholCurrentUse: "",
    otherRiskFactors: "",
  });

  const [billingData, setBillingData] = useState({
    referringPractitioner: "",
    editPostingDate: false,
    discountPercent: 0,
    paymentType: "Cash",
  });

  const [items, setItems] = useState([]);

  const [genderOptions, setGenderOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  // Fetch gender and company options from API
  useEffect(() => {
    const fetchGenderOptions = async () => {
      try {
        const response = await fetch("https://hms.automedai.in/api/resource/Gender", {
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data && data.data) {
          setGenderOptions(data.data);
        }
      } catch (error) {
        console.error("Error fetching gender options:", error);
      }
    };

    const fetchCompanyOptions = async () => {
      try {
        const response = await fetch("https://hms.automedai.in/api/resource/Company", {
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data && data.data) {
          setCompanyOptions(data.data);
        }
      } catch (error) {
        console.error("Error fetching company options:", error);
      }
    };

    fetchGenderOptions();
    fetchCompanyOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target;
    setMedicalHistory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTag = (field, value) => {
    if (value.trim() && !medicalHistory[field].includes(value.trim())) {
      setMedicalHistory((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeTag = (field, tagToRemove) => {
    setMedicalHistory((prev) => ({
      ...prev,
      [field]: prev[field].filter((tag) => tag !== tagToRemove),
    }));
  };

  const toggleRiskFactor = (factor) => {
    setMedicalHistory((prev) => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(factor) ? prev.riskFactors.filter((f) => f !== factor) : [...prev.riskFactors, factor],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "qty" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].rate;
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    const newItem = {
      no: items.length + 1,
      item: "",
      itemName: "",
      qty: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = () => {
    if (items.length > 1) {
      setItems(items.slice(0, -1));
    }
  };

  const calculateTotals = () => {
    const totalQty = items.reduce((sum, item) => sum + parseFloat(item.qty || 0), 0);
    const grossTotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const discountAmount = (grossTotal * parseFloat(billingData.discountPercent || 0)) / 100;
    const netTotal = grossTotal - discountAmount;

    return { totalQty, grossTotal, discountAmount, netTotal };
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createPatient = async () => {
    try {
      const payload = {
        doctype: "Patient",
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        uid: formData.uid,
        Gender: formData.gender,
        sex: formData.gender,
        mobile: formData.mobile,
        dob: formData.dateOfBirth,
        custom_company: formData.company,
        blood_group: formData.bloodGroup,
        age: 0, // Ignoring as requested
        medical_history: formData.existingConditions,
        medication: medicalHistory.regularMedication,
        surgical_history: medicalHistory.surgeryHistory,
        surrounding_factors: "", // Keep blank as requested
        tobacco_past_use: medicalHistory.tobaccoPastUse,
        tobacco_current_use: medicalHistory.tobaccoCurrentUse,
        alcohol_past_use: medicalHistory.alcoholPastUse,
        alcohol_current_use: medicalHistory.alcoholCurrentUse,
        other_risk_factors: medicalHistory.otherRiskFactors,
        marital_status: medicalHistory.maritalStatus,
      };

      console.log("Creating patient with payload:", payload);

      const response = await fetch("https://hms.automedai.in/api/resource/Patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Patient created successfully:", data);
        alert("Patient registered successfully!");
        navigate("/patients");
      } else {
        console.error("Error creating patient:", data);
        alert(`Error creating patient: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      alert("Error creating patient. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      handleNextStep();
    } else {
      // Final submission (Step 3 is now the last step)
      console.log("Form data:", formData);
      console.log("Medical History:", medicalHistory);
      console.log("Billing data:", billingData);
      console.log("Items:", items);
      console.log("Final submission");
      createPatient();
    }
  };

  return (
    <Layout>
      <RegistrationContainer>
        <Title>Patient Registration :</Title>

        <ProgressIndicator>
          <ProgressStepsContainer>
            <ProgressStep>
              <StepLabel active={currentStep >= 1}>Step 1: Registration</StepLabel>
            </ProgressStep>
            <ProgressStep>
              <StepLabel active={currentStep >= 2}>Step 2: Medical History</StepLabel>
            </ProgressStep>
            <ProgressStep>
              <StepLabel active={currentStep >= 3}>Step 3: Billing</StepLabel>
            </ProgressStep>
            {/* <ProgressStep>
              <StepLabel active={currentStep >= 4}>Step 4: Pre-Screening</StepLabel>
            </ProgressStep> */}
          </ProgressStepsContainer>
          <ProgressBarContainer>
            <ProgressBarFill currentStep={currentStep} />
          </ProgressBarContainer>
        </ProgressIndicator>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>First Name</FormLabel>
                    <FormInput
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        handleInputChange(e);
                      }}
                      pattern="[a-zA-Z\s]+"
                      placeholder="Enter first name"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormInput type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Last Name</FormLabel>
                    <FormInput
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        handleInputChange(e);
                      }}
                      pattern="[a-zA-Z\s]+"
                      placeholder="Enter last name"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Identification Number (UID)</FormLabel>
                    <FormInput type="text" name="uid" value={formData.uid} onChange={handleInputChange} />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormInput type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Gender</FormLabel>
                    <FormSelect name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select</option>
                      {genderOptions.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Mobile</FormLabel>
                    <FormInput
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                        handleInputChange(e);
                      }}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit mobile number"
                      required
                    />
                    <HelperText>Existing patient data will be fetched automatically.</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Company</FormLabel>
                    <FormSelect name="company" value={formData.company} onChange={handleInputChange}>
                      <option value="">Select company</option>
                      {companyOptions.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Blood Group</FormLabel>
                    <FormSelect name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                      <option value="">Select blood group</option>
                      <option value="A Positive">A Positive</option>
                      <option value="A Negative">A Negative</option>
                      <option value="B Positive">B Positive</option>
                      <option value="B Negative">B Negative</option>
                      <option value="AB Positive">AB Positive</option>
                      <option value="AB Negative">AB Negative</option>
                      <option value="O Positive">O Positive</option>
                      <option value="O Negative">O Negative</option>
                    </FormSelect>
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Medical Info</SectionTitle>
                <FormGroup fullWidth>
                  <FormLabel>Allergies</FormLabel>
                  <TextArea name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="Enter any known allergies..." />
                </FormGroup>

                <FormGroup fullWidth>
                  <FormLabel>Existing Conditions</FormLabel>
                  <TextArea name="existingConditions" value={formData.existingConditions} onChange={handleInputChange} placeholder="Enter any existing medical conditions..." />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Visit Details</SectionTitle>
                <FormGroup>
                  <FormLabel>Visit Type</FormLabel>
                  <RadioGroup>
                    <RadioOption>
                      <RadioInput type="radio" name="visitType" value="walk-in" checked={formData.visitType === "walk-in"} onChange={handleInputChange} />
                      <span>Walk-in</span>
                    </RadioOption>
                    <RadioOption>
                      <RadioInput type="radio" name="visitType" value="telemedicine" checked={formData.visitType === "telemedicine"} onChange={handleInputChange} />
                      <span>Telemedicine</span>
                    </RadioOption>
                    <RadioOption>
                      <RadioInput type="radio" name="visitType" value="referral" checked={formData.visitType === "referral"} onChange={handleInputChange} />
                      <span>Referral</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Assigned Doctor</FormLabel>
                  <FormSelect name="assignedDoctor" value={formData.assignedDoctor} onChange={handleInputChange}>
                    <option value="">Select a doctor</option>
                    <option value="dr1">Dr. Smith</option>
                    <option value="dr2">Dr. Johnson</option>
                    <option value="dr3">Dr. Williams</option>
                  </FormSelect>
                </FormGroup>
              </FormSection>
            </>
          )}

          {currentStep === 2 && (
            <>
              <FormSection>
                <SectionTitle>Personal & Social History</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Occupation</FormLabel>
                    <FormInput type="text" name="occupation" value={medicalHistory.occupation} onChange={handleMedicalHistoryChange} placeholder="Software Engineer" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Marital Status</FormLabel>
                    <FormSelect name="maritalStatus" value={medicalHistory.maritalStatus} onChange={handleMedicalHistoryChange}>
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </FormSelect>
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Medical Conditions & Allergies</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Allergies</FormLabel>
                    <TextArea name="allergies" value={medicalHistory.allergies} onChange={handleMedicalHistoryChange} placeholder="Enter any allergies..." />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Pre-existing Conditions</FormLabel>
                    <TextArea
                      name="preExistingConditions"
                      value={medicalHistory.preExistingConditions}
                      onChange={handleMedicalHistoryChange}
                      placeholder="Enter any pre-existing conditions..."
                    />
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Treatments & History</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Regular Medication</FormLabel>
                    <TextArea
                      name="regularMedication"
                      value={medicalHistory.regularMedication}
                      onChange={handleMedicalHistoryChange}
                      placeholder="Lisinopril 10mg daily, Metformin 500mg twice daily"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Surgery History</FormLabel>
                    <TextArea name="surgeryHistory" value={medicalHistory.surgeryHistory} onChange={handleMedicalHistoryChange} placeholder="Appendectomy - 2015" />
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Substance Use History</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Tobacco Use (Past)</FormLabel>
                    <FormInput
                      type="text"
                      name="tobaccoPastUse"
                      value={medicalHistory.tobaccoPastUse}
                      onChange={handleMedicalHistoryChange}
                      placeholder="e.g., Yes - 10 cigarettes/day for 5 years"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Tobacco Use (Current)</FormLabel>
                    <FormInput type="text" name="tobaccoCurrentUse" value={medicalHistory.tobaccoCurrentUse} onChange={handleMedicalHistoryChange} placeholder="e.g., No" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Alcohol Use (Past)</FormLabel>
                    <FormInput type="text" name="alcoholPastUse" value={medicalHistory.alcoholPastUse} onChange={handleMedicalHistoryChange} placeholder="e.g., Occasional" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Alcohol Use (Current)</FormLabel>
                    <FormInput type="text" name="alcoholCurrentUse" value={medicalHistory.alcoholCurrentUse} onChange={handleMedicalHistoryChange} placeholder="e.g., No" />
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Lifestyle & Risk Factors</SectionTitle>
                <FormGroup fullWidth>
                  <FormLabel>Select all applicable risk factors</FormLabel>
                  <RiskFactorsGrid>
                    {["Tobacco Use", "Alcohol Consumption", "Occupational Hazard", "Environmental Exposure", "Others"].map((factor) => (
                      <RiskFactorOption key={factor} selected={medicalHistory.riskFactors.includes(factor)}>
                        <RiskFactorCheckbox type="checkbox" checked={medicalHistory.riskFactors.includes(factor)} onChange={() => toggleRiskFactor(factor)} />
                        <RiskFactorLabel>{factor}</RiskFactorLabel>
                      </RiskFactorOption>
                    ))}
                  </RiskFactorsGrid>
                </FormGroup>

                <FormGroup fullWidth>
                  <FormLabel>Other Risk Factors</FormLabel>
                  <TextArea
                    name="otherRiskFactors"
                    value={medicalHistory.otherRiskFactors}
                    onChange={handleMedicalHistoryChange}
                    placeholder="e.g., Stress, Family history of hypertension"
                  />
                </FormGroup>
              </FormSection>
            </>
          )}

          {currentStep === 3 && (
            <>
              <FormSection>
                <SectionTitle>Patient Information</SectionTitle>
                <FormGroup>
                  <FormLabel>Referring Practitioner</FormLabel>
                  <FormSelect name="referringPractitioner" value={billingData.referringPractitioner} onChange={handleBillingChange}>
                    <option value="">Select practitioner</option>
                    <option value="Dr. Emily White">Dr. Emily White</option>
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Dr. Johnson">Dr. Johnson</option>
                  </FormSelect>
                </FormGroup>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox type="checkbox" name="editPostingDate" checked={billingData.editPostingDate} onChange={handleBillingChange} />
                    Edit Posting Date and Time
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormSection>

              <ItemsSection>
                <ItemsHeader>
                  <ItemsTitle>Items</ItemsTitle>
                  <ItemButtons>
                    <IconButton type="button" onClick={addItem}>
                      <Plus />
                    </IconButton>
                    <IconButton type="button" onClick={removeItem}>
                      <Minus />
                    </IconButton>
                  </ItemButtons>
                </ItemsHeader>

                <ItemsTable>
                  <TableHead>
                    <TableRow>
                      <TableHeader>No.</TableHeader>
                      <TableHeader>Item</TableHeader>
                      <TableHeader>Item Name</TableHeader>
                      <TableHeader>Qty</TableHeader>
                      <TableHeader>Rate</TableHeader>
                      <TableHeader>Amount</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.no}</TableCell>
                        <TableCell>
                          <ItemInput type="text" value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <ItemInput type="text" value={item.itemName} onChange={(e) => handleItemChange(index, "itemName", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <ItemInput type="number" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <ItemInput type="number" step="0.01" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} />
                        </TableCell>
                        <TableCell>{item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ItemsTable>

                <ItemFooter>
                  <FooterItem>
                    <FooterLabel>Discount %</FooterLabel>
                    <DiscountInput type="number" name="discountPercent" value={billingData.discountPercent} onChange={handleBillingChange} />
                  </FooterItem>
                  <FooterItem>
                    <FooterLabel>Total Qty:</FooterLabel>
                    <FooterValue>{calculateTotals().totalQty}</FooterValue>
                  </FooterItem>
                  <FooterItem>
                    <FooterLabel>Total:</FooterLabel>
                    <FooterValue>{calculateTotals().grossTotal.toFixed(2)}</FooterValue>
                  </FooterItem>
                </ItemFooter>
              </ItemsSection>

              <BottomSection>
                <CalculationCard>
                  <CardTitle>Calculation</CardTitle>
                  <CalculationRow>
                    <CalculationLabel>Gross Total</CalculationLabel>
                    <CalculationValue>{calculateTotals().grossTotal.toFixed(2)}</CalculationValue>
                  </CalculationRow>
                  <CalculationRow>
                    <CalculationLabel>Discount Amount</CalculationLabel>
                    <CalculationValue>{calculateTotals().discountAmount.toFixed(2)}</CalculationValue>
                  </CalculationRow>
                  <CalculationRow>
                    <CalculationLabel bold>Net Total (INR)</CalculationLabel>
                    <CalculationValue bold highlight>
                      {calculateTotals().netTotal.toFixed(2)}
                    </CalculationValue>
                  </CalculationRow>
                </CalculationCard>

                <CalculationCard>
                  <CardTitle>Payment</CardTitle>
                  <FormGroup>
                    <FormLabel>Payment Type</FormLabel>
                    <FormSelect name="paymentType" value={billingData.paymentType} onChange={handleBillingChange}>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Insurance">Insurance</option>
                    </FormSelect>
                  </FormGroup>
                </CalculationCard>
              </BottomSection>
            </>
          )}

          {/* Step 4: Pre-Screening - Commented out */}
          {/* {currentStep === 4 && (
            <>
              <FormSection>
                <SectionTitle>Pre-screening</SectionTitle>
                <FormGroup fullWidth>
                  <FormLabel>Medication</FormLabel>
                  <FormInput type="text" placeholder="Enter medication..." />
                </FormGroup>

                <FormGroup fullWidth>
                  <FormLabel>Surgical History</FormLabel>
                  <FormInput type="text" placeholder="Enter surgical history..." />
                </FormGroup>

                <FormGroup fullWidth>
                  <FormLabel>Occupational Hazards and Environmental Factors</FormLabel>
                  <FormInput type="text" placeholder="Enter occupational hazards and environmental factors..." />
                </FormGroup>

                <FormGrid>
                  <FormGroup>
                    <FormLabel>Tobacco Consumption (Past)</FormLabel>
                    <FormInput type="text" placeholder="Enter past tobacco consumption..." />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Tobacco Consumption (Present)</FormLabel>
                    <FormInput type="text" placeholder="Enter present tobacco consumption..." />
                  </FormGroup>
                </FormGrid>

                <FormGrid>
                  <FormGroup>
                    <FormLabel>Alcohol Consumption (Past)</FormLabel>
                    <FormInput type="text" placeholder="Enter past alcohol consumption..." />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Alcohol Consumption (Present)</FormLabel>
                    <FormInput type="text" placeholder="Enter present alcohol consumption..." />
                  </FormGroup>
                </FormGrid>

                <FormGroup fullWidth>
                  <FormLabel>Other Risk Factors</FormLabel>
                  <FormInput type="text" placeholder="Enter other risk factors..." />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Marital Status</FormLabel>
                  <FormSelect>
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </FormSelect>
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Vital Signs</SectionTitle>
                <FormGroup fullWidth>
                  <FormLabel>Select Patient</FormLabel>
                  <FormSelect>
                    <option value="">Select patient</option>
                    <option value="john-doe">John Doe</option>
                  </FormSelect>
                </FormGroup>

                <FormGrid>
                  <FormGroup>
                    <FormLabel>Date</FormLabel>
                    <DateInputWrapper>
                      <FormInput type="text" placeholder="mm/dd/yyyy" />
                      <Calendar />
                    </DateInputWrapper>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Time</FormLabel>
                    <FormInput type="time" placeholder="--:-- --" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Body Temperature</FormLabel>
                    <FormInput type="text" placeholder="e.g., 36.6 °C" />
                  </FormGroup>
                </FormGrid>

                <FormGrid>
                  <FormGroup>
                    <FormLabel>Heart Rate / Pulse</FormLabel>
                    <FormInput type="text" placeholder="e.g., 72 bpm" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Blood Pressure (systolic)</FormLabel>
                    <FormInput type="text" placeholder="e.g., 120 mmHg" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Blood Pressure (diastolic)</FormLabel>
                    <FormInput type="text" placeholder="e.g., 80 mmHg" />
                  </FormGroup>
                </FormGrid>

                <FormGrid>
                  <FormGroup>
                    <FormLabel>Respiratory rate</FormLabel>
                    <FormInput type="text" placeholder="e.g., 16 bpm" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Reflexes</FormLabel>
                    <FormSelect>
                      <option value="">Select value</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Tongue</FormLabel>
                    <FormSelect>
                      <option value="">Select value</option>
                      <option value="Normal">Normal</option>
                      <option value="Coated">Coated</option>
                    </FormSelect>
                  </FormGroup>
                </FormGrid>

                <FormGroup>
                  <FormLabel>Abdomen</FormLabel>
                  <FormSelect>
                    <option value="">Select value</option>
                    <option value="Normal">Normal</option>
                    <option value="Distended">Distended</option>
                    <option value="Tender">Tender</option>
                  </FormSelect>
                </FormGroup>

                <FormGroup fullWidth>
                  <FormLabel>Notes</FormLabel>
                  <TextArea placeholder="Enter notes..." />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Nutrition Values</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Height (in Meter)</FormLabel>
                    <FormInput type="text" placeholder="e.g., 1.75" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Weight (in Kilogram)</FormLabel>
                    <FormInput type="text" placeholder="e.g., 70" />
                  </FormGroup>
                </FormGrid>

                <FormGroup fullWidth>
                  <FormLabel>BMI</FormLabel>
                  <FormInput type="text" placeholder="e.g., 22.9" />
                </FormGroup>

                <FormGroup fullWidth>
                  <FormLabel>Notes</FormLabel>
                  <TextArea placeholder="Enter notes..." />
                </FormGroup>
              </FormSection>
            </>
          )} */}

          {currentStep === 1 && (
            <ActionButtons>
              <BackButton type="button" onClick={() => navigate("/patients")}>
                Back
              </BackButton>
              <NextButton type="submit">Next</NextButton>
            </ActionButtons>
          )}

          {currentStep === 2 && (
            <ActionButtons>
              <BackButton type="button" onClick={handlePreviousStep}>
                Back
              </BackButton>
              <NextButton type="submit">Next</NextButton>
            </ActionButtons>
          )}

          {currentStep === 3 && (
            <ActionButtons>
              <BackButton type="button" onClick={handlePreviousStep}>
                Back
              </BackButton>
              <NextButton type="submit">Submit and Send to Doctor</NextButton>
            </ActionButtons>
          )}

          {/* {currentStep === 4 && (
            <ActionButtons>
              <BackButton type="button" onClick={handlePreviousStep}>Back</BackButton>
              <NextButton type="submit">Submit and Send to Doctor</NextButton>
            </ActionButtons>
          )} */}
        </form>
      </RegistrationContainer>
    </Layout>
  );
};

export default PatientRegistration;
