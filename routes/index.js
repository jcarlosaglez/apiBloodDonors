// Importar las dependencias necesarias.
var router = require("express").Router();

// Definir el comportamiento raíz del endpoint
router.get("/", (req, res) => {
	res.send("Welcome to BloodDonors API");
});

// Rutas para Donor.js


// Rutas para Receiver.js


// Rutas para Request.js


// Exportar las rutas
module.exports = router;