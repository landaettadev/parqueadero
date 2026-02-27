# 📊 Poblar Firebase con Datos Iniciales

## Opción 1: Desde Firebase Console (Manual)

### 1. Acceder a Realtime Database

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Build > Realtime Database**
4. Click en la pestaña **Data**

### 2. Agregar Datos Manualmente

Click en el botón **+** junto a la raíz y agrega la siguiente estructura:

```json
{
  "parking_zones": {
    "zone-a": {
      "name": "Zona A",
      "totalSpots": 50,
      "occupiedSpots": 15,
      "latitude": 6.2008,
      "longitude": -75.5783,
      "createdAt": "2024-02-24T00:00:00Z"
    },
    "zone-b": {
      "name": "Zona B",
      "totalSpots": 60,
      "occupiedSpots": 40,
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
  "users": {
    "user1": {
      "email": "user@eafit.edu.co",
      "fullName": "Usuario Demo",
      "role": "USER",
      "createdAt": "2024-02-24T00:00:00Z"
    },
    "admin1": {
      "email": "admin@eafit.edu.co",
      "fullName": "Administrador Demo",
      "role": "ADMIN",
      "createdAt": "2024-02-24T00:00:00Z"
    }
  },
  "queue": {},
  "parking_spots": {},
  "parking_sessions": {}
}
```

## Opción 2: Usando REST API (Automatizado)

### Script PowerShell para Windows

Crea un archivo `populate-firebase.ps1`:

```powershell
# Configuración
$DATABASE_URL = "https://TU-PROYECTO.firebaseio.com"

# Datos de zonas
$zones = @{
    "zone-a" = @{
        name = "Zona A"
        totalSpots = 50
        occupiedSpots = 15
        latitude = 6.2008
        longitude = -75.5783
        createdAt = "2024-02-24T00:00:00Z"
    }
    "zone-b" = @{
        name = "Zona B"
        totalSpots = 60
        occupiedSpots = 40
        latitude = 6.2010
        longitude = -75.5780
        createdAt = "2024-02-24T00:00:00Z"
    }
    "zone-c" = @{
        name = "Zona C"
        totalSpots = 40
        occupiedSpots = 30
        latitude = 6.2012
        longitude = -75.5785
        createdAt = "2024-02-24T00:00:00Z"
    }
}

# Enviar datos
foreach ($key in $zones.Keys) {
    $json = $zones[$key] | ConvertTo-Json
    Invoke-RestMethod -Uri "$DATABASE_URL/parking_zones/$key.json" -Method Put -Body $json -ContentType "application/json"
    Write-Host "✓ Zona $key creada"
}

Write-Host "`n✅ Datos cargados exitosamente!"
```

Ejecutar:
```powershell
.\populate-firebase.ps1
```

## Opción 3: Desde la Aplicación Angular

### Crear Servicio de Inicialización

```typescript
// src/app/core/infrastructure/services/firebase-init.service.ts
import { Injectable } from '@angular/core';
import { getFirebaseDatabase } from '../config/firebase.config';
import { ref, set } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitService {
  private db = getFirebaseDatabase();

  async initializeData(): Promise<void> {
    const zones = {
      'zone-a': {
        name: 'Zona A',
        totalSpots: 50,
        occupiedSpots: 15,
        latitude: 6.2008,
        longitude: -75.5783,
        createdAt: new Date().toISOString()
      },
      'zone-b': {
        name: 'Zona B',
        totalSpots: 60,
        occupiedSpots: 40,
        latitude: 6.2010,
        longitude: -75.5780,
        createdAt: new Date().toISOString()
      },
      'zone-c': {
        name: 'Zona C',
        totalSpots: 40,
        occupiedSpots: 30,
        latitude: 6.2012,
        longitude: -75.5785,
        createdAt: new Date().toISOString()
      }
    };

    for (const [key, value] of Object.entries(zones)) {
      await set(ref(this.db, `parking_zones/${key}`), value);
    }

    console.log('✅ Datos inicializados en Firebase');
  }
}
```

Llamar desde el componente o en desarrollo:
```typescript
// En dashboard.component.ts
ngOnInit(): void {
  // Solo para desarrollo - comentar después
  // this.firebaseInitService.initializeData();
  
  this.parkingService.loadZones().subscribe();
}
```

## Verificar Datos

1. Ve a Firebase Console > Realtime Database > Data
2. Deberías ver la estructura `parking_zones` con 3 zonas
3. En la aplicación, el Dashboard debería mostrar las 3 tarjetas de zonas

## Actualizar Datos en Tiempo Real

Para simular cambios en tiempo real:

1. Ve a Firebase Console
2. Edita manualmente el valor de `occupiedSpots` en cualquier zona
3. La aplicación se actualizará automáticamente sin recargar

## Datos de Prueba Recomendados

### Escenario 1: Disponibilidad Normal
- Zona A: 15/50 ocupados (70% disponible) - Verde
- Zona B: 30/60 ocupados (50% disponible) - Amarillo
- Zona C: 10/40 ocupados (75% disponible) - Verde

### Escenario 2: Alta Ocupación
- Zona A: 45/50 ocupados (10% disponible) - Rojo
- Zona B: 55/60 ocupados (8% disponible) - Rojo
- Zona C: 38/40 ocupados (5% disponible) - Rojo

### Escenario 3: Parqueadero Lleno
- Zona A: 50/50 ocupados (0% disponible) - Rojo
- Zona B: 60/60 ocupados (0% disponible) - Rojo
- Zona C: 40/40 ocupados (0% disponible) - Rojo

## Troubleshooting

### Error: Permission Denied
- Verifica las reglas de seguridad en Firebase Console
- Para desarrollo, usa: `{ ".read": true, ".write": true }`

### No se muestran datos
- Verifica que `databaseURL` en `environment.ts` sea correcto
- Abre la consola del navegador para ver errores
- Verifica que Firebase esté inicializado correctamente

---

**Nota**: Los datos son solo para MVP/demo. En producción, implementar API backend para gestionar datos.
