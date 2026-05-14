import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Camera } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import api from "../services/api";

// ================= STYLES =================

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const Section = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const ProfilePictureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ProfilePicture = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ChangePhotoButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #357abd;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FileInfo = styled.p`
  font-size: 12px;
  color: #999999;
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

const SaveButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;
  margin-top: 15px;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
`;

const SecurityContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ChangePasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChangePasswordTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`;

const PasswordFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 18px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoLabel = styled.span`
  font-size: 13px;
  color: #888;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
  word-break: break-word;

  a {
    color: #4a90e2;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

// ================= COMPONENT =================

const Settings = () => {
  usePageTitle("Settings");

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [userEmail, setUserEmail] = useState("");

  const [profileData, setProfileData] = useState({
    fullName: "",
    mobileNo: "",
    email: "",
    userImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // ================= FETCH USER =================

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Get logged in email
      const loggedUserRes = await api.get(
        "/method/frappe.auth.get_logged_user"
      );

      const email = loggedUserRes.data?.message;

      if (!email) return;

      setUserEmail(email);

      // Get user details
      const userRes = await api.get(`/resource/User/${email}`);

      const user = userRes.data?.data;

      setProfileData({
        fullName: user?.full_name || "",
        mobileNo: user?.mobile_no || user?.phone || "",
        email: user?.email || "",
        userImage: user?.user_image
          ? `https://hms.automedai.in${user.user_image}`
          : "",
      });
    } catch (err) {
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // ================= HANDLE INPUTS =================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= NAME SPLIT =================

  const splitName = (fullName) => {
    const parts = fullName.trim().split(" ");

    const first_name = parts[0] || "";
    const last_name = parts.length > 1 ? parts[parts.length - 1] : "";
    const middle_name =
      parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

    return {
      first_name,
      middle_name,
      last_name,
    };
  };

  // ================= UPDATE PROFILE =================

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { first_name, middle_name, last_name } = splitName(
        profileData.fullName
      );

      const payload = {
        email: profileData.email,
        first_name,
        middle_name,
        last_name,
        mobile_no: profileData.mobileNo,
      };

      await api.put(`/resource/User/${userEmail}`, payload);

      alert("Profile updated successfully");

      fetchUserDetails();
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("file", file);
      formData.append("is_private", 0);

      // Upload image
      const uploadRes = await api.post("/method/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = uploadRes.data?.message?.file_url;

      if (!fileUrl) {
        alert("Image upload failed");
        return;
      }

      // Update user image
      await api.put(`/resource/User/${userEmail}`, {
        user_image: fileUrl,
      });

      setProfileData((prev) => ({
        ...prev,
        userImage: `https://hms.automedai.in${fileUrl}`,
      }));

      alert("Profile image updated successfully");
    } catch (err) {
      console.error("Error uploading image", err);
      alert("Failed to upload image");
    }
  };

  // ================= CHANGE PASSWORD =================

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put(`/resource/User/${userEmail}`, {
        new_password: passwordData.newPassword,
      });

      alert("Password updated successfully");

      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error updating password", err);
      alert("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <SettingsContainer>
        <PageTitle>Settings & Profile</PageTitle>

        {/* ================= PROFILE SECTION ================= */}

        <Section>
          <SectionHeader>
            <SectionTitleWrapper>
              <SectionTitle>Profile</SectionTitle>

              <SectionDescription>
                Update your photo and personal details here.
              </SectionDescription>
            </SectionTitleWrapper>

            <ProfilePictureSection>
              <ProfilePicture>
                {profileData.userImage ? (
                  <img
                    src={profileData.userImage}
                    alt="Profile"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <Camera size={40} color="#777" />
                )}
              </ProfilePicture>

              <ChangePhotoButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera />
                Change photo
              </ChangePhotoButton>

              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <FileInfo>JPG, GIF or PNG. 1MB max.</FileInfo>
            </ProfilePictureSection>
          </SectionHeader>

          <form onSubmit={handleProfileSave}>
            <FormGrid>
              <FormGroup>
                <FormLabel>Full Name</FormLabel>

                <FormInput
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  placeholder="Enter full name"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Mobile Number</FormLabel>

                <FormInput
                  type="tel"
                  name="mobileNo"
                  value={profileData.mobileNo}
                  onChange={handleProfileChange}
                  placeholder="Enter mobile number"
                />
              </FormGroup>

              <FormGroup fullWidth>
                <FormLabel>Email Address</FormLabel>

                <FormInput
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Enter email address"
                />
              </FormGroup>
            </FormGrid>

            <SaveButton type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </SaveButton>
          </form>
        </Section>

        <Separator />

        {/* ================= SECURITY SECTION ================= */}

        <Section>
          <SectionHeader>
            <SectionTitleWrapper>
              <SectionTitle>Security</SectionTitle>

              <SectionDescription>
                Manage your password and account security.
              </SectionDescription>
            </SectionTitleWrapper>
          </SectionHeader>

          <SecurityContent>
            <ChangePasswordSection>
              <ChangePasswordTitle>
                Change Password
              </ChangePasswordTitle>

              <form onSubmit={handlePasswordSave}>
                <PasswordFormGrid>
                  <FormGroup>
                    <FormLabel>New Password</FormLabel>

                    <FormInput
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Confirm New Password</FormLabel>

                    <FormInput
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </FormGroup>
                </PasswordFormGrid>

                <SaveButton type="submit" disabled={passwordLoading}>
                  {passwordLoading
                    ? "Updating..."
                    : "Update Password"}
                </SaveButton>
              </form>
            </ChangePasswordSection>
          </SecurityContent>
        </Section>

        {/* ================= ABOUT SECTION ================= */}

        <Section>
          <SectionHeader>
            <SectionTitleWrapper>
              <SectionTitle>About Application</SectionTitle>

              <SectionDescription>
                Application information, support details and version info.
              </SectionDescription>
            </SectionTitleWrapper>
          </SectionHeader>

          <InfoGrid>
            {/* <InfoCard>
              <InfoLabel>Application Name</InfoLabel>
              <InfoValue>AutoMed AI HMS</InfoValue>
            </InfoCard> */}

            <InfoCard>
              <InfoLabel>Version</InfoLabel>
              <InfoValue>v1.0.0</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Official Website</InfoLabel>

              <InfoValue>
                <a
                  href="https://automedai.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://automedai.in/
                </a>
              </InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Support Email</InfoLabel>
              <InfoValue>support@automedai.in</InfoValue>
            </InfoCard>

            {/* <InfoCard>
              <InfoLabel>Environment</InfoLabel>
              <InfoValue>Production</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Last Updated</InfoLabel>
              <InfoValue>14 May 2026</InfoValue>
            </InfoCard> */}

            {/* <InfoCard>
              <InfoLabel>Developed By</InfoLabel>
              <InfoValue>AutoMed AI</InfoValue>
            </InfoCard> */}

            <InfoCard style={{ width: "100%" }}>
              <InfoLabel>Copyright</InfoLabel>
              <InfoValue>
                © 2026 Tachyon AI Private Limited. All rights reserved.
              </InfoValue>
            </InfoCard>
          </InfoGrid>
        </Section>
      </SettingsContainer>
    </Layout>
  );
};

export default Settings;