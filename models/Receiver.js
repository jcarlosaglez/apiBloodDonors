// Receiver.js
// Clase que representa a un receptor

/* class Receiver {
	constructor (id, curp, first_name, last_name, dateOfBirth, gender, email, phone_number, place_of_residence) {
		this.id = id;
		this.curp = curp;
		this.first_name = first_name;
		this.last_name = last_name;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.email = email;
		this.phone_number = phone_number;
		this.place_of_residence = place_of_residence;
	}
}

module.exports = Receiver; */

const mongoose = require('mongoose');							// Importando mongoose
const uniqueValidator = require("mongoose-unique-validator");	// Importando módulo mongoose-unique-validator.
const crypto = require('crypto');								// Importando módulo crypto.
const jwt = require('jsonwebtoken');							// Importando módulo jsonwebtoken.
const secret = require('../config').secret;						// ????

// Definir el schema para mongoose
const ReceiverSchema = new mongoose.Schema({
	curp: {
		type: String,
		unique: true,
		uppercase: true,
		required: [true, "El curp no puede estar vacio."],
		match: [/^(?:[A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d)$/, "No es un curp valido."]
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	birthday: {
		type: String,
		match: [/^(?:[1][9]|[2][0-9])\d{2}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[12]\d|3[01])$/, "El fomato del correcto es: YYYY-MM-DD"],
		required: [true, "La fecha no puede ser vacia."]
	},
	gender: String,
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: [true, "no puede estar vacío"],
		match: [/\S+@\S+\.\S+/, "El formato del correo no es valido."],
		index: true
	},
	phone_number: {
		type: String,
		match: [/^\d{10}$/, "El número de telefono debe tener 10 digitos."]
	},
	place_of_residence: String,
	status: {
		type: String,
		enum: ["Activo", "Inactivo"]
	},
	hash: String,
	salt: String,
},
{timestamps: true});

ReceiverSchema.plugin(uniqueValidator, {message: "Receptor ya registrado."});

ReceiverSchema.methods.createPassword = function(password) {
	this.salt = crypto
		.randomBytes(16)
		.toString("hex");
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
		.toString("hex");
}

ReceiverSchema.methods.validatePassword = function(password) {
	const hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
		.toString("hex");

	return this.hash === hash;
}

ReceiverSchema.methods.generateJWT = function() {
	const today = new Date();
	const exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign({
		id: this.id,
		email: this.email,
		exp: parseInt(exp.getTime() / 1000)
	}, secret);
}

ReceiverSchema.methods.toAuthJSON = function() {
	return {
		email: this.email,
		token: this.generateJWT()
	};
}

ReceiverSchema.methods.publicData = function() {
	return {
		id: this.id,
		curp: this.curp,
		first_name: this.first_name,
		last_name: this.last_name,
		birthday: this.birthday,
		gender: this.gender,
		email: this.email,
		phone_number: this.phone_number,
		place_of_residence: this.place_of_residence,
		status: this.status,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt
	};
}

mongoose.model("Receiver", ReceiverSchema);