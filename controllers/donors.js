const Donor = require('../models/Donor')

function createDonador(req, res) {
  var donador = new Donor(req.body)
  res.status(201).send(donador)
}

function readDonadores(req, res) {
  var donador1 = new Donor(1, 'MAVSJ1312928DDCDDFAS', 'Juan', 'Lopez', '13/12/1995', 'Masculino', 'lp12@gamil.com', '5527388901', 'CDMX', 'A positivo', 'archivo.pdf', forms)
  var donador2 = new Donor(2, 'MAVSJ1312928DDCDDFAS', 'Maria', 'Dominguez', '05/01/1994', 'Femenino', 'mdda@gamil.com', '5527388889', 'CDMX', 'A negativo', 'archivo.pdf', forms)
  res.send([donador1, donador2])
}

function readDonador(req, res) {

   var donador1 = new Donor(req.params.id , 'MAVSJ1312928DDCDDFAS', 'Juan', 'Lopez', '13/12/1995', 'Masculino', 'lp12@gamil.com', '5527388901', 'CDMX', 'A positivo', 'archivo.pdf', forms)
  res.send([donador1])
}

function updateDonador(req, res) {
  var donador1 = new Donor(1, 'MAVSJ1312928DDCDDFAS', 'Juan', 'Lopez', '13/12/1995', 'Masculino', 'l990@gamil.com', '5527388901', 'CDMX', 'A positivo', 'archivo.pdf', forms)
  var modificaciones = req.body
  donador1 = { ...donador1, ...modificaciones }
  res.send(donador1)
}

function deleteDonador(req, res) {
  res.status(200).send(`Donador ${req.params.id} eliminado`);
}


// Falta ver como se va realizar esta funcion
function responseSolicitud(req, res) {
   
  }

// exportamos las funciones definidas
module.exports = {
  createDonador,
  readDonador,
  readDonadores,
  updateDonador,
  deleteDonador,
  responseSolicitud
}