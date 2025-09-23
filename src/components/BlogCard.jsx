import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;

  &:hover {
    text-decoration: none;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    img {
      transform: scale(1.05);
    }
  }

  @media (max-width: 640px) {
    border-radius: 10px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;

  @media (min-width: 768px) {
    height: 200px;
  }
`;


const Content = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;

  @media (max-width: 640px) {
    font-size: 0.95rem;
    -webkit-line-clamp: 2;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const AuthorImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const AuthorName = styled.span`
  color: #444;
  font-weight: 500;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Date = styled.span`
  color: #888;
  font-size: 0.85rem;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BlogCard = ({ blog }) => {

  return (
    <CardLink to={`/blog/${blog._id}`}>
      <Card>
        <Image
          src={blog.image}
          alt={blog.title}
        />
        <Content>
          <Title>{blog.title}</Title>
          <Description>{blog.description}</Description>
          <Meta>
            <Author>
              <AuthorImage
                src={blog.user?.avatar}
                alt={blog.user?.name}
              />
              <AuthorName>{blog.user?.name || 'Anonymous'}</AuthorName>
            </Author>
            <Date title={new window.Date(blog.createdAt).toLocaleString()}>
              {new window.Date(blog.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Date>
          </Meta>
        </Content>
      </Card>
    </CardLink>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
      email: PropTypes.string,
    }),
    createdAt: PropTypes.string,
  }).isRequired,
};

export default BlogCard;