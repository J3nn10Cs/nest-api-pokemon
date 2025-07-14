<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Stack
* MongoDb
* Nest

# Ejecutar en desarrollo
 1. Clonar el repositorio

 2. Ejecutar el comando 
 ```
  yarn install
 ```

 3. Instalar Nest CLI
 ```
  npm i -g @nestjs/cli
 ```

 4. Levantar la BD
 ```
  docker-compose up -d
 ```

 5. Clonar el archivo __.env.template__ y copiar a ```.env```

 6. Ejecutar el entorno de desarrollo
 ```
  yarn start:dev
 ```
 7. Cargar la base de datos
 ```
  http://localhost:3000/api/seed
 ```