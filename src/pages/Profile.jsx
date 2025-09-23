import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import BlogCard from '../components/BlogCard';
import { blogApi } from '../services/blogApi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%);
  padding-top: 64px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.04) 0%, transparent 25%);
    pointer-events: none;
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 380px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  margin-bottom: 100px;
  border-radius: 0 0 50px 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80') center/cover;
    opacity: 0.4;
    transition: transform 0.5s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
  }

  &:hover::before {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 280px;
    margin-bottom: 80px;
    border-radius: 0 0 30px 30px;
  }
`;

const CreatePostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #7c8ff7 0%, #8b5db9 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.25);

    &::before {
      opacity: 1;
    }
  }

  span {
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1.5rem;
  }
`;

const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  color: white;
  z-index: 1;
`;

const CoverStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-left: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CoverStat = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  p {
    font-size: 0.875rem;
    opacity: 0.9;
    margin: 0;
  }
`;

const ProfileHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  position: relative;
  margin-top: -80px;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
    padding: 0 1rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-top: -100px;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
  }

  &:hover::before {
    opacity: 0.1;
    transform: scale(1);
  }

  @media (max-width: 768px) {
    margin-top: -70px;
    justify-self: center;
  }
`;

const Avatar = styled.img`
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background-color: white;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02) rotate(2deg);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 160px;
    height: 160px;
    border-width: 4px;
  }
`;

const ProfileInfo = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1.5rem;
    text-align: center;
  }
`;

const ProfileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.95rem;

  svg {
    width: 20px;
    height: 20px;
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:not(:last-child)::after {
    content: '•';
    margin-left: 1rem;
    color: #cbd5e1;
  }
`;

const Name = styled.h1`
  font-size: 2.75rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Username = styled.div`
  font-size: 1.1rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  color: #4a5568;
  font-size: 1.1rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #e53e3e;
  font-size: 1.1rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,242,242,0.9) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(229, 62, 62, 0.1);
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #4a5568;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeIn 0.3s ease;
  
  p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    color: #718096;
  }
`;

const Bio = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0.5rem 0;
  max-width: 600px;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 16px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '"';
    position: absolute;
    top: -0.5rem;
    left: 0.5rem;
    font-size: 4rem;
    color: #667eea;
    opacity: 0.1;
    font-family: Georgia, serif;
  }

  &:hover {
    transform: translateX(4px);
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    margin: 0.5rem auto;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  width: fit-content;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 20px 20px 0 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    gap: 2rem;
    padding: 1.25rem;
    flex-wrap: wrap;
  }
`;

const Stat = styled.div`
  text-align: center;
  position: relative;
  padding: 0.5rem 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    height: 28px;
    width: 2px;
    background: linear-gradient(to bottom, transparent, #e2e8f0, transparent);
    opacity: 0.6;

    @media (max-width: 768px) {
      right: -1rem;
      height: 24px;
    }
  }

  @media (max-width: 480px) {
    &:not(:last-child)::after {
      display: none;
    }
  }
`;

const StatNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.375rem;
  transition: transform 0.2s ease;

  div:hover & {
    transform: scale(1.05);
  }
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.2s ease;

  div:hover & {
    color: #4a5568;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(to right, #e2e8f0 0%, transparent 100%);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BlogsSection = styled.div`
  max-width: 1400px;
  margin: 3rem auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    margin-top: 2rem;
  }
`;




const BlogsSectionContent = styled.div`
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const BlogsSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1rem;
    height: 1px;
    background: linear-gradient(to right, #e2e8f0 0%, transparent 100%);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  transition: opacity 0.3s ease;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  & > * {
    opacity: 0;
    animation: cardFadeIn 0.5s ease forwards;
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.2s; }
  & > *:nth-child(3) { animation-delay: 0.3s; }
  & > *:nth-child(4) { animation-delay: 0.4s; }
`;

const Profile = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const data = await blogApi.getUserBlogs(user._id);
        if (data?.success) {
          setBlogs(data?.data?.blogs);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user?._id]);

  return (
    <Container>
      <CoverImage>
        <CoverOverlay>
          <CoverStats>
            <CoverStat>
              <h4>{blogs?.length}</h4>
              <p>Posts</p>
            </CoverStat>
            <CoverStat>
              <h4>1.2K</h4>
              <p>Views</p>
            </CoverStat>
            <CoverStat>
              <h4>98%</h4>
              <p>Engagement</p>
            </CoverStat>
          </CoverStats>
        </CoverOverlay>
      </CoverImage>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar src={user.avatar} alt={user.name} />
        </AvatarContainer>
        <ProfileInfo>
          <div>
            <Name>{user.name}</Name>
            <Username>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Joined {new Date(userProfile?.createdAt || user.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Username>
            <ProfileMeta>
              <MetaItem>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 19C6.85714 16.7143 9.14286 15 12 15C14.8571 15 17.1429 16.7143 18 19" stroke="currentColor" strokeWidth="2" />
                </svg>
                Professional Blogger
              </MetaItem>
              <MetaItem>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 11L12 14L15 11" stroke="currentColor" strokeWidth="2" />
                </svg>
                {userProfile?.location || user.location || 'Earth'}
              </MetaItem>
              <MetaItem>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" />
                </svg>
                {userProfile?.website || user.website || 'myblog.com'}
              </MetaItem>
            </ProfileMeta>
          </div>
          <Bio>{userProfile?.bio || user.bio || 'Welcome to my blog! I share my thoughts and experiences about technology, design, and life in general. Join me on this journey of discovery and learning.'}</Bio>
          <Stats>
            <Stat>
              <StatNumber>{userProfile?.blogCount || blogs?.length || 0}</StatNumber>
              <StatLabel>Posts</StatLabel>
            </Stat>
          </Stats>
        </ProfileInfo>
      </ProfileHeader>

      {loading ? (
        <LoadingSpinner>Loading your posts...</LoadingSpinner>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : blogs?.length === 0 ? (
        <EmptyState>
          <p>You haven't created any posts yet.</p>
          <CreatePostButton to="/create">
            <span>✍️</span> Create Your First Post
          </CreatePostButton>
        </EmptyState>
      ) : (
        <BlogsSection>
          <BlogsSectionContent>
            <BlogsSectionHeader>
              <SectionTitle>My Posts</SectionTitle>
              <CreatePostButton to="/create">
                <span>✍️</span> Create New Post
              </CreatePostButton>
            </BlogsSectionHeader>
            <BlogGrid>
              {blogs?.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </BlogGrid>
          </BlogsSectionContent>
        </BlogsSection>
      )
      }
    </Container>
  );
};

export default Profile;