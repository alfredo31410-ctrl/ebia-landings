# Embudo IA para Maestros

## Rutas

- Landing: `/landings/ia-maestros`
- Preparación del registro: `POST /landings/ia-maestros/api/registrations/nonce`
- Confirmación de ActiveCampaign: `/landings/ia-maestros/registro-confirmado`
- Gracias: `/landings/ia-maestros/gracias`
- Consumo de conversión: `POST /landings/ia-maestros/api/registrations/consume`
- Paso previo a WhatsApp: `/landings/ia-maestros/unirse-whatsapp`
- Redirección server-side: `/landings/ia-maestros/api/whatsapp/redirect`

## Flujo

La landing carga el formulario oficial 327 de ActiveCampaign. Antes de habilitar su
botón solicita un nonce firmado de cinco minutos y conserva la atribución de la URL en
`sessionStorage` y en una cookie temporal. ActiveCampaign procesa el contacto y, solo
cuando el envío es exitoso, debe redirigir a `registro-confirmado`.

La ruta de confirmación valida el nonce, agrega `landing_slug` y `timestamp`, elimina
las cookies temporales y crea la cookie HttpOnly que autoriza la página de gracias.

Al cargar gracias, el navegador consume esa cookie en el endpoint interno. El endpoint
la elimina y entrega otra cookie HttpOnly, de 30 minutos, que autoriza únicamente el
paso de WhatsApp. Después de la respuesta válida se dispara `CompleteRegistration`.

La ruta `unirse-whatsapp` dispara `JoinGroup`, espera aproximadamente 1.5 segundos y
navega a la redirección interna. Esa redirección valida y consume la cookie de acceso
antes de abrir el grupo configurado en servidor.

## ActiveCampaign

La integración utiliza el embed oficial:

```html
<div class="_form_327"></div>
<script src="https://cefincapacitacion.activehosted.com/f/embed.php?id=327" charset="utf-8"></script>
```

En ActiveCampaign, el formulario 327 debe configurarse para abrir esta URL después
de un registro exitoso:

`https://ebiacapacitacion.com/landings/ia-maestros/registro-confirmado`

Variable requerida:

```env
NEXT_PUBLIC_ACTIVE_CAMPAIGN_ACCOUNT=cefincapacitacion
```

No se necesita API token ni ID de lista en el proyecto: la lista, automatización y
campos visibles se administran directamente en el formulario 327 de ActiveCampaign.

## Otras variables

```env
NEXT_PUBLIC_META_PIXEL_ID=
REGISTRATION_TOKEN_SECRET=
WHATSAPP_GROUP_URL_IA_MAESTROS=https://chat.whatsapp.com/codigo-real
```

`REGISTRATION_TOKEN_SECRET` debe ser aleatorio y tener al menos 32 caracteres. El
enlace de WhatsApp debe usar HTTPS, el host `chat.whatsapp.com` y no incluir query ni
fragmento.

## Datos editoriales pendientes

El nombre, cargo y experiencia de la instructora están declarados como `null` en
`lib/landings.ts`. Deben completarse únicamente cuando EBIA confirme información
pública real. La fotografía reutilizada se encuentra en:

`public/ia-desde-cero/Foto2.png`
