import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PossessionsTable = ({ possessions }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [patrimoineValue, setPatrimoineValue] = useState(null);

    const calculatePatrimoine = () => {
        let totalValue = possessions.reduce((acc, possession) => {
            const dateDebut = new Date(possession.dateDebut);
            const dateFin = possession.dateFin ? new Date(possession.dateFin) : new Date();
            const years = (dateFin - dateDebut) / (1000 * 60 * 60 * 24 * 365);
            const depreciation = (years * (possession.tauxAmortissement || 0) / 100) * possession.valeur;
            const currentValue = Math.max(possession.valeur - depreciation, 0);
            return acc + currentValue;
        }, 0);

        setPatrimoineValue(totalValue.toFixed(2));
    };

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Libellé</th>
                        <th>Valeur Initiale</th>
                        <th>Date de Début</th>
                        <th>Date de Fin</th>
                        <th>Taux d'Amortissement</th>
                        <th>Valeur Actuelle</th>
                    </tr>
                </thead>
                <tbody>
                    {possessions.map((possession, index) => (
                        <tr key={index}>
                            <td>{possession.libelle}</td>
                            <td>{possession.valeur} €</td>
                            <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                            <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
                            <td>{possession.tauxAmortissement ? `${possession.tauxAmortissement}%` : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form inline className="mt-3">
                <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />
                <Button onClick={calculatePatrimoine} variant="primary" className="ml-2">Valider</Button>
            </Form>
            {patrimoineValue !== null && (
                <div className="mt-3">
                    <strong>Valeur du Patrimoine:</strong> {patrimoineValue} €
                </div>
            )}
        </div>
    );
};

export default PossessionsTable;