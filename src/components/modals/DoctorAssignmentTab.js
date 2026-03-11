import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiService from "../../services/api/apiService";
import API_ENDPOINTS from "../../services/api/endpoints";
import Select from "react-select";
import { Pencil, Trash2 } from "lucide-react";

const SectionWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  padding: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  grid-column: span 4;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  input,
  select {
    height: 40px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  }
`;
const DropField = styled.div`
  grid-column: span 4;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  input,
  select {
    height: 20px;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

  }
`;
const DroppField = styled.div`
  grid-column: span 8;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  input,
  select {
    height: 20px;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

  }
`;
const RoomField = styled.div`
  grid-column: span 4;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  input,
  select {
    height: 20px;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

  }
`;

const TimeField = styled.div`
  grid-column: span 4;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  input,
  select {
    height: 40px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  }
`;
const TimeMField = styled.div`
  grid-column: span 4;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  input,
  select {
    height: 40px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  }
`;

const Button = styled.button`
  grid-column: span 2;
  height: 40px;
  align-self: end;

  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);

  &:hover {
    background: #2563eb;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8fafc;

    th {
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748b;
    }
  }

  tbody {
    tr {
      border-top: 1px solid #e2e8f0;
      transition: background 0.2s;

      &:hover {
        background: #f1f5f9;
      }

      td {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        color: #334155;
      }
    }
  }
