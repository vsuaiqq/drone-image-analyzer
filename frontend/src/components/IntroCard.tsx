import { Link } from 'react-router-dom';
import styled from 'styled-components';

const IntroCardWrapper = styled.div`
  width: 400px;
  padding: 50px;
  background: linear-gradient(145deg, #222, #111);
  border-radius: 30px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7), inset 0 3px 10px rgba(255, 255, 255, 0.05);
  text-align: center;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.6s ease-in-out;

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-3deg);
    background: linear-gradient(145deg, #333, #222);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.6), inset 0 5px 15px rgba(255, 255, 255, 0.1);
  }
`;

const IntroCardTitle = styled.h1`
  font-size: 36px;
  background: linear-gradient(90deg, #00f5a0, #00d98f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const IntroCardParagraph = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
`;

const IntroCardButton = styled.button`
  padding: 18px 36px;
  background: linear-gradient(145deg, #00f5a0, #00d98f);
  color: #111;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 20px rgba(0, 255, 160, 0.4);

  &:hover {
    background: linear-gradient(145deg, #00d98f, #00b47c);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 255, 160, 0.5);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 8px 15px rgba(0, 255, 160, 0.3);
  }
`;

const IntroCardCircle = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 160, 0.3), transparent);
  box-shadow: 0 30px 60px rgba(0, 255, 160, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.1);
  animation: floating 6s ease-in-out infinite;

  @keyframes floating {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-20px) scale(1.05);
    }
  }
`;

const IntroCardGlowEffect = styled.div`
  position: absolute;
  bottom: -20%;
  right: -20%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(0, 255, 160, 0.05), transparent);
  filter: blur(50px);
  animation: pulse 8s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.08);
    }
  }
`;

const IntroCard = () => {
  return (
    <IntroCardWrapper>
      <IntroCardCircle />
      <IntroCardGlowEffect />
      <IntroCardTitle>AI Powered Detection</IntroCardTitle>
      <IntroCardParagraph>
        This app is able to detect masked or unmasked fortifications, vehicles and soldiers on drone's images.
        The quality of result depends on quality of image, it's better to use clear images without interferences.
        After reading the information you can upload file and check the result.
      </IntroCardParagraph>
      <Link to='/main'>
        <IntroCardButton>Start Now</IntroCardButton>
      </Link>
    </IntroCardWrapper>
  );
};

export default IntroCard;
