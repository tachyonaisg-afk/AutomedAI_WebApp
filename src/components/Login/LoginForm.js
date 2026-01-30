import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  position: relative;
`;

const LoginHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 200px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoImage = styled.img`
  height: 100px;
  width: auto;
  object-fit: contain;
`;

const LoginContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 120px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;
  max-width: 550px;
  margin: 0 auto;
  width: 100%;
`;

const WelcomeHeading = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 12px 0;
  text-align: center;
  width: 100%;
`;

const SignUpText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 32px 0;
  text-align: center;
  width: 100%;
`;

const SignUpLink = styled.a`
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #333333;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FormInput = styled.input`
  padding: 16px 20px;
  border: 1px solid black;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  width: 100%;
  padding-right: ${(props) => (props.hasIcon ? "52px" : "20px")};
  min-height: 52px;
  box-sizing: border-box;

  &:focus {
    background-color: #ffffff;
    box-shadow: 0 0 0 2px black;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333333;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoginError = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
`;

const LoginButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background-color: #357abd;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginForm = () => {
  usePageTitle("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      // Use email as username for login
      const success = await login(email, password);
      if (success) {
        navigate("/opd");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <LogoSection>
          <LogoImage src="/Logo_light_web.png" alt="Logo" />
        </LogoSection>
      </LoginHeader>

      <LoginContent>
        <WelcomeHeading>Welcome</WelcomeHeading>
        <SignUpText>
          New to AutoMedAi? <SignUpLink href="#">Sign up</SignUpLink>
        </SignUpText>

        {error && <LoginError>{error}</LoginError>}

        <LoginFormStyled onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="email">Your email address</FormLabel>
            <FormInput type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} hasIcon={false} />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Your password</FormLabel>
            <InputWrapper>
              <FormInput type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} hasIcon={true} />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff /> : <Eye />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </LoginButton>
        </LoginFormStyled>
      </LoginContent>
    </LoginContainer>
  );
};

export default LoginForm;
