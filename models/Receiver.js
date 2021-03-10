// Receiver.js
// Clase que representa a un receptor

/* class Receiver {
	constructor (id, curp, firstName, lastName, dateOfBirth, gender, email, phoneNumber, placeOfResidence) {
		this.id = id;
		this.curp = curp;
		this.firstName = firstName;
		this.lastName = lastName;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.placeOfResidence = placeOfResidence;
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
		match: ["/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/", "No es un curp valido."]
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	birthDay: {
		type: String,
		match: ["/^(?:[1][9]|[2][0-9])\d{2}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[12]\d|3[01])$/", "El fomato del correcto es: YYYY-MM-DD"],
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
	phoneNumber: {
		type: String,
		match: ["/^\d{10}$/", "El número de telefono debe tener 10 digitos."]
	},
	placeOfResidence: String,
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
		.pbkdf2({
			password: password,
			salt: this.salt,
			iterations: 10000,
			keylen: 512,
			digest: "sha512"
		})
		.toString("hex");
}

ReceiverSchema.methods.validatePassword = function(password) {
	const hash = crypto
		.pbkdf2({
			password: password,
			salt: this.salt,
			iterations: 10000,
			keylen: 512,
			digest: "sha512"
		})
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
		firstName: this.firstName,
		lastName: this.lastName,
		birthday: this.birthday,
		gender: this.gender,
		email: this.email,
		phoneNumber: this.phoneNumber,
		placeOfResidence: this.placeOfResidence,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt
	};
}

mongoose.model("Receiver", ReceiverSchema);