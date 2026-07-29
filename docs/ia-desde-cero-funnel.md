# Embudo IA desde cero

## Arquitectura y limitaciones

El proyecto usa Next.js App Router. La landing está en `app/landings/ia-desde-cero`; el formulario oficial es el embed de ActiveCampaign 297 (`cefincapacitacion.activehosted.com/f/embed.php?id=297`). El Pixel se inicializa una sola vez en `app/layout.tsx` mediante `next/script` y `MetaPixel`. No hay base de datos, Redis, Vercel KV, sistema de logs persistente, rate limiting distribuido ni CAPI.

El embed procesa el registro en el navegador. La aparición de su mensaje de éxito es una señal visual útil para la experiencia, pero no certifica server-side que ActiveCampaign haya guardado el contacto. El flujo actual es, por tanto: confirmación basada en señal del cliente del embed + nonce/cookie firmados. La verificación fuerte futura requiere API, webhook o consulta server-side de ActiveCampaign.

## Flujo

1. La landing solicita por `POST` `/api/registrations/nonce`; el servidor emite un nonce HMAC de cinco minutos, devuelve `expiresAt` y lo guarda en cookie `httpOnly`, asociado a `ia-desde-cero`.
2. El embed 297 muestra sus propios campos, validaciones y estados. El código observa únicamente su contenedor, deshabilita controles durante el envío y tiene timeout de 15 segundos.
3. Solo ante un selector visible de éxito del embed se llama `POST /api/registrations/confirm` con nonce y atribución.
4. El endpoint exige `POST`, `application/json`, mismo origen, cuerpo máximo de 16 KB, nonce vigente en cookie y body, campaña válida y estado `registration_open`. Sin persistencia no puede garantizar consumo atómico entre dispositivos; elimina la cookie para evitar replay normal en el mismo navegador.
5. Gracias verifica una cookie HMAC `httpOnly` de 24 horas. Sin ella no muestra confirmación ni dispara `CompleteRegistration`.
6. El evento `CompleteRegistration` usa `fbq("track", ...)` y un `eventID` derivado del identificador del registro. `localStorage` es una defensa adicional, no una garantía entre dispositivos.
7. El CTA entra a `/landings/ia-desde-cero/unirse-whatsapp`. Se valida cookie y configuración, se intenta `JoinGroup` durante hasta 1.2 segundos, se completa una espera total cercana a 1.5 segundos y se navega a `/api/whatsapp/redirect`, que resuelve el destino únicamente en servidor. El botón manual ejecuta la misma secuencia.

El nonce se renueva 45 segundos antes de expirar, al recuperar un error y, una sola vez, si ActiveCampaign mostró éxito pero la confirmación devuelve `nonce_expired`. Esto mejora continuidad de UX, pero no convierte la señal del embed en validación server-side.

## ActiveCampaign

Embed: `https://cefincapacitacion.activehosted.com/f/embed.php?id=297`. Los selectores de éxito conservados son `._form-thank-you`, `._form_success`, `._form-success` y `[data-form-success]`; los selectores de error son `[role=alert]`, `._form_error` y `._form-error`. Deben contrastarse con el HTML real del formulario 297 tras cualquier cambio de ActiveCampaign. Un error visible o timeout restaura controles y no redirige.

No se afirma nada sobre listas, etiquetas, automatizaciones, campos personalizados o contactos preexistentes sin evidencia de la cuenta. Un contacto existente será exitoso solo si el propio formulario 297 muestra su estado de aceptación.

## Variables de entorno

| Variable | Tipo | Finalidad | Si falta |
| --- | --- | --- | --- |
| `REGISTRATION_TOKEN_SECRET` | server-side | HMAC de nonce y cookie; mínimo 32 caracteres | confirmación bloqueada |
| `WHATSAPP_GROUP_URL` | server-side | destino fijo del grupo | WhatsApp bloqueado |
| `NEXT_PUBLIC_META_PIXEL_ID` | pública | ID público existente del Pixel | se conserva el fallback existente |
| `NEXT_PUBLIC_ACTIVE_CAMPAIGN_ACCOUNT` | pública | cuenta usada por el embed | se conserva la cuenta existente |

