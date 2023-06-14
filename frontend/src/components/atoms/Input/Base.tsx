import styled from 'styled-components';

type Props = {
  id: string;
  placeholder: string;
  value: string | number | readonly string[] | undefined;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Base = (props: Props) => {
  const { id, placeholder, value, onChangeHandler } = props;

  return <SInput id={id} type="text" placeholder={placeholder} value={value} onChange={onChangeHandler} />;
};

const SInput = styled.input`
  width: 100%;
  max-width: 343px;
  min-height: 45px;
  border: none;
  border-radius: 8px;
  padding: 0.5em;
`;
