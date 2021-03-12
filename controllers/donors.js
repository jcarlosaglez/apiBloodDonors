/* const Donor = require('../models/Donor')

function createDonador(req, res) {
	var donador = new Donor(req.body)
	res.status(201).send(donador)
}

function readDonadores(req, res) {
	var donador1 = new Donor(1, 'MAVSJ1312928DDCDDFAS', 'Juan', 'Lopez', '13/12/1995', 'Masculino', 'lp12@gamil.com', '5527388901', 'CDMX', 'A positivo', 'archivo.pdf', "forms");
	var donador2 = new Donor(2, 'MAVSJ1312928DDCDDFAS', 'Maria', 'Dominguez', '05/01/1994', 'Femenino', 'mdda@gamil.com', '5527388889', 'CDMX', 'A negativo', 'archivo.pdf', "forms");
	res.send([donador1, donador2])
}

function readDonador(req, res) {
	var donador1 = new Donor(req.params.id , 'MAVSJ1312928DDCDDFAS', 'Juan', 'Lopez', '13/12/1995', 'Masculino', 'lp12@gamil.com', '5527388901', 'CDMX', 'A positivo', 'archivo.pdf', "forms")
	res.send([donador1])
}

function updateDonador(req, res) {
	var donador1 = new Donor(1, 'MAVSJ1312928DDCDDFAS', 'Juan', 'Lopez', '13/12/1995', 'Masculino', 'l990@gamil.com', '5527388901', 'CDMX', 'A positivo', 'archivo.pdf', "forms")
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
}; */

const mongoose = require('mongoose');			// Importando mongoose
const Donor = mongoose.model('Donor');
const passport = require('passport');

function createDonor(req, res, next) {
	if(!req.body.password) {
		return res.status(422)
				.json({errors: {password: "La contraseña no puede estar vacia."+req.curp}});
	}

	const body = req.body;
	const password = body.password;

	delete body.password;

	const user = new Donor(body);
	user.createPassword(password);
	user.save()
		.then(user => {
			return res.status(201).json(user.toAuthJSON());
		})
		.catch(next);
}

function readDonor(req, res, next) {
	if(req.params.id) {
		Donor.findById(req.params.id, (err, user) => {
			if(!user || err) {
				return res.status(401);
			}
			return res.json(user.publicData());
		})
		.catch(next);
	}
	else {
		Donor.find()
			.then(request => {
				res.send(request);
			})
			.catch(next);
	}
}

function updateDonor(req, res, next) {
	res.status(200)
		.send("TODO updateDonor");
}

function deleteDonor(req, res) {
	Donor.findOneAndDelete({_id: req.user.id})
		.then((user) => {
			res.status(200)
				.send(`Donador ${req.user.id} eliminado: ${user.publicData}`);
		});
}

function login(req, res, next) {
	if(!req.body.emal) {
		return res.status(422).json({errors: {email: "El email no puede estar vacio."}});
	}

	if(!req.body.password) {
		return res.status(422).json({errors: {password: "La contraseña no puede estar vacia."}});
	}

	passport.authenticate("local-donor", {session: false}, function(err, user, info) {
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
	createDonor,
	readDonor,
	updateDonor,
	deleteDonor,
	login
};