export { roleKeys } from "./keys";
export { detailQuery } from "./detail";
export { listQuery } from "./list";

import { detailQuery } from "./detail";
import { listQuery } from "./list";

export const roleQueries = {
	list: listQuery,
	detail: detailQuery,
};