# Deploy publico: Vercel + gateway BYOK

La aplicacion se divide en dos procesos porque las evaluaciones y el coaching usan streaming SSE y pueden tardar varios minutos:

```text
Navegador --> Vercel (React/Vite estatico) --> gateway Node (Render) --> provider OpenAI-compatible
                         sin API keys                  no persiste keys
```

Vercel sirve la SPA y redirige las rutas `/react/...` y `/rails/...` a `index.html`. El gateway se despliega como servicio Node separado. Esto evita intentar mantener streams largos dentro de una funcion serverless de Vercel.

## 1. Desplegar el gateway

1. En [Render](https://render.com/), crea un **Blueprint** desde este repositorio. Render detecta `render.yaml` y crea `learning-workspace-gateway` usando `server/` como raiz.
2. Cuando el servicio tenga una URL, por ejemplo `https://learning-workspace-gateway.onrender.com`, configura en Render:

   ```text
   CORS_ALLOWED_ORIGINS=https://TU-PROYECTO.vercel.app
   ```

   Para previews puntuales podes agregar mas origenes separados por coma. Nunca uses `*`: el gateway acepta una API key por request.
3. No hace falta definir una API key de servidor para el modo BYOK. Si queres un provider por defecto para uso interno, agrega `MINIMAX_API_KEY` o `FREELLMAPI_*` solo en Render; nunca en variables `VITE_*` ni en el repositorio.

El endpoint de health es:

```text
https://TU-GATEWAY.onrender.com/api/ai/status
```

Un `200` confirma que el gateway vive. `gateway.configured: false` es normal cuando no definiste un provider por defecto: cada persona provee su perfil desde Configuracion de IA.

## 2. Desplegar el frontend en Vercel

El repositorio ya incluye `vercel.json`. En el proyecto conectado en Vercel:

1. En **Settings -> Environment Variables**, agrega:

   ```text
   VITE_AI_API_URL=https://TU-GATEWAY.onrender.com
   ```

   No agregues ninguna API key a Vercel.
2. Aplica la variable a Production y Preview si queres que ambos funcionen. Si usas previews, agrega sus origenes concretos a `CORS_ALLOWED_ORIGINS` del gateway.
3. Hace un nuevo deploy despues de cambiar la variable. Vite incorpora las variables `VITE_*` durante el build.

Como el repositorio ya esta conectado, hacer push a la rama configurada crea el deploy automaticamente. Alternativamente, importalo desde el dashboard o ejecuta `npx vercel --prod` desde la raiz una vez autenticado.

## 3. Configurar un provider desde la aplicacion

Abri el boton **IA** de la barra superior. La pantalla acepta cualquier endpoint OpenAI-compatible que implemente `POST /chat/completions` y streaming SSE. Para MiniMax elegi el preset, pega tu API key y selecciona el modelo.

- En navegador, el perfil queda en `sessionStorage`: se borra al cerrar la pestana.
- En Electron, el perfil se cifra con el almacenamiento seguro del sistema operativo.
- La API key viaja solo al gateway en la request que la necesita. El gateway no la escribe a disco ni la incluye en respuestas, errores o logs.
- En produccion el gateway rechaza endpoints no HTTPS, locales o de redes privadas. Para desarrollo local explicito puede usarse `ALLOW_PRIVATE_PROVIDER_URLS=true`.

Usa **Probar conexion** antes de guardar. La prueba llama al endpoint estandar `/models`, por lo que un proveedor compatible que no lo exponga puede marcar error aunque `chat/completions` exista.

## Checklist final

- [ ] `npm run check` pasa localmente.
- [ ] El servicio Render responde `200` en `/api/ai/status`.
- [ ] `CORS_ALLOWED_ORIGINS` contiene exactamente el dominio de Vercel.
- [ ] `VITE_AI_API_URL` apunta a la URL HTTPS de Render y se redeployo Vercel.
- [ ] Se verifico una evaluacion real con un perfil BYOK desde la UI.
- [ ] No hay keys en Git, archivos `.env`, `VITE_*` ni logs compartidos.

## Limite de este modo publico

BYOK evita que la app comparta una key de proveedor, pero el gateway sigue siendo un proxy publico. Para un lanzamiento abierto agrega autenticacion, rate limiting por usuario/IP y limites de tamano/costo antes de permitir trafico anonimo.
