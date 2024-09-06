import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from './Patrimoine';

const ListPossession = () => {
  const [possessions, setPossessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/possessions`);
        setPossessions(response.data);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération des possessions.');
      }
    };

    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      await axios.put(`${API_URL}/api/possessions/${libelle}/close`);
      // Mettre à jour l'état local pour supprimer la possession clôturée
      setPossessions(prevPossessions => prevPossessions.filter(p => p.libelle !== libelle));
    } catch (error) {
      setError('Une erreur est survenue lors de la clôture de la possession.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <h1>Liste des Possessions</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link className="btn btn-primary" to="/possession/create">Créer une nouvelle possession</Link>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux</th>
            <th>Valeur Actuelle</th>
            <th>Possesseur</th> 
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession) => (
            <tr key={possession.libelle}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{formatDate(possession.dateDebut)}</td>
              <td>{possession.dateFin ? formatDate(possession.dateFin) : 'En cours'}</td>
              <td>{possession.taux}%</td>
              <td>{(possession.valeur * (1 + possession.taux / 100)).toFixed(2)}</td>
              <td>{possession.possesseur?.nom || 'Non défini'}</td>
              <td>
                <Link className="btn btn-warning" to={`/possession/${possession.libelle}/update`}>Éditer</Link>
                <button 
                  className="btn btn-danger ms-2"
                  onClick={() => handleClose(possession.libelle)}
                  disabled={possession.dateFin} 
                >
                  Clôturer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPossession;
