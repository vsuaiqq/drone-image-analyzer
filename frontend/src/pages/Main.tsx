import React, { useState, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

import PageWrapper from '../components/PageWrapper';
import ImagePreviewer from '../components/ImagePreviewer';
import { DEFAULT_CONFIDENCE_THRESHOLD, MAX_CONFIDENCE_THRESHOLD, MIN_CONFIDENCE_THRESHOLD, STEP_CONFIDENCE_THRESHOLD } from '../utils/constants';
import api from '../utils/Api';
import Slider from '../components/Slider';

const MainBackgroundPulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const MainBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(40, 40, 40, 1) 0%, rgba(20, 20, 20, 1) 100%);
  overflow: hidden;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
    animation: ${MainBackgroundPulseAnimation} 8s infinite ease-in-out;
  }

  &::before {
    width: 350px;
    height: 350px;
    top: 15%;
    left: 30%;
    background: linear-gradient(135deg, #00f5a0, #00d98f);
    filter: blur(120px);
  }

  &::after {
    width: 450px;
    height: 450px;
    bottom: 10%;
    right: 30%;
    background: linear-gradient(135deg, #00d98f, #00b47c);
    filter: blur(140px);
  }

  box-shadow: 0 0 100px rgba(0, 255, 160, 0.4);
`;

const MainWrapper = styled.div`
  text-align: center;
`

const MainTitle = styled.h2`
  font-size: 40px;
  color: #fff;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #00f5a0, #00d98f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1.5s ease-in-out;

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

const MainControllerButton = styled.button`
  padding: 14px 28px;
  margin: 10px;
  background: linear-gradient(145deg, #00f5a0, #00d98f);
  color: #111;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.4s ease;
  box-shadow: 0 10px 20px rgba(0, 255, 160, 0.4);

  &:hover {
    background: linear-gradient(145deg, #00d98f, #00b47c);
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 255, 160, 0.5);
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 8px 15px rgba(0, 255, 160, 0.3);
  }
`;

const MainImages = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px auto;
  width: 100%;
  max-width: 960px;
`;

const MainImageWrapper = styled.div`
  width: 350px;
  height: 350px;
  border-radius: 15px;
  overflow: hidden;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
`;

const MainControllers = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #00f5a0; /* Green */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Main = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(DEFAULT_CONFIDENCE_THRESHOLD);
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [setUploadedImage]);

  const handleResetFile = useCallback(() => {
    setUploadedImage(null);
    setProcessedImage(null);
    setConfidenceThreshold(DEFAULT_CONFIDENCE_THRESHOLD);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [
    setUploadedImage,
    setProcessedImage,
    setConfidenceThreshold,
  ]);

  const handleFileUpload = useCallback(() => {
    if (!uploadedImage) {
      return;
    }
  
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files) {
      return;
    }
  
    const file = fileInput.files[0];      
    setLoading(true);
    api.processImage(file, confidenceThreshold)
      .then(data => {
        if (data) {
          console.log(data);
          return data.blob();
        } else {
          throw new Error('Data is undefined');
        }
      })
      .then(blob => {
        return URL.createObjectURL(blob);
      })
      .then(url => {
        setProcessedImage(url);
        setLoading(false);
      })
      .catch(error => {
        console.warn(error);
        setLoading(false);
      });
  }, [uploadedImage, confidenceThreshold, setLoading, setProcessedImage]);

  const handleDownload = useCallback(() => {
    if (!processedImage) {
      return;
    }
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage]);

  const handleOpenPreviewer = useCallback(() => {
    if (processedImage) {
      setIsPreviewOpen(true);
    }
  }, [processedImage, setIsPreviewOpen]);

  const handleClosePreviewer = useCallback(() => {
    setIsPreviewOpen(false);
  }, [setIsPreviewOpen]);

  const handleConfidenceThresholdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setConfidenceThreshold(Number(event.target.value));
  }, [])

  return (
    <PageWrapper>
      <MainBackground />
      <MainWrapper>
        <MainTitle>Drone Image Analysis</MainTitle>
        <MainImages>
          <MainImageWrapper>
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded" />
            ) : (
              <span>Upload an Image</span>
            )}
            <FileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </MainImageWrapper>
          {processedImage && (
            <MainImageWrapper>
              <img src={processedImage} alt="Processed" />
            </MainImageWrapper>
          )}
        </MainImages>
        {!loading && (
          <Slider 
            label='Confidence threshold' 
            min={MIN_CONFIDENCE_THRESHOLD} 
            max={MAX_CONFIDENCE_THRESHOLD} 
            step={STEP_CONFIDENCE_THRESHOLD} 
            value={confidenceThreshold} 
            handleOnChange={handleConfidenceThresholdChange}
          />
        )}
        <MainControllers>
          {uploadedImage && (
            <MainControllerButton onClick={handleFileUpload} disabled={loading}>
              {loading ? <Spinner /> : processedImage ? 'Reprocess Image' : 'Process Image'}
            </MainControllerButton>
          )}
          {!loading && <MainControllerButton onClick={handleResetFile}>Reset</MainControllerButton>}
        </MainControllers>
        {processedImage && (
          <MainControllers>
            <MainControllerButton onClick={handleDownload}>Download Processed Image</MainControllerButton>
            <MainControllerButton onClick={handleOpenPreviewer}>View Image</MainControllerButton>
          </MainControllers>
        )}
        {isPreviewOpen && processedImage && (
          <ImagePreviewer src={processedImage} onClose={handleClosePreviewer} />
        )}
      </MainWrapper>
    </PageWrapper>
  );
};

export default Main;
