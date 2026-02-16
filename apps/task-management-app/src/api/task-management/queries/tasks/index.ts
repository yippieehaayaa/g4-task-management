export { detailQuery } from "./detail";
export { taskKeys } from "./keys";
export { listQuery } from "./list";

import { detailQuery } from "./detail";
import { listQuery } from "./list";

export const taskQueries = {
	list: listQuery,
	detail: detailQuery,
};
