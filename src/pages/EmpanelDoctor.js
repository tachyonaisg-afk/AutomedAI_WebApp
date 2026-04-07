import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Search, Edit, ArrowLeft } from "lucide-react";
import EmpanelDoctorModal from "../components/modals/EmpanelDoctorModal";
import api from "../services/api";
import EditDoctorModal from "../components/modals/editDoctorModal";

const PageWrapper = styled.div`
  padding: 24px;
`;

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const SearchBox = styled.div`
  width: 90%;
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 50px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4a90e2;
  }
`;

const SearchButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #4a90e2;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #3c7edb;
  }
`;
const TableHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  margin-top: 50px;
`;

const NewDoctorButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #4a90e2;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #3c7edb;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #bbd9f8;
`;

const Th = styled.th`
  padding: 14px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 14px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  cursor: pointer;
`;

const EditButton = styled(Button)`
  background: #f1f5f9;
`;

const EmpanelButton = styled(Button)`
  background: #10b981;
  color: white;

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.td`
  text-align: center;
  padding: 30px;
  font-size: 14px;
  color: #64748b;
`;

function EmpanelDoctor() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [empanelStatus, setEmpanelStatus] = useState({});
  const [autoEmpanel, setAutoEmpanel] = useState(false);
  const [empanelledDoctors, setEmpanelledDoctors] = useState([]);
  const [doctorNameMap, setDoctorNameMap] = useState({});
  const [tableMode, setTableMode] = useState("empanelled");
  // "empanelled" | "search"

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
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get(
          "/resource/Company"
        );

        const companyList = res.data?.data || [];

        setCompanies(companyList);

        if (companyList.length > 0) {
          setSelectedCompany(companyList[0].name);
        }
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };

    fetchCompanies();
  }, []);
  const checkEmpanelStatus = async (doctorId) => {
    if (!selectedCompany) return; // prevent empty company

    try {
      const res = await fetch(
        `https://midl.automedai.in/doctor_company/empanel/company/${selectedCompany}/doctor/${doctorId}`
      );

      const data = await res.json();

      setEmpanelStatus((prev) => ({
        ...prev,
        [doctorId]: data?.data?.isEmpanel || false,
      }));
    } catch (err) {
      console.error("Empanel check error", err);
    }
  };
  const searchDoctors = async (value) => {
    setSearch(value);

    if (!value) {
      setTableMode("empanelled");
      setDoctors([]);
      return;
    }

    setTableMode("search");

    try {
      const fields = encodeURIComponent(
        JSON.stringify([
          "name",
          "first_name",
          "last_name",
          "practitioner_name",
          "mobile_phone",
          "department",
          "gender",
          "custom_specializedqualification",
          "custom_registration_number",
          "op_consulting_charge",
        ])
      );

      const nameFilter = encodeURIComponent(
        JSON.stringify([["practitioner_name", "like", `%${value}%`]])
      );

      const regFilter = encodeURIComponent(
        JSON.stringify([["custom_registration_number", "like", `%${value}%`]])
      );

      const mobileFilter = encodeURIComponent(
        JSON.stringify([["mobile_phone", "like", `%${value}%`]])
      );

      const base =
        "/resource/Healthcare Practitioner";

      const [nameRes, regRes, mobileRes] = await Promise.all([
        api.get(`${base}?fields=${fields}&filters=${nameFilter}`),
        api.get(`${base}?fields=${fields}&filters=${regFilter}`),
        api.get(`${base}?fields=${fields}&filters=${mobileFilter}`),
      ]);

      const merged = [
        ...(nameRes.data.data || []),
        ...(regRes.data.data || []),
        ...(mobileRes.data.data || []),
      ];

      // remove duplicates using unique "name"
      const uniqueDoctors = Array.from(
        new Map(merged.map((doc) => [doc.name, doc])).values()
      );

      setDoctors(uniqueDoctors);

      uniqueDoctors.forEach((doc) => {
        checkEmpanelStatus(doc.name);
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };
  const empanelDoctor = async (doc) => {
    try {

      const empanelRes = await fetch(
        "https://midl.automedai.in/doctor_company/empanel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: selectedCompany,
            doctor_id: doc.name,
            doctor_name: doc.practitioner_name,
            consultation_fee: doc.op_consulting_charge || "0",
            created_by: currentUser || "ADMIN",
          }),
        }
      );

      const data = await empanelRes.json();

      if (!empanelRes.ok) {
        throw new Error(data?.message || "Empanel failed");
      }

      // 2️⃣ Update practitioner type
      await api.put(`/resource/Healthcare Practitioner/${doc.name}`, {
        practitioner_type: "Internal",
      });

      // 3️⃣ Update UI
      setEmpanelStatus((prev) => ({
        ...prev,
        [doc.name]: true,
      }));
      checkEmpanelStatus(doc.name);
      // ✅ Alert message from API
      alert(data.message);

    } catch (err) {
      console.error("Empanel error", err);
      alert(err.message);
    }
  };
  const removeEmpanel = async (doc) => {
    try {

      const res = await fetch(
        "https://midl.automedai.in/doctor_company/remove-empanel-doctor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: selectedCompany,
            doctor_id: doc.name || doc.doctor_id,
          }),
        }
      );

      const data = await res.json();

      checkEmpanelStatus(doc.name);

      // ✅ Alert message from API
      alert(data.message);
      fetchEmpanelledDoctors();

    } catch (err) {
      console.error("Remove empanel error", err);
    }
  };
  const hasMissingDetails = (doc) => {
    return (
      !doc.practitioner_name ||
      !doc.mobile_phone ||
      !doc.custom_registration_number ||
      !doc.custom_specializedqualification ||
      !doc.gender
    );
  };
  const fetchDoctorName = async (doctorId) => {
    try {
      const res = await api.get(
        `/resource/Healthcare Practitioner/${doctorId}`
      );

      const data = await res.json();

      if (data?.data) {

        const doc = data.data;

        setDoctorNameMap((prev) => ({
          ...prev,
          [doctorId]: doc,
        }));
      }

    } catch (error) {
      console.error(error);
    }
  };
  const fetchEmpanelledDoctors = async () => {
    if (!selectedCompany) return;

    try {
      const res = await fetch(
        `https://midl.automedai.in/doctor_company/company/${encodeURIComponent(selectedCompany)}`
      );

      const data = await res.json();

      const list = data?.data || [];

      setEmpanelledDoctors(list);

      list.forEach((doc) => {
        fetchDoctorName(doc.doctor_id);
        checkEmpanelStatus(doc.doctor_id);
      });

    } catch (err) {
      console.error("Empanelled doctors fetch error", err);
    }
  };
  useEffect(() => {
    if (selectedCompany) {
      fetchEmpanelledDoctors();
    }
  }, [selectedCompany]);

  const tableDoctors =
    tableMode === "empanelled"
      ? empanelledDoctors.map((doc) => doctorNameMap[doc.doctor_id])
      : doctors;

  return (
    <Layout>
      <SearchButton onClick={() => window.history.back()}>
        <ArrowLeft size={16} />
        Back
      </SearchButton>
      <PageWrapper>
        <SearchWrapper>
          <SearchBox>
            <SearchInput
              placeholder="Search doctor by name, registration number or mobile number"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                searchDoctors(value);
              }}
            />

            {/* <SearchButton>
              <Search size={16} />
              Search Doctor
            </SearchButton> */}
          </SearchBox>
        </SearchWrapper>

        <TableHeader>
          <NewDoctorButton onClick={() => setOpenModal(true)}>
            Empanel New Doctor
          </NewDoctorButton>
        </TableHeader>

        <h3 style={{ marginBottom: "12px" }}>
          {tableMode === "empanelled" ? "Empanelled Doctors" : "Search Results"}
        </h3>

        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th>Sl No.</Th>
                <Th>Doctor Name</Th>
                <Th>Mobile</Th>
                <Th>Reg No</Th>
                <Th>Qualification</Th>
                <Th>Action</Th>
              </tr>
            </Thead>

            <tbody>
              {tableDoctors?.length > 0 ? (
                tableDoctors.map((doc, index) => {

                  if (!doc) return null;

                  const doctorId = doc.name || doc.doctor_id;
                  const isEmpanel = empanelStatus[doctorId];
                  const missing = hasMissingDetails(doc);
                  return (
                    <tr key={doc.name || doc.doctor_id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        {doc.practitioner_name} ({doc.gender?.charAt(0)})
                      </Td>
                      <Td>{doc.mobile_phone}</Td>
                      <Td>{doc.custom_registration_number}</Td>
                      <Td>{doc.custom_specializedqualification}</Td>
                      <Td>
                        <ActionButtons>

                          <EditButton
                            onClick={() => {
                              setSelectedDoctor(doc);
                              setOpenEditModal(true);
                            }}
                          >
                            <Edit size={14} />
                          </EditButton>

                          {isEmpanel ? (
                            <EmpanelButton
                              style={{ background: "#ef4444" }}
                              onClick={() => removeEmpanel(doc)}
                            >
                              Remove
                            </EmpanelButton>
                          ) : (
                            <EmpanelButton
                              onClick={() => {
                                if (missing) {
                                  setSelectedDoctor(doc);
                                  setAutoEmpanel(true);
                                  setOpenEditModal(true);
                                } else {
                                  empanelDoctor(doc);
                                }
                              }}
                            >
                              Empanel
                            </EmpanelButton>
                          )}

                        </ActionButtons>
                      </Td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <EmptyMessage colSpan="6">
                    {tableMode === "empanelled"
                      ? "No empanelled doctors found"
                      : "No doctors found"}
                  </EmptyMessage>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
        {openModal && (
          <EmpanelDoctorModal onClose={() => setOpenModal(false)} />
        )}
        {openEditModal && selectedDoctor && (
          <EditDoctorModal
            doctor={selectedDoctor}
            autoEmpanel={autoEmpanel}
            empanelDoctor={empanelDoctor}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedDoctor(null);
              setAutoEmpanel(false);
            }}
          />
        )}
      </PageWrapper>
    </Layout>
  );
}

export default EmpanelDoctor;