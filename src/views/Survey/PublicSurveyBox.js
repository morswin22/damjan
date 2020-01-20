import React, { useEffect, useState } from 'react';
import styled from "styled-components"
import arrowLeft from 'assets/arrowLeft.png';
import arrowRight from 'assets/arrowRight.png';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
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

const RemoveEntryButton = styled.button`
  margin: 1rem;
  width: 12rem;
  height: 4rem;
  border: 2px solid #A63838;
  border-radius: .8rem;
  background-color: transparent;
  color: #c65353;
  font-size: 1.8rem;
  font-weight: 500;
  justify-self: center;
  cursor: pointer;

  &:hover {
    transition: all 200ms ease-in-out;
    color: #fff;
    background-color: #A63838;
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

const PublicSurveyBox = ({ firebase, user, aid }) => {
  const [entriesCount, setEntriesCount] = useState(0);
  const [entries, setEntries] = useState(null);
  const [showingEntry, setShowingEntry] = useState(0);

  useEffect(()=>{
    if (user.surveys 
        && user.actions[aid].survey !== false 
        && user.surveys[user.actions[aid].survey]
        && user.surveys[user.actions[aid].survey].finished === false) {
      const pid = user.surveys[user.actions[aid].survey].publicId;
      firebase.publicSurvey(pid).on('value', snapshot => {
        const publicSurvey = snapshot.val();
        if (publicSurvey && publicSurvey.entries) {
          setEntriesCount(Object.values(publicSurvey.entries).length);
          const entries = [];
          for (let key in publicSurvey.entries) entries.push({...publicSurvey.entries[key], _key: key});
          setEntries(entries);
        } else {
          setEntriesCount(0);
          setEntries(null);
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

  const handleRemoveEntry = (pid, eid) => {
    firebase.publicSurvey(pid).child(`entries/${eid}`).remove()
      .then(()=>{
        toast.success('Usunięto wpis', {
          className: 'toast',
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      });
  } 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>handleArrowButton(0), [entriesCount]);

  return (
    <Wrapper>
      <Hyperlink>https://plemiona.netlify.com/formularz/{user.surveys[user.actions[aid].survey].publicId}</Hyperlink>
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
            <RemoveEntryButton onClick={()=>handleRemoveEntry(user.surveys[user.actions[aid].survey].publicId, entry._key)} >
              Usuń wpis
            </RemoveEntryButton>
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

export default PublicSurveyBox;