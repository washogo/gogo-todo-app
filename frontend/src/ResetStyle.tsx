import { createGlobalStyle } from 'styled-components';
import sanitize from 'sanitize.css'
import typography from 'sanitize.css/typography.css'

const SGlobalStyle = createGlobalStyle`
  ${sanitize}
  ${typography}
`

export const ResetStyle = () => {
  return <SGlobalStyle />
};
