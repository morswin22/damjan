import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes'

const Styled = styled.div`
  grid-area: navbar;

  font-size: 2.4rem;
  line-height: 7.7rem;

  padding: 0 2rem;

  display: flex;
  justify-content: flex-end;

  color: ${({ theme }) => theme.color.primary};

  a {
    padding: 0 3rem;
  }
`;

const Navbar = () => (
  <Styled>
    <Link to={ROUTES.actions}>Akcje</Link>
    <Link to={ROUTES.surveys}>Ankiety</Link>
    <Link to={ROUTES.templates}>Szablony</Link>
  </Styled>
)

export default Navbar;