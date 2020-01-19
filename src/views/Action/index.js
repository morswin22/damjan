import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import history from 'components/History';
import { FirebaseContext } from 'components/Firebase';
import { AuthUserContext, withAuthorization } from 'components/Session';
import { /* Link, */ useParams } from 'react-router-dom';
import { ROUTES } from 'utils/routes';

const SurveysWrapper = styled.div`
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

const CardList = styled.div`
  cursor: pointer;
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

const SurveyLoadingWrapper = styled.div`
  display: grid;
  grid-auto-rows: 1fr 3fr 1fr;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div`
  text-align: center;
  font-size: 2.4rem;
`;

const Box = styled.div`
  background-color: #303030;
  height: 100%;
  width: 100%;
  border-radius: 1.2rem;
  display: grid;
  grid-auto-rows: 7rem auto 6.2rem;
`;

const Hyperlink = styled.div`
  font-size: 2rem;
  line-height: 7rem;
  padding: 0 2rem;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressBar = styled.div`
  margin: 3rem 1.6rem 1.6rem;
  height: 1.6rem;
  border-radius: 1.2rem;
  background-color: #C4C4C4;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${(props) => `${props.value*100/props.max}%`};
    background-color: #6C833A;
    border-radius: 1.2rem;
  }

  &::after {
    content: '${(props) => props.value}/${(props) => props.max}';
    position: absolute;
    top: -3rem;
    right: 1rem;
    font-size: 2.4rem;
    font-weight: 500;
  }
`;

const EndButton = styled.button`
  width: 26rem;
  height: 7rem;
  border: none;
  border-radius: .8rem;
  background-color: #A63838;
  color: #fff;
  font-size: 2.4rem;
  font-weight: 500;
  justify-self: center;
  cursor: pointer;
`;

const Action = () => {
  const user = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);

  console.log(firebase);

  const { aid } = useParams();

  useEffect(() => {
    if (user && (!user.actions || !user.actions[aid])) {
      history.push(ROUTES.actions);
      return;
    }
    if (user && (!user.surveys || !user.surveys[user.actions[aid].survey]) && user.actions[aid].survey !== false) {
      firebase.action(user.uid, user.actions[aid].survey).update({survey: false});
      return;
    }
  }, [aid, user, firebase]);

  const handleSurveySelect = sid => {
    firebase.action(user.uid, aid).update({survey: sid});
  }

  return user && user.actions && user.actions[aid] ? (
    user.actions[aid].survey === false ? (
      <SurveysWrapper>
        <ActionButton onClick={()=>{history.push(ROUTES.newSurvey)}}>Nowa ankieta</ActionButton>
        <CardWrapper>
          {user.surveys ? user.surveys.map(
            (survey, sid) => (
              <CardList onClick={()=>handleSurveySelect(sid)} key={sid}>
                <Title>{survey.name}</Title>
                {survey.elements.map((value, key)=>(
                  <Item key={key}>{value}</Item>
                ))}
              </CardList>
            )
          ) : null}
        </CardWrapper>
      </SurveysWrapper>
    ) : (
      user.surveys && user.surveys[user.actions[aid].survey] ? (
        user.surveys[user.actions[aid].survey].finished === false ? (
          <SurveyLoadingWrapper>
            <Info>Oczekiwanie na zakończenie ankiety...</Info>
            <Box>
              <Hyperlink>https://plemiona.netlify.com/formularz/{user.surveys[user.actions[aid].survey].publicId}</Hyperlink>
              <Data>...</Data>
              <ProgressBar value={0} max={user.surveys[user.actions[aid].survey].count} />
            </Box>
            <EndButton>Zakończ teraz</EndButton>
          </SurveyLoadingWrapper>
        ) : (
          <>survey done</>
        )
      ) : null
    )
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(Action);