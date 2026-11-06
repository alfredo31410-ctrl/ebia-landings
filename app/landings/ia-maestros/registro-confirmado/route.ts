import { handleTeacherConfirmedRegistration } from "../../../../lib/confirmed-registration-handlers.ts";

export function GET(request: Request) {
  return handleTeacherConfirmedRegistration(request);
}
