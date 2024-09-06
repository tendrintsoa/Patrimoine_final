import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const API_URL = 'https://patrimoine-final-backend.onrender.com';

const Patrimoine = () => {
  const [possessions, setPossessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificDate, setSpecificDate] = useState(''); // Ajouter la date spécifique
  const [filteredPossessions, setFilteredPossessions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Valeur Patrimoine',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
      }
    ]
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/possessions`)
      .then(response => {
        const data = response.data;
        setPossessions(data);
        generateGraphData(data, new Date(0), new Date());
        setFilteredPossessions(data);
      })
      .catch(error => console.error('Erreur de récupération des possessions:', error));
  }, []);

  const generateGraphData = (data, start, end) => {
    const labels = [];
    const values = [];

    data.forEach((p) => {
      const possessionStartDate = new Date(p.dateDebut);
      const possessionEndDate = p.dateFin ? new Date(p.dateFin) : new Date();
      const amortRate = p.taux / 100;

      let currentDate = new Date(possessionStartDate);
      let currentValue = p.valeur;

      while (currentDate <= possessionEndDate) {
        if (currentDate >= start && currentDate <= end) {
          labels.push(currentDate.toISOString().split('T')[0]);
          const monthsElapsed = Math.floor((currentDate - possessionStartDate) / (1000 * 60 * 60 * 24 * 30));
          const amortizedValue = currentValue * Math.pow(1 - amortRate, monthsElapsed);
          values.push(amortizedValue);
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Valeur Patrimoine',
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        },
      ],
    });
  };

  const handleFilterByDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const filtered = possessions.filter((p) => {
        const possessionStartDate = new Date(p.dateDebut);
        const possessionEndDate = p.dateFin ? new Date(p.dateFin) : new Date();
        return (possessionStartDate <= end && possessionEndDate >= start);
      });
      setFilteredPossessions(filtered);
      generateGraphData(filtered, start, end);
    }
  };

  const calculateTotal = () => {
    if (specificDate) {
      const date = new Date(specificDate);
      const totalAtDate = possessions.reduce((sum, p) => {
        const possessionStartDate = new Date(p.dateDebut);
        const possessionEndDate = p.dateFin ? new Date(p.dateFin) : new Date();
        if (date >= possessionStartDate && date <= possessionEndDate) {
          const monthsElapsed = Math.floor((date - possessionStartDate) / (1000 * 60 * 60 * 24 * 30));
          const amortRate = p.taux / 100;
          const amortizedValue = p.valeur * Math.pow(1 - amortRate, monthsElapsed);
          return sum + amortizedValue;
        }
        return sum;
      }, 0);
      setTotal(totalAtDate);
    } else {
      setTotal(0);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Patrimoine</h1>

      {/* Formulaire pour sélectionner une plage de dates */}
      <Form className="mb-3">
        <Form.Group controlId="startDate">
          <Form.Label>Date de début</Form.Label>
          <Form.Control 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </Form.Group>
        <Form.Group controlId="endDate" className="mt-2">
          <Form.Label>Date de fin</Form.Label>
          <Form.Control 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </Form.Group>
        <Button variant="primary" className="mt-3" onClick={handleFilterByDateRange}>
          Filtrer par Intervalle de Date
        </Button>
      </Form>

      {/* Formulaire pour sélectionner une date spécifique */}
      <Form className="mb-3">
        <Form.Group controlId="specificDate">
          <Form.Label>Date Spécifique</Form.Label>
          <Form.Control 
            type="date" 
            value={specificDate} 
            onChange={(e) => setSpecificDate(e.target.value)} 
          />
        </Form.Group>
        <Button variant="success" className="mt-3" onClick={calculateTotal}>
          Calculer la Valeur Totale du Patrimoine
        </Button>
      </Form>

      {/* Afficher le total */}
      <div className="total-display mt-3">
        <h4>Total des Patrimoines à la Date Sélectionnée: {total.toFixed(2)} Ar</h4>
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
          </tr>
        </thead>
        <tbody>
          {filteredPossessions.map((p) => (
            <tr key={p.libelle}>
              <td>{p.libelle}</td>
              <td>{p.valeur}</td>
              <td>{new Date(p.dateDebut).toLocaleDateString()}</td>
              <td>{p.dateFin ? new Date(p.dateFin).toLocaleDateString() : 'N/A'}</td>
              <td>{p.taux ? `${p.taux}%` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-4">
        <h3>Graphique de Valeur Patrimoine</h3>
        <div style={{ position: 'relative', height: '400px', width: '100%' }}>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Patrimoine;
