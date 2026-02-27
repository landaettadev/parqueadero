# 🚗 Smart Parking EAFIT - Sistema Inteligente de Parqueadero

Sistema de gestión inteligente de parqueadero para la Universidad EAFIT, desarrollado con Angular 18 y Firebase Realtime Database.

## 📋 Descripción

Aplicación web que permite a estudiantes y administradores gestionar el parqueadero universitario en tiempo real, incluyendo:

- ✅ Visualización de disponibilidad en tiempo real
- 🗺️ Mapa interactivo de zonas de parqueo
- 🚦 Sistema de cola cuando el parqueadero está lleno
- 📊 Dashboard administrativo con analíticas
- 🧠 Predicciones de disponibilidad con IA
- 📱 PWA para instalación en móviles

## 🏗️ Arquitectura

Este proyecto sigue **Clean Architecture** con separación de capas:

```
src/app/
├── core/
│   ├── domain/          # Entidades, Value Objects, Interfaces de Repositorios
│   ├── application/     # Casos de Uso (Use Cases)
│   └── infrastructure/  # Adaptadores (Firebase), Guards, Interceptors
├── shared/              # Componentes, Pipes, Directivas compartidas
├── features/            # Módulos por funcionalidad (auth, user, admin)
└── layouts/             # Layouts de la aplicación
```

## 🚀 Tecnologías

- **Angular 18** - Framework frontend con Zoneless Change Detection
- **Firebase Realtime Database** - Base de datos en tiempo real
- **TailwindCSS** - Framework de estilos
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Signals** - Manejo de estado reactivo

## 📦 Instalación

### Prerrequisitos

- Node.js 20.x o superior
- npm 10.x o superior
- Angular CLI 18.x

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Parqueadero
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**

Sigue la guía completa en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

Resumen:
- Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilita Realtime Database
- Copia las credenciales a `src/environments/environment.ts`

4. **Ejecutar en desarrollo**
```bash
ng serve
```

Abre `http://localhost:4200/` en tu navegador.

## 🎯 Vistas del MVP

### 👨‍🎓 Usuario (Estudiante)
1. **Dashboard** - Disponibilidad total y por zonas
2. **Mapa** - Visualización de zonas A, B, C
3. **Cola** - Estado de posición en cola
4. **Predicción** - Disponibilidad futura con IA
5. **Historial** - Registro de entradas/salidas

### 🛠️ Administrador
6. **Dashboard Admin** - Métricas en tiempo real
7. **Analítica** - Gráficos de horas pico, tendencias
8. **Cámaras** - Monitor de cámaras (simulado)
9. **IA Insights** - Predicciones y recomendaciones

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── domain/
│   │   │   ├── entities/           # ParkingZone, QueueEntry, etc.
│   │   │   ├── repositories/       # Interfaces de repositorios
│   │   │   └── value-objects/      # Coordinates, ParkingStatus
│   │   ├── application/
│   │   │   └── use-cases/          # GetAvailability, JoinQueue
│   │   └── infrastructure/
│   │       ├── adapters/firebase/  # Implementación Firebase
│   │       ├── guards/             # Auth, Role guards
│   │       └── config/             # Configuración Firebase
│   ├── shared/
│   │   ├── components/             # Header, Footer, Loader
│   │   ├── constants/              # Imágenes, Labels
│   │   └── pipes/                  # Pipes reutilizables
│   ├── features/
│   │   ├── auth/                   # Login, Register
│   │   ├── user/                   # Vistas de usuario
│   │   └── admin/                  # Vistas de admin
│   └── layouts/
│       ├── main-layout/            # Layout usuario
│       └── admin-layout/           # Layout admin
├── assets/
│   └── data/                       # Datos mock para MVP
└── environments/                   # Configuración por ambiente
```

## 🔥 Configuración de Firebase

### Estructura de la Base de Datos

```json
{
  "parking_zones": {
    "zone-a": {
      "name": "Zona A",
      "totalSpots": 50,
      "occupiedSpots": 35
    }
  },
  "queue": {},
  "users": {},
  "parking_sessions": {}
}
```

Ver [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para configuración completa.

## 🎨 Sistema de Diseño EAFIT

El proyecto utiliza el sistema de diseño oficial de EAFIT:

- **Colores primarios**: #000066 (Azul EAFIT), #00A9E0 (Azul claro)
- **Tipografía**: Inter
- **Componentes**: Header y Footer universitarios reutilizados

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests (configurar primero)
ng e2e
```

## 📦 Build para Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en `dist/`.

## 🚀 Roadmap

### ✅ Sprint 0 - Setup (Completado)
- Configuración del proyecto Angular 18
- Estructura Clean Architecture
- Integración con Firebase
- Path aliases configurados

### 📅 Sprint 1 - Auth + Layouts (Próximo)
- Login con Firebase Auth
- Main Layout y Admin Layout
- Header y Footer EAFIT
- Guards de autenticación

### 📅 Sprint 2 - Vistas Usuario Parte 1
- Dashboard usuario
- Mapa de parqueadero

### 📅 Sprint 3 - Vistas Usuario Parte 2
- Estado de cola
- Predicción IA
- Historial

### 📅 Sprint 4-5 - Vistas Admin
- Dashboard admin
- Analítica avanzada
- Monitor de cámaras
- IA Insights

### 📅 Sprint 6 - Integración Real-time
- Conexión completa con Firebase
- Real-time updates
- Testing exhaustivo

### 📅 Sprint 7 - Pulido y Demo
- Optimización de rendimiento
- PWA
- Documentación
- Deploy

## 🤝 Contribución

Este es un proyecto académico de la Universidad EAFIT.

## 📄 Licencia

Universidad EAFIT - 2026

## 📞 Contacto

Para más información sobre el proyecto, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para la Universidad EAFIT**
