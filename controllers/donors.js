const mongoose = require('mongoose');	// Importando mongoose
const Donor = mongoose.model('Donor');	// Importando el modelo del donador
const passport = require('passport');	// Importando passport para las sesiones

function createDonor(req, res, next) {
	if(!req.body.password) {
		return res.status(422)
				.json({errors: {password: "La contraseña no puede estar vacia."}});
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
		.catch(error => {
			if (error.name === "ValidationError") {
				let errors = {};

				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});

				return res.status(400).send(errors);
			}
			res.status(500).send("Something went wrong");
		});
}

function readDonor(req, res, next) {
	let fields = req.query.fields || "";
	fields = fields.split(",");

	if(req.params.id) {
		Donor.findById(req.params.id, fields, (err, user) => {
			if(!user || err) {
				return res.status(401);
			}
			return res.json(user.publicData());
		})
		.catch(next);
	}
	else {
		Donor.find(null, fields)
			.then(users => {
				res.json(users.map(user => user.publicData()));
			})
			.catch(next);
	}
}

function readDonorsByPages(req, res, next) {
	let fields = req.query.fields || "";
	fields = fields.split(",");
	const limit = req.query.limit > 0 ? req.query.limit : 5;
	const page = req.query.page > 0 ? req.query.page : 1;

	Donor.find(null, fields)
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
			.catch(error => {
				if (error.name === "ValidationError") {
					let errors = {};
	
					Object.keys(error.errors).forEach((key) => {
						errors[key] = error.errors[key].message;
					});
	
					return res.status(400).send(errors);
				}
				res.status(500).send("Something went wrong");
			});
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

async function search(req, res){
	const { field, value } = req.query;
	let filter = {};

	try{
		filter[field] = value;
		const donorsBD = await Donor.find(filter);
		return res.json(donorsBD.map(donor => donor.publicData()));
	}
	catch (error){
        console.log('erroooooooooorrr', error);
	}
}

module.exports = {
	createDonor,
	readDonor,
	readDonorsByPages,
	updateDonor,
	deleteDonor,
	login,
	search
};