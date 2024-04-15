// Importa las librerías necesarias 
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// C maneja la entrada de acrónimos del usuario
function InputField({ onAcronymSubmit }) {
  
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
  };

  const handleSubmit = () => {
    
    if (value.trim() !== '') {
      onAcronymSubmit(value);
    } else {

      alert('Por favor, ingresa un acrónimo');
    }
  };

  return (
    <div className="input-group mb-3">
      <input type="text" className="form-control" value={value} onChange={handleChange} placeholder="Ingresa un acrónimo" />
      <div className="input-group-append">
        <button className="btn btn-primary" type="button" onClick={handleSubmit}>Ver Significado de Acrónimo</button>
      </div>
    </div>
  );
}

// C principal
function App() {

  const [acronimos, setAcronimos] = useState([]);
  const [ultimoAcronimo, setUltimoAcronimo] = useState(null);
  const [historialVisible, setHistorialVisible] = useState(false);

  // obtiene los acrónimos del servidor
  const fetchAcronimos = async () => {
    const res = await axios.get('/api/acronimos');
    setAcronimos(res.data);
    setHistorialVisible(true);
  };

  // evento de envío del acrónimo
  const handleAcronymSubmit = async (acronimo) => {
    try {
      const response = await axios.post("/api/acronimos", { acronimo });
      const { message, totalMeanings } = response.data;
      console.log(message);
      console.log(response.data.meanings);
      if (totalMeanings > 0) {
        const newAcronym = { acronimo, significados: response.data.meanings };
        setUltimoAcronimo(newAcronym);
        setHistorialVisible(false);
      } else {
        console.log('No se encontraron significados para el acrónimo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <header className="my-4">
        <h1 className="text-center display-4 text-primary">APP de Acrónimos</h1>
        <InputField onAcronymSubmit={handleAcronymSubmit} />
        {ultimoAcronimo && (
          <div className="card my-4">
            <div className="card-body">
              <h2 className="card-title">Búsqueda</h2>
              <p className="card-text"><strong>Acrónimo:</strong> {ultimoAcronimo.acronimo}</p>
              <p className="card-text"><strong>Significados:</strong> {Array.isArray(ultimoAcronimo.significados) ? ultimoAcronimo.significados.join(', ') : ''}</p>
            </div>
          </div>
        )}
        <button className="btn btn-primary" onClick={fetchAcronimos}>Mostrar Historial</button>
        {historialVisible && (
          <table className="table table-striped my-4">
            <thead>
              <tr>
                <th>Acrónimo</th>
                <th>Significados</th>
              </tr>
            </thead>
            <tbody>
              {acronimos.map((acronimo, index) => (
                <tr key={index}>
                  <td>{acronimo.acronimo}</td>
                  <td>{Array.isArray(acronimo.significados) ? acronimo.significados.join(', ') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
}

// Exporta el componente principal
export default App;