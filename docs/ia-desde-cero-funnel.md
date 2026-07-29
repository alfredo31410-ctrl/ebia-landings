# Embudo IA desde cero

## Diagnóstico

El repositorio usa Next.js App Router. La landing es `app/landings/ia-desde-cero`, el formulario es un embed de ActiveCampaign y el Pixel se inicializa una sola vez en `app/layout.tsx` mediante `MetaPixel`. Antes de estos cambios, gracias confirmaba cualquier visita y el CTA saltaba directamente al enlace de WhatsApp; no existía persistencia ni ruta API.

## Configuración requerida

| Variable | Finalidad | Ejemplo sin secreto | Ubicación |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_ACTIVE_CAMPAIGN_ACCOUNT` | Cuenta pública para el embed | `cefincapacitacion` | `.env.local` y hosting |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID público del Pixel | `123456789012345` | `.env.local` y hosting |
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | Destino fijo permitido | `https://chat.whatsapp.com/codigo` | `.env.local` y hosting |
| `REGISTRATION_TOKEN_SECRET` | Firma de cookie httpOnly | valor aleatorio largo | solo servidor y hosting |

No se incluyeron credenciales de ActiveCampaign, etiquetas, automatizaciones ni una invitación privada. El formulario conserva el embed y su `formId` existente (`273`); la etiqueta/lista/automatización deben verificarse en la cuenta antes de producción.

## Flujo y tracking

1. `MetaPixel` inicializa `fbq` una sola vez en el layout y envía `PageView` una vez por pathname.
2. ActiveCampaign muestra el estado real de éxito; solo entonces el cliente llama `/api/registrations/confirm`.
3. El endpoint genera un identificador, fecha, expiración, landing y UTMs sanitizados en una cookie firmada `httpOnly`.
4. Gracias verifica esa cookie en servidor. Sin ella muestra recuperación y no envía `CompleteRegistration`.
5. `CompleteRegistration` usa `fbq("track", ...)` y una clave persistente por `registrationId`, evitando recargas, Strict Mode y pestañas duplicadas.
6. El CTA entra a `/unirse-whatsapp`. La ruta valida cookie, campaña y URL de configuración; espera 1.5 segundos y envía `fbq("trackCustom", "JoinGroup", ...)`. Este evento solo significa que se alcanzó la redirección, no que el usuario se unió realmente.

Para probar Pixel: usar Meta Pixel Helper, revisar `PageView`, `CompleteRegistration` y `JoinGroup` en Administrador de eventos, comprobar la consola y filtrar las solicitudes a `facebook.com/tr` en Network. No se agregó CAPI porque no existe arquitectura ni credencial disponible.

## ActiveCampaign

Se usa `https://<cuenta>.activehosted.com/f/embed.php?id=273`. El criterio de éxito es la aparición visible de uno de los selectores de éxito del embed, no un HTTP 200. ActiveCampaign conserva su propio manejo de contactos preexistentes; la asociación a la etiqueta/lista/automatización de esta clase debe confirmarse en la cuenta. Si el embed no muestra éxito, no hay redirección ni evento de conversión.

## Pruebas ejecutadas

- `npm.cmd run typecheck`: correcto.
- `npm.cmd run build`: correcto; se generaron landing, gracias, ruta interna y API.

No hay framework de pruebas instalado. Pendientes manuales: formulario válido/inválido, doble clic, error y timeout del embed, contacto existente, acceso directo y recarga de gracias, una sola conversión, URL faltante o inválida, UTMs, y responsive en 360/375/390/412/430 px, tablet y desktop.

## Pendientes y riesgos

- Configurar `REGISTRATION_TOKEN_SECRET` y `NEXT_PUBLIC_WHATSAPP_GROUP_URL` en cada entorno; sin ellos el flujo se detiene de forma segura.
- Confirmar en ActiveCampaign la etiqueta, lista, automatización, actualización de contactos existentes y persistencia de teléfono/UTMs.
- `endsAt` y `registrationClosesAt` quedan explícitamente en `null`: no se inventó duración ni cierre. Definirlos antes de producción.
- La protección del cliente evita doble clic, pero la cookie firmada es la barrera server-side para gracias. La deduplicación de Pixel es local al navegador; si se requiere deduplicación entre dispositivos deberá añadirse almacenamiento interno/CAPI.
- La ruta `/unirse-whatsapp` no confirma membresía real; la comparación con miembros reales debe hacerse operativamente.
