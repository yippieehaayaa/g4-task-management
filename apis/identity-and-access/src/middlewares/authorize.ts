import permissions from "express-jwt-permissions";

const guard = permissions({
  requestProperty: "identity",
  permissionsProperty: "permissions",
});

export { guard };
