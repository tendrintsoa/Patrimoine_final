import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Configurer CORS pour autoriser plusieurs origines
const allowedOrigins = ['http://localhost:3000', 'http://192.168.221.1:3000'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`Origin ${origin} not allowed by CORS`));
//     }
//   }
// }));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configurer __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir le dossier "data" statiquement
app
  .use(express.json())
  .use(express.urlencoded({extended: true}))
  .use(cors())
  .use('/data', express.static(path.join(__dirname, 'data')))

// Données simulées
let possessions = [
  { libelle: "MacBook Pro", valeur: 4000000, dateDebut: "2023-12-25T00:00:00.000Z", dateFin: null, taux: 5 },
  { libelle: "Alternance", valeur: 500000, dateDebut: "2022-12-31T21:00:00.000Z", dateFin: null, taux: null, jour: 1, valeurConstante: 500000 },
  { libelle: "Survie", valeur: -300000, dateDebut: "2022-12-31T21:00:00.000Z", dateFin: null, taux: null, jour: 2, valeurConstante: -300000 }
];

// Endpoint: Get Possession list
app.get('/api/possessions', (req, res) => {
  res.json(possessions);
});

// Endpoint: Get Possession details
app.get('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    res.json(possession);
  } else {
    res.status(404).json({ message: 'Possession not found' });
  }
});

// Endpoint: Create Possession
app.post('/api/possessions', (req, res) => {
  const { libelle, valeur, taux, possesseur } = req.body; // Ajout du possesseur

  if (!libelle || !valeur || !taux || !possesseur) { // Vérification du possesseur
    return res.status(400).json({ message: 'Missing required fields: libelle, valeur, taux, or possesseur' });
  }

  if (!possessions.find(p => p.libelle === libelle)) {
    possessions.push({ libelle, valeur, dateDebut: new Date().toISOString(), taux, possesseur, dateFin: null }); // Ajout du possesseur dans la possession
    res.status(201).json({ message: 'Possession created' });
  } else {
    res.status(400).json({ message: 'Possession already exists' });
  }
});

// Endpoint: Update Possession
app.put('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  const updatedPossession = req.body;
  const index = possessions.findIndex(p => p.libelle === libelle);

  if (index !== -1) {
    possessions[index] = { ...possessions[index], ...updatedPossession };
    res.status(200).json({ message: 'Possession updated successfully' });
  } else {
    res.status(404).json({ message: 'Possession not found' });
  }
});

// Endpoint: Close Possession
app.put('/api/possessions/:libelle/close', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);

  if (possession) {
    possession.dateFin = new Date().toISOString();
    possessions = possessions.filter(p => p.libelle !== libelle); // Supprimer la possession de la liste
    res.status(200).json({ message: 'Possession closed and removed successfully' });
  } else {
    res.status(404).json({ message: 'Possession not found' });
  }
});

// Configuration du port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
