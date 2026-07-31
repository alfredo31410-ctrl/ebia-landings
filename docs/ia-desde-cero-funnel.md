# Embudo IA desde cero

## Flujo de registro

La landing usa el formulario oficial de ActiveCampaign 297. Antes del envio solicita un nonce HMAC de cinco minutos y mantiene deshabilitados los controles del embed hasta que el nonce este listo.

ActiveCampaign debe configurarse con **Open URL / Abrir URL** hacia:

`https://ebiacapacitacion.com/landings/ia-desde-cero/registro-confirmado`

No debe redirigir directamente a `/gracias` ni directamente a WhatsApp.

La ruta intermedia valida la cookie nonce firmada, la expiracion, el `landingSlug` y el estado del evento. Si todo es valido, crea la cookie de registro `httpOnly` y redirige mediante HTTP a `/landings/ia-desde-cero/gracias`. Si no es valido, vuelve a la landing con `registro=confirmacion_invalida` y muestra un mensaje recuperable.

La landing ya no detecta el mensaje de exito del embed mediante `MutationObserver`, no llama a `/api/registrations/confirm` despues de observar el DOM y no redirige desde JavaScript despues del exito. El endpoint compartido `/api/registrations/confirm` se conserva para compatibilidad con otras integraciones.

`CompleteRegistration` ocurre unicamente al cargar una pagina de gracias valida. La ruta intermedia no dispara eventos. `JoinGroup` sigue ocurriendo solo en el flujo interno de WhatsApp.

## ActiveCampaign

La cuenta se construye con:

`https://{NEXT_PUBLIC_ACTIVE_CAMPAIGN_ACCOUNT}.activehosted.com/f/embed.php?id=297`

La cuenta usa unicamente el subdominio y el formulario permanece en `activeCampaignFormId: "297"`.

## Variables de entorno

Variables globales:

```env
NEXT_PUBLIC_ACTIVE_CAMPAIGN_ACCOUNT=
NEXT_PUBLIC_META_PIXEL_ID=
REGISTRATION_TOKEN_SECRET=
```

Variable server-side especifica de esta landing:

```env
WHATSAPP_GROUP_URL_IA_DESDE_CERO=
```

El secreto firma los nonces y las cookies de registro. No se expone al navegador.

## Configuracion por landing

Cada landing debe declarar en `lib/landings.ts` su:

- `slug`;
- `activeCampaignFormId`;
- `whatsappEnvKey`;
- datos del evento.

Ejemplo documental para una futura landing, sin agregarla ahora:

```ts
{
  slug: "auxiliar-contable",
  activeCampaignFormId: "301",
  whatsappEnvKey: "WHATSAPP_GROUP_URL_AUXILIAR_CONTABLE",
}
```

La URL de WhatsApp se resuelve unicamente en servidor usando el slug validado y la clave declarada. Se exige `https:`, host `chat.whatsapp.com`, path no vacio y ausencia de query/hash. No se acepta destino por query string ni se usa una variable publica.

## Seguridad y limitaciones

No hay base de datos, Redis, KV, webhook, CAPI, API propia de ActiveCampaign ni persistencia server-side. La cookie HMAC evita el acceso normal sin un registro valido, pero la deduplicacion atomica entre dispositivos requiere almacenamiento persistente.

El embed procesa el contacto en el navegador. La ruta intermedia confirma la navegacion posterior configurada por ActiveCampaign, pero no certifica mediante API que el contacto exista server-side.

## Validacion

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Las pruebas cubren nonces validos, ausentes, expirados, manipulados y de otra landing, la cookie de registro, las redirecciones y la ausencia de tracking en la ruta intermedia.
