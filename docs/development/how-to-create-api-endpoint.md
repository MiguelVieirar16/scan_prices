# Cómo crear un endpoint API en este proyecto

## Estructura usada por el backend
Cada módulo vive en:
- `apps/api/src/modules/<modulo>/`

Típicamente con:
- `<modulo>.route.ts`
- `<modulo>.service.ts`
- `<modulo>.repository.ts` (si aplica)

## Paso a paso

1. Crear carpeta del módulo
```bash
mkdir -p apps/api/src/modules/mi-modulo
```

2. Crear ruta del endpoint
Ejemplo `apps/api/src/modules/mi-modulo/mi-modulo.route.ts`:
```ts
import { FastifyInstance } from "fastify";

export async function miModuloRoute(app: FastifyInstance): Promise<void> {
  app.get("/api/v1/mi-modulo/ping", async (_request, reply) => {
    return reply.send({ ok: true });
  });
}
```

3. Registrar la ruta en:
- `apps/api/src/routes/index.ts`

4. Probar local:
```bash
npm run dev:api
curl "http://localhost:4000/api/v1/mi-modulo/ping"
```

5. Validar build:
```bash
npm run build
```

## Patrón recomendado
- Validación de `params/query/body` con `zod`.
- Lógica en `service`.
- Acceso a datos en `repository`.
- Errores controlados con `NotFoundError`/`ValidationError`.

## Cómo crear un conector por comercio
Usa el scaffold:
```bash
scripts/new-connector.sh <tenant-code>
```
Luego registra el conector en:
- `apps/worker/src/connectors/registry.ts`

