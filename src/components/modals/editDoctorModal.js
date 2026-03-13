import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { X, User, Camera, Stethoscope, UserCheck } from "lucide-react";
import api from "../../services/api";

// --- Styled Components ---

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999999;
  padding: 2rem 1rem;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  width: 100%;
  max-width: 960px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
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

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #475569;
  }
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

const GridLayoutMain = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const ColSpan9 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-column: span 9 / span 9;
  }
`;

const ColSpan3 = styled.div`
  @media (min-width: 768px) {
    grid-column: span 3 / span 3;
  }
`;

const GridLayoutInner = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
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

const ToggleContainer = styled.div`
  display: flex;
  background-color: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.5rem;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.375rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${(props) => (props.$active ? "#ffffff" : "transparent")};
  color: ${(props) => (props.$active ? "#2563eb" : "#64748b")};
  box-shadow: ${(props) => (props.$active ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none")};

  &:hover {
    color: ${(props) => (props.$active ? "#2563eb" : "#334155")};
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  height: 100%;
`;

const ProfileLabel = styled(InputLabel)`
  text-align: left;
  @media (min-width: 768px) {
    text-align: center;
  }
`;

const ProfileUploadArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
`;

const ProfileOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(37, 99, 235, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileAvatarWrapper = styled.label`
  position: relative;
  cursor: pointer;
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  border: 4px solid #f1f5f9;
  background-color: #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  overflow: hidden;

  &:hover ${ProfileOverlay} {
    opacity: 1;
  }
`;

const UploadText = styled.span`
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  margin-top: 2px;
`;

const UploadHint = styled.p`
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  max-width: 160px;
  line-height: 1.25;
  margin: 0;
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

function EditDoctorModal({ onClose, doctor, autoEmpanel, empanelDoctor }) {
    const [classification, setClassification] = useState("allopathy");
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        mobile_phone: "",
        email: "",
        department: "",
        custom_registration_number: "",
        consultation_fee: "",
        custom_specializedqualification: ""
    });

    useEffect(() => {
        if (doctor) {

            setFormData({
                first_name: doctor.first_name || "",
                middle_name: "",
                last_name: doctor.last_name || "",
                gender: doctor.gender || "",
                mobile_phone: doctor.mobile_phone || "",
                email: doctor.email || "",
                department: doctor.department || "",
                custom_registration_number: doctor.custom_registration_number || "",
                consultation_fee: doctor.op_consulting_charge || "",
                custom_specializedqualification: doctor.custom_specializedqualification || ""
            });
        }
    }, [doctor]);

    // ✅ Fetch Current User
    useEffect(() => {

        try {

            const userData = localStorage.getItem("user");

            if (!userData) return;

            const parsedUser = JSON.parse(userData);

            if (parsedUser?.full_name) {

                setCurrentUser(parsedUser.full_name);

            }

        } catch { }

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get(
                    "https://hms.automedai.in/api/resource/Company"
                );

                const companyList = res.data?.data || [];

                setCompanies(companyList);

                if (companyList.length > 0) {
                    setSelectedCompany(companyList[0].name); // first company
                }
            } catch (err) {
                console.error("Error fetching companies", err);
            }
        };

        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const practitionerName = `${formData.first_name} ${formData.last_name}`;

            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                gender: formData.gender,
                mobile_phone: formData.mobile_phone,
                email: formData.email,
                department: formData.department,
                op_consulting_charge: Number(formData.consultation_fee) || 0,
                custom_registration_number: formData.custom_registration_number,
                custom_specializedqualification: formData.custom_specializedqualification
            };

            // 🔹 Create Practitioner
            const res = await api.put(
                `https://hms.automedai.in/api/resource/Healthcare Practitioner/${doctor.name}`,
                payload
            );

            console.log("Doctor Updated:", res.data);

            // 🔹 Extract Doctor ID
            const doctorId = res.data?.data?.name;

            // 🔹 Call second API for empanelment
            // const empanelPayload = {
            //     company: selectedCompany,
            //     doctor_id: doctorId,
            //     doctor_name: practitionerName,
            //     consultation_fee: formData.consultation_fee,
            //     created_by: currentUser
            // };

            // const empanelRes = await api.post(
            //     "https://midl.automedai.in/doctor_company/empanel",
            //     empanelPayload
            // );

            // console.log("Empanel Response:", empanelRes.data);

            // if (empanelRes.data.success) {
            //     alert("Doctor empanelled successfully");
            // } else {
            //     alert(empanelRes.data.message);
            // }
            alert("Doctor updated successfully");

            // Auto empanel if coming from empanel button
            if (autoEmpanel && empanelDoctor) {
                await empanelDoctor({
                    name: doctor.name,
                    practitioner_name: `${formData.first_name} ${formData.last_name}`,
                    op_consulting_charge: formData.consultation_fee
                });
            }

            onClose();

        } catch (error) {
            console.error("Error Editing doctor:", error);
            alert("Error Editing doctor");
        }
    };

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalHeader>
                    <TitleBlock>
                        <ModalTitle>Edit Doctor</ModalTitle>
                        <ModalSubtitle>
                            update details of medical professional to the AutoMed AI healthcare network.
                        </ModalSubtitle>
                    </TitleBlock>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    <FormContent id="empanelDoctorForm" onSubmit={handleSubmit}>
                        {/* Personal Info Section */}
                        <Section>
                            <SectionHeader>
                                <User size={20} />
                                <SectionTitle>Personal Info</SectionTitle>
                            </SectionHeader>

                            <GridLayoutMain>
                                <ColSpan9>
                                    <GridLayoutInner>
                                        <InputGroup>
                                            <InputLabel>
                                                First Name<span>*</span>
                                            </InputLabel>
                                            <FormControl
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                placeholder="Include Dr. if applicable"
                                                required
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <InputLabel>Middle Name</InputLabel>
                                            <FormControl type="text" />
                                        </InputGroup>
                                        <InputGroup>
                                            <InputLabel>
                                                Last Name<span>*</span>
                                            </InputLabel>
                                            <FormControl
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </InputGroup>
                                    </GridLayoutInner>
                                    <GridLayoutInner>
                                        <InputGroup>
                                            <InputLabel>
                                                Gender<span>*</span>
                                            </InputLabel>
                                            <FormSelect
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Transgender">Transgender</option>
                                                <option value="Prefer Not To Say">Prefer Not to Say</option>
                                                <option value="Non Confirming">Non-Confirming</option>
                                            </FormSelect>
                                        </InputGroup>
                                        <InputGroup>
                                            <InputLabel>
                                                Mobile Number<span>*</span>
                                            </InputLabel>
                                            <FormControl
                                                name="mobile_phone"
                                                value={formData.mobile_phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <InputLabel>Email-ID</InputLabel>
                                            <FormControl
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </InputGroup>
                                    </GridLayoutInner>
                                </ColSpan9>

                                <ColSpan3>
                                    <ProfileSection>
                                        <ProfileLabel>Profile Pic</ProfileLabel>
                                        <ProfileUploadArea>
                                            <ProfileAvatarWrapper>
                                                <User size={28} strokeWidth={1.5} />
                                                <UploadText>Upload</UploadText>
                                                <ProfileOverlay>
                                                    <Camera size={20} color="#2563eb" />
                                                </ProfileOverlay>
                                                <input type="file" style={{ display: "none" }} />
                                            </ProfileAvatarWrapper>
                                            <UploadHint>
                                                JPG or PNG, max 2MB.
                                                <br />
                                                Recommended 400x400px.
                                            </UploadHint>
                                        </ProfileUploadArea>
                                    </ProfileSection>
                                </ColSpan3>
                            </GridLayoutMain>
                        </Section>

                        <Divider />

                        {/* Medical Credentials Section */}
                        <Section>
                            <SectionHeader>
                                <Stethoscope size={20} />
                                <SectionTitle>Medical Credentials</SectionTitle>
                            </SectionHeader>

                            <GridLayout2Col>
                                <InputGroup>
                                    <InputLabel>
                                        Medical Classification<span>*</span>
                                    </InputLabel>
                                    <ToggleContainer>
                                        <ToggleButton
                                            type="button"
                                            $active={classification === "allopathy"}
                                            onClick={() => setClassification("allopathy")}
                                        >
                                            Allopathy
                                        </ToggleButton>
                                        <ToggleButton
                                            type="button"
                                            $active={classification === "ayush"}
                                            onClick={() => setClassification("ayush")}
                                        >
                                            AYUSH
                                        </ToggleButton>
                                    </ToggleContainer>
                                </InputGroup>
                                <InputGroup>
                                    <InputLabel>AYUSH Stream</InputLabel>
                                    <FormSelect disabled={classification !== "ayush"}>
                                        <option value="">Select Stream</option>
                                        <option value="Ayurveda">Ayurveda</option>
                                        <option value="Yoga & Naturopathy">Yoga & Naturopathy</option>
                                        <option value="Unani">Unani</option>
                                        <option value="Siddha">Siddha</option>
                                        <option value="Homeopathy">Homeopathy</option>
                                    </FormSelect>
                                </InputGroup>
                                <InputGroup>
                                    <InputLabel>Medical Department</InputLabel>
                                    <FormSelect
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="Paediatrics">Paediatrics</option>
                                        <option value="Dental">Dental</option>
                                        <option value="General Medicine">General Medicine</option>
                                        <option value="Orthopaedics">Orthopaedics</option>
                                    </FormSelect>
                                </InputGroup>
                                <InputGroup>
                                    <InputLabel>
                                        Registration Number / License ID<span>*</span>
                                    </InputLabel>
                                    <FormControl
                                        name="custom_registration_number"
                                        value={formData.custom_registration_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputLabel>
                                        Consultation Fee<span>*</span>
                                    </InputLabel>
                                    <FormControl
                                        name="consultation_fee"
                                        value={formData.consultation_fee}
                                        onChange={handleChange}
                                        type="number"
                                        required
                                    />
                                </InputGroup>
                                <InputGroup className="col-span-2">
                                    <InputLabel>Specialized Qualification</InputLabel>
                                    <FormControl
                                        name="custom_specializedqualification"
                                        value={formData.custom_specializedqualification}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            </GridLayout2Col>
                        </Section>
                    </FormContent>
                </ModalBody>

                <ModalFooter>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <SubmitButton type="submit" form="empanelDoctorForm">
                        <UserCheck size={18} />
                        Update Doctor Details
                    </SubmitButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
}

export default EditDoctorModal;