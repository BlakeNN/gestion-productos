# Gestión de Productos

Sistema de gestión de productos para comercios medianos, desarrollado en Node.js y Express. Este sistema permite a los usuarios consultar productos, códigos y precios, y cuenta con roles de usuario y administrador para el control de accesos.

## Tabla de Contenidos
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Uso](#uso)
- [Estructura de Rutas](#estructura-de-rutas)
- [Licencia](#licencia)

## Características
- **Autenticación y autorización** con sesiones para usuarios y administradores.
- **Gestión de productos**: agregar, eliminar, y consultar productos.
- **Gestión de categorías** para organizar los productos.
- **Actualización de precios** por categoría o producto.
- **Interfaz de usuario** con plantillas EJS.
- **Operaciones CRUD** para usuarios y categorías.

## Tecnologías Utilizadas
- **Backend**: Node.js, Express
- **Base de Datos**: MySQL
- **Frontend**: EJS, HTML, CSS
- **Otros**: CORS, express-session

## Requisitos Previos
- [Node.js](https://nodejs.org/) >= 18.0.0
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

## Instalación
1. **Clona este repositorio**:
   ```bash
   git clone https://github.com/username/gestion-productos.git
   cd gestion-productos
2. **Instala las dependencias**:
   ```bash
   npm install  
## Configuración
1. **Configura la base de datos**: crea una base de datos MySQL y ejecuta el script para generar las tablas necesarias (por ejemplo, `schema.sql` si tienes un archivo con la estructura).

2. **Configura el archivo `.env`**: crea un archivo `.env` en el directorio raíz del proyecto y añade las siguientes variables con tus propios valores:
   ```plaintext
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=gestionProductos
   SESSION_SECRET=tu_secreto_seguro
## Ejecutar la Aplicación
Para iniciar la aplicación en modo desarrollo:
  ```bash
  npm run dev
  ```
Para iniciar la aplicación en modo producción:
  ```bash
  npm run prod
  ```
La aplicación estará disponible en http://localhost:3000.  
## Uso
1. **Página de inicio**: se accede a través de la ruta `/`.
2. **Login**: para autenticarse, los usuarios pueden acceder a la ruta `/validar`.
3. **Gestión de productos**: solo accesible para administradores; permite añadir, modificar o eliminar productos y categorías.

## Estructura de Rutas
| Ruta          | Método | Descripción                                               |
|---------------|--------|-----------------------------------------------------------|
| `/`           | GET    | Muestra la página de inicio                               |
| `/validar`    | POST   | Autentica y redirige a la vista correspondiente           |
| `/admin`      | GET    | Página de administración, para gestión de productos       |
| `/user`       | GET    | Página de usuario                                         |
| `/verCats`    | GET    | Muestra todas las categorías disponibles                  |
| `/buscProd`   | GET    | Permite buscar productos por código                       |
| `/addUser`    | GET    | Muestra el formulario para crear un usuario               |
| `/crearUser`  | POST   | Crea un nuevo usuario                                     |
| `/addcat`     | GET    | Muestra el formulario para añadir una categoría           |
| `/crearCat`   | POST   | Crea una nueva categoría                                  |
| `/verProds`   | GET    | Muestra los productos de una categoría específica         |
| ...           | ...    | ...                                                       |

## Licencia
Este proyecto está bajo la Licencia MIT. Puedes consultar el archivo `LICENSE` para más detalles.
