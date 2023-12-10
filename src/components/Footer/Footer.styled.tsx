import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled(Link)`
  position: fixed;
  bottom: 0;
  padding: 8px 16px;
  background-color: white;
  -webkit-box-shadow: 0px -2px 35px -24px rgba(66, 68, 90, 1);
  -moz-box-shadow: 0px -2px 35px -24px rgba(66, 68, 90, 1);
  box-shadow: 0px -2px 35px -24px rgba(66, 68, 90, 1);
`;
