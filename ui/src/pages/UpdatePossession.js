import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './Patrimoine';

const UpdatePossession = () => {
  const { libelle } = useParams();
  const [possession, setPossession] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    taux: '',
    possesseur: { nom: '' }
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/possessions/${libelle}`)
      .then(response => {
        // Assurez-vous que `response.data.possesseur` existe et est un objet avec `nom`
        setPossession(prevState => ({
          ...prevState,
          ...response.data,
          dateDebut: formatDateForInput(response.data.dateDebut),
          dateFin: formatDateForInput(response.data.dateFin),
          possesseur: response.data.possesseur || { nom: '' }
        }));
      })
      .catch(error => {
        setError('Erreur lors de la récupération des détails de la possession.');
      });
  }, [libelle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nom") {
      setPossession(prevState => ({
        ...prevState,
        possesseur: { ...prevState.possesseur, nom: value }
      }));
    } else {
      setPossession(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    // Convertir les dates au format ISO
    const updatedPossession = {
      ...possession,
      dateDebut: formatDateForAPI(possession.dateDebut),
      dateFin: formatDateForAPI(possession.dateFin)
    };

    axios.put(`${API_URL}/api/possessions/${libelle}`, updatedPossession)
      .then(response => {
        alert('Possession mise à jour avec succès');
        navigate('/possessions');
      })
      .catch(error => {
        setError('Erreur lors de la mise à jour de la possession.');
      });
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="container mt-5">
      <h1>Mettre à jour la possession</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Libelle</label>
          <input
            type="text"
            className="form-control"
            name="libelle"
            value={possession.libelle}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Valeur</label>
          <input
            type="number"
            className="form-control"
            name="valeur"
            value={possession.valeur}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date Début</label>
          <input
            type="date"
            className="form-control"
            name="dateDebut"
            value={possession.dateDebut}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date Fin</label>
          <input
            type="date"
            className="form-control"
            name="dateFin"
            value={possession.dateFin || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Taux d'Amortissement (%)</label>
          <input
            type="number"
            className="form-control"
            name="taux"
            value={possession.taux}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nom du Possesseur</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={possession.possesseur?.nom || ''}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdatePossession;
