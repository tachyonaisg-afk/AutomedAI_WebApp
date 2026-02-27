import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiService from "../../services/api/apiService";
import API_ENDPOINTS from "../../services/api/endpoints";

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

const DoctorAvailabilityTab = () => {

  const [practitioners, setPractitioners] = useState([]);

  const [companyOptions, setCompanyOptions] = useState([]);

  const [currentUser, setCurrentUser] = useState("");

  const [availabilityList, setAvailabilityList] = useState([]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [formData, setFormData] = useState({

    doctor_id: "",

    company: "",

    available_date: "",

    start_time: "",

    end_time: "",

  });



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

        // ✅ Auto select first company
        setFormData((prev) => ({
          ...prev,
          company: data.data[0].name,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };


  // ✅ Fetch Doctors
  const fetchPractitioners = async () => {

    try {

      const practitionerRes =
        await apiService.get(
          API_ENDPOINTS.PRACTITIONERS.LIST,
          {
            fields:
              '["name", "practitioner_name"]',
            limit_page_length: 5000,
          }
        );

      if (practitionerRes.data?.data) {

        setPractitioners(
          practitionerRes.data.data
        );

      }

    } catch { }

  };



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
  const handleCreate = async () => {
    if (!formData.doctor_id || !formData.company || !formData.available_date) {

      alert("Input Required Fields");

      return;

    }
    try {

      const body = [

        {

          doctor_id: formData.doctor_id,

          company: formData.company,

          available_date:
            formData.available_date,

          start_time: formData.start_time,

          end_time: formData.end_time,

          created_by: currentUser,

        },

      ];



      const res = await fetch(
        "https://midl.automedai.in/doctor_available/Create",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(body),

        }
      );



      const data = await res.json();



      if (data.success) {

        alert("Created");

        fetchAvailability();

      }

    } catch (error) {

      console.error(error);

    }

  };




  // ✅ Fetch Availability List
  const fetchAvailability = async () => {
    if (!formData.company || !selectedDate) return;

    try {
      const res = await fetch(
        `https://midl.automedai.in/doctor_available/fetch?company=${formData.company}&date=${selectedDate}`
      );

      const data = await res.json();

      if (data.success) {
        setAvailabilityList(data.data);
      } else {
        setAvailabilityList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (formData.company && selectedDate) {
      fetchAvailability();
    }
  }, [formData.company, selectedDate]);



  return (

    <SectionWrapper>

      <h3 style={{paddingLeft:"15px", paddingTop:"15px"}}>Create Doctor Availability :</h3>
      <FormGrid>

        {/* Doctor */}

        <Field>

          <label>Doctor<RequiredAsterisk>*</RequiredAsterisk></label>

          <select
            name="doctor_id"
            onChange={handleChange}
            value={formData.doctor_id}
            required
          >

            <option>Select Doctor</option>

            {practitioners.map((doc) => (

              <option
                key={doc.name}
                value={doc.name}
              >

                {doc.practitioner_name}

              </option>

            ))}

          </select>

        </Field>




        {/* Company */}

        <Field>

          <label>Company<RequiredAsterisk>*</RequiredAsterisk></label>

          <select
            name="company"
            onChange={handleChange}
            value={formData.company}
            required
          >

            <option>Select Company</option>

            {companyOptions.map(
              (company) => (

                <option
                  key={company.name}
                  value={company.name}
                >

                  {company.name}

                </option>

              )
            )}

          </select>

        </Field>




        {/* Date */}

        <Field>

          <label>Date<RequiredAsterisk>*</RequiredAsterisk></label>

          <input
            type="date"
            name="available_date"
            onChange={handleChange}
            value={formData.available_date}
            required
          />

        </Field>




        {/* Start */}

        <Field>

          <label>Start Time</label>

          <input
            type="time"
            name="start_time"
            onChange={handleChange}
            value={formData.start_time}
          />

        </Field>



        {/* End */}

        <Field>

          <label>End Time</label>

          <input
            type="time"
            name="end_time"
            onChange={handleChange}
            value={formData.end_time}
          />

        </Field>



        <Button onClick={handleCreate}>

          Create

        </Button>


      </FormGrid>

      {/* Filter Section */}
      <h3 style={{marginLeft:"15px",borderTop: "2px solid #e2e8f0", paddingTop:"15px", paddingBottom:"15px"}}>Check Doctor Availability :</h3>
      <FormGrid style={{ paddingTop: "0", paddingBottom: "1rem" }}>
        <Field>
          <label>Filter By Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Field>

        <Button
          style={{ gridColumn: "span 2", background: "#10b981" }}
          onClick={() => setSelectedDate(getTodayDate())}
        >
          Today
        </Button>
      </FormGrid>

      {/* TABLE */}


      <Table>

        <thead>

          <tr>

            <th>Doctor</th>

            <th>Date</th>

            <th>Start</th>

            <th>End</th>

            <th>Company</th>

          </tr>

        </thead>



        <tbody>

          {availabilityList.map(
            (item) => (

              <tr key={item.id}>

                <td>
                  {item.doctor_id}
                </td>

                <td>
                  {item.available_date}
                </td>

                <td>
                  {item.start_time}
                </td>

                <td>
                  {item.end_time}
                </td>

                <td>
                  {item.company}
                </td>

              </tr>

            )
          )}

        </tbody>

      </Table>

    </SectionWrapper>
  );
};

export default DoctorAvailabilityTab;