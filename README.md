# Fish Counting
### Fish Counting - MERN with Flask

## Directions
Clonar el proyecto (git clone ....)

## Client React / Server Express
### `cd fish_counting_tensorflow`
### `cd client`
### `npm install`
(instalamos los paquetes del cliente)
### `npm run build`

### `cd..`
### `npm install`
(instalamos los paquetes del servidor)
### `npx nodemon`

(arrancamos un servidor de express en el puerto 8000 - http://localhost:8000)<br />
(en esta URL la aplicacion deberia arrancar sin problemas)

## Flask API (python 3.8)
### `cd api_flask`
### `python -m venv venv`
(creamos un entorno/environtment para instalar los paquetes necesarios)
### `venv\Scripts\activate`
(activamos el entorno recien creado)
### (venv) $ `pip install pip==20.3.3`
### (venv) $ `pip install flask`
### (venv) $ `pip install flask-cors`
### (venv) $ `pip install python-dotenv`
### (venv) $ `pip install request`
### (venv) $ `pip install opencv-python`
### (venv) $ `pip install matplotlib`
### (venv) $ `pip install tensorflow==2.2.0`
### (venv) $ `pip install numpy==1.19.3`
(probablemente existe ya instalada una version superior, desinstalala e instala la version 1.19.3)
### `venv\Scripts\deactivate`
### `cd..`
### `npm run start-api`
(arrancamos un servidor de flask en el puerto 5000 - http://localhost:5000)<br />
(puedes probar el API con esta llamada: http://localhost:5000/flask_api/time recibes un archivo JSON con un numerajo del tipo `1609732886.7396224`)

## Archivo de Variables de entorno (.env)
### COOKIE_KEY="thisappisforcountingfish"
### MONGODB_URI="mongodb://`USER`:`PASSWORD`@cluster0-shard-00-00-0ibmb.mongodb.net:27017,cluster0-shard-00-01-0ibmb.mongodb.net:27017,cluster0-shard-00-02-0ibmb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
### NODE_ENV="production"
### PORT=8000
### PUBLIC_URL="http://localhost:8000"

## MongoDB User & Password
Si te he invitado tendras usuario y clave, de lo contrario puedes usar tu propia MongoDB URI en la variable de entorno.
