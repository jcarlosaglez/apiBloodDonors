// Importar las dependencias necesarias.
var router = require("express").Router();

// Definir el comportamiento raíz del endpoint
router.get("/", (req, res) => {
	res.send("Welcome to BloodDonors API");
});

// Rutas para Donor.js
router.use("/donor", require("./donors"));

// Rutas para Receiver.js
router.use("/receiver", require("./receivers"));

// Rutas para Request.js
router.use("/request", require("./requests"));

// Exportar las rutas
module.exports = router;