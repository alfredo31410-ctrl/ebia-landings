# Embudo IA para Maestros

## Rutas

- Landing: `/landings/ia-maestros`
- Inscripción: `/landings/ia-maestros/inscripcion`
- Preparación del registro: `POST /landings/ia-maestros/api/registrations/nonce`
- Confirmación de ActiveCampaign: `/landings/ia-maestros/registro-confirmado`
- Gracias: `/landings/ia-maestros/gracias`
- Consumo de conversión: `POST /landings/ia-maestros/api/registrations/consume`
- Redirección server-side: `/landings/ia-maestros/api/whatsapp/redirect`

## Flujo

La landing carga el formulario oficial 327 de ActiveCampaign. Antes de habilitar su
botón solicita un nonce firmado de cinco minutos y conserva la atribución de la URL en
`sessionStorage` y en una cookie temporal. ActiveCampaign procesa el contacto y, solo
cuando el envío es exitoso, debe redirigir a `registro-confirmado`.

La ruta de confirmación valida el nonce, agrega `landing_slug` y `timestamp`, elimina
las cookies temporales y crea la cookie HttpOnly que autoriza la página de gracias.

Al cargar gracias por primera vez, el navegador consume la cookie inicial en el
endpoint interno. El endpoint la reemplaza por una cookie HttpOnly de confirmación,
válida durante 30 días, y entrega otra cookie HttpOnly de 30 minutos que autoriza la
redirección a WhatsApp. Solo la primera respuesta válida autoriza disparar
`CompleteRegistration`; las recargas restauran el acceso y el CTA sin repetir ese
evento.

El clic en ese CTA registra `JoinGroup` como métrica secundaria y navega directamente
a la redirección interna, sin mostrar una segunda página ni agregar una espera. La
redirección valida y consume la cookie de acceso antes de abrir el grupo configurado
en servidor.

## Inscripción de pago

La ruta de venta directa presenta el producto **Inteligencia Artificial para
Maestros: De Cero al Aula** por **$297.00 MXN** y dirige la compra al checkout oficial
de Hotmart. La oferta incluye **3 clases prácticas en vivo**, programadas para el
**29 y 30 de septiembre y 1 de octubre a las 6:00 PM, hora CDMX**. Conserva únicamente
parámetros de atribución aprobados y registra
`ViewContent` e `InitiateCheckout` en Meta Pixel cuando la integración está disponible.

El checkout predeterminado es:

`https://pay.hotmart.com/M107670322C?off=f4a0vm6y&checkoutMode=10`

Puede reemplazarse por entorno solamente con la misma combinación autorizada de
producto, oferta y modo de checkout:

```env
NEXT_PUBLIC_HOTMART_CHECKOUT_URL_IA_MAESTROS=
```

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
fragmento. IA Maestros cuenta con un destino predeterminado autorizado en el código;
`WHATSAPP_GROUP_URL_IA_MAESTROS` es opcional y, cuando se configura, reemplaza ese
destino sin necesidad de modificar el repositorio.

## Instructora

La información pública confirmada muestra a Miranda Medina como Instructora EBIA.
No se publican credenciales ni experiencia adicional sin confirmación. La fotografía
reutilizada se encuentra en:

`public/ia-desde-cero/Foto2.png`
