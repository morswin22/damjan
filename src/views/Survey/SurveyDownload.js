import React from "react";
import styled from "styled-components";
import XLSX from 'xlsx';
import download from 'assets/download.png';

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 2.4rem;
  font-weight: 500;
  color: #fff;

  img {
    margin-right: 1rem;
  }
`;

const SurveyDownload = ({firebase, user, aid}) => {

  const handleButton = event => {
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

  return (
    <Button onClick={handleButton}>
      <img src={download} alt='💾' /> Pobierz wyniki ankiety (.xlsx)
    </Button>
  )
}

export default SurveyDownload;
