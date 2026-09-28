// UI message catalogs. en and es must expose exactly the same keys (npm run check:i18n).
// Values are strings with {param} placeholders, or functions (params) => string for plurals.
import en from "./en/index.js";
import es from "./es/index.js";

export const MESSAGES = Object.freeze({ en, es });
