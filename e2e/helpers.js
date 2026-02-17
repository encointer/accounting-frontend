const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY || "ci-test-secret";

/**
 * Forge a cookie-session cookie pair (session + session.sig)
 * matching the backend's cookie-session middleware config.
 */
function forgeSessionCookies(sessionData) {
  const value = Buffer.from(JSON.stringify(sessionData)).toString("base64");
  const sig = crypto
    .createHmac("sha1", SECRET_KEY)
    .update(`session=${value}`)
    .digest("base64")
    .replace(/\/|\+|=/g, (x) => ({ "/": "_", "+": "-", "=": "" })[x]);

  return [
    { name: "session", value, domain: "localhost", path: "/" },
    { name: "session.sig", value: sig, domain: "localhost", path: "/" },
  ];
}

function readonlyAdminCookies() {
  return forgeSessionCookies({
    address: "e2e-readonly-admin",
    isAdmin: false,
    isReadonlyAdmin: true,
    name: "E2E ReadonlyAdmin",
  });
}

module.exports = { forgeSessionCookies, readonlyAdminCookies };
