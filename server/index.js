// Importando librerías necesarias
const express = require("express");
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const db = require('./db.js');
const axios = require('axios');

// Crea una nueva aplicación Express
const app = express();

//convierte el cuerpo de las solicitudes HTTP entrantes, que están en formato JSON, en un objeto JavaScript utilizable.
app.use(bodyParser.json());

// Petición GET para validar respuesta del servidor
app.get("/api", (req, res) => {
    res.json({ message: "Conectado correctamente al servidor" });
});

// obtener el significado del acrónimo digitado por el usuario consumiendo la api
async function getAcronymMeaning(acronym) {
  try {
    const response = await axios.get(`http://www.nactem.ac.uk/software/acromine/dictionary.py?sf=${acronym}`);
    if (response.data.length > 0) {
      const meanings = response.data[0].lfs.map(lf => lf.lf);
      return meanings;
    } else {
      return ['No se encontró ninguna definición de abreviatura'];
    }
  } catch (error) {
    console.error(error);
    return ['Acrónimo no válido'];
  }
}

// Petición para almacenar el acrónimo y sus significados en la base de datos
app.post("/api/acronimos", async (req, res) => {
  const acronimo = req.body.acronimo;
  const meanings = await getAcronymMeaning(acronimo);
  db.insertAcronym(acronimo, meanings, (err) => {
    if (err) {
      res.status(500).json({ message: "Error al almacenar el acrónimo" });
    } else {
      res.json({ message: "Acronimo almacenado correctamente!", totalMeanings: meanings.length, meanings: meanings });
    }
  });
});

// Petición que recupera todos los acrónimos almacenados en la base de datos
app.get("/api/acronimos", (req, res) => {
  db.fetchAcronyms((err, acronimos) => {
    if (err) {
      console.error('Error al recuperar los acrónimos', err);
      res.status(500).json({ message: "Error al recuperar los acrónimos" });
    } else {
      res.json(acronimos);
    }
  });
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});