import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Plus, Minus, CreditCard, Camera, X } from "lucide-react";
import AadhaarScanner from "../components/shared/AadhaarScanner";
import usePageTitle from "../hooks/usePageTitle";
import apiService from "../services/api/apiService";
import API_ENDPOINTS from "../services/api/endpoints";
import Select from "react-select";

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const RequiredAsterisk = styled.span`
  color: #dc2626;
  margin-left: 4px;
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

  &:disabled {
    background-color: #f5f5f5;
    color: #666666;
    cursor: not-allowed;
    border-color: #d0d0d0;
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

  &:disabled {
    background-color: #f5f5f5;
    color: #666666;
    cursor: not-allowed;
    border-color: #d0d0d0;
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
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

const AadhaarScanButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(74, 144, 226, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const AadhaarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f0f7ff;
  border: 1px dashed #4a90e2;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const AadhaarInfo = styled.div`
  flex: 1;
`;

const AadhaarTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const AadhaarDescription = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
`;

const ItemSearchWrapper = styled.div`
  position: relative;
  min-width: 180px;
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
  margin-top: 4px;
`;

const SearchResultItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333333;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f8ff;
  }
`;

const SearchResultEmpty = styled.div`
  padding: 12px;
  text-align: center;
  color: #666666;
  font-size: 14px;
