import styled from 'styled-components';

const Content = styled.div`
    grid-area: router;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.color.primary};
`;

export default Content;