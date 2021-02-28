const Request = require('../models/Request')

function createRequest(req, res) {
  var request = new Request (req.body)
  res.status(201).send(Request)
}

function readRequests(req, res) {
  var request1 = new Request (1, 1, 1, 'A positivo', 'Hola, gracias por querer ser voluntario')
  var request2 = new Request (2, 2, 2, 'O negativo', 'Necesito personas urgentemente')
  res.send([request1, request2])
}

function readRequest(req, res) {
    var request1 = new Request (req.params.id, 1, 1, 'A positivo', 'Hola, gracias por querer ser voluntario')
    res.send([request1])
}

function updateRequest(req, res) {
    var request1 = new Request (req.params.id, 1, 1, 'Cualquier tipo', 'Hola, gracias por querer ser voluntario')
  var modificaciones = req.body
  request1 = { ...request1, ...modificaciones }
  res.send(request1)
}

function deleteRequest(req, res) {
  res.status(200).send(`Solicitud ${req.params.id} eliminada`);
}



// exportamos las funciones definidas
module.exports = {
  createRequest,
  readRequests,
  readRequest,
  updateRequest,
  deleteRequest
}