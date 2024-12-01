import React, { useCallback, useState, useEffect } from 'react';
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
  width: 90vw;
  height: 90vh;
  overflow: hidden;
`;

const Image = styled.img<{ scale: number }>`
  max-width: 100%;
  max-height: 100%;
  transform: scale(${(props) => props.scale});
  transition: transform 0.3s ease-in-out;
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
  font-size: 30px;  /* Сделаем крестик побольше */
  color: black;
  z-index: 40;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;

  /* Убедимся, что крестик будет круглым */
  width: 50px;
  height: 50px;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const ZoomSlider = styled.input`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  width: 200px;
`;

const ImagePreviewer = ({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState<number>(1);

  // Функции для увеличения и уменьшения масштаба
  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom * ZOOM_COEFF, MAX_ZOOM_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => Math.max(prevZoom / ZOOM_COEFF, MIN_ZOOM_SCALE));
  }, []);

  // Обработка колесика мыши для увеличения/уменьшения масштаба

  // Функция для обработки изменения значения слайдера
  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setZoom(Number(event.target.value));
    },
    []
  );

  // Регистрация обработчика события колесика мыши с параметром passive: false
  useEffect(() => {
    const imageWrapperElement = document.getElementById('image-wrapper');
    if (imageWrapperElement) {
      const wheelHandler = (event: WheelEvent) => {
        event.preventDefault();
        if (event.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      };

      // Добавляем обработчик события колесика с passive: false
      imageWrapperElement.addEventListener('wheel', wheelHandler, { passive: false });

      // Очистка эффекта при удалении компонента
      return () => {
        imageWrapperElement.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [handleZoomIn, handleZoomOut]);

  return (
    <>
      <ImagePreviwerOverlay onClick={onClose} />
      <ImageWrapper id="image-wrapper">
        <ImagePreviwerCloseButton onClick={onClose}>×</ImagePreviwerCloseButton>
        <Image src={src ?? undefined} alt="Preview" scale={zoom} />
      </ImageWrapper>

      {/* Слайдер для масштаба */}
      <ZoomSlider
        type="range"
        min={MIN_ZOOM_SCALE}
        max={MAX_ZOOM_SCALE}
        step={0.1}
        value={zoom}
        onChange={handleSliderChange}
      />
    </>
  );
};

export default ImagePreviewer;
