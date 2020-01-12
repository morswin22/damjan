import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import history from '../../components/History';
import { FirebaseContext } from '../../components/Firebase';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import { ROUTES } from '../../utils/routes';

import plus from '../../assets/plus.png';

const Form = styled.form`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  align-items: center;

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

    &.list-item {
      animation: scale-up-ver-center 300ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both!important;

      @keyframes scale-up-ver-center {
        0% {
          margin: 0rem 1rem;
          height: 0rem;
          padding: 0rem 1.2rem;
        }
        100% {
          margin: 1rem 1rem;
          height: 7rem;
          padding: 1.2rem 1.2rem;
        }
      }

      ::after {
        content: 'hej';
      }
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

  div {
    display: flex;
    align-items: flex-end;
    flex-direction: column;

    &:last-of-type {
    align-items: flex-start;
    }
  }
`;

const AddButton = styled.button`
  width: 26rem;
  height: .5rem;
  border-radius: .4rem;
  background-color: #303030;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  margin: 1.5rem 1rem;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3.3rem;
    height: 3.3rem;
    background-image: url(${plus});
  }
`;

const NewSurvey = () => {
  const firebase = useContext(FirebaseContext);
  const user = useContext(AuthUserContext);

  const [name, setName] = useState('');
  const [count, setCount] = useState('');

  const [elements, setElements] = useState(new Map());
  if (elements.size === 0) setElements(prevState => new Map(prevState).set("0",""))

  const handleName = (event) => setName(event.target.value);
  const handleCount = (event) => setCount(event.target.value);

  const getElements = (elements) => {
    const iterator = elements[Symbol.iterator](), array = [];
    for (let item of iterator) {
      array.push(item[1]);
    }
    return array;
  }
  const handleElements = (event) => {
    event.persist();
    setElements(prevState => new Map(prevState).set(event.target.name, event.target.value));
  };

  const handleAddButton = (event) => setElements(prevState => new Map(prevState).set(`${prevState.size}`,""));

  const handleSubmit = (event) => {
    firebase.surveys(user.uid).once('value')
      .then(snapshot => {
        const surveys = snapshot.val() || [];
        surveys.push({
          name,
          count,
          elements: getElements(elements),
          finished: false,
          timestamp: Date.now(),
        });
        firebase.surveys(user.uid).update(surveys);
        history.push(ROUTES.actions); // redirect back !
      })
    event.preventDefault();
  }

  return user ? (
    <Form onSubmit={handleSubmit}>
      <div>
        <input 
          type="text" 
          onChange={handleName}
          value={name}
          placeholder="Nazwa"
        />
        <input 
          type="text" 
          onChange={handleCount}
          value={count}
          placeholder="Ilość osób"
        />
        <input 
          type="submit" 
          value="Utwórz"
          disabled={name === '' || count === ''}
        />
      </div>
      <div>
        {getElements(elements).map((value, index)=>(
          <input 
            type="text" 
            key={index}
            name={index}
            className="list-item"
            onChange={handleElements}
            value={value}
            placeholder="Element"
          />
        ))}
        <AddButton type="button" onClick={handleAddButton} />
      </div>
    </Form>
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(NewSurvey);