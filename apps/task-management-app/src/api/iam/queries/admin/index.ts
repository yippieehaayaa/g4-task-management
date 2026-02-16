export { adminKeys } from "./keys";
export { otpsQuery } from "./otps";
export { sessionsQuery } from "./sessions";

import { otpsQuery } from "./otps";
import { sessionsQuery } from "./sessions";

export const adminQueries = {
	sessions: sessionsQuery,
	otps: otpsQuery,
};
