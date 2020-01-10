import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.div`
    width: 45rem;

    font-size: 2.4rem;
    text-align: center;
    text-transform: uppercase;

    color: ${({ theme }) => theme.color.primary };
`;

const Logo = () => (
    <StyledLogo>
        Plemiona: Planer ataków
    </StyledLogo>
)

export default Logo;