# Learning Workspace como aplicación desktop

La versión Electron conserva la aplicación web como renderer y agrega una shell de escritorio segura. No duplica la lógica de React ni crea un segundo frontend.

## Experiencia de interfaz

- La barra superior funciona como command bar compacta: identidad del mapa, progreso y acceso a navegación.
- El panel de navegación permanece cerrado por defecto para priorizar el canvas.
- Al abrirlo reúne selector de grafo, modo Grafo/Flashcards, categorías y próximo desafío.
- Las cards son rutas SPA de pantalla completa y funcionan como un workspace separado.
- La navegación contextual de una card se abre con `Ruta`; cerrada, deja visibles únicamente el título, score, controles y la vista activa.
- Lectura, Coaching y Evaluar siguen siendo superficies persistentes en el rail izquierdo.

## Desarrollo

Primero configurá `server/.env` a partir de `server/.env.example`. Después ejecutá desde la raíz:

```bash
npm run desktop:dev
```

El comando inicia Vite en `127.0.0.1:5173` y abre Electron. Electron comprueba `127.0.0.1:4317`; si el gateway no existe, lo inicia automáticamente usando `server/.env`. Al cerrar la ventana también finaliza el gateway que inició, pero no toca un gateway que ya estuviera ejecutándose.

## Build local y instalador

Build desempaquetada para verificar:

```bash
npm run desktop:pack
```

Instalador de Windows:

```bash
npm run desktop:dist
```

Los resultados quedan en `release/`. El gateway se compila como un único archivo Node antes de empaquetar Electron.

La configuración actual genera una aplicación local sin firma y evita el toolchain de codesigning de Windows. Para distribuirla públicamente conviene configurar un certificado y volver a habilitar `win.signAndEditExecutable`.

Las credenciales no se incluyen en el instalador. En una instalación empaquetada, la primera ejecución copia una plantilla a:

```text
%APPDATA%\Learning Workspace\.env.example
```

Copiala como `.env` en la misma carpeta y completá las keys. El gateway empaquetado usa ese directorio como configuración local.

## Arquitectura y seguridad

```text
Electron main
├── BrowserWindow aislada
│   └── React + Vite (renderer sin acceso a Node)
├── servidor HTTP local de assets y fallback SPA
│   └── /api/ai/* → proxy al gateway
└── proceso gateway local
    └── MiniMax directo → FreeLLMAPI como fallback
```

- `contextIsolation` está activo.
- `nodeIntegration` está desactivado.
- El renderer está sandboxed.
- El preload solo expone runtime, plataforma y versiones; no expone filesystem, procesos ni secretos.
- Los permisos del navegador se rechazan por defecto.
- Los links externos se abren en el navegador del sistema.
- Producción se sirve por HTTP loopback para conservar routing SPA y streaming SSE sin depender de `file://`.
- IndexedDB y `localStorage` pertenecen al perfil de Electron, separado del perfil del navegador.

## Archivos principales

- `electron/main.cjs`: ventana, lifecycle, servidor local, proxy y gateway.
- `electron/preload.cjs`: frontera mínima y segura con el renderer.
- `src/App.jsx`: shell del workspace y navegación contextual colapsable.
- `src/product-ui.css`: composición desktop y responsive.
