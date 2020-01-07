import React from "react";
import {Link} from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div id="home">
      <div className="header">
        Cześć,
      </div>
      <p className="intro">
        to narzędzie pozwala Ci tworzyć, edytować oraz rozpisywać plany ataków.
      </p>
      <p className="intro">
      Kliknij <Link to="/nowa-akcja">tutaj</Link> aby stworzyć nową akcję i wprowadzić dane wiosek.
      </p>
      <p className="intro">
        Gdy Twoja akcja będzie gotowa, przejdź do sekcji Wiadomości, aby stworzyć informacje dla graczy o przydzielonych im atakach do wykonania.
      </p>
    </div>
  );
}

export default Home;