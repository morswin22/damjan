import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import history from '../../components/History';
import { FirebaseContext } from '../../components/Firebase';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import { ROUTES } from '../../utils/routes';

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

  input {
    margin: 1rem;
    width: 26rem;
    height: 7rem;
    font-size: 2rem;
    border: 0;
    border-radius: .8rem;
    padding: 1.2rem;
    background-color: #303030;
    color: #FFFFFF;

    ::placeholder {
      text-align: center;
      color: #BBBBBB;
      font-size: 2.4rem;
    }

    &[type=submit] {
      background: #6C833A;
      font-weight: 500;
      font-size: 2.4rem;
      cursor: pointer;
    }
    &[type=submit]:disabled {
      background: #646D50;
    }
  }
`;

const NewAction = () => {
  const firebase = useContext(FirebaseContext);
  const user = useContext(AuthUserContext);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleName = (event) => setName(event.target.value);
  const handleDate = (event) => setDate(event.target.value);

  const handleSubmit = (event) => {
    firebase.actions(user.uid).once('value')
      .then(snapshot => {
        const actions = snapshot.val() || [];
        actions.push({
          name,
          date,
          timestamp: Date.now()
        });
        firebase.actions(user.uid).update(actions);
        history.push(ROUTES.actions);
      })
    event.preventDefault();
  }

  return user ? (
    <Form onSubmit={handleSubmit}>
      <input 
        type="text" 
        onChange={handleName}
        value={name}
        placeholder="Nazwa"
      />
      <input 
        type="text" 
        onChange={handleDate}
        value={date}
        placeholder="Data"
      />
      <input 
        type="submit" 
        value="Utwórz"
        disabled={name === '' || date === ''}
      />
    </Form>
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(NewAction);