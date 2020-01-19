import React, {useContext} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from 'utils/routes'
import { AuthUserContext } from 'components/Session';

import profile from 'assets/profile.png';

const Styled = styled.div`

  display: flex;
  justify-content: flex-end;

  font-size: 2.4em;

  color: ${({ theme }) => theme.color.primary};

  a {
    margin: 0 1.5rem;

    &:hover {
      text-decoration: underline!important;
    }
  }

  animation: scale-up-ver-bottom 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

  @keyframes scale-up-ver-bottom {
    0% {
      transform: scaleY(0.4);
      transform-origin: 0% 100%;
      opacity: 0;
    }
    100% {
      transform: scaleY(1);
      transform-origin: 0% 100%;
      opacity: 1;
    }
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  
  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.color.primary};

  img {
    margin-left: 2rem;
  }
`;

const Navbar = () => {
  const user = useContext(AuthUserContext)

  return <>
  {user ? 
    <Styled>
      <Link to={ROUTES.actions}>Akcje</Link>
      <Link to={ROUTES.surveys}>Ankiety</Link>
      <Link to={ROUTES.templates}>Szablony</Link>
      <StyledLink to={ROUTES.user}>
        {user.name}
        <img src={profile} alt="" />
      </StyledLink>
    </Styled>
  : null }
  </> 

}

export default Navbar;