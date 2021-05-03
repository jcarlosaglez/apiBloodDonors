const mongoose = require('mongoose');			// Importando mongoose
const Receiver = mongoose.model("Receiver");	// Importando el modelo de Receptor
const passport = require("passport");			// Importando passport para las sesiones

function createReceiver(req, res, next) {
	if(!req.body.password) {
		return res.status(422)
				.json({errors: {password: "La contraseña no puede estar vacia."}});
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
		.catch(error => {
			if (error.name === "ValidationError") {
				let errors = {};

				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});

				return res.status(400).json({errors: errors});
			}
			res.status(500).send("Something went wrong");
		});
}

function readReceiver(req, res, next) {
	let fields = req.query.fields || "";
	fields = fields.split(",");

	if(req.params.id) {
		Receiver.findById(req.params.id, fields, (err, user) => {
			if(!user || err) {
				return res.status(401);
			}
			return res.json(user.publicData());
		})
		.catch(next);
	}
	else {
		Receiver.find(null, fields)
			.then(users => {
				res.json(users.map(user => user.publicData()));
			})
			.catch(next);
	}
}

function readReceiversByPages(req, res, next) {
	let fields = req.query.fields || "";
	fields = fields.split(",");
	const limit = req.query.limit > 0 ? req.query.limit : 5;
	const page = req.query.page > 0 ? req.query.page : 1;

	Receiver.find(null, fields)
		.sort("last_name")
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.then(receivers => {
			Receiver.countDocuments((err, count) => {
				if(err) {
					return res.sendStatus(401);
				}
				return res.status(200)
					.json({
						receivers: receivers.map(receiver => receiver.publicData()),
						totalRegisters: count,
						totalPages: Math.ceil(count / limit),
						currentPage: page*1
					});
			});
		})
		.catch(next);
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

					return res.status(400).json({errors: errors});
				}
				res.status(500).send("Something went wrong");
			});
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
			.then(deletedUser => {
				res.status(201)
					.json(deletedUser.publicData())
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

async function search(req, res){
	const { field, value } = req.query;
	let filter = {};
	
	try{
		filter[field] = value;
		const receiverBD = await Receiver.find(filter);
		return res.json(receiverBD.map(receiver => receiver.publicData()));
	}
	catch (error){
        console.log('erroooooooooorrr', error);
	}
}

module.exports = {
	createReceiver,
	readReceiver,
	readReceiversByPages,
	updateReceiver,
	deleteReceiver,
	search,
	login
};