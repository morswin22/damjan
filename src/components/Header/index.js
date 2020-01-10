import React from 'react';
import styled from 'styled-components';

import Logo from '../Logo';
import Navbar from '../Navbar';

const Bar = styled.div`
  grid-area: header;

  line-height: 7.7rem;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 45rem auto;
  grid-auto-rows: 7.7rem;

  color: ${({ theme }) => theme.color.primary };
`;

const Header = () => (
  <Bar>
    <Logo />
    <Navbar />
  </Bar>
)

export default Header;