`;

const DeleteItemButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #e53935;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #c62828;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PatientRegistration = () => {
  usePageTitle("Patient Registration");
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAadhaarScannerOpen, setIsAadhaarScannerOpen] = useState(false);
  const mobileInputRef = useRef(null);
  const occupationInputRef = useRef(null);

  // Check if we're on pathlab route
  const isPathLabRoute = location.pathname.includes("/pathlab");
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
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
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
    riskFactors: [],
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
  });

  // Initialize items based on route - pathlab has no items, others have default consultation
  const [items, setItems] = useState(() => {
    if (isPathLabRoute) {
      return [];
    } else {
      return [{
        no: 1,
        item: "STO-ITEM-2025-00539",
        itemName: "",
        qty: 1,
        rate: 20,
        amount: 20,
      }];
    }
  });

  const [genderOptions, setGenderOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [disabledFields, setDisabledFields] = useState({});
  const [age, setAge] = useState(""); // UI-only field for age

  // Item search state
  const [itemSearchIndex, setItemSearchIndex] = useState(null);
  const [itemSearch, setItemSearch] = useState("");
  const [itemResults, setItemResults] = useState([]);
  const [showItemResults, setShowItemResults] = useState(false);
  const [searchingItem, setSearchingItem] = useState(false);

  // If address line 1 has a value, other address fields (except line 2) become required
  const hasAnyAddressValue = formData.address_line1;

  // Calculate age from date of birth
  const calculateAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  // Calculate DOB from age (set to 01/01/YYYY)
  const calculateDOBFromAge = (ageValue) => {
    if (!ageValue || isNaN(ageValue)) return "";
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(ageValue);
    return `${birthYear}-01-01`;
  };

  // Helper function to match gender values
  const matchGenderValue = (genderValue, options) => {
    if (!genderValue) return "";

    const normalized = genderValue.trim().toLowerCase();
    console.log("Trying to match gender:", normalized);

    // Try exact match first
    const exactMatch = options.find(opt => opt.name.toLowerCase() === normalized);
    if (exactMatch) {
      console.log("Exact match found:", exactMatch.name);
      return exactMatch.name;
    }

    // Try matching common patterns
    const patterns = {
      'm': ['male', 'm'],
      'f': ['female', 'f'],
      't': ['transgender', 'trans', 't'],
      'o': ['other', 'o']
    };

    for (const [key, variations] of Object.entries(patterns)) {
      if (variations.some(v => normalized === v || normalized.startsWith(v))) {
        const match = options.find(opt => opt.name.toLowerCase().startsWith(key));
        if (match) {
          console.log("Pattern match found:", match.name);
          return match.name;
        }
      }
    }

    // Try partial match as fallback
    const partialMatch = options.find(opt => {
      const optName = opt.name.toLowerCase();
      return optName.startsWith(normalized) || normalized.startsWith(optName.charAt(0));
    });

    if (partialMatch) {
      console.log("Partial match found:", partialMatch.name);
      return partialMatch.name;
    }

    console.log("No match found, returning raw value");
    return genderValue;
  };

  // Normalize gender value when options are loaded (for auto-normalization after Aadhaar scan)
  useEffect(() => {
    if (genderOptions.length > 0 && formData.gender) {
      const currentValue = formData.gender.trim();

      // Check if current value is already a valid option
      const isValidOption = genderOptions.some(
        opt => opt.name.toLowerCase() === currentValue.toLowerCase()
      );

      if (!isValidOption) {
        // Try to match and normalize
        const matchedValue = matchGenderValue(currentValue, genderOptions);
        if (matchedValue && matchedValue !== currentValue) {
          console.log("Auto-normalizing gender from", currentValue, "to", matchedValue);
          setFormData((prev) => ({ ...prev, gender: matchedValue }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderOptions]);

  // Auto-focus on appropriate field when step changes
  useEffect(() => {
    if (currentStep === 2 && occupationInputRef.current) {
      // Small delay to ensure the step content is rendered
      setTimeout(() => {
        occupationInputRef.current?.focus();
      }, 100);
    }
  }, [currentStep]);

  // Auto-select company if only one option is available
  useEffect(() => {
    if (companyOptions.length === 1 && !formData.company) {
      setFormData((prev) => ({ ...prev, company: companyOptions[0].name }));
    }
  }, [companyOptions, formData.company]);

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
          console.log("Gender options loaded:", data.data);
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

    const fetchPractitioners = async () => {
      try {
        const practitionerRes = await apiService.get(API_ENDPOINTS.PRACTITIONERS.LIST, {
          fields: '["name", "practitioner_name"]',
          limit_page_length: 5000,
        });
        if (practitionerRes.data?.data) {
          setPractitioners(practitionerRes.data.data);
          console.log("Practitioners loaded:", practitionerRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching practitioners:", error);
      }
    };

    const fetchDefaultItem = async () => {
      try {
        const response = await apiService.get(API_ENDPOINTS.ITEMS.GET_BY_ID("STO-ITEM-2025-00539"));
        console.log("Default item fetched:", response.data);

        if (response.data && response.data.data) {
          const itemData = response.data.data;
          const defaultItem = {
            no: 1,
            item: itemData.name || itemData.item_code || "STO-ITEM-2025-00539",
            itemName: itemData.item_name || "",
            qty: 1,
            rate: 20, // Fixed rate for default item
            amount: 20,
          };
          setItems([defaultItem]);
        }
      } catch (error) {
        console.error("Error fetching default item:", error);
      }
    };

    fetchGenderOptions();
    fetchCompanyOptions();
    fetchPractitioners();

    // Fetch default item only for non-pathlab routes
    if (!isPathLabRoute) {
      fetchDefaultItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle DOB change - calculate age
    if (name === "dateOfBirth") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setAge(calculateAgeFromDOB(value));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle age input change - calculate DOB
  const handleAgeChange = (e) => {
    const ageValue = e.target.value;
    setAge(ageValue);

    if (ageValue && !isNaN(ageValue)) {
      const calculatedDOB = calculateDOBFromAge(ageValue);
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: calculatedDOB,
      }));
    } else if (!ageValue) {
      // Clear DOB if age is cleared
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: "",
      }));
    }
  };

  const handleAadhaarDataExtracted = (data) => {
    console.log("=== Aadhaar Scan Data ===");
    console.log("Extracted data:", data);
    console.log("Gender options available:", genderOptions.map(o => o.name));

    // Match gender value with available options from API
    let matchedGender = "";
    if (data.gender) {
      if (genderOptions.length > 0) {
        matchedGender = matchGenderValue(data.gender, genderOptions);
        console.log("Final matched gender:", matchedGender);
      } else {
        // If options not loaded yet, store the raw value
        // It will be normalized when options load via useEffect
        matchedGender = data.gender.trim();
        console.log("Gender options not loaded yet, using raw value:", matchedGender);
      }
    }

    // Build distributed address fields from individual components
    const addressLine1Parts = [
      data.careOf ? `C/O ${data.careOf}` : "",
      data.house,
      data.street,
      data.landmark,
    ].filter((part) => part && part.trim());
    const addressLine1 = addressLine1Parts.join(", ");

    const addressLine2Parts = [
      data.location || data.locality,
      data.postOffice ? `PO: ${data.postOffice}` : "",
      data.vtc,
      data.subDistrict,
    ].filter((part) => part && part.trim());
    const addressLine2 = addressLine2Parts.join(", ");

    // Track which fields are being populated from Aadhaar
    const fieldsToDisable = {};
    if (data.firstName) fieldsToDisable.firstName = true;
    if (data.middleName) fieldsToDisable.middleName = true;
    if (data.lastName) fieldsToDisable.lastName = true;
    if (data.uid) fieldsToDisable.uid = true;
    if (data.dateOfBirth) fieldsToDisable.dateOfBirth = true;
    if (matchedGender) fieldsToDisable.gender = true;
    if (addressLine1 || data.address) fieldsToDisable.address_line1 = true;
    if (addressLine2) fieldsToDisable.address_line2 = true;
    if (data.district) fieldsToDisable.city = true;
    if (data.state) fieldsToDisable.state = true;
    if (data.pincode) fieldsToDisable.pincode = true;
    if (data.state) fieldsToDisable.country = true;

    setDisabledFields(fieldsToDisable);

    const newDOB = data.dateOfBirth || formData.dateOfBirth;
    setFormData((prev) => ({
      ...prev,
      firstName: data.firstName || prev.firstName,
      middleName: data.middleName || prev.middleName,
      lastName: data.lastName || prev.lastName,
      uid: data.uid || prev.uid,
      dateOfBirth: newDOB,
      gender: matchedGender || prev.gender,
      address_line1: addressLine1 || data.address || prev.address_line1,
      address_line2: addressLine2 || prev.address_line2,
      city: data.district || prev.city,
      state: data.state || prev.state,
      pincode: data.pincode || prev.pincode,
      country: data.state ? "India" : prev.country,
    }));

    // Calculate and set age if DOB is provided
    if (newDOB) {
      setAge(calculateAgeFromDOB(newDOB));
    }

    // Auto-focus on mobile number field after Aadhaar scan
    setTimeout(() => {
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
    }, 100);
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

  const toggleRiskFactor = (factor) => {
    setMedicalHistory((prev) => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(factor) ? prev.riskFactors.filter((f) => f !== factor) : [...prev.riskFactors, factor],
    }));
  };

  // Debounced item search
  const searchItems = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setItemResults([]);
      setShowItemResults(false);
      return;
    }

    setSearchingItem(true);
    try {
      const response = await apiService.get(API_ENDPOINTS.ITEMS.SEARCH, {
        doctype: "Item",
        txt: query,
        page_length: 10,
      });
      if (response.data?.results || response.data?.message) {
        setItemResults(response.data.results || response.data.message || []);
        setShowItemResults(true);
      }
    } catch (err) {
      console.error("Error searching items:", err);
    } finally {
      setSearchingItem(false);
    }
  }, []);

  // Debounce effect for item search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems(itemSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [itemSearch, searchItems]);

  const handleItemSelect = async (item, index) => {
    try {
      // Fetch item details
      const itemCode = item.value || item.name;
      const response = await apiService.get(API_ENDPOINTS.ITEMS.GET_BY_ID(itemCode));
      const itemData = response.data?.data;

      // Fetch item price from Item Price API
      let rate = 0;
      try {
        const priceResponse = await apiService.get(API_ENDPOINTS.ITEMS.GET_PRICE, {
          filters: JSON.stringify([["item_code", "=", itemCode], ["selling", "=", 1]]),
          fields: JSON.stringify(["name", "item_code", "price_list", "price_list_rate", "currency", "uom", "valid_from", "valid_upto"]),
        });
        if (priceResponse.data?.data && priceResponse.data.data.length > 0) {
          rate = priceResponse.data.data[0].price_list_rate || 0;
        }
      } catch (priceErr) {
        console.error("Error fetching item price:", priceErr);
        // Fallback to standard_rate if price fetch fails
        rate = itemData?.standard_rate || itemData?.valuation_rate || 0;
      }

      const updatedItems = [...items];
      const qty = updatedItems[index].qty || 1;

      updatedItems[index] = {
        ...updatedItems[index],
        no: index + 1,
        item: itemCode,
        itemName: itemData?.item_name || item.description || itemCode,
        qty: qty,
        rate: rate,
        amount: rate * qty,
      };
      setItems(updatedItems);
    } catch (err) {
      console.error("Error fetching item details:", err);
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        item: item.value || item.name,
        itemName: item.description || item.value || item.name,
      };
      setItems(updatedItems);
    }

    setItemSearch("");
    setShowItemResults(false);
    setItemSearchIndex(null);
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

  // const removeItem = () => {
  //   if (items.length > 1) {
  //     setItems(items.slice(0, -1));
  //   }
  // };
    const removeItem = (index) => {
    if (items.length > 0) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
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
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
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

      // Add optional fields
      if (billingData.referringPractitioner) {
        payload.default_practitioner = billingData.referringPractitioner;
      }

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

        // Get patient details from response
        const patientId = data.data?.name;
        const patientName = data.data?.patient_name || `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
        const company = formData.company;
        // Create Sales Invoice if there are billing items
        if (items.length > 0 && items.some(item => item.item)) {
          try {
            console.log("Creating Sales Invoice...");

            // Map items to Sales Invoice format
            const invoiceItems = items
              .filter(item => item.item) // Only include items with item_code
              .map(item => ({
                item_code: item.item,
                // item_name: item.itemName || item.item,
                // description: item.itemName || item.item,
                // warehouse: "Finished Goods - RKMS",
                // income_account: "Sales - RKMS",
                // expense_account: "Cost of Goods Sold - RKMS",
                // cost_center: "Main - RKMS",
                uom: "Unit",
                qty: parseFloat(item.qty) || 1,
                rate: parseFloat(item.rate) || 0,
              }));

            // Prepare Sales Invoice payload
            const invoicePayload = {
              docstatus: 1,
              doctype: "Sales Invoice",
              naming_series: "SINV-.YY.-",
              company: company,
              posting_date: new Date().toISOString().split("T")[0],
              set_posting_time: 1,
              is_pos: 0,
              customer: patientName,
              patient: patientId,
              patient_name: patientName,
              currency: "INR",
              selling_price_list: "Standard Selling",
              update_stock: 0,
              items: invoiceItems,
              apply_discount_on: "Grand Total",
              additional_discount_percentage: parseFloat(billingData.discountPercent) || 0,
              rounding_adjustment: 0,
              mode_of_transport: "Road",
              gst_vehicle_type: "Regular",
              // service_unit: "All Healthcare Service Units - RKMS",
            };

            // Add ref_practitioner if selected
            if (billingData.referringPractitioner) {
              invoicePayload.ref_practitioner = billingData.referringPractitioner;
            }

            console.log("Sales Invoice payload:", invoicePayload);

            const invoiceResponse = await fetch("https://hms.automedai.in/api/resource/Sales%20Invoice", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              credentials: "include",
              body: JSON.stringify(invoicePayload),
            });

            const invoiceData = await invoiceResponse.json();

            if (invoiceResponse.ok) {
              console.log("Sales Invoice created successfully:", invoiceData);

              // Get invoice name and totals
              const invoiceName = invoiceData.data?.name;
              const totals = calculateTotals();
              const netTotal = totals.netTotal;

              // Create Payment Entry
              try {
                console.log("Creating Payment Entry...");

                const paymentPayload = {
                  doctype: "Payment Entry",
                  docstatus: 1,
                  payment_type: "Receive",
                  posting_date: new Date().toISOString().split("T")[0],
                  company: company,
                  mode_of_payment: "Cash", // Todo This can be changed if needed
                  party_type: "Customer",
                  party: patientName,
                  paid_amount: netTotal,
                  received_amount: netTotal,
                  target_exchange_rate: 1,
                  paid_to: company === "Ramakrishna Mission Sargachi" ? "Cash - RKMS" : "Cash - ADC&P",
                  paid_to_account_currency: "INR",
                  references: [
                    {
                      reference_doctype: "Sales Invoice",
                      reference_name: invoiceName,
                      total_amount: netTotal,
                      outstanding_amount: netTotal,
                      allocated_amount: netTotal,
                    }
                  ]
                };

                console.log("Payment Entry payload:", paymentPayload);

                const paymentResponse = await fetch("https://hms.automedai.in/api/resource/Payment%20Entry", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(paymentPayload),
                });

                const paymentData = await paymentResponse.json();

                if (paymentResponse.ok) {
                  console.log("Payment Entry created successfully:", paymentData);
                  alert("Patient registered, invoice created, and payment recorded successfully!");
                } else {
                  console.error("Error creating Payment Entry:", paymentData);
                  alert(`Patient and invoice created, but payment recording failed: ${paymentData.message || "Unknown error"}`);
                }
              } catch (paymentError) {
                console.error("Error creating Payment Entry:", paymentError);
                alert("Patient and invoice created, but payment recording failed. Please record payment manually.");
              }
            } else {
              console.error("Error creating Sales Invoice:", invoiceData);
              alert(`Patient registered but invoice creation failed: ${invoiceData.message || "Unknown error"}`);
            }
          } catch (invoiceError) {
            console.error("Error creating Sales Invoice:", invoiceError);
            alert("Patient registered but invoice creation failed. Please create invoice manually.");
          }
        } else {
          alert("Patient registered successfully!");
        }

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
              <AadhaarSection>
                <CreditCard size={32} color="#4a90e2" />
                <AadhaarInfo>
                  <AadhaarTitle>Quick Registration with Aadhaar</AadhaarTitle>
                  <AadhaarDescription>
                    Scan Aadhaar QR code or upload Aadhaar card image to auto-fill patient details
                  </AadhaarDescription>
                </AadhaarInfo>
                <AadhaarScanButton type="button" onClick={() => setIsAadhaarScannerOpen(true)}>
                  <Camera />
                  Scan Aadhaar
                </AadhaarScanButton>
              </AadhaarSection>

              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>First Name<RequiredAsterisk>*</RequiredAsterisk></FormLabel>
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
                      disabled={disabledFields.firstName}
                      autoFocus
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormInput
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        handleInputChange(e);
                      }}
                      pattern="[a-zA-Z\s]*"
                      placeholder="Enter middle name"
                      disabled={disabledFields.middleName}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Last Name<RequiredAsterisk>*</RequiredAsterisk></FormLabel>
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
                      disabled={disabledFields.lastName}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Identification Number (UID)</FormLabel>
                    <FormInput type="text" name="uid" value={formData.uid} onChange={handleInputChange} disabled={disabledFields.uid} />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormInput
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split("T")[0]}
                      disabled={disabledFields.dateOfBirth}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Age (Years)</FormLabel>
                    <FormInput
                      type="number"
                      name="age"
                      value={age}
                      onChange={handleAgeChange}
                      placeholder="Enter age"
                      min="0"
                      max="150"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Gender<RequiredAsterisk>*</RequiredAsterisk></FormLabel>
                    <FormSelect name="gender" value={formData.gender} onChange={handleInputChange} disabled={disabledFields.gender} required>
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
                      ref={mobileInputRef}
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
                    />
                    <HelperText>Existing patient data will be fetched automatically.</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Clinic</FormLabel>
                    <FormSelect name="company" value={formData.company} onChange={handleInputChange}>
                      <option value="">Select clinic</option>
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

                  <FormGroup>
                    <FormLabel>Address Line 1{hasAnyAddressValue && <RequiredAsterisk>*</RequiredAsterisk>}</FormLabel>
                    <FormInput
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      placeholder="Enter address line 1"
                      disabled={disabledFields.address_line1}
                      required={hasAnyAddressValue}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormInput
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      placeholder="Enter address line 2"
                      disabled={disabledFields.address_line2}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>District{hasAnyAddressValue && <RequiredAsterisk>*</RequiredAsterisk>}</FormLabel>
                    <FormInput
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter district"
                      required={hasAnyAddressValue}
                      disabled={disabledFields.city}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>State{hasAnyAddressValue && <RequiredAsterisk>*</RequiredAsterisk>}</FormLabel>
                    <FormSelect name="state" value={formData.state} onChange={handleInputChange} required={hasAnyAddressValue} disabled={disabledFields.state}>
                      <option value="">Select state</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Puducherry">Puducherry</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Pincode{hasAnyAddressValue && <RequiredAsterisk>*</RequiredAsterisk>}</FormLabel>
                    <FormInput
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                        handleInputChange(e);
                      }}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit pincode"
                      required={hasAnyAddressValue}
                      disabled={disabledFields.pincode}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Country{hasAnyAddressValue && <RequiredAsterisk>*</RequiredAsterisk>}</FormLabel>
                    <FormInput
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                      required={hasAnyAddressValue}
                      disabled={disabledFields.country}
                    />
                  </FormGroup>
                </FormGrid>
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
                    <FormInput ref={occupationInputRef} type="text" name="occupation" value={medicalHistory.occupation} onChange={handleMedicalHistoryChange} placeholder="Software Engineer" />
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
                <SectionTitle>Lifestyle & Risk Factors</SectionTitle>
                <FormGroup fullWidth>
                  <FormLabel>Select all applicable risk factors</FormLabel>
                  <RiskFactorsGrid>
                    {[
                      "Tobacco Use (Past)",
                      "Tobacco Use (Current)",
                      "Alcohol Use (Past)",
                      "Alcohol Use (Current)",
                      "Occupational Hazard",
                      "Environmental Exposure",
                      "Others",
                    ].map((factor) => (
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
                  <FormLabel>
                    Referring Practitioner<RequiredAsterisk>*</RequiredAsterisk>
                  </FormLabel>

                  <Select
                    options={practitioners.map((p) => ({
                      label: p.practitioner_name || p.name,
                      value: p.name
                    }))}
                    onChange={(selected) =>
                      setBillingData((prev) => ({
                        ...prev,
                        referringPractitioner: selected ? selected.value : null
                      }))
                    }
                    placeholder="Search practitioner..."
                    isSearchable
                    isClearable
                  />
                </FormGroup>
              </FormSection>

              <ItemsSection>
                <ItemsHeader>
                  <ItemsTitle>Items</ItemsTitle>
                  <ItemButtons>
                    <IconButton type="button" onClick={addItem}>
                      <Plus />
                    </IconButton>
                    {/* <IconButton type="button" onClick={removeItem}>
                      <Minus />
                    </IconButton> */}
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
                          <ItemSearchWrapper>
                            {item.item ? (
                              <ItemInput type="text" value={item.item} disabled />
                            ) : (
                              <>
                                <ItemInput
                                  type="text"
                                  placeholder="Search item..."
                                  value={itemSearchIndex === index ? itemSearch : ""}
                                  onChange={(e) => {
                                    setItemSearchIndex(index);
                                    setItemSearch(e.target.value);
                                  }}
                                  onFocus={() => {
                                    setItemSearchIndex(index);
                                    if (itemSearch.length >= 2) setShowItemResults(true);
                                  }}
                                  onBlur={() => setTimeout(() => setShowItemResults(false), 200)}
                                />
                                {showItemResults && itemSearchIndex === index && (
                                  <SearchResults>
                                    {itemResults.length > 0 ? (
                                      itemResults.map((itemResult, idx) => (
                                        <SearchResultItem
                                          key={idx}
                                          onMouseDown={() => handleItemSelect(itemResult, index)}
                                        >
                                          {itemResult.value || itemResult.name} - {itemResult.description || ""}
                                        </SearchResultItem>
                                      ))
                                    ) : (
                                      <SearchResultEmpty>
                                        {searchingItem ? "Searching..." : "No items found"}
                                      </SearchResultEmpty>
                                    )}
                                  </SearchResults>
                                )}
                              </>
                            )}
                          </ItemSearchWrapper>
                        </TableCell>
                        <TableCell>
                          <ItemInput type="text" value={item.itemName} disabled />
                        </TableCell>
                        <TableCell>
                          <ItemInput type="number" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <ItemInput type="number" step="0.01" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} />
                        </TableCell>
                        <TableCell>{item.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <DeleteItemButton type="button" onClick={() => removeItem(index)}>
                            <X />
                          </DeleteItemButton>
                        </TableCell>
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
                    <FormInput type="text" value="Cash" disabled />
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

        <AadhaarScanner
          isOpen={isAadhaarScannerOpen}
          onClose={() => setIsAadhaarScannerOpen(false)}
          onDataExtracted={handleAadhaarDataExtracted}
        />
      </RegistrationContainer>
    </Layout>
  );
};

export default PatientRegistration;
