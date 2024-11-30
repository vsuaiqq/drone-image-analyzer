import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { MAX_ZOOM_SCALE, MIN_ZOOM_SCALE, ZOOM_COEFF } from '../utils/constants';

const ImagePreviwerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 10;
`;

const ImageWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
`;

const Image = styled.img<{ scale: number }>`
  max-width: 100%;
  max-height: 100%;
  transform: scale(${(props) => props.scale});
  transition: transform 0.3s ease-in-out;
`;

const ImagePreviwerZoomButton = styled.button`
  position: fixed;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  font-size: 24px;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 30;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const ImagePreviwerZoomInButton = styled(ImagePreviwerZoomButton)`
  top: 20px;
  right: 20px;
`;

const ImagePreviwerZoomOutButton = styled(ImagePreviwerZoomButton)`
  top: 20px;
  left: 20px;
`;

const ImagePreviwerCloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  color: black;
  z-index: 30;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const ImagePreviewer = ({ 
  src, 
  onClose 
}: {
  src: string | null
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState<number>(1);

  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom * ZOOM_COEFF, MAX_ZOOM_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => Math.max(prevZoom / ZOOM_COEFF, MIN_ZOOM_SCALE));
  }, []);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    },
    [handleZoomIn, handleZoomOut]
  );

  return (
    <>
      <ImagePreviwerOverlay onClick={onClose} />
      <ImageWrapper onWheel={handleWheel}>
        <ImagePreviwerCloseButton onClick={onClose}>×</ImagePreviwerCloseButton>
        <ImagePreviwerZoomInButton onClick={handleZoomIn}>+</ImagePreviwerZoomInButton>
        <ImagePreviwerZoomOutButton onClick={handleZoomOut}>-</ImagePreviwerZoomOutButton>
        <Image 
          src={src ?? undefined} 
          alt="Preview" 
          scale={zoom} 
        />
      </ImageWrapper>
    </>
  );
};

export default ImagePreviewer;
