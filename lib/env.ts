export const getMetaPixelId = () =>
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1928404584468392";

// El secreto se usa únicamente en el servidor para firmar el acceso temporal a gracias.
export const getRegistrationSecret = () => process.env.REGISTRATION_TOKEN_SECRET || "";

// Un secreto vacío o corto permitiría falsificar cookies en producción; por eso
// el endpoint debe permanecer bloqueado hasta que se configure uno fuerte.
export const hasSafeRegistrationSecret = () => {
  const secret = getRegistrationSecret();
  return secret.length >= 32 && secret !== "change-me" && secret !== "development-secret";
};
