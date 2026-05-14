import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/Layout/Layout";
import api, { API_ENDPOINTS } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";
import { ArrowLeft, Save } from "lucide-react";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const LoadingContainer = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: #dc2626;
  margin: 0;
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #999999;
  margin: -4px 0 0 0;
`;

const EditPatientDetails = () => {
  usePageTitle("Edit Patient");

  const { id } = useParams();
  const navigate = useNavigate();

  const addressRefs = useRef([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [addressResults, setAddressResults] = useState([]);
  const [showAddressResults, setShowAddressResults] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [activeAddressIndex, setActiveAddressIndex] = useState(-1);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    uid: "",
    dob: "",
    age: "",
    sex: "",
    mobile: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    custom_religion: "",
    custom_cast: "",
  });

  const casteOptions = [
    { label: "General", value: "General" },
    { label: "SC", value: "SC" },
    { label: "ST", value: "ST" },
    { label: "OBC-A", value: "OBC-A" },
    { label: "OBC-B", value: "OBC-B" },
    { label: "Other", value: "Other" },
    { label: "Prefer Not to Say", value: "Prefer Not to Say" },
  ];

  const getFilteredCastes = () => {
    const religion = formData.custom_religion;

    if (!religion) return [];

    if (religion === "Hindu") {
      return casteOptions.filter((caste) => caste.value !== "OBC-B");
    }

    if (religion === "Muslim") {
      return casteOptions.filter(
        (caste) =>
          caste.value === "General" || caste.value === "OBC-B"
      );
    }

    return casteOptions;
  };

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const calculateDOBFromAge = (age) => {
    if (!age) return "";

    const today = new Date();
    const dob = new Date(
      today.getFullYear() - age,
      today.getMonth(),
      today.getDate()
    );

    return dob.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);

        const patientRes = await api.get(
          `/api/resource/Patient/${id}`
        );

        const patient = patientRes?.data?.data;

        const addressRes = await api.get(
          `/api/resource/Address?filters=${encodeURIComponent(
            JSON.stringify([
              ["Dynamic Link", "link_doctype", "=", "Patient"],
              ["Dynamic Link", "link_name", "=", id],
            ])
          )}&fields=${encodeURIComponent(JSON.stringify(["*"]))}`
        );

        const address = addressRes?.data?.data?.[0] || {};

        setFormData({
          first_name: patient?.first_name || "",
          middle_name: patient?.middle_name || "",
          last_name: patient?.last_name || "",
          uid: patient?.uid || "",
          dob: patient?.dob || "",
          age: patient?.dob ? calculateAge(patient?.dob) : "",
          sex: patient?.sex || "",
          mobile: patient?.mobile || "",
          address_line1: address?.address_line1 || "",
          address_line2: address?.address_line2 || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
          country: address?.country || "India",
          custom_religion: patient?.custom_religion || "",
          custom_cast: patient?.custom_cast || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;

    setFormData((prev) => ({
      ...prev,
      dob,
      age: calculateAge(dob),
    }));
  };

  const handleAgeChange = (e) => {
    const age = e.target.value;

    setFormData((prev) => ({
      ...prev,
      age,
      dob: calculateDOBFromAge(age),
    }));
  };

  const searchAddress = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setAddressResults([]);
      setShowAddressResults(false);
      return;
    }

    setSearchingAddress(true);

    try {
      const res = await fetch(
        `https://midl.automedai.in/location/autocomplete?input=${encodeURIComponent(
          query
        )}`
      );

      const data = await res.json();

      if (data.success) {
        setAddressResults(data.data || []);
        setShowAddressResults(true);
      }
    } catch (err) {
      console.error("Address search error:", err);
    } finally {
      setSearchingAddress(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchAddress(addressSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [addressSearch, searchAddress]);

  const handleAddressSelect = async (place) => {
    try {
      const res = await fetch(
        `https://midl.automedai.in/location/details?place_id=${place.place_id}`
      );

      const data = await res.json();

      if (data.success && data.data) {
        const d = data.data;

        setFormData((prev) => ({
          ...prev,
          address_line1: d.name || "",
          address_line2: d.address_line_2 || "",
          city: d.district || "",
          state: d.state || "",
          country: d.country || "",
          pincode: String(d.postal_code || ""),
        }));
      }
    } catch (err) {
      console.error(err);
    }

    setShowAddressResults(false);
    setAddressSearch("");
    setActiveAddressIndex(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        uid: formData.uid,
        dob: formData.dob,
        sex: formData.sex,
        mobile: formData.mobile,
        custom_religion: formData.custom_religion,
        custom_cast: formData.custom_cast,
      };

      await api.put(`/api/resource/Patient/${id}`, payload);

      navigate(`/patients/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update patient");
    } finally {
      setSubmitting(false);
    }
  };

  // if (loading) {
  //   return (
  //     <Layout>
  //       <LoadingContainer>Loading patient details...</LoadingContainer>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <PageContainer>
        <Header>
          <TitleContainer>
            <Title>Edit Patient</Title>
            <Subtitle>{id}</Subtitle>
          </TitleContainer>

          <ButtonGroup>
            <SecondaryButton onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Back
            </SecondaryButton>

            <PrimaryButton onClick={handleSubmit} disabled={submitting}>
              <Save size={16} />
              {submitting ? "Saving..." : "Save Changes"}
            </PrimaryButton>
          </ButtonGroup>
        </Header>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>

            <FormGrid>
              <FormGroup>
                <FormLabel>
                  First Name<RequiredAsterisk>*</RequiredAsterisk>
                </FormLabel>

                <FormInput
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Middle Name</FormLabel>

                <FormInput
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Last Name<RequiredAsterisk>*</RequiredAsterisk>
                </FormLabel>

                <FormInput
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>UID</FormLabel>

                <FormInput
                  type="text"
                  name="uid"
                  value={formData.uid}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Date of Birth</FormLabel>

                <FormInput
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleDOBChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Age</FormLabel>

                <FormInput
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleAgeChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Gender</FormLabel>

                <FormSelect
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Mobile</FormLabel>

                <FormInput
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <HelperText>
                  Enter valid 10 digit mobile number
                </HelperText>
              </FormGroup>

              <FormGroup>
                <FormLabel>Religion</FormLabel>

                <FormSelect
                  name="custom_religion"
                  value={formData.custom_religion}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      custom_religion: e.target.value,
                      custom_cast: "",
                    }));
                  }}
                >
                  <option value="">Select Religion</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jain">Jain</option>
                  <option value="Parsi">Parsi</option>
                  <option value="Jewish">Jewish</option>
                  <option value="Atheist / No Religion">
                    Atheist / No Religion
                  </option>
                  <option value="Other">Other</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Caste</FormLabel>

                <FormSelect
                  name="custom_cast"
                  value={formData.custom_cast}
                  onChange={handleInputChange}
                >
                  <option value="">Select Caste</option>

                  {getFilteredCastes().map((caste) => (
                    <option key={caste.value} value={caste.value}>
                      {caste.label}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
            </FormGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>Address Information</SectionTitle>

            <FormGrid>
              <FormGroup fullWidth>
                <FormLabel>Address Line 1</FormLabel>

                <div style={{ position: "relative", width: "100%" }}>
                  <FormInput
                    style={{ width: "100%" }}
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={(e) => {
                      handleInputChange(e);
                      setAddressSearch(e.target.value);
                    }}
                    placeholder="Start typing address..."
                  />

                  {showAddressResults && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        maxHeight: "220px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {addressResults.length > 0 ? (
                        addressResults.map((item, idx) => (
                          <div
                            key={idx}
                            ref={(el) => (addressRefs.current[idx] = el)}
                            onMouseDown={() =>
                              handleAddressSelect(item)
                            }
                            style={{
                              padding: "10px",
                              cursor: "pointer",
                            }}
                          >
                            {item.description}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "10px" }}>
                          {searchingAddress
                            ? "Searching..."
                            : "No Results"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormGroup>

              <FormGroup>
                <FormLabel>Address Line 2</FormLabel>

                <FormInput
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>District</FormLabel>

                <FormInput
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>State</FormLabel>

                <FormInput
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Pincode</FormLabel>

                <FormInput
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Country</FormLabel>

                <FormInput
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormGrid>
          </FormSection>
        </form>
      </PageContainer>
    </Layout>
  );
};

export default EditPatientDetails;