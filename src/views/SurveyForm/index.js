import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import history from 'components/History';
import { FirebaseContext } from 'components/Firebase';
import loading from 'assets/loading.gif';
import { toast } from 'react-toastify';

const Wrapper = styled.form`
  display: flex;
  flex-flow: column;
  align-items: center;
`;
const Name = styled.div`
  line-height: 9rem;
  font-size: 2.4rem;
  text-transform: capitalize;
`;
const InputGroup = styled.div`
  position: relative;

  input:focus + label, input:valid + label {
    transition: all 100ms linear;
    font-size: 1rem;
    line-height: 1rem;
  }
`;
const Label = styled.label`
  position: absolute;
  pointer-events: none;
  top: 1rem;
  left: 1rem;
  font-size: 2.4rem;
  padding: 1rem;
  line-height: 5rem;
`;
const Input = styled.input`
  margin: 1rem;
  width: 26rem;
  height: 7rem;
  font-size: 2rem;
  border: 0;
  border-radius: .8rem;
  padding: 1.2rem;
  padding-top: 2rem;
  background-color: #303030;
  color: #FFFFFF;
`;
const Submit = styled.input`
  margin: 1rem;
  width: 26rem;
  height: 7rem;
  font-size: 2rem;
  font-weight: 500;
  border: 0;
  border-radius: .8rem;
  padding: 1.2rem;
  background-color: #6C833A;
  color: #FFFFFF;
  cursor: pointer;
  &:disabled {
    background-color: #646D50;
  }
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    width: 5rem;
    height: 5rem;
  }
`;

const SurveyForm = () => {
  const firebase = useContext(FirebaseContext);
  const { pid } = useParams();

  const [survey, setSurvey] = useState(undefined);
  const [disabled, setDisabled] = useState(true);
  const [entries, setEntries] = useState(new Map());
  const handleEntry = event => {
    event.persist();
    setEntries(prevState => new Map(prevState).set(event.target.name, event.target.value));
  };

  const getElements = (elements) => {
    const iterator = elements[Symbol.iterator](), array = [];
    for (let item of iterator) {
      array.push(item);
    }
    return array;
  }

  useEffect(()=>{
    firebase.publicSurvey(pid).once('value')
      .then(snapshot=> {
        const data = snapshot.val();
        if (data !== null) {
          const elements = new Map();
          for (let element of data.elements) {
            elements.set(`${element}`, '');
          }
          setEntries(elements);
        }
        setSurvey(data);
      });
  }, [pid, firebase]);

  useEffect(() => {
    let disabled = false;
    for (let element of getElements(entries)) if (element[1].trim() === '') disabled = true;
    setDisabled(disabled);
  }, [entries])

  const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => // eslint-disable-next-line
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  const handleSubmit = event => {
    event.preventDefault();
    const formatted = {};
    for (let element of getElements(entries)) formatted[element[0]] = element[1];
    const ref = firebase.publicSurvey(pid);
    ref.once('value')
      .then(snapshot => {
        const publicSurvey = snapshot.val();
        if (!publicSurvey.entries || Object.values(publicSurvey.entries).length < parseInt(publicSurvey.count)) {
          ref.child(`entries/${uuidv4()}`).set(formatted)
            .then(() => history.push(`/formularz/${pid}/sukces`));
        } else {
          toast.error('Przekroczono liczbę wpisów do tej ankiety', {
            className: 'toast',
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }
      });
  }

  return survey !== undefined ? (
    survey !== null ? (
      <Wrapper onSubmit={handleSubmit}>
        {survey.name ? <Name>{survey.name}</Name> : null}
        {getElements(entries).map( (element, index) =>
        <InputGroup key={index}>
          <Input 
            type="text"
            name={element[0]}
            value={element[1]}
            onChange={handleEntry} 
            required
          />
          <Label>{element[0]}</Label>
        </InputGroup>
        )}
        <Submit 
          type="submit" 
          value="Wyślij" 
          disabled={disabled}
        />
      </Wrapper>
    ) : (
      <Error>
        Ten formularz nie istnieje lub został zakończony
      </Error>
    )
  ) : (
    <Error>
      <img src={loading} alt="Ładowanie..." />
    </Error>
  )
}

export default SurveyForm;