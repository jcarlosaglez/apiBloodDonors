// Importar las dependencias necesarias.
const router = require("express").Router();
const { readToken } = require("../controllers/me"); 

// Definir el comportamiento raíz del endpoint
router.get("/", (req, res) => {
	res.send("Welcome to BloodDonors API");
});

// Rutas para Donor.js
router.use("/donors", require("./donors"));

// Rutas para Receiver.js
router.use("/receivers", require("./receivers"));

// Rutas para Request.js
router.use("/requests", require("./requests"));

router.get("/me", readToken);


// Exportar las rutas
module.exports = router;
