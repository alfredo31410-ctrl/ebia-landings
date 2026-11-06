# Embudo Correos profesionales con IA

## Rutas

- Landing: `/landings/correos-profesionales-con-ia`
- Preparación del registro: `POST /landings/correos-profesionales-con-ia/api/registrations/nonce`
- Confirmación de ActiveCampaign: `/landings/correos-profesionales-con-ia/registro-confirmado`
- Gracias: `/landings/correos-profesionales-con-ia/gracias`
- Consumo de conversión: `POST /landings/correos-profesionales-con-ia/api/registrations/consume`
- Redirección a WhatsApp: `/landings/correos-profesionales-con-ia/api/whatsapp/redirect`

## Evento

- Fecha: martes 10 de noviembre de 2026.
- Hora: 1:00 p. m., hora de Ciudad de México.
- Modalidad: en línea.
- Instructora: Miranda Medina, Instructora EBIA.

## ActiveCampaign

La landing carga el formulario `379` desde la cuenta `cefincapacitacion`. El ID está
versionado en `lib/landings.ts` y no requiere una variable de Vercel.

El componente también instala un respaldo de redirección mediante el callback de
éxito del embed. Después de un registro válido, el navegador continúa a:

`https://ebiacapacitacion.com/landings/correos-profesionales-con-ia/registro-confirmado`

## WhatsApp y servidor

```env
REGISTRATION_TOKEN_SECRET=
```

`REGISTRATION_TOKEN_SECRET` debe contener al menos 32 caracteres. El grupo se cambia
directamente en `app/landings/correos-profesionales-con-ia/config.ts`; no requiere
crear o actualizar una variable en Vercel. El enlace debe utilizar HTTPS, el host
`chat.whatsapp.com` y no incluir query string ni fragmento.

## Conversión

La landing registra `ViewContent`. `RegistrationStart` se registra al pulsar un CTA y
se confirma también al enviar el formulario, sin duplicarlo por sesión. El regreso
válido desde ActiveCampaign crea una cookie HttpOnly temporal. La página de gracias consume esa
cookie una sola vez para registrar `CompleteRegistration`, conserva el acceso de
recarga durante 30 días y emite un acceso de 30 minutos a la redirección server-side
de WhatsApp. El clic al grupo registra `JoinGroup` sin exponer el destino en el
navegador.
