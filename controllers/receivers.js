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
	if(!req.body.password) {
		return res.status(422)
				.json({errors: {password: "La contraseña no puede estar vacia."+req.curp}});
	}

	const body = req.body;
	const password = body.password;

	delete body.password;
	body.status = "Activo";

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
			.then(users => {
				res.json(users.map(user => user.publicData()));
			})
			.catch(next);
	}
}

function updateReceiver(req, res, next) {
	Receiver.findById(req.user.id).then(user => {
		if (!user) {
			return res.sendStatus(401);
		}

		let newInfo = req.body

		if(Object.entries(newInfo).length === 0) {
			return res.status(422)
					.send("No hay cambios a efectuar");
		}

		if (typeof newInfo.curp !== 'undefined')
			user.curp = newInfo.curp
		if (typeof newInfo.first_name !== 'undefined')
			user.first_name = newInfo.first_name
		if (typeof newInfo.last_name !== 'undefined')
			user.last_name = newInfo.last_name
		if (typeof newInfo.birthday !== 'undefined')
			user.birthday = newInfo.birthday
		if (typeof newInfo.email !== 'undefined')
			user.email = newInfo.email
		if (typeof newInfo.phone_number !== 'undefined')
			user.phone_number = newInfo.phone_number
		if (typeof newInfo.place_of_residence !== 'undefined')
			user.place_of_residence = newInfo.place_of_residence
		if (typeof newInfo.password !== 'undefined')
			user.crearPassword(newInfo.password)

		user.save()
			.then(updatedUser => {
				res.status(201)
					.json(updatedUser.publicData())
			})
			.catch(next)
	}).catch(next)
}

function deleteReceiver(req, res) {
	// Eliminar completamente
	/* Receiver.findOneAndDelete({_id: req.user.id})
		.then((user) => {
			res.status(200)
				.send(`Donador ${req.params.id} eliminado: ${user}`);
		}); */
	// Eliminar cambiando status a inactivo
	Receiver.findById(req.user.id).then(user => {
		if (!user) {
			return res.sendStatus(401);
		}
		
		user.status = "Inactivo"

		user.save()
			.then(updatedUser => {
				res.status(201)
					.json(updatedUser.publicData())
			})
	})
}

function login(req, res, next) {
	if(!req.body.email) {
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
	})(req, res, next);
}

module.exports = {
	createReceiver,
	readReceiver,
	updateReceiver,
	deleteReceiver,
	login
};