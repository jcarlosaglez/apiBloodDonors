const Receiver = require('../models/Receiver')

function createReceiver(req, res) {
  var receiver = new Receiver(req.body)
  res.status(201).send(receiver)
}

function readReceivers(req, res) {
  var receiver1 = new Receiver (1, 'MAVSJ1312928DDCDDFAS', 'Pedor', 'Meza', '24/06/1996', 'Masculino', 'pp99@gamil.com', '5527388901', 'CDMX')
  var receiver2 = new Receiver (2, 'DAFMJ1312928DDCDDFAS', 'Daniela', 'Fernandez', '17/10/1993', 'Femenino', 'dafa@gamil.com', '5527388889', 'CDMX')
  res.send([donador1, donador2])
}

function readReceiver(req, res) {
    var receiver1 = new Receiver (req.params.id, 'MAVSJ1312928DDCDDFAS', 'Pedor', 'Meza', '24/06/1996', 'Masculino', 'pp99@gamil.com', '5527388901', 'CDMX')
    res.send([receiver1])
}

function updateReceiver(req, res) {
    var receiver1 = new Receiver (req.params.id, 'MAVSJ1312928DDCDDFAS', 'Pedor', 'Meza', '24/06/1996', 'Masculino', 'pp99@gamil.com', '5527388901', 'CDMX')
  var modificaciones = req.body
  receiver1 = { ...receiver1, ...modificaciones }
  res.send(receiver1)
}

function deleteReceiver(req, res) {
  res.status(200).send(`Receptor ${req.params.id} eliminado`);
}


// Falta ver como se va realizar esta funcion
function requestDonador(req, res) {
   
  }

// exportamos las funciones definidas
module.exports = {
  createReceiver,
  readReceivers,
  readReceiver,
  updateReceiver,
  deleteReceiver,
  requestDonador
}