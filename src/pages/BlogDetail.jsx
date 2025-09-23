import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { blogApi } from '../services/blogApi';
import { uploadApi } from '../services/uploadApi';

const Container = styled.div`
  width: 100%;
  padding: 2rem 1rem;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const AuthorName = styled.span`
  font-weight: 500;
  color: #333;
`;

const Date = styled.span`
  color: #666;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
`;

const LoadingContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ErrorContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #e74c3c;
`;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogApi.getBlogById(id);
        setBlog(data.blog);
      } catch (err) {
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <LoadingContainer>
        <h2>Loading...</h2>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>{error}</h2>
      </ErrorContainer>
    );
  }

  if (!blog) {
    return (
      <Container>
        <h1>Blog not found</h1>
      </Container>
    );
  }

  return (
    <Container>
      <BlogImage src={uploadApi.getImageUrl(blog.image)} alt={blog.title} />
      <Title>{blog.title}</Title>
      <Meta>
        <Author>
          <AuthorName>{blog.user?.name || 'Anonymous'}</AuthorName>
        </Author>
        <Date>{new Date(blog.createdAt).toLocaleDateString()}</Date>
      </Meta>
      <Content>
        <p>{blog.description}</p>
        {blog.content && <div dangerouslySetInnerHTML={{ __html: blog.content }} />}
      </Content>
    </Container>
  );
};

export default BlogDetail;