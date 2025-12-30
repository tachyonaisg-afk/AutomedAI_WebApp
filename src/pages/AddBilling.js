import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Plus, Minus } from "lucide-react";

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

  &:hover {
    background-color: #357abd;
  }
`;

const AddBilling = () => {
  const navigate = useNavigate();

  const [billingData, setBillingData] = useState({
    referringPractitioner: "",
    editPostingDate: false,
    discountPercent: 0,
    paymentType: "Cash",
  });

  const [items, setItems] = useState([]);

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Billing data:", billingData);
    console.log("Items:", items);
    console.log("Totals:", calculateTotals());
    // TODO: Add API call to create billing record
    alert("Billing created successfully!");
    navigate("/billing");
  };

  return (
    <Layout>
      <BillingContainer>
        <Title>Add Billing</Title>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Patient Information</SectionTitle>
            <FormGroup>
              <FormLabel>Referring Practitioner</FormLabel>
              <FormSelect
                name="referringPractitioner"
                value={billingData.referringPractitioner}
                onChange={handleBillingChange}
              >
                <option value="">Select practitioner</option>
                <option value="Dr. Emily White">Dr. Emily White</option>
                <option value="Dr. Smith">Dr. Smith</option>
                <option value="Dr. Johnson">Dr. Johnson</option>
              </FormSelect>
            </FormGroup>
            <CheckboxGroup>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="editPostingDate"
                  checked={billingData.editPostingDate}
                  onChange={handleBillingChange}
                />
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
                      <ItemInput
                        type="text"
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <ItemInput
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <ItemInput
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <ItemInput
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>{item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ItemsTable>

            <ItemFooter>
              <FooterItem>
                <FooterLabel>Discount %</FooterLabel>
                <DiscountInput
                  type="number"
                  name="discountPercent"
                  value={billingData.discountPercent}
                  onChange={handleBillingChange}
                />
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
                <CalculationValue bold highlight>{calculateTotals().netTotal.toFixed(2)}</CalculationValue>
              </CalculationRow>
            </CalculationCard>

            <CalculationCard>
              <CardTitle>Payment</CardTitle>
              <FormGroup>
                <FormLabel>Payment Type</FormLabel>
                <FormSelect
                  name="paymentType"
                  value={billingData.paymentType}
                  onChange={handleBillingChange}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Insurance">Insurance</option>
                </FormSelect>
              </FormGroup>
            </CalculationCard>
          </BottomSection>

          <ActionButtons>
            <BackButton type="button" onClick={() => navigate("/billing")}>Back</BackButton>
            <SubmitButton type="submit">Create Billing</SubmitButton>
          </ActionButtons>
        </form>
      </BillingContainer>
    </Layout>
  );
};

export default AddBilling;
