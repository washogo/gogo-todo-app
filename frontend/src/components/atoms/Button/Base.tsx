import styled from 'styled-components';

type Props = {
  text: string;
  onClickHandler?: () => void;
};

export const Base = (props: Props) => {
  const { text, onClickHandler } = props;

  return <SButton onClick={onClickHandler}>{text}</SButton>;
};

const SButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 24px;
  background-color: #ffd700;
  color: #fff;
  border: none;
`;
