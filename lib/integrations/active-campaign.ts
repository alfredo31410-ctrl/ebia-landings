export const ACTIVE_CAMPAIGN_ACCOUNT = process.env.NEXT_PUBLIC_ACTIVE_CAMPAIGN_ACCOUNT || "cefincapacitacion";
export const getActiveCampaignClassName = (formId: string) => `_form_${formId}`;
export const getActiveCampaignEmbedUrl = (formId: string) => `https://${ACTIVE_CAMPAIGN_ACCOUNT}.activehosted.com/f/embed.php?id=${encodeURIComponent(formId)}`;
// Estos selectores son los estados que ya contemplaba la integración del embed.
// Deben contrastarse con el HTML real del formulario 297 en cada cambio de AC.
export const ACTIVE_CAMPAIGN_SUCCESS_SELECTOR = "._form-thank-you, ._form_success, ._form-success, [data-form-success]";
export const ACTIVE_CAMPAIGN_ERROR_SELECTOR = "[role=alert], ._form_error, ._form-error";
