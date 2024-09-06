import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CreatePossession from './pages/CreatePossession';
import ListPossession from './pages/ListPossession';
import UpdatePossession from './pages/UpdatePossession';
import Patrimoine, { API_URL } from './pages/Patrimoine';
import PossessionsTable from './CalculatePatrimoine';
import Home from './pages/home'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/possessions`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données des possessions');
        }
        return response.json();
      })
      .then(data => {
        setPossessions(data || []);
      })
      .catch(error => console.error('Erreur lors du chargement des données des possessions:', error));
  }, []);
  

  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Route par défaut pour afficher la date */}
          <Route path="/patrimoine" element={<Patrimoine possessions={possessions} />} />
          <Route path="/possession" element={<ListPossession possessions={possessions} />} />
          <Route path="/possession/create" element={<CreatePossession />} />
          <Route path="/possession/:libelle/update" element={<UpdatePossession possessions={possessions} />} />
          <Route 
            path="/patrimoine/possessions-table" 
            element={<PossessionsTable possessions={possessions} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
