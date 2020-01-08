import React from 'react';
import styled from 'styled-components';

const Styled = styled.div`
    grid-area: header;

    font-size: 2.4rem;
    line-height: 7.7rem;
    text-align: center;
    text-transform: uppercase;

    color: ${({ theme }) => theme.color.primary };
`;

const Header = () => (
    <Styled>
        Plemiona: Planer ataków
    </Styled>
)

export default Header;