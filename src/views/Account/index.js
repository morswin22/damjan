import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../../components/Firebase';
// import history from '../../components/History';
// import { toast } from 'react-toastify';
import { AuthUserContext } from '../../components/Session';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Window = styled.div`
  width: 700px;
  height: 600px;

  background-color: #303030;
  border-radius: .8rem;

  animation: fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

  display: grid;
  grid-auto-rows: 5.2rem auto;
`;

const Title = styled.div`
  line-height: 5.2rem;
  text-align: center;
  font-size: 2rem;
  border-bottom: 2px solid #666666;
`;

const Body = styled.div`
  padding: .5rem;
  
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 12.5rem auto;

`;

const MenuItem = styled.a`
  display: block;
  margin: 1rem 0;
  font-size: 1.8rem;
  text-align: center;
  cursor: pointer;
  color: #5FBEFF!important;

  &:hover {
    text-decoration: underline!important;
  }
`;

const General = ({firebase, user}) => {
  return null;
}
const Password = ({firebase, user}) => {
  return null;
}
const Data = ({firebase, user}) => {
  return null;
}

const Account = () => {
  const firebase = useContext(FirebaseContext);
  const user = useContext(AuthUserContext);

  const [selected, setSelected] = useState('general');

  return (
    <Wrapper>
      <Window>
        <Title>Ustawienia konta</Title>
        <Body>
          <div>
            <MenuItem onClick={e=>setSelected('general')}>Ogólne</MenuItem>
            <MenuItem onClick={e=>setSelected('password')}>Hasło</MenuItem>
            <MenuItem onClick={e=>setSelected('data')}>Dane</MenuItem>
          </div>
          { selected === 'general' ? <General firebase={firebase} user={user} /> : null}
          { selected === 'password' ? <Password firebase={firebase} user={user} /> : null}
          { selected === 'data' ? <Data firebase={firebase} user={user} /> : null}
        </Body>
      </Window>
    </Wrapper>
  );
}

export default Account;