# Front-ABDO77

Aplicación web desarrollada con React, TypeScript y Vite para la gestión de clientes.

## 🚀 Características

- ⚡️ Desarrollo rápido con Vite
- 🔒 TypeScript para type-safety
- 🎨 Diseño moderno
- 🔄 Estado global con Context API
- 🛠️ Configuración de ESLint para calidad de código

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm
- Git

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Heizahn/front-abdo.git
cd front-abdo
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
# Edita .env.local con tus configuraciones
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🏗️ Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes reutilizables
├── config/         # Configuraciones
├── constants/      # Constantes de la aplicación
├── context/        # Contextos de React
├── hooks/          # Custom hooks
├── interfaces/     # Interfaces TypeScript
├── layouts/        # Layouts de la aplicación
├── pages/          # Páginas de la aplicación
├── router/         # Configuración de rutas
├── services/       # Servicios y llamadas a API
└── theme/          # Configuración de temas
```

## 🏗️ Construcción

Para crear una versión de producción:

```bash
npm run build
```

## 📦 Despliegue

La aplicación está configurada para ser desplegada en Docker:

```bash
docker build -t front-abdo .
docker run -p 3000:3000 front-abdo
```

## 🤝 Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Proyecto Link: [https://github.com/Heizahn/front-abdo](https://github.com/Heizahn/front-abdo)
