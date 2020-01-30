import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
// import history from 'components/History';
import { FirebaseContext } from 'components/Firebase';
import { AuthUserContext, withAuthorization } from 'components/Session';
import { useParams } from 'react-router-dom';

const TargetsWrapper = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 15rem;
  grid-template-areas: 
   "input input"
   "submit submit";
  /* grid-column-gap: 7.5rem; */

  animation: fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
`;

const InputGroup = styled.div`
  display: grid;
  grid-auto-rows: 6.4rem auto;
  width: 80%;
  height: 80%;
  align-self: center;
  justify-self: center;
`;

const Label = styled.div`
  align-self: center;
  justify-self: center;
  font-size: 2.4rem;
`;

const Input = styled.textarea`
  background-color: #303030;
  border: none;
  border-radius: 1.2rem;
  resize: none;
  color: #fff;
  font-family: inherit;
  font-size: 1.5rem;
  padding: 1.2rem;
`;

const Submit = styled.button`
  grid-area: submit;
  display: block;
  width: 26rem;
  height: 7rem;
  border: none;
  border-radius: .8rem;
  background-color: #6C833A;
  color: #fff;
  font-size: 2.4rem;
  font-weight: 500;
  justify-self: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
`;

const StrategiesWrapper = styled.div`
  height: 100%;

  animation: fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
`;

const Strategies = () => {
  const user = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);

  const { aid } = useParams();

  const [targetsInput, setTargetsInput] = useState('');
  const [fakesInput, setFakesInput] = useState('');

  const evaluate = value => {
    const regex = /(\d+)\|(\d+)/gm;
    let match;
    const evaluated = [];
    while ((match = regex.exec(value)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      evaluated.push({
        x: Number(match[1]),
        y: Number(match[2])
      })
    }
    return evaluated;
  }

  const handleTargetsInput = event => setTargetsInput(event.target.value);
  const handleInputsInput = event => setFakesInput(event.target.value);
  
  const evaluateTargets = event => setTargetsInput(evaluate(event.target.value).map(v => `${v.x}|${v.y}`).join("\n"));
  const evaluateFakes = event => setFakesInput(evaluate(event.target.value).map(v => `${v.x}|${v.y}`).join("\n"));
  
  useEffect(() => {
    if (user && user.actions && user.actions[aid] && user.surveys && user.surveys[user.actions[aid].survey] && user.surveys[user.actions[aid].survey].finished) {
      if (user.actions[aid].targets) setTargetsInput(user.actions[aid].targets.map(v => `${v.x}|${v.y}`).join("\n"))
      if (user.actions[aid].fakes) setFakesInput(user.actions[aid].fakes.map(v => `${v.x}|${v.y}`).join("\n"))
    }
  }, [user, aid])

  const handleSubmit = event => {
    firebase.action(user.uid, aid)
      .update({
        targets: evaluate(targetsInput),
        fakes: evaluate(fakesInput)
      })
      .then(() => {
        setOpenTargetsWrapper(false);
      })
  }

  const [openTargetsWrapper, setOpenTargetsWrapper] = useState(false);

  return user && user.actions && user.actions[aid] && user.surveys && user.surveys[user.actions[aid].survey] && user.surveys[user.actions[aid].survey].finished ? (
    openTargetsWrapper || !user.actions[aid].targets || !user.actions[aid].fakes ? (
    <TargetsWrapper>
      <InputGroup>
        <Label>Cele</Label>
        <Input 
          onChange={handleTargetsInput} 
          value={targetsInput}
          onBlur={evaluateTargets}
        />
      </InputGroup>
      <InputGroup>
        <Label>Fejki</Label>
        <Input 
          onChange={handleInputsInput} 
          value={fakesInput} 
          onBlur={evaluateFakes}
        />
      </InputGroup>
      <Submit onClick={handleSubmit}>Oblicz strategie</Submit>
    </TargetsWrapper>
    ) : (
    <StrategiesWrapper>
      wybierz strategie
      <button onClick={()=>setOpenTargetsWrapper(true)}>Edytuj listę celów</button>
    </StrategiesWrapper>
    )
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(Strategies);