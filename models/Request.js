// Reques.js
// Clase que representa a una solicitud a un donador

class Request {
	constructor(id, idReceiver, idDonor, requiredBloodType, message) {
		this.id = id;
		this.idReceiver = idReceiver;
		this.idDonor = idDonor;
		this.requiredBloodType = requiredBloodType;
		this.message = message;
	}
}