import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Plus, Minus, Search, X, Loader2 } from "lucide-react";
import apiService from "../services/api/apiService";
import API_ENDPOINTS from "../services/api/endpoints";
import usePageTitle from "../hooks/usePageTitle";

const BillingContainer = styled.div`
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

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const RequiredStar = styled.span`
  color: #e53935;
  margin-left: 2px;
`;

const FormInput = styled.input`
  padding: 10px 12px;
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

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  padding-right: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #4a90e2;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  display: flex;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;
  }
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

const SelectedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 6px;
  font-size: 14px;
  color: #1976d2;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #1976d2;

  &:hover {
    color: #1565c0;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  position: relative;
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

const ItemsTableWrapper = styled.div`
  overflow: visible;
  position: relative;
  min-width: 100%;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  table-layout: fixed;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  white-space: nowrap;

  &:first-child {
    padding-left: 16px;
    width: 40px;
  }

  &:nth-child(2) {
    width: 180px; /* Item Code */
  }

  &:nth-child(3) {
    width: 200px; /* Item Name */
  }

  &:nth-child(4) {
    width: 180px; /* Warehouse */
  }

  &:nth-child(5) {
    width: 80px; /* UOM */
  }

  &:nth-child(6) {
    width: 120px; /* Qty */
  }

  &:nth-child(7) {
    width: 100px; /* Rate */
  }

  &:nth-child(8) {
    width: 120px; /* Amount */
    text-align: right;
    padding-right: 16px;
  }

  &:nth-child(9) {
    width: 50px; /* Delete button */
  }
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 8px;
  font-size: 14px;
  color: #333333;
  vertical-align: middle;
  position: relative;
  overflow: visible;

  &:first-child {
    padding-left: 16px;
    color: #666666;
  }

  &:nth-child(8) {
    text-align: right;
    padding-right: 16px;
    font-weight: 600;
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
  min-width: 60px;

  &:focus {
    border-color: #4a90e2;
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const ItemSearchWrapper = styled.div`
  position: relative;
  min-width: 180px;
  z-index: 10;
`;

const QtyControlWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;

  &:hover {
    background-color: #f5f5f5;
    border-color: #4a90e2;
  }

  &:active {
    background-color: #e8e8e8;
  }

  svg {
    width: 14px;
    height: 14px;
    color: #333333;
  }
`;

const QtyInput = styled.input`
  width: 50px;
  padding: 4px 6px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #4a90e2;
  }

  /* Hide number input arrows */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  flex-wrap: wrap;
  gap: 16px;
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
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
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #a0c4e8;
    cursor: not-allowed;
  }

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const AddBilling = () => {
  usePageTitle("Add Billing");
  const navigate = useNavigate();
  const location = useLocation();

  // Determine base path for navigation (handles both /billing and /opd/billing)
  const basePath = location.pathname.startsWith("/opd") ? "/opd/billing" : "/billing";

  // Form state
  const [billingData, setBillingData] = useState({
    company: "",
    posting_date: new Date().toISOString().split("T")[0],
    set_posting_time: 1,
    is_pos: 0,
    customer: "",
    patient: "",
    patient_name: "",
    apply_discount_on: "Grand Total",
    additional_discount_percentage: 0,
    ref_practitioner: "",
    service_unit: "",
    payment_type: "Cash",
    due_date: new Date().toISOString().split("T")[0],
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search states
  const [patientSearch, setPatientSearch] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [searchingPatient, setSearchingPatient] = useState(false);

  const [itemSearchIndex, setItemSearchIndex] = useState(null);
  const [itemSearch, setItemSearch] = useState("");
  const [itemResults, setItemResults] = useState([]);
  const [showItemResults, setShowItemResults] = useState(false);
  const [searchingItem, setSearchingItem] = useState(false);

  // Dropdown options
  const [practitioners, setPractitioners] = useState([]);
  const [serviceUnits, setServiceUnits] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Fetch dropdown options on mount
  useEffect(() => {
    fetchDropdownOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle preselected patient from navigation state
  useEffect(() => {
    const { preselectedPatient } = location.state || {};

    // Set preselected patient
    if (preselectedPatient) {
      setBillingData(prev => ({
        ...prev,
        patient: preselectedPatient.name,
        patient_name: preselectedPatient.patient_name,
      }));
      setPatientSearch(preselectedPatient.patient_name);
      console.log("Preselected patient set:", preselectedPatient);
    }
  }, [location.state]);

  // Handle default item after warehouses are loaded
  useEffect(() => {
    const { defaultItemCode } = location.state || {};

    // Fetch and add default item only if warehouses are loaded and items array is empty
    if (defaultItemCode && warehouses.length > 0 && items.length === 0) {
      fetchDefaultItem(defaultItemCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, warehouses]);

  const fetchDefaultItem = async (itemCode) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.ITEMS.GET_BY_ID(itemCode));
      if (response.data?.data) {
        const itemData = response.data.data;
        const newItem = {
          item_code: itemData.item_code || itemData.name,
          item_name: itemData.item_name || itemData.item_code,
          qty: 1,
          rate: itemData.standard_rate || 0,
          amount: itemData.standard_rate || 0,
          warehouse: warehouses.length > 0 ? warehouses[0].name : "",
        };
        setItems([newItem]);
        console.log("Default item loaded:", newItem);
      }
    } catch (error) {
      console.error("Error fetching default item:", error);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      // Fetch practitioners
      const practitionerRes = await apiService.get(API_ENDPOINTS.PRACTITIONERS.LIST, {
        fields: '["name", "practitioner_name"]',
        limit_page_length: 100,
      });
      if (practitionerRes.data?.data) {
        setPractitioners(practitionerRes.data.data);
      }

      // Fetch service units
      const serviceUnitRes = await apiService.get(API_ENDPOINTS.SERVICE_UNITS.LIST, {
        fields: '["name"]',
        limit_page_length: 100,
      });
      if (serviceUnitRes.data?.data) {
        setServiceUnits(serviceUnitRes.data.data);
      }

      // Fetch warehouses
      const warehouseRes = await apiService.get(API_ENDPOINTS.WAREHOUSE.LIST, {
        fields: '["name"]',
        limit_page_length: 100,
      });
      if (warehouseRes.data?.data) {
        setWarehouses(warehouseRes.data.data);
      }

      // Fetch companies
      const companyRes = await apiService.get(API_ENDPOINTS.COMPANY.LIST, {
        fields: '["name", "company_name"]',
        limit_page_length: 100,
      });
      if (companyRes.data?.data) {
        setCompanies(companyRes.data.data);
        // Set first company as default if available and no company is set
        if (companyRes.data.data.length > 0 && !billingData.company) {
          setBillingData(prev => ({
            ...prev,
            company: companyRes.data.data[0].name
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
    }
  };

  // Debounced patient search
  const searchPatients = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setPatientResults([]);
      setShowPatientResults(false);
      return;
    }

    setSearchingPatient(true);
    try {
      const response = await apiService.get(API_ENDPOINTS.PATIENTS.SEARCH_LINK, {
        doctype: "Patient",
        txt: query,
        page_length: 10,
      });
      if (response.data?.results || response.data?.message) {
        setPatientResults(response.data.results || response.data.message || []);
        setShowPatientResults(true);
      }
    } catch (err) {
      console.error("Error searching patients:", err);
    } finally {
      setSearchingPatient(false);
    }
  }, []);

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

  // Debounce effect for patient search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPatients(patientSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [patientSearch, searchPatients]);

  // Debounce effect for item search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems(itemSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [itemSearch, searchItems]);

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handlePatientSelect = async (patient) => {
    const patientId = patient.value || patient.name;

    // Fetch patient details to get the patient_name and linked customer
    try {
      const response = await apiService.get(API_ENDPOINTS.PATIENTS.GET_BY_ID(patientId));
      const patientData = response.data?.data;
      const patientName = patientData?.patient_name || patient.description || patientId;

      setBillingData((prev) => ({
        ...prev,
        // Customer should be the linked customer or patient name
        customer: patientData?.customer || patientName,
        // Patient field uses the patient ID (name field like "HLC-PAT-2025-00032")
        patient: patientId,
        patient_name: patientName,
      }));
    } catch (err) {
      console.error("Error fetching patient details:", err);
      const patientName = patient.description || patientId;
      setBillingData((prev) => ({
        ...prev,
        customer: patientName,
        patient: patientId,
        patient_name: patientName,
      }));
    }

    setPatientSearch("");
    setShowPatientResults(false);
  };

  const clearPatient = () => {
    setBillingData((prev) => ({
      ...prev,
      customer: "",
      patient: "",
      patient_name: "",
    }));
  };

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
        item_code: itemCode,
        item_name: itemData?.item_name || item.description || itemCode,
        description: itemData?.description || item.description || itemCode,
        uom: itemData?.stock_uom || itemData?.sales_uom || "Unit",
        rate: rate,
        amount: rate * qty,
      };
      setItems(updatedItems);
    } catch (err) {
      console.error("Error fetching item details:", err);
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        item_code: item.value || item.name,
        item_name: item.description || item.value || item.name,
        description: item.description || item.value || item.name,
        uom: "Unit",
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
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = qty * rate;
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    const defaultWarehouse = warehouses.length > 0 ? warehouses[0].name : "";
    const newItem = {
      item_code: "",
      item_name: "",
      description: "",
      warehouse: defaultWarehouse,
      uom: "Unit",
      qty: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index) => {
    if (items.length > 0) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const calculateTotals = () => {
    const totalQty = items.reduce((sum, item) => sum + parseFloat(item.qty || 0), 0);
    const grossTotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const discountAmount = (grossTotal * parseFloat(billingData.additional_discount_percentage || 0)) / 100;
    const netTotal = grossTotal - discountAmount;

    return { totalQty, grossTotal, discountAmount, netTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Prevent double submission
    if (loading) {
      console.log("Form submission already in progress, ignoring duplicate request");
      return;
    }

    // Validation
    if (!billingData.patient) {
      setError("Please select a patient");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one item");
      return;
    }

    const hasEmptyItems = items.some((item) => !item.item_code);
    if (hasEmptyItems) {
      setError("Please select an item for all rows");
      return;
    }

    setLoading(true);

    try {
      // Debug: Log the items array to check for duplicates
      console.log("=== BILLING SUBMISSION START ===");
      console.log("Items array length:", items.length);
      console.log("Items array:", JSON.stringify(items, null, 2));
      console.log("billingData:", JSON.stringify(billingData, null, 2));

      // ============ Step 1: Create Sales Invoice ============
      console.log("Step 1: Creating Sales Invoice...");
      const invoicePayload = {
        docstatus: 0,
        doctype: "Sales Invoice",
        company: billingData.company,
        posting_date: billingData.posting_date,
        set_posting_time: billingData.set_posting_time,
        is_pos: billingData.is_pos,
        customer: billingData.customer,
        patient: billingData.patient,
        patient_name: billingData.patient_name,
        items: items.map((item) => ({
          item_code: item.item_code,
          // item_name: item.item_name,
          // description: item.description || item.item_name,
          // warehouse: item.warehouse,
          // income_account: "Sales - RKMS",
          // expense_account: "Cost of Goods Sold - RKMS",
          // cost_center: "Main - RKMS",
          // uom: item.uom || "Unit",
          qty: parseFloat(item.qty) || 1,
          rate: parseFloat(item.rate) || 0,
        })),
        apply_discount_on: billingData.apply_discount_on,
        additional_discount_percentage: parseFloat(billingData.additional_discount_percentage) || 0,
        due_date: billingData.due_date,
      };

      // Add optional fields if they have values
      if (billingData.ref_practitioner) {
        invoicePayload.ref_practitioner = billingData.ref_practitioner;
      }
      // if (billingData.service_unit) {
      //   invoicePayload.service_unit = billingData.service_unit;
      // }

      const invoiceResponse = await apiService.post(API_ENDPOINTS.BILLING.CREATE, invoicePayload);

      if (!invoiceResponse.data?.data?.name) {
        throw new Error("Failed to create sales invoice - no invoice name returned");
      }

      const salesInvoiceId = invoiceResponse.data.data.name;
      const invoiceTotal = invoiceResponse.data.data.grand_total || invoiceResponse.data.data.rounded_total || 0;
      console.log(`Step 1 Complete: Sales Invoice ${salesInvoiceId} created with total ${invoiceTotal}`);

      // ============ Step 2: Submit Sales Invoice ============
      console.log(`Step 2: Submitting Sales Invoice ${salesInvoiceId}...`);
      await apiService.put(API_ENDPOINTS.BILLING.UPDATE(salesInvoiceId), {
        docstatus: 1
      });
      console.log(`Step 2 Complete: Sales Invoice ${salesInvoiceId} submitted`);

      // ============ Step 3: Create Payment Entry ============
      console.log("Step 3: Creating Payment Entry...");
      const paymentPayload = {
        doctype: "Payment Entry",
        docstatus: 1,
        payment_type: "Receive",
        posting_date: billingData.posting_date,
        due_date: billingData.due_date,
        company: billingData.company,
        mode_of_payment: billingData.payment_type,
        party_type: "Customer",
        party: billingData.customer,
        paid_amount: invoiceTotal,
        received_amount: invoiceTotal,
        target_exchange_rate: 1,
        paid_to: billingData.payment_type === "Cash" ?  (billingData.company==="Ramakrishna Mission Sargachi" ? "Cash - RKMS" :"Cash - ADC&P" ): (billingData.company==="Ramakrishna Mission Sargachi" ? "Bank - RKMS": "Bank - ADC&P") ,
        paid_to_account_currency: "INR",
        references: [
          {
            reference_doctype: "Sales Invoice",
            reference_name: salesInvoiceId,
            total_amount: invoiceTotal,
            outstanding_amount: invoiceTotal,
            allocated_amount: invoiceTotal
          }
        ]
      };

      const paymentResponse = await apiService.post("/resource/Payment Entry", paymentPayload);
      const paymentEntryId = paymentResponse.data?.data?.name;
      console.log(`Step 3 Complete: Payment Entry ${paymentEntryId} created`);

      // ============ Step 4 & 5: Create Lab Tests for each item ============
      // COMMENTED OUT FOR TESTING - Lab test creation is disabled
      console.log(`Step 4 & 5: SKIPPED - Lab Test creation is commented out for testing`);

      /*
      console.log(`Step 4 & 5: Creating Lab Tests for ${items.length} items...`, items.map(i => i.item_code));

      // First, check if lab tests were auto-created by ERPNext
      let existingLabTests = [];
      try {
        console.log("Checking if lab tests already exist for this invoice...");
        const existingLabTestsResponse = await apiService.post(
          `/method/frappe.client.get_list`,
          {
            doctype: "Lab Test",
            fields: ["name", "template"],
            filters: { invoice: salesInvoiceId }
          }
        );
        existingLabTests = existingLabTestsResponse.data?.message || [];
        console.log(`Found ${existingLabTests.length} existing lab tests for invoice ${salesInvoiceId}`);
      } catch (checkError) {
        console.log("Could not check for existing lab tests (field not permitted), proceeding with creation...");
        existingLabTests = [];
      }

      if (existingLabTests.length > 0) {
        console.log("Lab tests were auto-created by ERPNext, skipping manual creation");
        console.log("Existing lab tests:", existingLabTests.map(lt => lt.name));
      } else {
        console.log("No existing lab tests found, creating them manually...");

        const labTestPromises = items.map(async (item, index) => {
          try {
            // Step 4: Get Lab Test Template
            console.log(`Step 4.${index + 1}: Fetching template for item ${item.item_code}...`);
            const templateResponse = await apiService.get(
              `/resource/Lab Test Template?fields=["name","item","department"]&filters=[["Lab Test Template","item","=","${item.item_code}"]]`
            );

            if (!templateResponse.data?.data || templateResponse.data.data.length === 0) {
              console.log(`No template found for item ${item.item_code}, skipping lab test creation`);
              return null;
            }

            const template = templateResponse.data.data[0];
            console.log(`Step 4.${index + 1} Complete: Template ${template.name} found for ${item.item_code}`);

            // Step 5: Create Lab Test
            console.log(`Step 5.${index + 1}: Creating Lab Test for ${item.item_code}...`);
            const currentDate = new Date();
            const currentTime = currentDate.toTimeString().split(' ')[0];
            const expectedResultDate = new Date(currentDate);
            expectedResultDate.setDate(expectedResultDate.getDate() + 1);

            const labTestPayload = {
              doctype: "Lab Test",
              naming_series: "HLC-LAB-.YYYY.-",
              company: billingData.company,
              status: "Draft",
              template: template.name,
              department: template.department,
              patient: billingData.patient,
              patient_sex: "Male", // Default value, can be enhanced later
              date: billingData.posting_date,
              time: currentTime,
              expected_result_date: expectedResultDate.toISOString().split('T')[0],
              employee: "HR-EMP-00001", // Default employee
              employee_name: "Lab Technician",
              invoiced: 1, // Mark as invoiced
              invoice: salesInvoiceId, // Link to sales invoice
              normal_test_items: [],
              descriptive_test_items: [],
              organism_test_items: [],
              sensitivity_test_items: [],
              codification_table: []
            };

            const labTestResponse = await apiService.post("/resource/Lab Test", labTestPayload);
            const labTestId = labTestResponse.data?.data?.name;
            console.log(`Step 5.${index + 1} Complete: Lab Test ${labTestId} created for ${item.item_code}`);
            return labTestId;
          } catch (error) {
            console.error(`Error creating lab test for item ${item.item_code}:`, error);
            // Don't throw error for individual lab test failures
            return null;
          }
        });

        await Promise.all(labTestPromises);
        console.log("All lab tests created successfully");
      }
      */

      // Success!
      alert(`Billing created successfully!\n\nSales Invoice: ${salesInvoiceId}\nPayment Entry: ${paymentEntryId}`);
      navigate(basePath);

    } catch (err) {
      console.error("Error creating billing:", err);
      // Extract detailed error message from ERPNext response
      let errorMessage = "Failed to create billing. Please try again.";
      if (err.response?.data?.exc_type) {
        errorMessage = `${err.response.data.exc_type}: ${err.response.data._server_messages || err.response.data.message || err.message}`;
      } else if (err.response?.data?._server_messages) {
        try {
          const serverMessages = JSON.parse(err.response.data._server_messages);
          errorMessage = serverMessages.map(m => JSON.parse(m).message).join(", ");
        } catch {
          errorMessage = err.response.data._server_messages;
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <BillingContainer>
        <Title>Add Billing</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          {/* Patient & Company Information */}
          <FormSection>
            <SectionTitle>Patient & Company Information</SectionTitle>
            <FormGrid>
              <FormGroup>
                <FormLabel>
                  Patient<RequiredStar>*</RequiredStar>
                </FormLabel>
                {billingData.patient ? (
                  <SelectedTag>
                    <span>{billingData.patient_name || billingData.patient}</span>
                    <ClearButton type="button" onClick={clearPatient}>
                      <X />
                    </ClearButton>
                  </SelectedTag>
                ) : (
                  <SearchInputWrapper>
                    <SearchInput
                      type="text"
                      placeholder="Search patient..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      onFocus={() => patientSearch.length >= 2 && setShowPatientResults(true)}
                      onBlur={() => setTimeout(() => setShowPatientResults(false), 200)}
                    />
                    <SearchIcon>
                      {searchingPatient ? <Loader2 className="spinning" /> : <Search />}
                    </SearchIcon>
                    {showPatientResults && (
                      <SearchResults>
                        {patientResults.length > 0 ? (
                          patientResults.map((patient, index) => (
                            <SearchResultItem
                              key={index}
                              onMouseDown={() => handlePatientSelect(patient)}
                            >
                              {patient.value || patient.name} - {patient.description || ""}
                            </SearchResultItem>
                          ))
                        ) : (
                          <SearchResultEmpty>No patients found</SearchResultEmpty>
                        )}
                      </SearchResults>
                    )}
                  </SearchInputWrapper>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel>Company</FormLabel>
                <FormSelect
                  name="company"
                  value={billingData.company}
                  onChange={handleBillingChange}
                >
                  <option value="">Select company</option>
                  {companies.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.company_name || c.name}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Posting Date</FormLabel>
                <FormInput
                  type="date"
                  name="posting_date"
                  value={billingData.posting_date}
                  onChange={handleBillingChange}
                />
              </FormGroup>

            </FormGrid>

            <CheckboxGroup>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="set_posting_time"
                  checked={billingData.set_posting_time === 1}
                  onChange={handleBillingChange}
                />
                Edit Posting Date and Time
              </CheckboxLabel>
            </CheckboxGroup>
          </FormSection>

          {/* Practitioner & Service Information */}
          <FormSection style={{ marginTop: "24px" }}>
            <SectionTitle>Practitioner & Service Information</SectionTitle>
            <FormGrid>
              <FormGroup>
                <FormLabel>Referring Practitioner</FormLabel>
                <FormSelect
                  name="ref_practitioner"
                  value={billingData.ref_practitioner}
                  onChange={handleBillingChange}
                >
                  <option value="">Select practitioner</option>
                  {practitioners.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.practitioner_name || p.name}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Service Unit</FormLabel>
                <FormSelect
                  name="service_unit"
                  value={billingData.service_unit}
                  onChange={handleBillingChange}
                >
                  <option value="">Select service unit</option>
                  {serviceUnits.map((su) => (
                    <option key={su.name} value={su.name}>
                      {su.name}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

            </FormGrid>
          </FormSection>

          {/* Items Section */}
          <ItemsSection style={{ marginTop: "24px" }}>
            <ItemsHeader>
              <ItemsTitle>Items</ItemsTitle>
              <ItemButtons>
                <IconButton type="button" onClick={addItem}>
                  <Plus />
                </IconButton>
              </ItemButtons>
            </ItemsHeader>

            <ItemsTableWrapper>
              <ItemsTable>
                <TableHead>
                  <TableRow>
                    <TableHeader>#</TableHeader>
                    <TableHeader>Item Code</TableHeader>
                    <TableHeader>Item Name</TableHeader>
                    {/* <TableHeader>Warehouse</TableHeader> */}
                    {/* <TableHeader>UOM</TableHeader> */}
                    <TableHeader>Qty</TableHeader>
                    <TableHeader>Rate</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} style={{ textAlign: "center", padding: "24px", color: "#666" }}>
                        No items added. Click + to add items.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <ItemSearchWrapper>
                            {item.item_code ? (
                              <ItemInput type="text" value={item.item_code} disabled />
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
                          <ItemInput
                            type="text"
                            value={item.item_name}
                            disabled
                          />
                        </TableCell>
                        {/* <TableCell>
                          <FormSelect
                            value={item.warehouse}
                            onChange={(e) => handleItemChange(index, "warehouse", e.target.value)}
                            style={{ padding: "6px 8px", fontSize: "13px", minWidth: "120px" }}
                          >
                            {warehouses.map((w) => (
                              <option key={w.name} value={w.name}>
                                {w.name}
                              </option>
                            ))}
                            <option value="Finished Goods - RKMS">Finished Goods - RKMS</option>
                          </FormSelect>
                        </TableCell> */}
                        {/* <TableCell>
                          <ItemInput
                            type="text"
                            value={item.uom}
                            disabled
                            style={{ width: "60px" }}
                          />
                        </TableCell> */}
                        <TableCell>
                          <QtyControlWrapper>
                            <QtyButton
                              type="button"
                              onClick={() => {
                                const currentQty = parseFloat(item.qty) || 0;
                                if (currentQty > 1) {
                                  handleItemChange(index, "qty", currentQty - 1);
                                }
                              }}
                            >
                              <Minus />
                            </QtyButton>
                            <QtyInput
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                              min="1"
                            />
                            <QtyButton
                              type="button"
                              onClick={() => {
                                const currentQty = parseFloat(item.qty) || 0;
                                handleItemChange(index, "qty", currentQty + 1);
                              }}
                            >
                              <Plus />
                            </QtyButton>
                          </QtyControlWrapper>
                        </TableCell>
                        <TableCell>
                          <ItemInput
                            type="number"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                            style={{ width: "80px" }}
                          />
                        </TableCell>
                        <TableCell>
                          {(item.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DeleteItemButton type="button" onClick={() => removeItem(index)}>
                            <X />
                          </DeleteItemButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </ItemsTable>
            </ItemsTableWrapper>

            <ItemFooter>
              {/* <FooterItem>
                <FooterLabel>Apply Discount On</FooterLabel>
                <FormSelect
                  name="apply_discount_on"
                  value={billingData.apply_discount_on}
                  onChange={handleBillingChange}
                  style={{ padding: "6px 8px", fontSize: "13px" }}
                >
                  <option value="Grand Total">Grand Total</option>
                  <option value="Net Total">Net Total</option>
                </FormSelect>
              </FooterItem> */}
              <FooterItem>
                <FooterLabel>Discount %</FooterLabel>
                <DiscountInput
                  type="number"
                  name="additional_discount_percentage"
                  value={billingData.additional_discount_percentage}
                  onChange={handleBillingChange}
                  step="0.01"
                />
              </FooterItem>
              <FooterItem>
                <FooterLabel>Total Qty:</FooterLabel>
                <FooterValue>{totals.totalQty}</FooterValue>
              </FooterItem>
              <FooterItem>
                <FooterLabel>Total:</FooterLabel>
                <FooterValue>{totals.grossTotal.toFixed(2)}</FooterValue>
              </FooterItem>
            </ItemFooter>
          </ItemsSection>

          {/* Bottom Section - Calculations & Payment */}
          <BottomSection style={{ marginTop: "24px" }}>
            <CalculationCard>
              <CardTitle>Calculation</CardTitle>
              <CalculationRow>
                <CalculationLabel>Gross Total</CalculationLabel>
                <CalculationValue>{totals.grossTotal.toFixed(2)}</CalculationValue>
              </CalculationRow>
              <CalculationRow>
                <CalculationLabel>Discount Amount ({billingData.additional_discount_percentage}%)</CalculationLabel>
                <CalculationValue>{totals.discountAmount.toFixed(2)}</CalculationValue>
              </CalculationRow>
              <CalculationRow>
                <CalculationLabel bold>Net Total (INR)</CalculationLabel>
                <CalculationValue bold highlight>
                  {totals.netTotal.toFixed(2)}
                </CalculationValue>
              </CalculationRow>
            </CalculationCard>

            <CalculationCard>
              <CardTitle>Payment</CardTitle>
              <FormGroup>
                <FormLabel>Payment Type</FormLabel>
                <FormSelect
                  name="payment_type"
                  value={billingData.payment_type}
                  onChange={handleBillingChange}
                >
                  <option value="Cash">Cash</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Due Date</FormLabel>
                <FormInput
                  type="date"
                  name="due_date"
                  value={billingData.due_date}
                  onChange={handleBillingChange}
                />
              </FormGroup>
            </CalculationCard>
          </BottomSection>

          <ActionButtons style={{ marginTop: "24px" }}>
            <BackButton type="button" onClick={() => navigate(basePath)}>
              Back
            </BackButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading && <Loader2 size={18} />}
              {loading ? "Creating..." : "Create Billing"}
            </SubmitButton>
          </ActionButtons>
        </form>
      </BillingContainer>
    </Layout>
  );
};

export default AddBilling;
