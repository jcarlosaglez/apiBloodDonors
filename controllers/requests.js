/* const Request = require('../models/Request')

function createRequest(req, res) {
	var request = new Request (req.body);
	res.status(201).send(request);
}

function readRequests(req, res) {
	var request1 = new Request (1, 1, 1, 'A positivo', 'Hola, gracias por querer ser voluntario');
	var request2 = new Request (2, 2, 2, 'O negativo', 'Necesito personas urgentemente');
	res.send([request1, request2]);
}

function readRequest(req, res) {
    var request1 = new Request (req.params.id, 1, 1, 'A positivo', 'Hola, gracias por querer ser voluntario');
    res.send([request1]);
}

function updateRequest(req, res) {
	var request1 = new Request (req.params.id, 1, 1, 'Cualquier tipo', 'Hola, gracias por querer ser voluntario');
	var modificaciones = req.body;
	request1 = { ...request1, ...modificaciones };
	res.send(request1);
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
}; */

const mongoose = require('mongoose');			// Importando mongoose
const Request = mongoose.model("Request");
const Donor = mongoose.model("Donor");
const Receiver = mongoose.model("Receiver");

function createRequest(req, res, next) {
	if(!(req.user.type === "receiver-user"))  {
		return res.status(401)
			.json({errors: {invalid_user: "Solo los receptores pueden crear una solicitud."}});
	}

	const request = new Request(req.body);

	Donor.findById(request.id_donor, (err, donor) => {
		if(!donor || err) {
			return res.status(404)
				.json({errors: {donor_not_found: "El donador solicitado no fue encontrado."}});
		}
		if(donor.status === "Inactivo") {
			return res.status(422)
				.json({errors: {inactive_donor: "El donador solicitado no fue encontrado."}});
		}

		request.id_receiver = req.user.id;
		request.status = "Enviada";
		request.save()
			.then(request => {
				res.status(201)
					.send(request);
			})
			.catch(next);
	})
	.catch(next);
}

function readRequest(req, res, next) {
	if(req.params.id) {
		Request.findById(req.params.id)
				.populate("id_receiver", "first_name last_name email")
				.populate("id_donor", "first_name last_name email")
				.then(request => {
					res.send(request)
				})
				.catch(next);
	}
	else if(req.query.page && req.query.limit) {
		const limit = req.query.limit > 0 ? req.query.limit : 5;
		const page = req.query.page > 0 ? req.query.page : 1;
		Request.find()
			.populate("id_receiver", "first_name last_name email")
			.populate("id_donor", "first_name last_name email")
			.sort("required_blood_type")
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.then(requests => {
				Request.countDocuments((err, count) => {
					if(err) {
						return res.sendStatus(401);
					}
					return res.status(200)
						.json({
							requests: requests.map(request => request.publicData()),
							totalRegisters: count,
							totalPages: Math.ceil(count / limit),
							currentPage: page*1
						});
				});
			})
			.catch(next);
	}
	else {
		Request.find()
			.populate("id_receiver", "first_name last_name email")
			.populate("id_donor", "first_name last_name email")
			.then(requests => {
				res.send(requests.map(request => request.publicData()));
			})
			.catch(next);
	}
}

function updateRequest(req, res, next) {
	let user = req.user.type === "receiver-user" ? "id_receiver" : "id_donor";
	Request.findById(req.params.id).then(request => {
		if (!request) {
			return res.sendStatus(401);
		}

		if(req.user.id !== request[user].toString()) {
			return res.status(401)
					.json({errors: {invalid_user: "Solo el donador o receptor puede modificar la solicitud."}});
		}

		let newInfo = req.body

		if(Object.entries(newInfo).length === 0) {
			return res.status(422)
					.send("No hay cambios a efectuar");
		}

		if(user === "id_receiver"){
			if (typeof newInfo.required_blood_type !== 'undefined')
				request.required_blood_type = newInfo.required_blood_type
			if (typeof newInfo.message !== 'undefined')
				request.message = newInfo.message
			if (typeof newInfo.status !== 'undefined')
				request.status = "Cancelada"
		}

		if(user === "id_receiver"){
			if (typeof newInfo.status !== 'undefined')
				request.status = newInfo.status === "Aceptada" ? "Aceptada" : "Rechazada";
		}

		request.save(function (err, savedRequest) {
				if(err) {
					return res.send(err);
				}
				const opts = [
					{ path: 'id_receiver', select: 'first_name last_name email' },
					{ path: 'id_donor', select: 'first_name last_name email' }
				];
				savedRequest = Request.populate(savedRequest, opts);
				savedRequest.then(request => {
					return res.status(201).json(request.publicData())
				})
			})
	}).catch(next);
}

function deleteRequest(req, res) {
	if(!(req.user.type === "receiver-user"))  {
		return res.status(401)
			.json({errors: {invalid_user: "Solo los receptores pueden eliminar solicitudES."}});
	}

	Request.findById(req.params.id).then(request => {
		if (!request) {
			return res.sendStatus(401);
		}

		if(req.user.id !== request.id_receiver.toString()) {
			return res.status(401)
					.json({errors: {invalid_user: "Solo puedes eliminar tus propias solicitudes."}});
		}
		
		request.status = "Cancelada"

		request.save()
			.then(deletedRequest => {
				res.status(201)
					.json(deletedRequest.publicData())
			})
	})
}
async function search(req, res){
	const campo = req.params.campo;
	const atributo = req.params.atributo;
	let field={};
	try{
		field[campo]=atributo;
		const requestBD = await Request.find(field);
		return res.json(requestBD);
	} catch (error){
        console.log('erroooooooooorrr', error);
	}
}
module.exports = {
	createRequest,
	readRequest,
	updateRequest,
	deleteRequest,
	search
};