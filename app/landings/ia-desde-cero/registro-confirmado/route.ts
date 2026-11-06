import { handleConfirmedRegistration } from "../../../../lib/confirmed-registration-handlers.ts";

export function GET(request: Request) {
  return handleConfirmedRegistration(request);
}
