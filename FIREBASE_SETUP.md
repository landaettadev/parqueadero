# 🔥 Configuración de Firebase - Smart Parking EAFIT

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `smart-parking-eafit` (o el que prefieras)
4. Deshabilita Google Analytics (opcional para MVP)
5. Click en "Crear proyecto"

### 2. Configurar Realtime Database

1. En el menú lateral, ve a **Build > Realtime Database**
2. Click en "Crear base de datos"
3. Selecciona ubicación: `us-central1` (o la más cercana)
4. Modo de seguridad: **Empezar en modo de prueba** (para desarrollo)
5. Click en "Habilitar"

### 3. Obtener Credenciales del Proyecto

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. En la pestaña "General", baja hasta "Tus apps"
3. Click en el ícono de **Web** (`</>`)
4. Registra tu app con el nombre: `Smart Parking Web`
5. **Copia las credenciales** que aparecen

### 4. Configurar el Proyecto Angular

Abre el archivo `src/environments/environment.ts` y reemplaza con tus credenciales:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto.firebaseio.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
  }
};
```

Haz lo mismo en `src/environments/environment.prod.ts` para producción.

### 5. Estructura de la Base de Datos

Crea la siguiente estructura en Firebase Realtime Database:

```json
{
  "parking_zones": {
    "zone-a": {
      "name": "Zona A",
      "totalSpots": 50,
      "occupiedSpots": 35,
      "latitude": 6.2008,
      "longitude": -75.5783,
      "createdAt": "2024-02-24T00:00:00Z"
    },
    "zone-b": {
      "name": "Zona B",
      "totalSpots": 60,
      "occupiedSpots": 45,
      "latitude": 6.2010,
      "longitude": -75.5780,
      "createdAt": "2024-02-24T00:00:00Z"
    },
    "zone-c": {
      "name": "Zona C",
      "totalSpots": 40,
      "occupiedSpots": 30,
      "latitude": 6.2012,
      "longitude": -75.5785,
      "createdAt": "2024-02-24T00:00:00Z"
    }
  },
  "parking_spots": {},
  "queue": {},
  "users": {},
  "parking_sessions": {},
  "analytics_snapshots": {}
}
```

### 6. Reglas de Seguridad (Desarrollo)

En la pestaña "Reglas" de Realtime Database, usa estas reglas para desarrollo:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **IMPORTANTE**: Estas reglas son solo para desarrollo. Para producción, implementa reglas de seguridad apropiadas.

### 7. Reglas de Seguridad (Producción - Ejemplo)

```json
{
  "rules": {
    "parking_zones": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'ADMIN'"
    },
    "queue": {
      ".read": "auth != null",
      "$queueId": {
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### 8. Configurar Authentication (Opcional)

1. Ve a **Build > Authentication**
2. Click en "Comenzar"
3. Habilita **Email/Password** como proveedor
4. Crea usuarios de prueba manualmente

### 9. Verificar Instalación

Ejecuta el proyecto:

```bash
npm install
ng serve
```

Abre la consola del navegador y verifica que no haya errores de Firebase.

## 🔄 Actualización en Tiempo Real

Firebase Realtime Database se actualiza automáticamente en todos los clientes conectados. Los adapters ya están configurados para escuchar cambios con `onValue()`.

## 📊 Monitoreo

Puedes ver los datos en tiempo real en Firebase Console > Realtime Database > Data.

## 🚀 Próximos Pasos

1. Configurar Firebase según esta guía
2. Ejecutar `ng serve`
3. Comenzar desarrollo de componentes (Sprint 1)

---

**Documentación oficial**: https://firebase.google.com/docs/database
