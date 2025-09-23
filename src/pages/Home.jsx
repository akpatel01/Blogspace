import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import BlogCard from '../components/BlogCard';
import BlogCardSkeleton from '../components/BlogCardSkeleton';
import { blogApi } from '../services/blogApi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeContainer = styled.div`
  width: 100%;
  padding: 1rem;
  min-height: 100%;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.75rem;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    font-size: 1.1rem;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
`;

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogApi.getAllBlogs();
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <HomeContainer>
      <Header>
        <Title>Explore Stories</Title>
        <Subtitle>Discover amazing stories shared by our community</Subtitle>
      </Header>
      <BlogGrid>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : error ? (
          <p style={{ color: '#e74c3c', textAlign: 'center', gridColumn: '1 / -1' }}>
            {error}
          </p>
        ) : blogs.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No blogs found</p>
        ) : (
          blogs.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              style={{ textDecoration: 'none' }}
            >
              <BlogCard blog={blog} />
            </Link>
          ))
        )}
      </BlogGrid>
    </HomeContainer>
  );
};

export default Home;