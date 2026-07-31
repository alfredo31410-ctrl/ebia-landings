const PUBLIC_ORIGIN = "https://ebiacapacitacion.com";
const LOCAL_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);

/** Devuelve solo un origen confiable para redirecciones internas del embudo. */
export function getPublicOrigin(request: Request) {
  if (process.env.NODE_ENV === "production") return PUBLIC_ORIGIN;

  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "http" ? "http" : null;
  const host = request.headers.get("host");
  const candidate = protocol && host ? `${protocol}://${host}` : null;
  if (candidate && LOCAL_ORIGINS.has(candidate)) return candidate;

  const origin = request.headers.get("origin");
  if (origin && LOCAL_ORIGINS.has(origin)) return origin;
  throw new Error("public_origin_unavailable");
}
