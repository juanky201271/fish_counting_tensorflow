# Fish Counting
### Fish Counting - MERN with Flask

## Directions
Clonar el proyecto (git clone ....)<br />
Instalar nodejs + npm.<br />
Instalar Python 3.8.

## Client React / Server Express
### `cd fish_counting_tensorflow`
### `cd client`
### `npm install`
(instalamos los paquetes del cliente)
### `npm run build`
(si cambias algun fuente del client/front-end deberas volver a lanzar este comando y refrescar la pagina en tu navegador para ver el resultado de los cambios)
### `cd..`
### `npm install`
(instalamos los paquetes del servidor)

## Archivo de Variables de entorno (`.env` crearlo en el raiz del repo)
`COOKIE_KEY="thisappisforcountingfish"`<br />
`MONGODB_URI="mongodb://USER:PASSWORD@cluster0-shard-00-00-0ibmb.mongodb.net:27017,cluster0-shard-00-01-0ibmb.mongodb.net:27017,cluster0-shard-00-02-0ibmb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"`<br />
`NODE_ENV="production"`<br />
`PORT=8000`<br />
`PUBLIC_URL="http://localhost:8000"`

## MongoDB User & Password
Si te he invitado tendras usuario (USER en la variable MONGODB_URI) y clave (PASSWORD en la variable MONGODB_URI), de lo contrario puedes usar tu propia MongoDB URI en la variable de entorno.

## React app ready to go
### `npm run start` o `npx nodemon`
(si cambias algun fuente del server/back-end toma efecto automaticamente, no tienes que hacer nada)<br /><br />
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
### (venv) $ `pip install matplotlib==3.2`
### (venv) $ `pip install tensorflow==2.2.0`
### (venv) $ `pip install numpy==1.19.3`
(probablemente existe ya instalada una version superior, desinstalala e instala la version 1.19.3 `pip uninstall numpy` y `pip install numpy==1.19.3`)
### `venv\Scripts\deactivate`
### `cd..`
### `npm run start-api` (alternativa: `cd api_flask` `venv\Scripts\activate` `flask run`)
(si cambias algun fuente de api_flask/python toma efecto automaticamente, no tienes que hacer nada)<br />
(arrancamos un servidor de flask en el puerto 5000 - http://localhost:5000)<br />
(puedes probar el API con esta llamada: http://localhost:5000/flask_api/time recibes un archivo JSON con un numerajo del tipo `1609732886.7396224`)

## Repositorio de archivos creados (csv, avi y zip)
Dentro de la carpeta: `client/public` va a existir la carpeta: `submits` solamente. Si tu repo es de alguna version anterior tendras otras tres carpetas que deberas borrar recursivamente (borrando tambien todo el contenido de cada una de las tres).

## Modelos entrenados
A causa de los archivos mayores de 100Mb he quitado los modelos del repo. Para usar un modelo copialo dentro de la carpeta `api_flask/models`.
