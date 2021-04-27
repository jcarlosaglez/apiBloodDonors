## PROYECTO FINAL MÓDULO BACKEND BEDU-SANTANDER
![alt text](https://github.com/devnull404/TODO/blob/develop/assets/doc/PORTADABEDU.svg)

# Historias de Usuario.
- Como donador quiero registrarme para poder donar
- Como donador quiero marcar cuando esté dispuesto o indispuesto a donar
para que los que busquen lo sepan
- Como donador quiero darme de baja definitivamente para que ya no me
puedan mandar solicitudes
- Como donador quiero decidir si aceptar o no para contestar a las solicitudes
- Como receptor quiero registrarme para hacer una solicitud de donación
- Como receptor quiero buscar a posibles donadores para saber si hay un
posible donador
- Como receptor quiero hacer una solicitud a un donador para saber si está
dispuesto a donarme a mí
- Como receptor quiero editar mis datos para tener mi información
actualizada
- Como receptor quiero eliminar mi registro 

¿Qué tipos de usuario tendrá nuestro sistema?
2 tipos de usuarios:
Donadores
Receptores¿Qué acciones puede realizar cada usuario?

Donador:
Registrarse
Darse de baja temporalmente
Darse de baja definitivamente
Editar sus datos personales
Aceptar una solicitud de donación

Receptor:
Registrarse
Editar sus datos personales
Crear una solicitud de donación
¿Qué información se necesita?

Donador:
Datos personales (Nombre, apellidos, CURP, Fecha de nacimiento, sexo,
correo, teléfono lugar de residencia, tipo de sangre)
Certificado medico
Respuestas a cuestionario de evaluación

Receptor:
Datos personales (Nombre, apellidos, CURP, Fecha de nacimiento, sexo,
lugar de residencia, correo, teléfono)

¿Cuáles son las principales entidades?

Donador
Receptor
Solicitud de donación¿Qué características tiene cada entidad?

Donador:
id (CURP)
nombre(s)
apellidos
fechaNacimiento
sexo
correo
teléfono
lugarResidencia
tipo de sangre
archivoCertificado
respuestasCuestionario

Receptor:
id (CURP)
nombre(s)
apellidos
fechaNacimiento
sexo
lugarResidencia
correo
teléfono

Solicitud de donación:
id
idReceptor
idDonador
tipoSangreRequerida
comentarios¿Qué funcionalidades tiene cada entidad?

Donador:
createDonador()
readDonador()
readDonadores()
updateDonador()
deleteDonador()
responseSolicitud()
// Para registrarse
// Para leer a un donador por su id
// Para leer a todos los donadores
// Para actualizar sus datos
// Para dar de baja a un donador
// Para aceptar o declinar una solicitud

Receptor:
createDonador()
readDonador()
readDonadores()
updateDonador()
deleteDonador()
requestDonador()
// Para registrarse
// Para leer a un receptor por su id
// Para leer a todos los receptores
// Para actualizar sus datos
// Para dar de baja a un receptor
// Para crear una solicitud a un donador

Solicitud de donación:
createSolicitud()
readSolicitud()
readSolicitudes()
updateSolicitud()
deleteSolicitud()
// Cuando un usuario crea una solicitud
// Para leer una solicitud
// Para leer todas las solicitudes
// Para cuando un donador acepta o rechaza la solicitud
// Para eliminar la solicitud


# ¿Cómo funciona nuestra API?
Los requerimientos para el proyecto son crear una API que pueda realizar las operaciones básicas (CRUD), por lo que elegimos una API que se encargue de manejar el registro, modificación, vista y eliminado de tanto donadores de sangre, y los respectivos pacientes que la requieren. Entonces, nuestra API se encuentra seccionada en dos partes:

- Donadores. 
- Receptores.

Por lo que es posible registrar tanto a donantes como a receptores.

# Heroku
El links para hacer uso de BloodDonors es el siguiente: 

[BloodDonors](https://blood-donors-v1.herokuapp.com/v1)

# ¿Por qué MONGODB?
Elegimos utilizar MONGODB debido a su estructura. Por otra parte, nos permite hacer consultas rápidas y eficaces ya que esperamos que el crecimiento y la utilidad de esta API genera una gran demanda, además de que los requisitos o parámetros de la información de los usuarios cambia dependiendo de muchos factores, y es por esto que necesitamos una base de datos flexible. Finalmente, nos permitiría relacionarlo con Heroku de manera más versatil promoviendo la rapidez en el deploy, y dejándonos tiempo para hacer pruebas y encontrar bugs en nuestra API.



# ¿Cómo utilizar BloodDonors?
Es necesario para conectarse y trabajar con la API, utilizar una aplicación de consultas como lo es **Insomnia** o **Postman**. Los requerimientos y rutas pueden encontrarse en:
[Postman Documenter](https://documenter.getpostman.com/view/13128492/Tz5qbHbn#86c5c709-67d7-4ea9-973c-cf49cfb46ae0)


Donde podremos encontrar los parámetros y el cuerpo de las consultas para un correcto funcionamiento:

- /donors
- /receivers
- /requests

También para acceder mediante QR:

![alt text](https://github.com/killjoy157/apiBloodDonors/blob/main/QRcode.jpeg)



## Estructura de trabajo en equipo remoto
Debido a que la estructura de trabajo utilizada anteriormente nos funcionó del todo bien, en esta ocación utilizamos la misma. En el diagrama que se presenta a continuación, podemos observar que nos basamos en un repositorio principal, y entonces el resto del equipo hizo un fork de este para así clonar en sus equipos localmente; una vez terminada su parte del proyecto, lo único que hicieron fue un *pull request* que alguien del equipo se encarga de revisar y aceptar para porder hacer merge en la rama develop, uniendo los cambios de cada uno de los integrantes del equipo.

![alt text](https://github.com/devnull404/TODO/blob/develop/assets/doc/GITHUBBEDU.png)
