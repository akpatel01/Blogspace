import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ImageSkeleton = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const TitleSkeleton = styled.div`
  width: 80%;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const DescriptionSkeleton = styled.div`
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  &:last-of-type {
    width: 60%;
  }
`;

const BlogCardSkeleton = () => {
    return (
        <Card>
            <ImageSkeleton />
            <Content>
                <TitleSkeleton />
                <DescriptionSkeleton />
                <DescriptionSkeleton />
                <DescriptionSkeleton />
            </Content>
        </Card>
    );
};

export default BlogCardSkeleton;