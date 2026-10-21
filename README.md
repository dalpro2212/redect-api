# RedTec API

API REST para gestionar el inventario y los préstamos de equipos
(audiovisuales, herramientas y laptops) del centro de recursos de RedTec.

## Tecnologías
Node.js, Express, MySQL, Sequelize ORM, JWT, bcrypt

## Requisitos
- Node.js 18 o superior
- MySQL o MariaDB (por ejemplo, con XAMPP)
- Git

## Instalación

1. Clonar el repositorio:
```bash
   git clone https://github.com/dalpro2212/redect-api.git
   cd redect-api
```
2. Instalar dependencias:
```bash
   npm install
```
3. Crear el archivo de variables de entorno a partir de la plantilla:
```bash
   copy .env.example .env
```
   Editar `.env` con los datos de tu MySQL.

## Base de datos

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@redtec.com | Admin123* |
| Usuario | usuario@redtec.com | Usuario123* |

## Modelo de datos
- **Users** (1:N) **Prestamos** (N:1) **Equipos**
- Relación N:M entre Users y Equipos a través de Prestamos

## Estructura del proyecto
```
src/
├── config/
├── models/
├── migrations/
└── seeders/
```

## Flujo de ramas
- `main`: versión estable
- `feature/*`: una rama por hito o funcionalidad