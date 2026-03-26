import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";

// ================= STYLES =================

const PageWrapper = styled.div`
  padding: 24px;
`;


const BackButton = styled.button`
  margin-bottom: 15px;
  padding: 8px 14px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

// --- Styled Components ---

const ModalContainer = styled.div`
  background-color: #ffffff;
  width: 100%;
  max-width: 1500px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  font-family: 'Inter', sans-serif;
  padding: 0rem 0rem 0rem 1rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
`;

const TitleBlock = styled.div``;

const ModalTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`;

const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Section = styled.section``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #2563eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const GridLayout2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &.col-span-2 {
    @media (min-width: 768px) {
      grid-column: span 2 / span 2;
    }
  }
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;

  span {
    color: #ef4444;
  }
`;

const FormControl = styled.input`
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 0.625rem 1rem;
  color: #0f172a;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 0.625rem 1rem;
  color: #0f172a;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  appearance: auto;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  border-radius: 0 0 16px 16px;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: #475569;

  &:hover {
    background-color: #e2e8f0;
  }
`;

const SubmitButton = styled.button`
  padding: 0.625rem 2rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1d4ed8;
  }
`;

// ================= COMPONENT =================

function AddNewTest() {
    const [form, setForm] = useState({
        item_name: "",
        lab_test_name: "",
        custom_display_name: "",
        lab_test_code: "",
        department: "",
        item_group: "",
        lab_test_uom: "",
        lab_test_rate: "",
        description: "",
        normal_range: "",
        sample: "",
        gst_hsn_code: "999312",
        lab_test_template_type: "Single",
    });

    const [itemGroups, setItemGroups] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [company, setCompany] = useState("");

    // ================= FETCH DROPDOWNS =================

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const [ig, uom, dept, comp] = await Promise.all([
                api.get("https://hms.automedai.in/api/resource/Item Group"),
                api.get("https://hms.automedai.in/api/resource/Lab%20Test%20UOM"),
                api.get("https://hms.automedai.in/api/resource/Medical Department?limit_page_length=1500"),
                api.get("https://hms.automedai.in/api/resource/Company"),
            ]);

            const igData = await ig.json();
            const uomData = await uom.json();
            const deptData = await dept.json();
            const compData = await comp.json();

            setItemGroups(igData.data || []);
            setUoms(uomData.data || []);
            setDepartments(deptData.data || []);
            setCompany(compData.data?.[0]?.name || "");
        } catch (err) {
            console.error(err);
        }
    };

    // ================= HANDLE CHANGE =================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            let updated = { ...prev, [name]: value };

            // Auto-fill display name from lab test name
            if (name === "lab_test_name") {
                updated.custom_display_name = value;
            }

            return updated;
        });
    };

    const templateTypes = [
        "Single",
        "Compound",
        "Descriptive",
        "Grouped",
        "Imaging",
        "No Result",
    ];

    // ================= SUBMIT =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // STEP 1: CREATE ITEM
            const itemRes = await api.post(
                "https://hms.automedai.in/api/resource/Item",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        item_name: form.lab_test_name,
                        item_group: form.item_group,
                        stock_uom: "Nos",
                        gst_hsn_code: form.gst_hsn_code || "999312",
                        maintain_stock: 0,
                        is_stock_item: 0,
                        item_defaults: [
                            {
                                company: company,
                                default_price_list: "Standard Selling",
                            },
                        ],
                    }),
                }
            );

            const itemData = await itemRes.json();

            if (!itemRes.ok) {
                throw new Error(itemData.message || "Item creation failed");
            }

            const createdItem = itemData.data.name;

            // STEP 2: CREATE LAB TEST
            const labRes = await api.post(
                "https://hms.automedai.in/api/resource/Lab Test Template",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        lab_test_name: form.lab_test_name,
                        lab_test_code: form.lab_test_code,
                        lab_test_description: form.description,
                        department: form.department,
                        lab_test_group: form.item_group,
                        lab_test_template_type: form.lab_test_template_type,
                        lab_test_rate: Number(form.lab_test_rate),
                        link_existing_item: 1,
                        item: createdItem,
                        custom_display_name: form.custom_display_name,
                        lab_test_uom: form.lab_test_uom,
                        result_type: form.lab_test_template_type,
                        lab_test_normal_range: form.normal_range,
                        sample: form.sample,
                        sample_qty: 1,
                        custom_company: company,
                    }),
                }
            );

            const labData = await labRes.json();

            if (!labRes.ok) {
                throw new Error(labData.message || "Lab Test creation failed");
            }

            alert("Lab Test Created Successfully ✅");
            window.history.back();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    // ================= UI =================

    return (
        <Layout>
            <PageWrapper>
                {/* TOP BAR */}
                {/* CARD CONTAINER */}
                <ModalContainer style={{ position: "relative", inset: "unset", margin: "0 auto" }}>

                    {/* HEADER */}
                    <ModalHeader>
                        <TitleBlock>
                            <BackButton onClick={() => window.history.back()}>
                                <ArrowLeft size={16} /> Back
                            </BackButton>
                            <ModalTitle>Add Lab Test</ModalTitle>
                            <ModalSubtitle>
                                Create a new lab test template for your system
                            </ModalSubtitle>
                        </TitleBlock>
                    </ModalHeader>

                    {/* BODY */}
                    <ModalBody>
                        <FormContent onSubmit={handleSubmit} id="labTestForm">

                            {/* BASIC INFO */}
                            <Section>
                                <SectionHeader>
                                    <SectionTitle>Basic Information</SectionTitle>
                                </SectionHeader>

                                <GridLayout2Col>
                                    <InputGroup>
                                        <InputLabel>Lab Test Name <span>*</span></InputLabel>
                                        <FormControl
                                            name="lab_test_name"
                                            value={form.lab_test_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>Lab Test Code <span>*</span></InputLabel>
                                        <FormControl
                                            name="lab_test_code"
                                            value={form.lab_test_code}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>Lab Test Rate <span>*</span></InputLabel>
                                        <FormControl
                                            type="number"
                                            name="lab_test_rate"
                                            value={form.lab_test_rate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>Display Name</InputLabel>
                                        <FormControl
                                            name="custom_display_name"
                                            value={form.custom_display_name}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </GridLayout2Col>
                            </Section>

                            <Divider />

                            {/* CLASSIFICATION */}
                            <Section>
                                <SectionHeader>
                                    <SectionTitle>Classification</SectionTitle>
                                </SectionHeader>

                                <GridLayout2Col>
                                    <InputGroup>
                                        <InputLabel>Item Group <span>*</span></InputLabel>
                                        <FormSelect
                                            name="item_group"
                                            value={form.item_group}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Item Group</option>
                                            {itemGroups.map((g) => (
                                                <option key={g.name}>{g.name}</option>
                                            ))}
                                        </FormSelect>
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>Department <span>*</span></InputLabel>
                                        <FormSelect
                                            name="department"
                                            value={form.department}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((d) => (
                                                <option key={d.name}>{d.name}</option>
                                            ))}
                                        </FormSelect>
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>UOM <span>*</span></InputLabel>
                                        <FormSelect
                                            name="lab_test_uom"
                                            value={form.lab_test_uom}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select UOM</option>
                                            {uoms.map((u) => (
                                                <option key={u.name}>{u.name}</option>
                                            ))}
                                        </FormSelect>
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>Sample <span>*</span></InputLabel>
                                        <FormControl
                                            name="sample"
                                            value={form.sample}
                                            onChange={handleChange}
                                            placeholder="e.g. Blood"
                                            required
                                        />
                                    </InputGroup>

                                    <InputGroup>
                                        <InputLabel>Template Type</InputLabel>
                                        <FormSelect
                                            name="lab_test_template_type"
                                            value={form.lab_test_template_type}
                                            onChange={handleChange}
                                        >
                                            {templateTypes.map((type) => (
                                                <option key={type}>{type}</option>
                                            ))}
                                        </FormSelect>
                                    </InputGroup>
                                </GridLayout2Col>
                            </Section>

                            <Divider />

                            {/* DETAILS */}
                            <Section>
                                <SectionHeader>
                                    <SectionTitle>Additional Details</SectionTitle>
                                </SectionHeader>

                                <GridLayout2Col>
                                    <InputGroup className="col-span-2">
                                        <InputLabel>Lab Test Description</InputLabel>
                                        <FormControl
                                            as="textarea"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>

                                    <InputGroup className="col-span-2">
                                        <InputLabel>Normal Range</InputLabel>
                                        <FormControl
                                            as="textarea"
                                            name="normal_range"
                                            value={form.normal_range}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </GridLayout2Col>
                            </Section>

                        </FormContent>
                    </ModalBody>

                    {/* FOOTER */}
                    <ModalFooter>
                        <CancelButton onClick={() => window.history.back()}>
                            Cancel
                        </CancelButton>

                        <SubmitButton type="submit" form="labTestForm">
                            Create Lab Test
                        </SubmitButton>
                    </ModalFooter>
                </ModalContainer>
            </PageWrapper>
        </Layout>
    );
}

export default AddNewTest;