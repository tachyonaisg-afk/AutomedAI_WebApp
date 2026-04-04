import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import AsyncSelect from "react-select/async";
import WorksheetEditor from "../utils/WorksheetEditor";
import { useNavigate, useParams } from "react-router-dom";
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
  gap: 1.5rem;
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

const CheckBoxControl = styled.input`
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

//   &:focus {
//     box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
//     border-color: #2563eb;
//   }

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
    const { id } = useParams();
    const decodedId = id ? decodeURIComponent(id) : null;
    const isEditMode = Boolean(id);

    const [groupRows, setGroupRows] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [samples, setSamples] = useState([]);
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
        worksheet_instructions: "",
    });
    const isSingle = form.lab_test_template_type === "Single";

    const [itemGroups, setItemGroups] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [company, setCompany] = useState("");
    const [compoundRows, setCompoundRows] = useState([]);

    const navigate = useNavigate();

    // ================= FETCH DROPDOWNS =================

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const [ig, uom, dept, comp, sampleRes] = await Promise.all([
                api.get("/resource/Item Group"),
                api.get("/resource/Lab Test UOM"),
                api.get("/resource/Medical Department?limit_page_length=1500"),
                api.get("/resource/Company"),
                api.get("/resource/Lab Test Sample"),
            ]);

            setItemGroups(ig.data.data || []);
            setUoms(uom.data.data || []);
            setDepartments(dept.data.data || []);
            setCompany(comp.data.data?.[0]?.name || "");
            setSamples(sampleRes.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const addRow = () => {
        setGroupRows(prev => [
            ...prev,
            {
                type: "test",
                lab_test_template: null,
                description: "",
                event: "",
                allow_blank: 0,
                disabled: false
            }
        ]);
    };

    const deleteRow = (index) => {
        setGroupRows(prev => prev.filter((_, i) => i !== index));
    };

    //Compound Row manage
    const addCompoundRow = () => {
        setCompoundRows(prev => [
            ...prev,
            {
                lab_test_event: "",
                lab_test_uom: "",
                normal_range: "",
                allow_blank: 0
            }
        ]);
    };

    const deleteCompoundRow = (index) => {
        setCompoundRows(prev => prev.filter((_, i) => i !== index));
    };

    // ================= HANDLE CHANGE =================

    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];

        try {
            const res = await api.post(
                "/method/frappe.desk.search.search_link",
                {
                    txt: inputValue,
                    doctype: "Lab Test Template",
                    ignore_user_permissions: 1,
                    reference_doctype: "Lab Test Group Template",
                    page_length: 10,
                    filters: {
                        lab_test_template_type: ["in", ["Single", "Compound"]],
                    },
                }
            );

            const data = res.data;

            return data.message.map((item) => ({
                label: item.value,
                value: item.value,
                description: item.description,
            }));
        } catch (err) {
            console.error(err);
            return [];
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

    const handleRowChange = (index, field, value) => {
        const updated = [...groupRows];

        // TEST SELECTED
        if (field === "lab_test_template") {
            updated[index].type = "test";
            updated[index].lab_test_template = value;
            updated[index].description = value?.description || "";
            updated[index].event = "";
            updated[index].allow_blank = 0;
        }

        // EVENT INPUT
        if (field === "event") {
            updated[index].event = value;

            if (value) {
                updated[index].type = "event";
                updated[index].lab_test_template = null;
                updated[index].description = "";
                updated[index].allow_blank = 1;
            } else {
                updated[index].type = "test";
                updated[index].allow_blank = 0;
            }
        }

        setGroupRows(updated);
    };

    //Handle Compound Change
    const handleCompoundChange = (index, field, value) => {
        const updated = [...compoundRows];
        updated[index][field] = value;
        setCompoundRows(updated);
    };

    const templateTypes = [
        "Single",
        "Compound",
        "Descriptive",
        "Grouped",
        "Imaging",
        "No Result",
    ];

    useEffect(() => {
        if (!isSingle) {
            setForm(prev => ({
                ...prev,
                lab_test_uom: "",
                normal_range: ""
            }));
        }
    }, [form.lab_test_template_type]);

    useEffect(() => {
        if (form.lab_test_template_type === "Compound") {
            if (compoundRows.length === 0) addCompoundRow();
            setGroupRows([]); // 🔥 clear grouped
        }

        if (form.lab_test_template_type === "Grouped") {
            if (groupRows.length === 0) addRow();
            setCompoundRows([]); // 🔥 clear compound
        }
    }, [form.lab_test_template_type]);

    // ================= SUBMIT =================

    const fetchTestDetails = async () => {
        try {
            const res = await api.get(`/resource/Lab Test Template/${decodedId}`);
            const data = res.data.data;

            // ===== SET FORM =====
            setForm({
                lab_test_name: data.lab_test_name || "",
                custom_display_name: data.custom_display_name || "",
                lab_test_code: data.lab_test_code || "",
                department: data.department || "",
                item_group: data.lab_test_group || "",
                lab_test_uom: data.lab_test_uom || data.sample_uom || "",
                lab_test_rate: data.lab_test_rate || "",
                description: data.lab_test_description || "",
                normal_range: data.lab_test_normal_range || "",
                sample: data.sample || "",
                gst_hsn_code: "999312",
                lab_test_template_type: data.lab_test_template_type || "Single",
                worksheet_instructions: data.worksheet_instructions || "",
                item: data.item || "",
            });

            // ===== HANDLE COMPOUND =====
            if (data.lab_test_template_type === "Compound") {
                const rows = data.normal_test_templates.map((r) => ({
                    lab_test_event: r.lab_test_event || "",
                    lab_test_uom: r.lab_test_uom || "",
                    normal_range: r.normal_range || "",
                    allow_blank: r.allow_blank || 0,
                }));

                setCompoundRows(rows);
            }

            // ===== HANDLE GROUPED =====
            if (data.lab_test_template_type === "Grouped") {
                const rows = data.lab_test_groups.map((g) => ({
                    type: g.template_or_new_line === "Add Test" ? "test" : "event",
                    lab_test_template:
                        g.template_or_new_line === "Add Test"
                            ? { label: g.lab_test_template, value: g.lab_test_template }
                            : null,
                    description: g.lab_test_description || "",
                    event:
                        g.template_or_new_line === "Add New Line"
                            ? g.group_event || g.lab_test_description || ""
                            : "",
                    allow_blank: g.allow_blank || 0,
                }));

                setGroupRows(rows);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to load test data");
        }
    };

    useEffect(() => {
        if (isEditMode) {
            fetchTestDetails();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ================= VALIDATION =================

            if (!form.lab_test_name || !form.lab_test_code || !form.lab_test_rate) {
                alert("Please fill all required fields");
                return;
            }

            if (form.lab_test_template_type === "Grouped") {
                if (groupRows.length === 0) {
                    alert("Please add at least one row in grouped test");
                    return;
                }
            }

            // ================= STEP 1: CREATE ITEM =================
            let createdItem = form.item;
            if (!isEditMode) {
                const itemRes = await api.post("/resource/Item", {
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
                });

                createdItem = itemRes?.data?.data?.name;
            }

            if (!createdItem) {
                throw new Error("Item creation failed");
            }

            // ================= BUILD Compound DATA =================

            let normal_test_templates = [];

            if (form.lab_test_template_type === "Compound") {
                if (compoundRows.length === 0) {
                    alert("Please add at least one row in compound test");
                    return;
                }

                normal_test_templates = compoundRows
                    .filter(row => row.lab_test_event)
                    .map(row => ({
                        lab_test_event: row.lab_test_event,
                        lab_test_uom: row.lab_test_uom,
                        normal_range: row.normal_range,
                        allow_blank: 0
                    }));

                if (normal_test_templates.length === 0) {
                    alert("Invalid compound rows");
                    return;
                }
            }

            // ================= BUILD GROUP DATA =================

            let lab_test_groups = [];

            if (form.lab_test_template_type === "Grouped") {
                lab_test_groups = groupRows
                    .filter((row) => row.lab_test_template || row.event)
                    .map((row) => {
                        if (row.type === "test" && row.lab_test_template) {
                            return {
                                template_or_new_line: "Add Test",
                                lab_test_template: row.lab_test_template.value, // ✅ FIX
                            };
                        }

                        if (row.type === "event" && row.event) {
                            return {
                                template_or_new_line: "Add New Line",
                                group_event: row.event,
                                allow_blank: 1,
                            };
                        }

                        return null;
                    })
                    .filter(Boolean);

                if (lab_test_groups.length === 0) {
                    alert("Invalid grouped rows. Please check your entries.");
                    return;
                }
            }

            // ================= STEP 2: CREATE LAB TEST =================

            const payload = {
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
                worksheet_instructions: form.worksheet_instructions,

                // ✅ only include if compound
                ...(form.lab_test_template_type === "Compound" && {
                    normal_test_templates,
                }),

                // ✅ only include if grouped
                ...(form.lab_test_template_type === "Grouped" && {
                    lab_test_groups,
                }),
            };

            let labRes;

            if (isEditMode) {
                labRes = await api.put(`/resource/Lab Test Template/${decodedId}`, payload);
            } else {
                labRes = await api.post("/resource/Lab Test Template", payload);
            }

            const labData = labRes?.data;

            if (!labData?.data) {
                throw new Error("Lab Test creation failed");
            }

            // ================= SUCCESS =================

            alert(
                isEditMode
                    ? "Lab Test Updated Successfully ✅"
                    : "Lab Test Created Successfully ✅"
            );
            navigate("/pathlab/admin/test-manage", {
                state: { refresh: true },
            });

        } catch (err) {
            console.error(err);

            // Better error handling
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong";

            alert(errorMessage);
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
                            <ModalTitle> {isEditMode ? "Edit Lab Test" : "Add Lab Test"} </ModalTitle>
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
                                        <InputLabel>Display Name <span>*</span></InputLabel>
                                        <FormControl
                                            name="custom_display_name"
                                            value={form.custom_display_name}
                                            onChange={handleChange}
                                            required
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
                                        <InputLabel>Sample <span>*</span></InputLabel>
                                        <FormSelect
                                            name="sample"
                                            value={form.sample}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Sample</option>
                                            {samples.map((s) => (
                                                <option key={s.name} value={s.name}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </FormSelect>
                                    </InputGroup>

                                    {isSingle && (
                                        <InputGroup>
                                            <InputLabel>UOM <span>*</span></InputLabel>
                                            <FormSelect
                                                name="lab_test_uom"
                                                value={form.lab_test_uom}
                                                onChange={handleChange}
                                                required={isSingle}
                                            >
                                                <option value="">Select UOM</option>
                                                {uoms.map((u) => (
                                                    <option key={u.name}>{u.name}</option>
                                                ))}
                                            </FormSelect>
                                        </InputGroup>
                                    )}

                                </GridLayout2Col>
                            </Section>


                            {form.lab_test_template_type === "Grouped" && (
                                <Section>
                                    <SectionHeader style={{ justifyContent: "space-between" }}>
                                        <SectionTitle>Grouped Tests</SectionTitle>
                                        <SubmitButton type="button" onClick={addRow}>
                                            + Add Row
                                        </SubmitButton>
                                    </SectionHeader>

                                    <div style={{ overflowX: "auto", minHeight: "200px" }}>
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "separate",
                                                borderSpacing: "10px 10px",
                                            }}
                                        >
                                            <thead style={{ background: "#bbd9f8", height: "40px" }}>
                                                <tr style={{ background: "#f8fafc" }}>
                                                    <th>No.</th>
                                                    <th>Test Name</th>
                                                    <th>Description</th>
                                                    <th>Event</th>
                                                    <th>Allow Blank</th>
                                                    <th></th>
                                                </tr>
                                            </thead>

                                            <tbody style={{ background: "#f8fafc" }}>
                                                {groupRows.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>

                                                        {/* TEST NAME */}
                                                        <td style={{ minWidth: "220px" }}>
                                                            <AsyncSelect
                                                                cacheOptions
                                                                defaultOptions
                                                                loadOptions={loadOptions}
                                                                value={row.lab_test_template}
                                                                isDisabled={row.type === "event"}
                                                                onChange={(selected) =>
                                                                    handleRowChange(index, "lab_test_template", selected)
                                                                }
                                                                placeholder="Search Test..."

                                                                menuPortalTarget={document.body}   // ✅ KEY FIX
                                                                menuPosition="fixed"               // ✅ important

                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: "38px",
                                                                        borderRadius: "8px",
                                                                        borderColor: "#e2e8f0",
                                                                        backgroundColor: "#f8fafc",
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999, // ensure on top
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                    }),
                                                                }}
                                                            />
                                                        </td>

                                                        {/* DESCRIPTION */}
                                                        <td>
                                                            <FormControl
                                                                value={row.description}
                                                                disabled
                                                            />
                                                        </td>

                                                        {/* EVENT */}
                                                        <td>
                                                            <FormControl
                                                                disabled={row.type === "test" && row.lab_test_template}
                                                                value={row.event}
                                                                onChange={(e) =>
                                                                    handleRowChange(index, "event", e.target.value)
                                                                }
                                                            />
                                                        </td>

                                                        {/* ALLOW BLANK */}
                                                        <td>
                                                            <CheckBoxControl
                                                                type="checkbox"
                                                                checked={row.allow_blank === 1}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteRow(index)}
                                                                style={{
                                                                    // background: "#ef4444",
                                                                    color: "#ff0000",
                                                                    border: "none",
                                                                    padding: "6px 12px",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer",
                                                                    fontSize: "22px",
                                                                    fontWeight: "bold",
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                X
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Section>
                            )}

                            {form.lab_test_template_type === "Compound" && (
                                <Section>
                                    <SectionHeader style={{ justifyContent: "space-between" }}>
                                        <SectionTitle>Compound Tests</SectionTitle>
                                        <SubmitButton type="button" onClick={addCompoundRow}>
                                            + Add Row
                                        </SubmitButton>
                                    </SectionHeader>

                                    <div style={{ overflowX: "auto", minHeight: "200px" }}>
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "separate",
                                                borderSpacing: "10px 10px",
                                            }}
                                        >
                                            <thead style={{ background: "#bbd9f8", height: "40px" }}>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Event</th>
                                                    <th>UOM</th>
                                                    <th>Normal Range</th>
                                                    <th></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {compoundRows.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>

                                                        <td>
                                                            <FormControl
                                                                value={row.lab_test_event}
                                                                onChange={(e) =>
                                                                    handleCompoundChange(index, "lab_test_event", e.target.value)
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            <FormSelect
                                                                value={row.lab_test_uom}
                                                                onChange={(e) =>
                                                                    handleCompoundChange(index, "lab_test_uom", e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select</option>
                                                                {uoms.map((u) => (
                                                                    <option key={u.name}>{u.name}</option>
                                                                ))}
                                                            </FormSelect>
                                                        </td>

                                                        <td>
                                                            <FormControl
                                                                value={row.normal_range}
                                                                onChange={(e) =>
                                                                    handleCompoundChange(index, "normal_range", e.target.value)
                                                                }
                                                            />
                                                        </td>

                                                        <td style={{ textAlign: "center" }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteCompoundRow(index)}
                                                                style={{
                                                                    color: "#ff0000",
                                                                    border: "none",
                                                                    fontSize: "20px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                X
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Section>
                            )}

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

                                    {isSingle && (
                                        <InputGroup className="col-span-2">
                                            <InputLabel>Normal Range</InputLabel>
                                            <FormControl
                                                as="textarea"
                                                name="normal_range"
                                                value={form.normal_range}
                                                onChange={handleChange}
                                            />
                                        </InputGroup>
                                    )}

                                    <InputGroup className="col-span-2">
                                        <InputLabel>Worksheet Instructions</InputLabel>

                                        <WorksheetEditor
                                            value={form.worksheet_instructions}
                                            onChange={(value) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    worksheet_instructions: value,
                                                }))
                                            }
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
                            {isEditMode ? "Update Lab Test" : "Create Lab Test"}
                        </SubmitButton>
                    </ModalFooter>
                </ModalContainer>
            </PageWrapper>
        </Layout>
    );
}

export default AddNewTest;