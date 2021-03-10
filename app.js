// Importar las bibliotecas necesarias.
var express = require("express"),
	bodyParser = require("body-parser"),
	// cookieParser = require('cookie-parser'),
	cors = require("cors");

// const session = require('express-session');

// Objeto global app 
var app = express();

// Configuración de middlewares.
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());

//Agregamos cookieParser necesario para Express-session
// app.use(cookieParser());

//Configurano Express-session
/* app.use(session({
    secret: 'lasmanzanascrecenenarbustos',
    resave: false,
    saveUninitialized: true
})); */

// Configurar mongoose
const mongoose = require("mongoose");

const connection_string = require("config/mongo.js").connection_string;

/* mongoose.connect(
    connection_string,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
); */

mongoose.connect(
	connection_string,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(()=>{
		console.log(`connection to database established`)
	})
	.catch(err=>{
		console.log(`db error ${err.message}`);
		process.exit(-1)
 })

mongoose.set("debug", true);

require("./models/Donor");
require("./models/Receiver");
require("./models/Request");
require('./config/passport');

// Agregamos las rutas.
app.use("/v1", require("./routes"));

// Control de error 404
app.use((req, res, next) => {
	var err = new Error("Not Found.");
	err.status = 404;
	next(err);
});

// Iniciar el servidor.
var server = app.listen(process.env.PORT || 3000, () => {
	console.log("Escuchando en el puerto", server.address().port);
})