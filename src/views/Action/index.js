import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import history from 'components/History';
import { FirebaseContext } from 'components/Firebase';
import { AuthUserContext, withAuthorization } from 'components/Session';
import { /* Link, */ useParams } from 'react-router-dom';
import { ROUTES } from 'utils/routes';
import arrowLeft from 'assets/arrowLeft.png';
import arrowRight from 'assets/arrowRight.png';
import { toast } from 'react-toastify';
import XLSX from 'xlsx';

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
    width: ${(props) => `${props.value*100/props.max}%`};
    background-color: #6C833A;
    border-radius: 1.2rem;
    transition: width 500ms ease-in-out;
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

const DownloadButton = styled.button``;

const Action = () => {
  const user = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);

  const { aid } = useParams();

  const [entriesCount, setEntriesCount] = useState(0);
  const [entries, setEntries] = useState(null);
  const [showingEntry, setShowingEntry] = useState(0);

  useEffect(() => {
    if (user) {
      if (!user.actions || !user.actions[aid]) {
        history.push(ROUTES.actions);
        return;
      }
      if ((!user.surveys || !user.surveys[user.actions[aid].survey]) && user.actions[aid].survey !== false) {
        firebase.action(user.uid, user.actions[aid].survey).update({survey: false});
        return;
      }
      if (user.surveys && user.actions[aid].survey !== false && user.surveys[user.actions[aid].survey]) {
        if (user.surveys[user.actions[aid].survey].finished === false) {
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
        } else {
          // finished === true
        }
      }
    }
    
  }, [aid, user, firebase]);

  const handleSurveySelect = sid => {
    firebase.action(user.uid, aid).update({survey: sid});
  }

  const handleEndButton = event => { 
    const publicSurveyRef = firebase.publicSurvey(user.surveys[user.actions[aid].survey].publicId);
    publicSurveyRef.once('value')
      .then(snapshot => {
        const publicSurvey = snapshot.val();
        const data = { finished: true };
        if (publicSurvey && publicSurvey.entries) data.entries = publicSurvey.entries;
        firebase.survey(user.uid, user.actions[aid].survey).update(data)
          .then(()=>{
            publicSurveyRef.remove();
          });
      });
  }

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

  const handleDownloadButton = event => {
    firebase.survey(user.uid, user.actions[aid].survey).once('value')
      .then(snapshot => {
        const survey = snapshot.val();
        if (survey.entries) {
          const header = [];
          for (let key of user.surveys[user.actions[aid].survey].elements) {
            header.push(key); 
          }
          const data = [header];
          for (let eid in survey.entries) {
            const row = [];
            for (let key of user.surveys[user.actions[aid].survey].elements) {
              row.push(survey.entries[eid][key]);
            }
            data.push(row);
          }
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workbook, 
            XLSX.utils.aoa_to_sheet(data), 
            'Wyniki ankiety'
          );
          XLSX.writeFile(workbook, `${survey.name}.xlsx`);
        }
      });
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
            </Box>
            <EndButton onClick={handleEndButton}>Zakończ teraz</EndButton>
          </SurveyLoadingWrapper>
        ) : (
          <>
            survey done
            <DownloadButton onClick={handleDownloadButton}>
              Pobierz wyniki ankiety (.xlsx)
            </DownloadButton>
          </>
        )
      ) : null
    )
  ) : null;
}

const condition = user => !!user;

export default withAuthorization(condition)(Action);