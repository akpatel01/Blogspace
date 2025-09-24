import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.match(/image\/(jpg|jpeg|png|gif)/)) {
        setError('Only image files (jpg, jpeg, png, gif) are allowed');
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Create FormData for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    if (avatar) {
      formDataToSend.append('avatar', avatar);
    }

    try {
      // Use the signup function from AuthContext
      await signup(formDataToSend);
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      setError(error.message || 'Failed to sign up. Please try again.');
      setLoading(false);
    }
  }; return (
    <Container>
      <FormWrapper>
        <Logo>BlogSphere</Logo>
        <Title>Create an Account</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>
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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Profile Picture</Label>
            <AvatarInput
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <AvatarPreview>
                <img src={avatarPreview} alt="Avatar preview" />
              </AvatarPreview>
            )}
          </InputGroup>
          <SignupButton type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </SignupButton>
        </Form>
        <LoginText>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </LoginText>
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
  color: #0c0c0cff;

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
  }
`;

const AvatarInput = styled.input`
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  background: white;

  &::file-selector-button {
    background: #f3f4f6;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const AvatarPreview = styled.div`
  margin-top: 1rem;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ddd;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SignupButton = styled.button`
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

const LoginText = styled.p`
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

const LoadingButton = styled(SignupButton)`
  opacity: ${props => props.loading ? 0.7 : 1};
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  position: relative;

  &:disabled {
    background-color: #ccc;
  }
`;

export default Signup;