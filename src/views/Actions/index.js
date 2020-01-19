import React, { useContext } from 'react';
import styled from 'styled-components';
import history from 'components/History';
// import { FirebaseContext } from '../../components/Firebase';
import { AuthUserContext, withAuthorization } from 'components/Session';
import { Link } from 'react-router-dom';
import { ROUTES } from 'utils/routes';

const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-auto-rows: 18rem auto;

  animation: fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
`;

const ActionButton = styled.button`
  height: 7rem;
  width: 26rem;
  font-size: 2.4rem;
  font-weight: 500;
  border: none;
  color: #fff;
  background-color: #6C833A;
  border-radius: .8rem;
  justify-self: center;
  align-self: center;
  cursor: pointer;
`;

const CardWrapper = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 144rem;
  margin: 0 auto;
  justify-items: center;
`;

const Card = styled(Link)`
  width: 30rem;
  height: 16.5rem;
  background-color: #303030;
  border-radius: 1.2rem;
  text-align: center;
  animation: slide-fwd-center 200ms cubic-bezier(0.250, 0.460, 0.450, 0.940) ${(props) => props.delay*200 + 'ms'} both!important;
`;

const Title = styled.div`
  height: 11rem;
  padding: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  overflow: hidden;
`;

const Date = styled.div`
  font-size: 1.8rem;
  line-height: 5.5rem;
  overflow: hidden;
`;

const Actions = () => {
  const user = useContext(AuthUserContext);

  return user ? (
    <Wrapper>
      <ActionButton onClick={()=>{history.push(ROUTES.newAction)}}>Nowa akcja</ActionButton>
      <CardWrapper>
        {user.actions ? user.actions.map(
          (action, id) => (
            <Card to={`/akcja/${id}`} key={id} delay={id}>
              <Title>{action.name}</Title>
              <Date>{action.date}</Date>
            </Card>
          )
        ) : null}
      </CardWrapper>
    </Wrapper>
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(Actions);