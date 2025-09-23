import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.login(formData);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  }; return (
    <Container>
      <FormWrapper>
        <Logo>BlogSphere</Logo>
        <Title>Welcome Back!</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <ForgotPassword>Forgot password?</ForgotPassword>
          <LoginButton type="submit">Login</LoginButton>
        </Form>
        <SignupText>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignupText>
      </FormWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff5e6;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.h1`
  text-align: center;
  color: #ff6b00;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9f9f9;
  color: #333;

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
  }
`;

const LoginButton = styled.button`
  background-color: #ff6b00;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e65c00;
  }
`;

const ForgotPassword = styled.a`
  text-align: right;
  color: #ff6b00;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: #ff6b00;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const LoadingButton = styled(LoginButton)`
  opacity: ${props => props.loading ? 0.7 : 1};
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  position: relative;

  &:disabled {
    background-color: #ccc;
  }
`;

export default Login;