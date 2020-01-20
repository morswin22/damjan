import React, { useEffect, useState } from 'react';
import styled from "styled-components"
import arrowLeft from 'assets/arrowLeft.png';
import arrowRight from 'assets/arrowRight.png';
import { Link } from 'react-router-dom';
import edit from 'assets/edit.png';

const Wrapper = styled.div`
  background-color: #303030;
  height: 100%;
  min-width: 80rem;
  border-radius: 1.2rem;
  display: grid;
  grid-auto-rows: 7rem auto 6.2rem;
`;

const EditButton = styled(Link)`
  font-size: 2rem;
  line-height: 7rem;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    text-decoration: underline!important;
  }

  img {
    margin-left: 1rem;
  }
`;

const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Data = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 12rem auto 12rem;
`;

const ArrowButton = styled.img`
  cursor: pointer;
  align-self: center;
  justify-self: center;
`;

const Entries = styled.div`
  display: flex;
  overflow: hidden;

  & > div:first-child {
    transition: margin-left 500ms ease-in-out;
    margin-left: ${({ showing }) => `-${showing * 100}%`};
  }
`;
const Entry = styled.div`
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
`;
const EntryItem = styled.div`
  margin: 1rem;

  span {
    font-weight: 500;
  }
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
    width: ${({ value, max }) => `${value * 100 / max}%`};
    background-color: #6C833A;
    border-radius: 1.2rem;
    transition: width 500ms ease-in-out;
  }

  &::after {
    content: '${({ value, max }) => `${value}/${max}`}';
    position: absolute;
    top: -3rem;
    right: 1rem;
    font-size: 2.4rem;
    font-weight: 500;
  }
`;

const SurveyBox = ({ firebase, user, aid }) => {
  const [entriesCount, setEntriesCount] = useState(0);
  const [entries, setEntries] = useState(null);
  const [showingEntry, setShowingEntry] = useState(0);

  useEffect(()=>{
    if (user.surveys 
        && user.actions[aid].survey !== false 
        && user.surveys[user.actions[aid].survey]
        && user.surveys[user.actions[aid].survey].finished === true) {
      const sid = user.actions[aid].survey;
      firebase.survey(user.uid, sid).once('value')
        .then(snapshot => {
          const survey = snapshot.val();
          if (survey && survey.entries) {
            setEntriesCount(Object.values(survey.entries).length);
            const entries = [];
            for (let key in survey.entries) entries.push({...survey.entries[key], _key: key});
            setEntries(entries);
          }
        });
    }
  }, [aid, user, firebase]);

  const handleArrowButton = direction => {
    let next = showingEntry + direction;
    if (next >= entriesCount) next = entriesCount - 1;
    if (next < 0) next = 0;
    setShowingEntry(next);
  }

  return (
    <Wrapper>
      <EditButton to={`/ankieta/${user.actions[aid].survey}/edytuj`}>Edytuj wpisy <img src={edit} alt='/' /></EditButton>
      {entries ? (
      <Data>
        <ArrowButton
          src={arrowLeft}
          alt="<"
          onClick={() => handleArrowButton(-1)}
        />
        <Entries showing={showingEntry}>
        {entries.map(entry => (
          <Entry key={entry._key}>
            {user.surveys[user.actions[aid].survey].elements.map((key, index) => (
              <EntryItem key={index}>
                <span>{key}</span>: {entry[key]}
              </EntryItem>
            ))}
          </Entry>  
        ))}
        </Entries>
        <ArrowButton
          src={arrowRight}
          alt=">"
          onClick={() => handleArrowButton(1)}
        />
      </Data>
      ) : (
      <NoData>
        Brak wpisów
      </NoData>
      )}
      <ProgressBar value={entriesCount} max={user.surveys[user.actions[aid].survey].count} />
    </Wrapper>
  );
}

export default SurveyBox;