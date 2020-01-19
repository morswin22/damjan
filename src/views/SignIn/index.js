import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from 'components/Firebase';
import history from 'components/History';
import { toast } from 'react-toastify';
import { ROUTES } from 'utils/routes';

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) 0.6s both;

  input {
    margin: 2rem;
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

const SignIn = () => {
  const firebase = useContext(FirebaseContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmail = event => setEmail(event.target.value);
  const handlePassword = event => setPassword(event.target.value);
  const handleSubmit = event => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        // reset state? 
        history.push(ROUTES.actions);
      })
      .catch(() => {
        toast.error('Błędne dane logowania', {
          className: 'toast',
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      })

    event.preventDefault();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <input 
        type="email" 
        onChange={handleEmail}
        value={email}
        placeholder="E-mail"
      />
      <input 
        type="password" 
        onChange={handlePassword}
        value={password}
        placeholder="Hasło"
      />
      <input 
        type="submit" 
        value="Zaloguj"
        disabled={email === '' || password === ''}
      />
    </Form>
  );
}

export default SignIn;