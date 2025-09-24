import styled from "@emotion/styled";

const ComingSoonWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ff8a00 0%, #ff5f6d 100%);
  color: white;
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  animation: fadeInUp 0.8s ease forwards;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.15);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: inline-block;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const NotifyButton = styled.button`
  background: white;
  color: #ff5f6d;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 95, 109, 0.4);
  }
`;

const ComingSoon = () => {
  return (
    <ComingSoonWrapper>
      <Tag>⚙️ New Feature</Tag>
      <Title>Coming Soon: Settings</Title>
      <Subtitle>
        We’re building a modern and customizable settings page so you can manage
        your profile, preferences, and privacy with ease.
      </Subtitle>
      <NotifyButton>Notify Me</NotifyButton>
    </ComingSoonWrapper>
  );
};

export default ComingSoon;
