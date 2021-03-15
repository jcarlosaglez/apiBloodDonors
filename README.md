## PROYECTO FINAL MÓDULO BACKEND BEDU-SANTANDER
![alt text](https://github.com/devnull404/TODO/blob/develop/assets/doc/PORTADABEDU.svg)


# ¿Cómo funciona nuestra API?
Los requerimientos para el proyecto son crear una API que pueda realizar las operaciones básicas (CRUD), por lo que elegimos una API que se encargue de manejar el registro, modificación, vista y eliminado de tanto donadores de sangre, y los respectivos pacientes que la requieren. Entonces, nuestra API se encuentra seccionada en dos partes:

- Donadores. 
- Receptores.

Por lo que es posible registrar tanto a donantes como a receptores.

# ¿Por qué MONGODB?
Elegimos utilizar MONGODB debido a su estructura. Por otra parte, nos permite hacer consultas rápidas y eficaces ya que esperamos que el crecimiento y la utilidad de esta API genera una gran demanda, además de que los requisitos o parámetros de la información de los usuarios cambia dependiendo de muchos factores, y es por esto que necesitamos una base de datos flexible. Finalmente, nos permitiría relacionarlo con Heroku de manera más versatil promoviendo la rapidez en el deploy, y dejándonos tiempo para hacer pruebas y encontrar bugs en nuestra API.



# ¿Cómo utilizar BloodDonors?




## Estructura de trabajo en equipo remoto
Debido a que la estructura de trabajo utilizada anteriormente nos funcionó del todo bien, en esta ocación utilizamos la misma. En el diagrama que se presenta a continuación, podemos observar que nos basamos en un repositorio principal, y entonces el resto del equipo hizo un fork de este para así clonar en sus equipos localmente; una vez terminada su parte del proyecto, lo único que hicieron fue un *pull request* que alguien del equipo se encarga de revisar y aceptar para porder hacer merge en la rama develop, uniendo los cambios de cada uno de los integrantes del equipo.

![alt text](https://github.com/devnull404/TODO/blob/develop/assets/doc/GITHUBBEDU.png)