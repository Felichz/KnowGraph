// Curriculum text per locale. Spanish is the base (src/reactGraph.js, src/logic/railsGraph.js);
// every other locale mirrors its text shape. Checked by scripts/i18n/check-i18n.mjs.
import react_meta from "./en/react/meta.js";
import react_nodes01 from "./en/react/nodes-01.js";
import react_nodes02 from "./en/react/nodes-02.js";
import react_nodes03 from "./en/react/nodes-03.js";
import react_nodes04 from "./en/react/nodes-04.js";
import react_nodes05 from "./en/react/nodes-05.js";
import react_nodes06 from "./en/react/nodes-06.js";
import react_nodes07 from "./en/react/nodes-07.js";
import react_nodes08 from "./en/react/nodes-08.js";
import react_nodes09 from "./en/react/nodes-09.js";
import rails_meta from "./en/rails/meta.js";
import rails_nodes01 from "./en/rails/nodes-01.js";
import rails_nodes02 from "./en/rails/nodes-02.js";
import rails_nodes03 from "./en/rails/nodes-03.js";

export const CONTENT_OVERLAYS = {
  en: {
    react: { meta: react_meta, nodes: { ...react_nodes01, ...react_nodes02, ...react_nodes03, ...react_nodes04, ...react_nodes05, ...react_nodes06, ...react_nodes07, ...react_nodes08, ...react_nodes09 } },
    rails: { meta: rails_meta, nodes: { ...rails_nodes01, ...rails_nodes02, ...rails_nodes03 } },
  },
};
