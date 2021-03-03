-- Se crea la base de datos.
create database blood_donors;

-- Se selecciona la base de datos pata trabajar sobre ella.
use blood_donors;

-- Se crea y define la tabla donor que guarda la informacion de los donadores.
create table donor (
	id_donor INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	curp CHAR(19) UNIQUE NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	birthday DATE NOT NULL,
	genre CHAR(2),
	email VARCHAR(45) NOT NULL,
	phone_number CHAR(11),
	place_of_residence VARCHAR(80),
	blood_type CHAR(3) NOT NULL,
	certified_file VARCHAR(50),
	form_answers JSON NOT NULL,
	status CHAR(1) NOT NULL
);

-- Se crea la tabla receiver que guarda la informacion de los receptores.
create table receiver (
	id_receiver INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	curp CHAR(19) UNIQUE NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	birthday DATE NOT NULL,
	genre CHAR(2),
	email VARCHAR(45) NOT NULL,
	phone_number CHAR(11),
	place_of_residence VARCHAR(80),
	status CHAR(1) NOT NULL
);

--  Se crea la tabla request que guarda la informacion de las solicitudes que crean los receptores.
create table request (
	id_request INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id_receiver INT NOT NULL,
	id_donor INT NOT NULL,
	required_blood_type CHAR(3) NOT NULL,
	message TEXT,
	status CHAR(1) NOT NULL, 
	FOREIGN KEY (id_receiver) REFERENCES receiver(id_receiver),
	FOREIGN KEY (id_donor) REFERENCES donor(id_donor)
);