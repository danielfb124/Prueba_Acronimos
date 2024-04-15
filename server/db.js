// Importa los módulos necesarios de 'tedious'
const { Connection, Request, TYPES } = require('tedious');

// Configuración de la conexión a la base de datos SQL Server
const config = {
    server: 'DESKTOP-J2TIMGV\\SQLEXPRESS01', 
    authentication: {
        type: 'default', 
        options:{
            userName:"app", 
            password:"35843194639" 
        }
    },
    options: {
        port: 1433, 
        database: 'app_acronimos', 
        trustServerCertificate: true 
    }
};

// Crea la conexión
const connection = new Connection(config);

// valida conexión a la base de datos
connection.connect(err => {
    if(err) {
        console.log('Error al conectar a la base de datos', err); // En caso de error, se registra en la consola
    } else {
        console.log('Conectado a la base de datos'); // En caso de éxito, se registra en la consola
    }
});

//inserta un nuevo acrónimo y sus significados
function insertAcronym(acronym, meanings, callback) {
    const meaningsStr = JSON.stringify(meanings); // Conversión de los significados a una cadena JSON

  
    const query = new Request('INSERT INTO acronimos_significados (acronimo, significados) VALUES (@acronym, @meanings)', (err) => {
        if (err) {
            console.log('Error al ejecutar la consulta', err); 
            callback(err);
        } else {
            console.log('Acrónimo y significados almacenados correctamente'); 
            callback(null);
        }
    });

    query.addParameter('acronym', TYPES.VarChar, acronym);
    query.addParameter('meanings', TYPES.VarChar, meaningsStr);

    connection.execSql(query);
}

// Recupera los acrónimos y sus significados
function fetchAcronyms(callback) {
  const acronimos = []; 
  const query = 'SELECT * FROM acronimos_significados';

  const request = new Request(query, (err) => {
    if (err) {
      console.log('Error al ejecutar la consulta', err); 
      callback(err);
    } else {
      console.log('Acrónimos recuperados correctamente'); 
      callback(null, acronimos);
    }
  });

  request.on('row', columns => {
    const acronimo = {};
    columns.forEach(column => {
      if (column.metadata.colName === 'acronimo') {
        acronimo.acronimo = column.value; 
      } else if (column.metadata.colName === 'significados') {
        acronimo.significados = JSON.parse(column.value); 
      }
    });
    acronimos.push(acronimo); 
  });

  connection.execSql(request);
}

// Exporta la conexión y las funciones
module.exports = {
  connection,
  insertAcronym,
  fetchAcronyms
};