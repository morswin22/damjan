import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import history from '../../components/History';
// import { FirebaseContext } from '../../components/Firebase';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

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

const CardList = styled(Link)`
  width: 30rem;
  height: 20rem;
  background-color: #303030;
  border-radius: 1.2rem;
  text-align: center;
  animation: slide-fwd-center 200ms cubic-bezier(0.250, 0.460, 0.450, 0.940) ${(props) => props.delay*200 + 'ms'} both!important;
`;

const Title = styled.div`
  line-height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 500;
  overflow: hidden;
`;

const Item = styled.div`
  font-size: 1.8rem;
  line-height: 3.5rem;
  overflow: hidden;
`;

const Action = () => {
  const user = useContext(AuthUserContext);

  const { id } = useParams();

  useEffect(() => {
    if (user && (!user.actions || !user.actions[id])) history.push(ROUTES.actions);
  }, [id, user]);

  const handleSurveySelect = (event) => {
    console.log(event.target.delay);
  }

  return user && user.actions && user.actions[id] ? (
    user.actions[id].survey === false ? (
      <Wrapper>
        <ActionButton onClick={()=>{history.push(ROUTES.newSurvey)}}>Nowa ankieta</ActionButton>
        <CardWrapper>
          {user.surveys ? user.surveys.map(
            (survey, id) => (
              <CardList onClick={handleSurveySelect} key={id} delay={id}>
                <Title>{survey.name}</Title>
                {survey.elements.map((value, key)=>(
                  <Item key={key}>{value}</Item>
                ))}
              </CardList>
            )
          ) : null}
        </CardWrapper>
      </Wrapper>
    ) : (
      <>ok</>
    )
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(Action);