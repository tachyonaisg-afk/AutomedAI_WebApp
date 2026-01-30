import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const CollectionContainer = styled.div`
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

const FormCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: span 2;

    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #f8f9fa;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
    background-color: #ffffff;
  }

  &::placeholder {
    color: #999999;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #f8f9fa;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;

  &:focus {
    border-color: #4a90e2;
    background-color: #ffffff;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  background-color: #f8f9fa;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    border-color: #4a90e2;
    background-color: #ffffff;
  }

  &::placeholder {
    color: #999999;
  }
`;

const ColorInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorIndicator = styled.div`
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.color || "#e0e0e0"};
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px #e0e0e0;
`;

const ColorInput = styled(Input)`
  padding-left: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
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

    &:hover {
      background-color: #357abd;
    }
  }

  &.secondary {
    background-color: #f5f5f5;
    color: #333333;
    border: 1px solid #e0e0e0;

    &:hover {
      background-color: #e8e8e8;
    }
  }
`;

const NewCollection = () => {
  usePageTitle("New Sample Collection");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: "",
    patient_name: "",
    gender: "",
    referring_practitioner: "",
    date: "",
    status: "Pending",
    sample: "",
    quantity_uom: "",
    container_color: "",
    collection_datetime: "",
    collected_by: "",
    notes: "",
  });

  const containerColors = {
    Lavender: "#9b88d4",
    Red: "#ef4444",
    Blue: "#3b82f6",
    Green: "#22c55e",
    Yellow: "#eab308",
    Gray: "#6b7280",
    Pink: "#ec4899",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Call API to save collection data
    // After successful save, navigate back to collection list
    navigate("/pathlab/collection");
  };

  const handleCancel = () => {
    navigate("/pathlab/collection");
  };

  return (
    <Layout>
      <CollectionContainer>
        <PageTitle>Sample Collection</PageTitle>

        <FormCard>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Patient ID</Label>
                <Input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  placeholder="P0654321"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Patient Name</Label>
                <Input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Gender</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Referring Practitioner</Label>
                <Input
                  type="text"
                  name="referring_practitioner"
                  value={formData.referring_practitioner}
                  onChange={handleChange}
                  placeholder="Dr. Emily Carter"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Collected">Collected</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Sample</Label>
                <Input
                  type="text"
                  name="sample"
                  value={formData.sample}
                  onChange={handleChange}
                  placeholder="Whole Blood"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Sample Quantity & Sample UOM</Label>
                <Input
                  type="text"
                  name="quantity_uom"
                  value={formData.quantity_uom}
                  onChange={handleChange}
                  placeholder="5 ml"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Container Color</Label>
                <ColorInputWrapper>
                  <ColorIndicator color={containerColors[formData.container_color]} />
                  <ColorInput
                    type="text"
                    name="container_color"
                    value={formData.container_color}
                    onChange={handleChange}
                    placeholder="Lavender"
                    required
                  />
                </ColorInputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Collection Date and Time</Label>
                <Input
                  type="datetime-local"
                  name="collection_datetime"
                  value={formData.collection_datetime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Collected by</Label>
                <Input
                  type="text"
                  name="collected_by"
                  value={formData.collected_by}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                />
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any relevant notes..."
                />
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <Button type="button" className="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="primary">
                Save
              </Button>
            </ButtonGroup>
          </form>
        </FormCard>
      </CollectionContainer>
    </Layout>
  );
};

export default NewCollection;
