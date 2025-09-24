import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import BlogCard from '../components/BlogCard';
import { blogApi } from '../services/blogApi';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%);
  padding: 2rem 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1470&q=80') center/cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: -2rem auto 3rem;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const SearchBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  font-size: 1.1rem;
  padding: 0.5rem;
  outline: none;
  background: white;
  color: #333;

  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchIcon = styled.svg`
  width: 24px;
  height: 24px;
  color: #a0aec0;
  margin-left: 0.5rem;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  justify-content: center;
`;

const Tag = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #4a5568;
  font-size: 1.1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2d3748;
  }

  p {
    color: #718096;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const FiltersSidebar = styled.div`
  position: fixed;
  right: ${props => props.show ? '0' : '-320px'};
  top: 0;
  width: 320px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
`;

const FilterGroup = styled.div`
  margin-bottom: 2rem;

  h3 {
    font-size: 1.1rem;
    color: #2d3748;
    margin-bottom: 1rem;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#5a6ed1' : '#f7fafc'};
  }
`;

const FilterToggle = styled.button`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1001;

  &:hover {
    transform: scale(1.1);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #4a5568;
  font-size: 1.1rem;

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    margin: 2rem auto;
    border-radius: 50%;
    border: 3px solid #e2e8f0;
    border-top-color: #667eea;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Explore = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [tags, setTags] = useState(['All']);
  const [popularTags, setPopularTags] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [readTimeRange, setReadTimeRange] = useState({ min: '', max: '' });

  const sortOptions = [
    { value: 'createdAt', label: 'Date', order: 'desc' },
    { value: 'title', label: 'Title', order: 'asc' },
    { value: 'readTime', label: 'Read Time', order: 'asc' },
    { value: 'likes', label: 'Most Liked', order: 'desc' },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await blogApi.getPopularTags();
        if (data?.success) {
          setPopularTags(['All', ...(data?.data?.tags || [])]);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 9,
          search: searchTerm,
          tags: activeTag === 'All' ? [] : [activeTag],
          sortBy,
          sortOrder,
          dateRange: dateRange.start ? dateRange : undefined,
          minReadTime: readTimeRange.min || undefined,
          maxReadTime: readTimeRange.max || undefined
        };

        const data = await blogApi.getAllBlogs(params);
        if (data?.success) {
          if (page === 1) {
            setBlogs(data?.data?.blogs || []);
          } else {
            setBlogs(prev => [...prev, ...(data?.data?.blogs || [])]);
          }
          setTotalBlogs(data?.data?.total || 0);
          setHasMore((data?.data?.blogs || []).length === 9);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchBlogs();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [page, searchTerm, activeTag, sortBy, sortOrder, dateRange, readTimeRange]);

  const handleSortChange = (option) => {
    setSortBy(option.value);
    setSortOrder(option.order);
    setPage(1);
  };

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setPage(1);
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
    setPage(1);
  };

  const handleReadTimeChange = (type, value) => {
    setReadTimeRange(prev => ({
      ...prev,
      [type]: value
    }));
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Explore Amazing Stories</Title>
        <SubTitle>
          Discover inspiring stories, insightful articles, and creative ideas from writers around the world
        </SubTitle>
      </Header>

      <SearchContainer>
        <SearchBar>
          <SearchIcon viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search stories, articles, and more..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </SearchContainer>

      <Content>
        <TagsContainer>
          {popularTags.map(tag => (
            <Tag
              key={tag}
              active={activeTag === tag}
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </Tag>
          ))}
        </TagsContainer>

        {loading && page === 1 ? (
          <LoadingSpinner>Finding amazing stories...</LoadingSpinner>
        ) : blogs.length > 0 ? (
          <>
            <BlogGrid>
              {blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </BlogGrid>
            {hasMore && (
              <LoadMoreButton
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Stories'}
              </LoadMoreButton>
            )}
          </>
        ) : (
          <NoResults>
            <h3>No Stories Found</h3>
            <p>
              We couldn't find any stories matching your search. Try adjusting your filters or search terms.
            </p>
          </NoResults>
        )}
      </Content>

      <FilterToggle onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </FilterToggle>

      <FiltersSidebar show={showAdvancedFilters}>
        <FilterGroup>
          <h3>Sort By</h3>
          {sortOptions.map(option => (
            <SortButton
              key={option.value}
              active={sortBy === option.value}
              onClick={() => handleSortChange(option)}
            >
              {option.label}
            </SortButton>
          ))}
        </FilterGroup>

        <FilterGroup>
          <h3>Date Range</h3>
          <FilterInput
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            placeholder="Start Date"
          />
          <FilterInput
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            placeholder="End Date"
          />
        </FilterGroup>

        <FilterGroup>
          <h3>Read Time (minutes)</h3>
          <FilterInput
            type="number"
            min="0"
            value={readTimeRange.min}
            onChange={(e) => handleReadTimeChange('min', e.target.value)}
            placeholder="Min Read Time"
          />
          <FilterInput
            type="number"
            min="0"
            value={readTimeRange.max}
            onChange={(e) => handleReadTimeChange('max', e.target.value)}
            placeholder="Max Read Time"
          />
        </FilterGroup>
      </FiltersSidebar>
    </Container>
  );
};

export default Explore;