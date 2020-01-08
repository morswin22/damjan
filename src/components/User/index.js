import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes'

const Styled = styled.div`
  grid-area: user;

  font-size: 2.4rem;
  line-height: 7.7rem;

  padding: 0 2rem;

  color: ${({ theme }) => theme.color.primary};
`;

const User = () => (
  <Styled>
    <Link to={ROUTES.actions}>Użytkownik</Link>
  </Styled>
)

export default User;