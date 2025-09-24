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
  background: white;
  color: #333;

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
  background: white;
  color: #333;

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

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  background: #f0f2f5;
  color: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 1.1rem;

    &:hover {
      color: #e74c3c;
    }
  }
`;

const TagInput = styled(Input)`
  margin-bottom: 0.5rem;
`;

const SuggestedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SuggestedTag = styled.button`
  background: ${props => props.active ? '#333' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: 1px solid #ddd;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: #fff;
  }
`;

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    tags: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [popularTags, setPopularTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Suggested tags for new blogs
  const suggestedTags = [
    'Technology', 'Programming', 'Web Development', 'Design',
    'Tutorial', 'How-to', 'Career', 'Software', 'Tips',
    'Best Practices', 'Learning', 'Guide'
  ];

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (value.trim().length < 5) {
          error = 'Title must be at least 5 characters long';
        } else if (value.trim().length > 100) {
          error = 'Title must be less than 100 characters';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 10) {
          error = 'Description must be at least 10 characters long';
        } else if (value.trim().length > 200) {
          error = 'Description must be less than 200 characters';
        }
        break;
      case 'content':
        if (!value.trim()) {
          error = 'Content is required';
        } else if (value.trim().length < 50) {
          error = 'Content must be at least 50 characters long';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }
      // Validate image format
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Only jpg, jpeg, png and gif images are allowed'
        }));
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleAddTag = (tag) => {
    const processedTag = tag.trim().toLowerCase();
    if (processedTag && !tags.includes(processedTag)) {
      if (tags.length >= 5) {
        setFormErrors(prev => ({
          ...prev,
          tags: 'Maximum 5 tags allowed'
        }));
        return;
      }
      setTags(prev => [...prev, processedTag]);
      setTagInput('');
      setFormErrors(prev => ({
        ...prev,
        tags: ''
      }));
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestedTagClick = (tag) => {
    handleAddTag(tag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields before submission
    const errors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      content: validateField('content', formData.content),
      image: formErrors.image, // Keep existing image error if any
      tags: tags.length === 0 ? 'At least one tag is required' : ''
    };

    setFormErrors(errors);

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error !== '')) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        const uploadResponse = await uploadApi.uploadImage(selectedImage);
        imageUrl = uploadResponse.imageUrl;
      }

      const blogData = {
        ...formData,
        image: imageUrl,
        tags: tags,
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
            style={{ borderColor: formErrors.title ? '#e74c3c' : '#ddd' }}
          />
          {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a brief description of your blog post"
            style={{
              minHeight: '100px',
              borderColor: formErrors.description ? '#e74c3c' : '#ddd'
            }}
          />
          {formErrors.description && <ErrorMessage>{formErrors.description}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post content here"
            style={{ borderColor: formErrors.content ? '#e74c3c' : '#ddd' }}
          />
          {formErrors.content && <ErrorMessage>{formErrors.content}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="image">Blog Image</Label>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ borderColor: formErrors.image ? '#e74c3c' : '#ddd' }}
          />
          {formErrors.image && <ErrorMessage>{formErrors.image}</ErrorMessage>}
          {previewUrl && (
            <ImagePreview src={previewUrl} alt="Preview" />
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            type="text"
            id="tags"
            name="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tags (press Enter or comma to add)"
            style={{ borderColor: formErrors.tags ? '#e74c3c' : '#ddd' }}
          />
          {formErrors.tags && <ErrorMessage>{formErrors.tags}</ErrorMessage>}

          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
              </Tag>
            ))}
          </TagsContainer>

          <Label as="p" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Suggested Tags:
          </Label>
          <SuggestedTags>
            {suggestedTags
              .filter(tag => !tags.includes(tag.toLowerCase()))
              .map((tag, index) => (
                <SuggestedTag
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedTagClick(tag)}
                >
                  {tag}
                </SuggestedTag>
              ))}
          </SuggestedTags>
        </FormGroup>

        {error && <ErrorMessage style={{ textAlign: 'center' }}>{error}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;