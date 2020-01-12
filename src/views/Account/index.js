import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../../components/Firebase';
import history from '../../components/History';
import { toast } from 'react-toastify';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import ContentEditable from 'react-contenteditable'

const stripHTML = html => {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

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
  grid-gap: .5rem;

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

const Content = styled.div`
  label {
    display: block;
    font-weight: 700;
    font-size: 1.8rem;
    line-height: 2.5rem;
    margin-top: 2rem;

    &:first-of-type {
      margin-top: 1rem;
    }
  }
  div {
    display: inline-block;
    font-size: 1.8rem;
    line-height: 3.5rem;
    border-bottom: 1px solid #ffffff;
    min-width: 1rem;

    transition: border-bottom-color 200ms ease-in-out;

    &:focus {
      outline: none;
      border-bottom-color: #c68062;
    }
  }
  button {
    /* background-color: #cb8b66; */
    background-color: #c68062;
    width: 15rem;
    height: 3rem;
    border: none;
    margin-right:100%;
    border-radius: .4rem;
    margin-top: 2.5rem;
    /* color: #000000; */
    color: #fff;
    font-size: 1.4rem;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    box-shadow: 0px 0px 0px 0px #c68062;
    transition: box-shadow 200ms ease-in-out;

    &:not(:disabled):hover {
      box-shadow: 0px 0px 0px 1px #c68062;
    }
  }
  input {
    width: 15rem;
    height: 3rem;
    border: none;
    margin-right:100%;
    border-radius: .4rem;
    margin-bottom: 1rem;
    padding: .5rem;
    background-color: #656565;
    color: #fff;

    & + button {
      margin-top: .6rem;
      background-color: #6C833A;
      box-shadow: 0px 0px 0px 0px #91B04F;

      &:disabled {
        background-color: #646D50;
      }

      &:not(:disabled):hover {
        box-shadow: 0px 0px 0px 1px #91B04F;
      }
    }
  }
`;

const toastData = {
  className: 'toast',
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

const General = ({firebase, user}) => {
  const nameContainer = useRef(null);
  const [name, setName] = useState(user.name)

  const handleName = (event) => setName(stripHTML(event.target.value).trim());
  const fixName = () => nameContainer.current.innerHTML.trim() === '' ? setName(user.email.split('@')[0]) : true;

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      let timeout = setTimeout(()=>{
        if (name !== '') firebase.user(user.uid).set({ name });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [name, firebase, user.uid]);

  const handleSignOut = () => {
    firebase.doSignOut();
    history.push('/');
    toast.success('Wylogowano!', toastData);
  }

  return user ? (
    <Content>
      <label>Nazwa</label>
      <ContentEditable
        innerRef={nameContainer}
        html={name}
        disabled={false}
        onChange={handleName} 
        onBlur={fixName}
        spellCheck={false}
      />
      <label>E-mail</label>
      <div>{user.email}</div>
      <button onClick={handleSignOut}>Wyloguj</button>
    </Content>
  ) : null;
}
const Password = ({firebase, user}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleOldPassword = (event) => setOldPassword(event.target.value.trim());
  const handleNewPassword = (event) => setNewPassword(event.target.value.trim());
  const handleRepeatPassword = (event) => setRepeatPassword(event.target.value.trim());

  const handleSubmit = (event) => {
    if (oldPassword !== '' && newPassword !== '' && repeatPassword !== '' && 
        newPassword === repeatPassword && newPassword.length >= 6) {
      firebase.auth.currentUser.reauthenticateWithCredential(firebase.emailAuthProvider.credential(user.email, oldPassword))
        .then(() => {
          firebase.auth.currentUser.updatePassword(newPassword)
            .then(() => {
              toast.success('Zmieniono hasło', toastData)
              setOldPassword('');
              setNewPassword('');
              setRepeatPassword('');
            })
            .catch(() => {
              toast.error('Nie udało się zmienić hasła', toastData)
            });
        })
        .catch(() => {
          toast.error('Wprowadzono błędne hasło', toastData)
        })
    } else {
      toast.error('Nowe hasło musi składać się z przynajmniej 6 znaków', toastData)
    }
  }

  return user ? (
    <Content>
      <label>Zmień hasło</label>
      <small>Stare hasło</small>
      <input
        type="password"
        onChange={handleOldPassword}
        value={oldPassword}
      />
      <small>Nowe hasło</small>
      <input
        type="password"
        onChange={handleNewPassword}
        value={newPassword}
      />
      <small>Powtórz hasło</small>
      <input
        type="password"
        onChange={handleRepeatPassword}
        value={repeatPassword}
      />
      <button
        disabled={oldPassword === '' || newPassword === '' || repeatPassword === '' || newPassword !== repeatPassword}
        onClick={handleSubmit}
      >Zmień</button>
    </Content>
  ) : null;
}
const Data = ({firebase, user}) => {
  firebase.user(user.uid).on('value', snapshot => {
    console.log(snapshot.val())
  })

  return null;
}

const Account = () => {
  const firebase = useContext(FirebaseContext);
  const user = useContext(AuthUserContext);

  const [selected, setSelected] = useState('general');

  return user ? (
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
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(Account);