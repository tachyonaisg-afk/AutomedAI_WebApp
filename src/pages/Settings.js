import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import { Camera } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

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

const Settings = () => {
  usePageTitle("Settings");
  const [profileData, setProfileData] = useState({
    fullName: "Dr. Emily Carter",
    phoneNumber: "(555) 123-4567",
    email: "emily.carter@clinic.com",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  const handleProfileSave = (e) => {
    e.preventDefault();
    console.log("Profile saved:", profileData);
    // Handle profile save
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    console.log("Password changed");
    // Handle password change
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Layout>
      <SettingsContainer>
        <PageTitle>Settings & Profile</PageTitle>

        {/* Profile Section */}
        <Section>
          <SectionHeader>
            <SectionTitleWrapper>
              <SectionTitle>Profile</SectionTitle>
              <SectionDescription>Update your photo and personal details here.</SectionDescription>
            </SectionTitleWrapper>
            <ProfilePictureSection>
              <ProfilePicture>
                <img
                  src="https://via.placeholder.com/120x120?text=Profile"
                  alt="Profile"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </ProfilePicture>
              <ChangePhotoButton>
                <Camera />
                Change photo
              </ChangePhotoButton>
              <FileInfo>JPG, GIF or PNG. 1MB max.</FileInfo>
            </ProfilePictureSection>
          </SectionHeader>

          <form onSubmit={handleProfileSave}>
            <FormGrid>
              <FormGroup>
                <FormLabel>Full Name</FormLabel>
                <FormInput type="text" name="fullName" value={profileData.fullName} onChange={handleProfileChange} placeholder="Dr. Emily Carter" />
              </FormGroup>

              <FormGroup>
                <FormLabel>Phone Number</FormLabel>
                <FormInput type="tel" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} placeholder="(555) 123-4567" />
              </FormGroup>

              <FormGroup fullWidth>
                <FormLabel>Email Address</FormLabel>
                <FormInput type="email" name="email" value={profileData.email} onChange={handleProfileChange} placeholder="emily.carter@clinic.com" />
              </FormGroup>
            </FormGrid>

            <SaveButton type="submit">Save Changes</SaveButton>
          </form>
        </Section>

        <Separator />

        {/* Security Section */}
        <Section>
          <SectionHeader>
            <SectionTitleWrapper>
              <SectionTitle>Security</SectionTitle>
              <SectionDescription>Manage your password, two-factor authentication, and active sessions.</SectionDescription>
            </SectionTitleWrapper>
          </SectionHeader>

          <SecurityContent>
            <ChangePasswordSection>
              <ChangePasswordTitle>Change Password</ChangePasswordTitle>
              <form onSubmit={handlePasswordSave}>
                <PasswordFormGrid>
                  <FormGroup>
                    <FormLabel>Current Password</FormLabel>
                    <FormInput type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>New Password</FormLabel>
                    <FormInput type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormInput type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm new password" />
                  </FormGroup>
                </PasswordFormGrid>

                <SaveButton type="submit">Update Password</SaveButton>
              </form>
            </ChangePasswordSection>
          </SecurityContent>
        </Section>
      </SettingsContainer>
    </Layout>
  );
};

export default Settings;
