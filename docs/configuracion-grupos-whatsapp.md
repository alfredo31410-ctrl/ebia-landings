# Configuración de grupos de WhatsApp

Cada landing mantiene su propio destino en un archivo `config.ts` dentro de su
carpeta. Para cambiar un grupo, edita únicamente `whatsappGroupUrl`, confirma el
cambio en Git y publícalo mediante el flujo normal de `main`.

## Archivos

- `app/landings/ia-desde-cero/config.ts`
- `app/landings/ia-maestros/config.ts`
- `app/landings/tareas-con-ia/config.ts`
- `app/landings/correos-profesionales-con-ia/config.ts`

Ejemplo:

```ts
export const landingConfig = {
  whatsappGroupUrl: "https://chat.whatsapp.com/codigo-del-grupo",
} as const;
```

El enlace debe usar `https://chat.whatsapp.com/` y no puede incluir parámetros ni
fragmentos. Ya no se necesita declarar una variable de Vercel para los grupos.

Al crear una landing nueva, agrega su `config.ts` y regístralo en
`lib/whatsapp-config.ts`. Los enlaces quedan visibles para cualquier persona con
acceso de lectura al repositorio.
