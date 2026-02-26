import React, { useEffect, useState } from "react";
import styled from "styled-components";

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

const FormField = styled.div`
  grid-column: span 5;

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

const AddButton = styled.button`
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

const ToggleWrapper = styled.label`
  position: relative;
  width: 40px;
  height: 20px;
  display: inline-block;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #22c55e;
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #cbd5e1;
  border-radius: 20px;
  transition: 0.3s;

  &:before {
    content: "";
    position: absolute;
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }
`;

const OpdRoomTab = () => {

    const [companyOptions, setCompanyOptions] = useState([]);
    const [currentUser, setCurrentUser] = useState("");
    const [formData, setFormData] = useState({
        company: "",
        room_name: "",
    });

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        try {
          const userData = localStorage.getItem("user");
    
          if (!userData) return;
    
          const parsedUser = JSON.parse(userData);
    
          if (parsedUser?.full_name) {
            setCurrentUser(parsedUser.full_name);
          }
    
        } catch (error) {
          console.error("Error reading user from localStorage:", error);
        }
      }, []);


    // ✅ Fetch Company List
    const fetchCompanyOptions = async () => {

        try {

            const response = await fetch(
                "https://hms.automedai.in/api/resource/Company",
                {
                    headers: { Accept: "application/json" },
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (data?.data) {
                setCompanyOptions(data.data);
            }

        } catch (error) {

            console.error(error);

        }

    };


    // ✅ Fetch Rooms
    const fetchRooms = async (company) => {

        if (!company) return;

        try {

            const response = await fetch(
                `https://midl.automedai.in/rooms/all?company=${company}`
            );

            const data = await response.json();

            if (data.success) {

                setRooms(data.data);

            }

        } catch (error) {

            console.error(error);

        }

    };


    // Load companies on mount
    useEffect(() => {

        fetchCompanyOptions();

    }, []);



    // Fetch rooms when company selected
    useEffect(() => {

        fetchRooms(formData.company);

    }, [formData.company]);



    // Form Change
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };



    // ✅ Create Room API
    const handleAddRoom = async () => {

        if (!formData.room_name || !formData.company) {

            alert("Enter all fields");
            return;

        }

        try {

            const response = await fetch(
                "https://midl.automedai.in/rooms/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        room_name: formData.room_name,
                        created_by: currentUser,
                        company: formData.company,
                    }),

                }
            );

            const data = await response.json();

            if (data.success) {

                alert("Room Created");

                fetchRooms(formData.company);

                setFormData({
                    company: formData.company,
                    room_name: "",
                });

            }

        } catch (error) {

            console.error(error);

        }

    };



    // ✅ Toggle Status API
    const handleToggleStatus = async (room) => {

        const newStatus =
            room.status === "active" ? "inactive" : "active";
        try {
            const response = await fetch(
                `https://midl.automedai.in/rooms/${room.id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        user_id: currentUser,
                        company: room.company,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {

                fetchRooms(room.company);

            }

        } catch (error) {

            console.error(error);

        }

    };



    return (

        <SectionWrapper>
            {/* FORM */}
            <FormGrid>
                <FormField>
                    <label>Company</label>
                    <select
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                    >
                        <option value="">Select Company</option>
                        {companyOptions.map((company) => (
                            <option
                                key={company.name}
                                value={company.name}
                            >
                                {company.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField>
                    <label>Room Name</label>
                    <input
                        name="room_name"
                        value={formData.room_name}
                        onChange={handleChange}
                    />
                </FormField>

                <AddButton onClick={handleAddRoom}>
                    Add Room
                </AddButton>
            </FormGrid>

            {/* TABLE */}
            <Table>
                <thead>
                    <tr>
                        <th>Room</th>
                        <th>Company</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.room_name}</td>
                            <td>{room.company}</td>
                            <td>
                                <ToggleWrapper>
                                    <ToggleInput
                                        type="checkbox"
                                        checked={room.status === "active"}
                                        onChange={() =>
                                            handleToggleStatus(room)
                                        }
                                    />
                                    <ToggleSlider />
                                </ToggleWrapper>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </SectionWrapper>
    );
};

export default OpdRoomTab;