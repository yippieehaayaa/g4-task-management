export { detailQuery } from "./detail";
export { policyKeys } from "./keys";
export { listQuery } from "./list";

import { detailQuery } from "./detail";
import { listQuery } from "./list";

export const policyQueries = {
	list: listQuery,
	detail: detailQuery,
};
