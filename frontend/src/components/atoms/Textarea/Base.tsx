import styled from 'styled-components';

type Props = {
  id: string;
  placeholder: string;
  value: string | number | readonly string[] | undefined;
  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const Base = (props: Props) => {
  const { id, placeholder, value, onChangeHandler } = props;

  return <STextarea id={id} placeholder={placeholder} value={value} onChange={onChangeHandler} />;
};

const STextarea = styled.textarea`
  width: 100%;
  max-width: 343px;
  min-height: 200px;
  border: none;
  border-radius: 8px;
  padding: 0.5em;
`;
