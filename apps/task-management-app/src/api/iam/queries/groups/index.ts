export { detailQuery } from "./detail";
export { groupKeys } from "./keys";
export { listQuery } from "./list";

import { detailQuery } from "./detail";
import { listQuery } from "./list";

export const groupQueries = {
	list: listQuery,
	detail: detailQuery,
};