`;

const RequiredAsterisk = styled.span`
  color: #dc2626;
  margin-left: 4px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e2e8f0;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: ${(props) => (props.active ? "#3b82f6" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#334155")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? "#2563eb" : "#f1f5f9")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  width: 600px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 35px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.h3`
  margin-bottom: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
`;

const DoctorAssignmentTab = () => {

    const [practitioners, setPractitioners] = useState([]);

    const [companyOptions, setCompanyOptions] = useState([]);

    const [currentUser, setCurrentUser] = useState("");

    const [availabilityList, setAvailabilityList] = useState([]);
    const [doctorNameMap, setDoctorNameMap] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [rooms, setRooms] = useState([]);
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedCompany, setSelectedCompany] = useState("");

    const [formData, setFormData] = useState({
        doctor_id: "",
        doctor_name: "",   // ✅ ADD THIS
        company: "",
        available_date: getTodayDate(),
        start_time: "09:00",
        end_time: "13:00",
        room_id: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // change if needed
    const totalPages = Math.ceil(availabilityList.length / rowsPerPage);

    const paginatedData = availabilityList.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

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


    // ✅ Fetch Companies
    const fetchCompanies = async () => {
        try {
            const res = await fetch(
                "https://hms.automedai.in/api/resource/Company",
                { credentials: "include" }
            );

            const data = await res.json();

            if (data?.data?.length > 0) {
                setCompanyOptions(data.data);

                const firstCompany = data.data[0].name;

                // For create form
                setFormData((prev) => ({
                    ...prev,
                    company: firstCompany,
                }));

                // ✅ For filter dropdown
                setSelectedCompany(firstCompany);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // ✅ Fetch Doctors
    const fetchPractitioners = async () => {
        try {
            const res = await fetch(
                `https://hms.automedai.in/api/resource/Healthcare Practitioner?limit_page_length=5000&filters=[["practitioner_type","=","Internal"]]&fields=["name","practitioner_name","department"]`,
                { credentials: "include" }
            );

            const data = await res.json();

            if (data?.data) {
                setPractitioners(data.data);
            }

        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const fetchDoctorName = async (doctorId) => {
        try {
            const res = await fetch(
                `https://hms.automedai.in/api/resource/Healthcare Practitioner/${doctorId}`,
                { credentials: "include" }
            );

            const data = await res.json();

            if (data?.data?.practitioner_name) {
                setDoctorNameMap((prev) => ({
                    ...prev,
                    [doctorId]: data.data.practitioner_name,
                }));
            }

        } catch (error) {
            console.error(error);
        }
    };

    const fetchRooms = async (company) => {
        if (!company) {
            setRooms([]);
            return;
        }

        try {
            const res = await fetch(
                `https://midl.automedai.in/rooms/all?company=${company}`
            );

            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {

                // Only active rooms
                const activeRooms = data.data.filter(
                    (room) => room.status === "active"
                );

                setRooms(activeRooms);

            } else {
                setRooms([]);
            }

        } catch (error) {
            console.error("Error fetching rooms:", error);
            setRooms([]);
        }
    };

    useEffect(() => {
        if (formData.company) {
            fetchRooms(formData.company);

            // Clear previous room selection
            setFormData((prev) => ({
                ...prev,
                room_id: "",
            }));
        }
    }, [formData.company]);

    useEffect(() => {
        fetchPractitioners();
        fetchCompanies();
    }, []);

    // FORM CHANGE
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ CREATE AVAILABILITY
    const handleAssign = async () => {
        if (
            !formData.doctor_id ||
            !formData.company ||
            !formData.available_date ||
            !formData.room_id
        ) {
            alert("Input Required Fields");
            return;
        }

        try {
            const body = {
                doctor_id: formData.doctor_id,
                doctor_name: formData.doctor_name,
                company: formData.company,
                room_id: formData.room_id,
                schedule_date: formData.available_date,
                from_time: formData.start_time,
                to_time: formData.end_time,
                user_id: currentUser,
            };

            const res = await fetch(
                "https://midl.automedai.in/doctor_room/assign",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Assigned Successfully");
                fetchAvailability();

                // ✅ Reset form to default
                setFormData((prev) => ({
                    doctor_id: "",
                    doctor_name: "",
                    company: prev.company,
                    available_date: getTodayDate(),
                    start_time: "09:00",
                    end_time: "13:00",
                    room_id: "",
                }));
            } else {
                alert(data.message || "Something went wrong");
            }

        } catch (error) {
            console.error(error);
            alert("Server Error");
        }
    };

    // ✅ Fetch Availability List
    const fetchAvailability = async () => {
        if (!selectedCompany || !selectedDate) return;

        try {
            const res = await fetch(
                `https://midl.automedai.in/doctor_room/assignments/by-company-date?company=${selectedCompany}&schedule_date=${selectedDate}`
            );

            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                setAvailabilityList(data.data);
            } else {
                setAvailabilityList([]);
            }

        } catch (error) {
            console.error("Error fetching assignments:", error);
            setAvailabilityList([]);
        }
    };

    useEffect(() => {
        if (selectedCompany && selectedDate) {
            setCurrentPage(1);
            fetchAvailability();
        }
    }, [selectedCompany, selectedDate]);

    const formatToAMPM = (timeString) => {
        if (!timeString) return "";

        const [hours, minutes] = timeString.split(":");
        let hour = parseInt(hours, 10);

        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12; // convert 0 → 12

        return `${hour}:${minutes} ${ampm}`;
    };
    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const handleEdit = (item) => {

        const formattedDate = item.schedule_date
            ? new Date(item.schedule_date).toISOString().split("T")[0]
            : "";

        setEditData({
            id: item.id,
            doctor_id: item.doctor_id,
            doctor_name: item.doctor_name,
            company: item.company,
            room_id: item.room_id,
            schedule_date: formattedDate,
            from_time: item.from_time?.slice(0, 5),
            to_time: item.to_time?.slice(0, 5),
        });

        fetchRooms(item.company);
        setIsEditOpen(true);
    };

    const handleEditChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {

        try {

            const body = {
                doctor_id: editData.doctor_id,
                doctor_name: editData.doctor_name,
                company: editData.company,
                room_id: editData.room_id,
                schedule_date: editData.schedule_date,
                from_time: editData.from_time,
                to_time: editData.to_time,
                user_id: currentUser
            };

            const res = await fetch(
                `https://midl.automedai.in/doctor_room/update/${editData.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await res.json();

            if (data.success) {

                alert("Updated Successfully");

                setIsEditOpen(false);
                fetchAvailability();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);
            alert("Server Error");

        }
    };


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://midl.automedai.in/doctor_room/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        company: selectedCompany,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Deleted Successfully");
                fetchAvailability();
            } else {
                alert(data.message || "Delete failed");
            }

        } catch (error) {
            console.error("Delete error:", error);
            alert("Server error while deleting");
        }
    };

    return (

        <SectionWrapper>

            <h3 style={{ paddingLeft: "15px", paddingTop: "15px" }}>Assign Doctor :</h3>
            <FormGrid>

                {/* Company */}

                <DropField>
                    <label>
                        Company<RequiredAsterisk>*</RequiredAsterisk>
                    </label>

                    <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        options={companyOptions?.map((company) => ({
                            label: company.name,
                            value: company.name,
                        }))}

                        value={
                            companyOptions
                                ?.map((company) => ({
                                    label: company.name,
                                    value: company.name,
                                }))
                                .find((option) => option.value === formData.company) || null
                        }

                        onChange={(selected) =>
                            setFormData((prev) => ({
                                ...prev,
                                company: selected ? selected.value : "",
                            }))
                        }

                        placeholder="Search Company..."
                        isSearchable
                        isClearable
                        required
                    />
                </DropField>

                {/* Date */}

                <Field>

                    <label>Date<RequiredAsterisk>*</RequiredAsterisk></label>

                    <input
                        type="date"
                        name="available_date"
                        onChange={handleChange}
                        value={formData.available_date}
                        min={new Date().toISOString().split("T")[0]}
                        required
                    />

                </Field>

                {/* Start */}

                <TimeField>

                    <label>Start Time</label>

                    <input
                        type="time"
                        name="start_time"
                        onChange={handleChange}
                        value={formData.start_time}
                    />

                </TimeField>



                {/* End */}

                {/* <TimeField>
                    <label>End Time</label>
                    <input
                        type="time"
                        name="end_time"
                        onChange={handleChange}
                        value={formData.end_time}
                    />
                </TimeField> */}

                {/* Doctor */}
                <DropField>
                    <label>
                        Doctor<RequiredAsterisk>*</RequiredAsterisk>
                    </label>

                    <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}

                        options={practitioners.map((doc) => ({
                            label: `${doc.practitioner_name}`,
                            value: doc.name,
                            doctor_name: doc.practitioner_name,
                        }))}

                        value={
                            practitioners
                                .map((doc) => ({
                                    label: `${doc.practitioner_name} (${doc.department || "No Department"})`,
                                    value: doc.name,
                                    doctor_name: doc.practitioner_name,
                                }))
                                .find((option) => option.value === formData.doctor_id) || null
                        }

                        onChange={(selected) =>
                            setFormData((prev) => ({
                                ...prev,
                                doctor_id: selected ? selected.value : "",
                                doctor_name: selected ? selected.doctor_name : "",
                            }))
                        }

                        placeholder="Search Doctor..."
                        isSearchable
                        isClearable
                    />
                </DropField>

                {/* Room */}
                <DropField>
                    <label>
                        Room<RequiredAsterisk>*</RequiredAsterisk>
                    </label>

                    <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        options={rooms.map((room) => ({
                            label: room.room_name,
                            value: room.id,
                        }))}

                        value={
                            rooms
                                .map((room) => ({
                                    label: room.room_name,
                                    value: room.id,
                                }))
                                .find((option) => option.value === formData.room_id) || null
                        }

                        onChange={(selected) =>
                            setFormData((prev) => ({
                                ...prev,
                                room_id: selected ? selected.value : "",
                            }))
                        }

                        placeholder={
                            formData.company
                                ? "Search Room..."
                                : "Select Company First"
                        }

                        isSearchable
                        isClearable
                        isDisabled={!formData.company}
                    />
                </DropField>

                <Button onClick={handleAssign}>

                    Assign Doctor

                </Button>

            </FormGrid>

            {/* Filter Section */}
            <h3 style={{ marginLeft: "15px", borderTop: "2px solid #e2e8f0", paddingTop: "15px", paddingBottom: "15px" }}>Check Assigned Doctors :</h3>
            <FormGrid style={{ paddingTop: "0", paddingBottom: "1rem" }}>

                {/* Select Company */}
                <DropField>
                    <label>Select Company</label>

                    <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        options={companyOptions?.map((company) => ({
                            label: company.name,
                            value: company.name,
                        }))}

                        value={
                            companyOptions
                                ?.map((company) => ({
                                    label: company.name,
                                    value: company.name,
                                }))
                                .find((option) => option.value === selectedCompany) || null
                        }

                        onChange={(selected) =>
                            setSelectedCompany(selected ? selected.value : "")
                        }

                        placeholder="Search Company..."
                        isSearchable
                        isClearable
                    />
                </DropField>
                <Field>
                    <label>Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </Field>

            </FormGrid>

            {/* TABLE */}

            <Table>

                <thead>

                    <tr>

                        <th>Doctor</th>

                        <th>Room</th>

                        <th>Date</th>

                        <th>Start</th>

                        <th>End</th>

                        <th>Company</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {paginatedData?.map(
                        (item) => (

                            <tr key={item.id}>

                                <td>
                                    {item.doctor_name}
                                </td>

                                <td>
                                    {item.room_name}
                                </td>

                                <td>{formatDate(item.schedule_date)}</td>

                                <td>{formatToAMPM(item.from_time)}</td>

                                <td>{formatToAMPM(item.to_time)}</td>

                                <td>
                                    {item.company}
                                </td>

                                <td>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                                        <Pencil
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleEdit(item)}
                                        />

                                        <Trash2
                                            size={18}
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={() => handleDelete(item.id)}
                                        />

                                    </div>
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </Table>
            {totalPages > 1 && (
                <PaginationWrapper>
                    <PageButton
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </PageButton>

                    {[...Array(totalPages)].map((_, index) => (
                        <PageButton
                            key={index}
                            active={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </PageButton>
                    ))}

                    <PageButton
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </PageButton>
                </PaginationWrapper>
            )}

            {isEditOpen && editData && (

                <ModalOverlay>

                    <ModalBox>

                        <ModalTitle>Edit Doctor Assignment</ModalTitle>

                        <FormGrid>

                            <DroppField>
                                <label>
                                    Doctor<RequiredAsterisk>*</RequiredAsterisk>
                                </label>

                                <Select
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}

                                    options={practitioners.map((doc) => ({
                                        label: `${doc.practitioner_name}`,
                                        value: doc.name,
                                        doctor_name: doc.practitioner_name,
                                    }))}

                                    value={
                                        practitioners
                                            .map((doc) => ({
                                                label: `${doc.practitioner_name}`,
                                                value: doc.name,
                                                doctor_name: doc.practitioner_name,
                                            }))
                                            .find((option) => option.value === editData.doctor_id) || null
                                    }

                                    onChange={(selected) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            doctor_id: selected ? selected.value : "",
                                            doctor_name: selected ? selected.doctor_name : "",
                                        }))
                                    }

                                    placeholder="Search Doctor..."
                                    isSearchable
                                    isClearable
                                />
                            </DroppField>

                            <Field>
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="schedule_date"
                                    value={editData.schedule_date}
                                    onChange={handleEditChange}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </Field>

                            <TimeMField>
                                <label>Start</label>
                                <input
                                    type="time"
                                    name="from_time"
                                    value={editData.from_time}
                                    onChange={handleEditChange}
                                />
                            </TimeMField>

                            <TimeMField>
                                <label>End</label>
                                <input
                                    type="time"
                                    name="to_time"
                                    value={editData.to_time}
                                    onChange={handleEditChange}
                                />
                            </TimeMField>

                            <RoomField>
                                <label>Room</label>

                                <Select
                                    options={rooms.map((room) => ({
                                        label: room.room_name,
                                        value: room.id,
                                    }))}

                                    value={
                                        rooms
                                            .map((room) => ({
                                                label: room.room_name,
                                                value: room.id,
                                            }))
                                            .find((opt) => opt.value === editData.room_id) || null
                                    }

                                    onChange={(selected) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            room_id: selected.value
                                        }))
                                    }
                                />

                            </RoomField>

                        </FormGrid>

                        <ModalButtons>

                            <CancelButton onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </CancelButton>

                            <SaveButton onClick={handleUpdate}>
                                Update
                            </SaveButton>

                        </ModalButtons>

                    </ModalBox>

                </ModalOverlay>

            )}

        </SectionWrapper>
    );
};

export default DoctorAssignmentTab;