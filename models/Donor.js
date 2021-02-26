// Donor.js
// Clase que representa a un donador

Class Donor {
	constructor (id, curp, firstName, lastName, dateOfBirth, gender, email, phoneNumber, placeOfResidence, bloodType, certifiedFile, formAnswers) {
		this.id = id;
		this.curp = curp;
		this.firstName = firstName;
		this.lastName = lastName;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.placeOfResidence = placeOfResidence;
		this.bloodType = bloodType;
		this.certifiedFile = certifiedFile;
		this.formAnswers = formAnswers;
	}
}