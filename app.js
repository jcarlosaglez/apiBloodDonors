// Importar las bibliotecas necesarias.
var express = require("express"),
	bodyParser = require("body-parser");
	cors = require("cors");

// Objeto global app 
var app = express();

// Configuración de middlewares.
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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