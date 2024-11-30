import styled from "styled-components";

const SliderWrapper = styled.div`
  margin: 20px auto;
  text-align: center;
`;

const SliderLabel = styled.label`
  display: block;
  color: #fff;
  font-size: 18px;
  margin-bottom: 10px;
`;

const SliderInput = styled.input`
  width: 100%;
  max-width: 400px;
`;

const Slider = ({
  label,
  min,
  max,
  step,
  value,
  handleOnChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <SliderWrapper>
      <SliderLabel>{label}: {value.toFixed(2)}</SliderLabel>
      <SliderInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleOnChange}
      />
    </SliderWrapper>
  )
};

export default Slider;
