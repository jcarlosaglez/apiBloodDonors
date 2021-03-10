/* const Receiver = require('../models/Receiver')

function createReceiver(req, res) {
	var receiver = new Receiver(req.body);
	res.status(201).send(receiver);
}

function readReceivers(req, res) {
	var receiver1 = new Receiver (1, 'MAVSJ1312928DDCDDFAS', 'Pedor', 'Meza', '24/06/1996', 'Masculino', 'pp99@gamil.com', '5527388901', 'CDMX');
	var receiver2 = new Receiver (2, 'DAFMJ1312928DDCDDFAS', 'Daniela', 'Fernandez', '17/10/1993', 'Femenino', 'dafa@gamil.com', '5527388889', 'CDMX');
	res.send([receiver1, receiver2]);
}

function readReceiver(req, res) {
    var receiver1 = new Receiver (req.params.id, 'MAVSJ1312928DDCDDFAS', 'Pedor', 'Meza', '24/06/1996', 'Masculino', 'pp99@gamil.com', '5527388901', 'CDMX');
    res.send([receiver1]);
}

function updateReceiver(req, res) {
	var receiver1 = new Receiver (req.params.id, 'MAVSJ1312928DDCDDFAS', 'Pedor', 'Meza', '24/06/1996', 'Masculino', 'pp99@gamil.com', '5527388901', 'CDMX');
	var modificaciones = req.body;
	receiver1 = { ...receiver1, ...modificaciones };
	res.send(receiver1);
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
}; */

const mongoose = require('mongoose');			// Importando mongoose
const Receiver = mongoose.model("Receiver");
const passport = require("passport");

function createReceiver(req, res, next) {
	const body = req.body;
	const password = body.password;

	delete body.password;

	const user = new Receiver(body);
	user.createPassword(password);
	user.save()
		.then(user => {
			return res.status(201).json(user.toAuthJSON());
		})
		.catch(next);
}

function readReceiver(req, res, next) {
	if(req.params.id) {
		Receiver.findById(req.params.id, (err, user) => {
			if(!user || err) {
				return res.status(401);
			}
			return res.json(user.publicData());
		})
		.catch(next);
	}
	else {
		Receiver.find()
			.then(request => {
				res.send(request);
			})
			.catch(next);
	}
}

function updateReceiver(req, res, next) {
	return res.status(100)
				.send("TODO updateReceiver");
}

function deleteReceiver(req, res) {
	Receiver.findOneAndDelete({_id: req.user.id})
		.then((user) => {
			res.status(200)
				.send(`Donador ${req.params.id} eliminado: ${user}`);
		});
}

function login(req, res, next) {
	if(!req.body.emal) {
		return res.status(422).json({errors: {email: "El email no puede estar vacio."}});
	}

	if(!req.body.password) {
		return res.status(422).json({errors: {password: "La contraseña no puede estar vacia."}});
	}

	passport.authenticate("local-receiver", {session: false}, function(err, user, info) {
		if(err) {
			return next(err);
		}
		if(user) {
			user.token = user.generateJWT();
			return res.json({user: user.toAuthJSON()});
		}
		else {
			return res.status(422).json(info);
		}
	})
}

module.exports = {
	createReceiver,
	readReceiver,
	updateReceiver,
	deleteReceiver,
	login
};