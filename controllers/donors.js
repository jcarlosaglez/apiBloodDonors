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
	body.status = "Activo";

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
	else if(req.query.page && req.query.limit) {
		const limit = req.query.limit > 0 ? req.query.limit : 5;
		const page = req.query.page > 0 ? req.query.page : 1;
		Donor.find()
			.sort("last_name")
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.then(donors => {
				Donor.countDocuments((err, count) => {
					if(err) {
						return res.sendStatus(401);
					}
					return res.status(200)
						.json({
							donors: donors.map(donor => donor.publicData()),
							totalRegisters: count,
							totalPages: Math.ceil(count / limit),
							currentPage: page*1
						});
				});
			})
			.catch(next);
	}
	else {
		Donor.find()
			.then(users => {
				res.json(users.map(user => user.publicData()));
			})
			.catch(next);
	}
}

function updateDonor(req, res, next) {
	Donor.findById(req.user.id).then(user => {
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
		if (typeof newInfo.status !== 'undefined')
			user.status = newInfo.status
		if (typeof newInfo.password !== 'undefined')
			user.createPassword(newInfo.password)

		user.save()
			.then(updatedUser => {
				res.status(201)
					.json(updatedUser.publicData())
			})
			.catch(next)
	}).catch(next)
}

function deleteDonor(req, res) {
	// Eliminar completamente
	/* Donor.findOneAndDelete({_id: req.user.id})
		.then((user) => {
			res.status(200)
				.send(`Donador ${req.user.id} eliminado: ${user.publicData}`);
		}); */
	// Eliminar cambiando status a inactivo
	Donor.findById(req.user.id).then(user => {
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
	})(req, res, next);
}
async function selects(req, res){
    const id = req.params.id; 			//obtenemos el Id del usuarop
	const select = req.params.select;	//Obtenemos los campos que requiere
    try {
		if(id){
			let paramets = select.split(",");
			let limit = paramets.length;
			let fields = {};
			for(var i = 0; i < limit; i++) {
			  fields[paramets[i]] = 1;
			}
			const donorsBD = await Donor.findOne({ _id: id },fields);
			console.log(donorsBD);
			return res.json(donorsBD);

		}else{
			return error;
		}
    } catch (error) {
        console.log('erroooooooooorrr', error);
    }
};

module.exports = {
	createDonor,
	readDonor,
	updateDonor,
	deleteDonor,
	login,
	selects
};