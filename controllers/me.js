const mongoose = require('mongoose');			// Importando mongoose
const Request = mongoose.model("Request");		// Importando el modelo de Solicitud
const Donor = mongoose.model("Donor");			// Importando el modelo del Donador
 
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

async function readToken(req, res, next) {
	const token = req.headers["x-access-token"];
	if(!token) {
		return res.status(401).json({
			auth: false,
			message: "No token provided"
		});
	}
	const decoded = jwt.verify(token, secret);
	console.log(decoded);
	let user = {};
	if(decoded.type === "donor-user"){
		user = await Donor.findById(decoded.id, {password: 0, status: 0, salt: 0, hash: 0});
	} else if(decoded.type === ""){	
		user = await Donor.findById(decoded.id, {password: 0, status: 0, salt: 0, hash: 0});
	} else {
		return res.status(404).send("Invalid Token")
	}
	if(!user){
		return res.status(404).send("No user found");
	}
	res.json(user);
}


module.exports = {
	readToken,
};
