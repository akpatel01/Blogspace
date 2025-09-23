import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { blogApi } from '../services/blogApi';
import { uploadApi } from '../services/uploadApi';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #444;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const Button = styled.button`
  background: #333;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #444;
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.img`
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 4px;
    margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 0.5rem;
`;

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = '';
      if (selectedImage) {
        const uploadResponse = await uploadApi.uploadImage(selectedImage);
        imageUrl = uploadResponse.imageUrl;
        console.log("uploadResponse", uploadResponse);
      }
      console.log("imageUrl", imageUrl);
      const blogData = {
        ...formData,
        image: imageUrl,
      };

      await blogApi.createBlog(blogData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create blog post');
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Create New Post</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Write a brief description of your blog post"
            style={{ minHeight: '100px' }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write your blog post content here"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="image">Blog Image</Label>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <ImagePreview src={previewUrl} alt="Preview" />
          )}
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;