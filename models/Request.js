// Reques.js
// Clase que representa a una solicitud a un donador

/* class Request {
	constructor (id, idReceiver, idDonor, requiredBloodType, message) {
		this.id = id;
		this.idReceiver = idReceiver;
		this.idDonor = idDonor;
		this.requiredBloodType = requiredBloodType;
		this.message = message;
	}
}

module.exports = Request; */

const mongoose = require('mongoose');			// Importando mongoose

// Definir el schema para mongoose
const RequestSchema = new mongoose.Schema({
	idReceiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Receiver"
	},
	idDonor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Donor"
	},
	requiredBloodType: {
		type: String,
		match: ["/^(?:A|B|AB|O)[+-]$$/", "El tipo de sangre no es valido."],
		required: [true, "El tipo de sangre es obligatorio."],
		index: true
	},
	message: String,
	status: {
		type: String,
		enum: ["Enviada", "Aceptada", "Rechazada", "Cancelada", "Finalizada"]
	}
},
{timestamps: true});

RequestSchema.methods.publicData = function() {
	return {
		id: this.id,
		idReceiver: this.idReceiver,
		idDonor: this.idDonor,
		requiredBloodType: this.requiredBloodType,
		message: this.message,
		status: this.status,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt
	};
}

mongoose.model("Request", RequestSchema);