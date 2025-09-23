import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import BlogCard from '../components/BlogCard';
import { blogApi } from '../services/blogApi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 64px; // Add space for navbar
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`;

const CoverSection = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  margin-bottom: 80px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    height: 200px;
    margin-bottom: 60px;
  }
`;

const ProfileHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 3rem;
  position: relative;
  margin-top: -60px;
  z-index: 1; // Ensure profile header stays above cover section
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    padding: 0 1rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-top: -40px;
`;

const Avatar = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
  }
`;

const EditButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);w
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding-top: 2rem;

  @media (max-width: 768px) {
    padding-top: 0;
  }
`;

const Name = styled.h1`
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Bio = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 600px;
`;

const UserActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled(ActionButton)`
  background-color: #4a90e2;
  color: white;
  border: none;

  &:hover {
    background-color: #357abd;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;

  &:hover {
    background-color: #f8fafc;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 3rem;
  background: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: fit-content;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
  }
`;

const Stat = styled.div`
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    height: 24px;
    width: 1px;
    background-color: #e2e8f0;

    @media (max-width: 768px) {
      right: -1rem;
    }
  }
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MainContent = styled.div`
  padding: 0 2rem 3rem;

  @media (max-width: 768px) {
    padding: 0 1rem 2rem;
  }
`;

const BlogsSection = styled.div`
  margin-top: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 600;
`;

const FilterDropdown = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #cbd5e0;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const dummyUser = {
  name: 'John Doe',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: 'Tech enthusiast and blogger. Sharing thoughts on web development, AI, and technology trends.',
  stats: {
    posts: 6,
    followers: 1234,
    following: 567
  }
};

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
`;

const CreatePostButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const Profile = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const data = await blogApi.getUserBlogs(user?._id);
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserBlogs();
    }
  }, [user?._id]);

  return (
    <Container>
      <ProfileHeader>
        <Avatar src={dummyUser.avatar} alt={dummyUser.name} />
        <ProfileInfo>
          <Name>{dummyUser.name}</Name>
          <Bio>{dummyUser.bio}</Bio>
          <Stats>
            <Stat>
              <StatNumber>{dummyUser.stats.posts}</StatNumber>
              <StatLabel>Posts</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{dummyUser.stats.followers}</StatNumber>
              <StatLabel>Followers</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{dummyUser.stats.following}</StatNumber>
              <StatLabel>Following</StatLabel>
            </Stat>
          </Stats>
        </ProfileInfo>
      </ProfileHeader>

      <BlogsSection>
        <SectionTitle>My Posts</SectionTitle>
        <BlogGrid>
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </BlogGrid>
      </BlogsSection>
    </Container>
  );
};

export default Profile;