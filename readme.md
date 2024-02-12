# Backend Red Social

## Configuración del Backend:

### Clonar el Repositorio: Clona este repositorio con el comando: git clone https://github.com/victordelara94/social.network.back.git

### Instalar Dependencias: Accede al directorio del servidor (cd social.network.back) y ejecuta npm install para instalar las dependencias necesarias.

### Configurar Variables de Entorno: Crea un archivo .env en la raíz de /social.network.back y establece las variables de entorno necesarias, como la conexión a la base de datos.

```.env
# Archivo .env
PORT=3001
DB_PASSWORD=tu_contraseña_de_MongoDB,
DB_USER=tu_usuario_de_MongoDB,
DB_CLUSTER=tu_subdominio_del_cluster_de_MongoDB,
CLOUDINARY_URL=tu_url_de_cloudinary
CLOUDINARY_NAME=tu_nombre_de_cloudinary
CLOUDINARY_KEY=tu_clave_de_api_de_cloudinary
CLOUDINARY_SECRET=tu_secreto_de_api_de_cloudinary
TOKEN_SECRET=tu_clave_secreta_para_jwt
```

### Iniciar el Servidor: Ejecuta npm run build y npm run server ,cada comando en un terminal, en el directorio del servidor para iniciar el backend.

## Características Implementadas:

1. Autenticación de Usuarios: Implementé un sistema de registro e inicio de sesión seguro.

2. Entidades: La aplicación utiliza las entidades User, Post y Comment para gestionar la información del usuario, las publicaciones y los comentarios.

3. Seguimiento y Feed: Desarrollé la funcionalidad para que los usuarios puedan seguir a otros y tengan un feed personalizado basado en las personas a las que siguen.

4. Configuración de Perfiles: Los usuarios pueden configurar la privacidad de sus perfiles como públicos o privados.

5. Comentarios y Likes: Se implementaron sistemas de comentarios y "likes" en las publicaciones.

¡Gracias por la oportunidad de participar en este desafío técnico!
