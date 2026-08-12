# Deploy público: Vercel + BYOK

El modo recomendado ejecuta la SPA y el gateway Node en el mismo deployment de
Vercel:

```text
Navegador --> Vercel (React/Vite + /api/ai) --> provider OpenAI-compatible
              sin API keys persistidas
```

Las funciones en `api/ai/**` reutilizan el gateway de `server/`. Vercel permite
streams de hasta cinco minutos en esta configuración. El mismo origen se acepta
automáticamente; no hace falta configurar CORS para la propia URL del deployment.

## 1. Desplegar en Vercel

El repositorio ya incluye `vercel.json`. Desde la raíz, con la sesión de Vercel
iniciada:

```bash
npx vercel --prod
```

No agregues una API key de proveedor a Vercel para el modo BYOK. Si querés un
provider por defecto para uso interno, definí `MINIMAX_API_KEY` o
`FREELLMAPI_*` solo como variables de entorno del servidor, nunca como
`VITE_*` ni en el repositorio.

El health check del mismo deployment es:

```text
https://TU-PROYECTO.vercel.app/api/ai/status
```

Un `200` confirma que el gateway vive. `gateway.configured: false` es normal
cuando no definiste un provider por defecto: cada persona provee su perfil desde
Configuración de IA.

## 2. Gateway externo (opcional)

Usá Render u otro proceso Node si necesitás límites de ejecución distintos o
querés aislar el gateway. En ese caso configurá en Vercel:

```text
VITE_AI_API_URL=https://TU-GATEWAY.example.com
```

Y en el gateway externo agregá una allowlist concreta, por ejemplo:

```text
CORS_ALLOWED_ORIGINS=https://TU-PROYECTO.vercel.app
```

Para previews puntuales podés agregar más orígenes separados por coma. Nunca
uses `*`: el gateway acepta una API key por request.

## 3. Configurar un provider desde la aplicacion

Abrí el botón **IA** de la barra superior. El directorio permite buscar providers conocidos y muestra cuáles son conectables desde este gateway. Las filas **Compatible** usan `POST /chat/completions` y streaming SSE; las filas **Requiere adaptador** se muestran para descubrimiento, pero no aceptan una conexión hasta que el gateway implemente su protocolo nativo. Para MiniMax elegí el preset, pegá tu API key y seleccioná el modelo.

- En navegador, el perfil queda en `sessionStorage`: se borra al cerrar la pestana.
- En Electron, el perfil se cifra con el almacenamiento seguro del sistema operativo.
- La API key viaja solo al gateway en la request que la necesita. El gateway no la escribe a disco ni la incluye en respuestas, errores o logs.
- En produccion el gateway rechaza endpoints no HTTPS, locales o de redes privadas. Para desarrollo local explicito puede usarse `ALLOW_PRIVATE_PROVIDER_URLS=true`.

Usá **Probar modelo** antes de guardar. La prueba hace una inferencia mínima
contra `POST /chat/completions`; así valida la URL, la key y el slug reales. El
catálogo es una operación separada y un provider puede usarse aun sin `/models`.

## Checklist final

- [ ] `npm run check` pasa localmente.
- [ ] El deployment de Vercel responde `200` en `/api/ai/status`.
- [ ] Si usás gateway externo, `CORS_ALLOWED_ORIGINS` contiene el dominio de Vercel.
- [ ] Si usás gateway externo, `VITE_AI_API_URL` apunta a su URL HTTPS y se redeployó Vercel.
- [ ] Se verifico una evaluacion real con un perfil BYOK desde la UI.
- [ ] No hay keys en Git, archivos `.env`, `VITE_*` ni logs compartidos.

## Limite de este modo publico

BYOK evita que la app comparta una key de proveedor, pero el gateway sigue siendo un proxy publico. Para un lanzamiento abierto agrega autenticacion, rate limiting por usuario/IP y limites de tamano/costo antes de permitir trafico anonimo.