El enlace de WhatsApp no se acepta por query string ni se expone como `NEXT_PUBLIC_`. Se valida `https`, host exacto `chat.whatsapp.com`, path no vacío y ausencia de query/hash. No contiene valores privados en el repositorio.

## UTMs

Se capturan `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `campaign_id`, `adset_id`, `ad_id`, `placement`, `fbclid`, `landing_slug`, `event_id` y timestamp. Cada valor se limita a 200 caracteres y se conserva únicamente dentro del token temporal firmado. No existe mapeo real a campos de ActiveCampaign ni persistencia analítica: captura temporal `COMPLETADO`; persistencia analítica `PENDIENTE DE IMPLEMENTACIÓN`.

## Estados del evento

`startsAt`, `registrationClosesAt`, `endsAt` y `timeZone` viven en `lib/landings.ts`. `registrationClosesAt` y `endsAt` están en `null` con TODO: no se inventó cierre ni duración. El servidor rechaza registros si el estado deja de ser `registration_open`; definir esos valores antes de producción para completar el cierre automático.

## Tracking y pruebas

`PageView` se envía una vez por pathname desde `MetaPixel`; no hay Google Tag Manager ni segunda inicialización detectada. `CompleteRegistration` solo se intenta en gracias válida. `JoinGroup` solo indica llegada a la redirección, no membresía real.

Pruebas automatizadas: `npm test` cubre estado del evento, firma manipulada, nonce/landing, sanitización y host de WhatsApp. Pruebas de embed, contactos existentes, Meta bloqueado y responsive requieren navegador y cuenta real.

Prueba adversarial completa: `POST /api/registrations/nonce` con origen y cuerpo válidos emite nonce/cookie; después `POST /api/registrations/confirm` puede emitir la cookie de registro si el nonce sigue vigente. Una llamada sin origen, sin nonce o con nonce manipulado responde `403`/`400`. Esto reduce abuso, pero un cliente todavía puede solicitar nonce y llamar después a confirm; no certifica ActiveCampaign. El rate limiting distribuido queda pendiente de infraestructura (WAF, CDN o proveedor persistente).

## Pendientes y camino de validación fuerte

- `PENDIENTE DE VERIFICACIÓN`: confirmar HTML real, éxito/error y comportamiento de contacto preexistente del formulario 297.
- `PENDIENTE DE VERIFICACIÓN`: ejecutar manualmente el caso de una persona que tarda más de cinco minutos; el nonce se renueva automáticamente y también existe un reintento único tras éxito visual.
- `BLOQUEADO`: deduplicación server-side completa y registro interno atómico, porque no existe almacenamiento persistente.
- `BLOQUEADO`: WhatsApp hasta configurar `WHATSAPP_GROUP_URL` en local, preview y producción.
- `PENDIENTE DE VERIFICACIÓN`: pruebas manuales en 360, 375, 390, 412, 430, 768 y 1440 px.
- `PENDIENTE DE VERIFICACIÓN`: Pixel tardío/bloqueado; la navegación no espera indefinidamente y continúa tras 1.5 segundos.

## Advertencia de Node

`npm test` usa `node --experimental-strip-types` sobre un archivo TypeScript y Node 22 muestra `MODULE_TYPELESS_PACKAGE_JSON`. No se añadió `"type": "module"` automáticamente porque el repositorio contiene configuración y scripts que no fueron auditados como ESM; la advertencia es no bloqueante.

La evolución recomendada es: formulario/API propia hacia ActiveCampaign con credenciales, webhook correlacionado o consulta server-side que confirme contacto y asociación. Para ello harán falta credenciales API, lista, etiqueta, automatización, campos personalizados y una clave de correlación.
