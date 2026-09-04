import fs from "node:fs";
import path from "node:path";

function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.name.endsWith(".jsx") || entry.name.endsWith(".js")) {
      const content = fs.readFileSync(full, "utf8");
      const lines = content.split("\n").length;
      results.push({ path: full, lines });
    }
  }
  return results;
}

const targets = [
  ...collectFiles("src/components"),
  ...collectFiles("src/hooks"),
  { path: "src/App.jsx", lines: fs.readFileSync("src/App.jsx", "utf8").split("\n").length },
];

targets.sort((a, b) => b.lines - a.lines);

console.log("=== AUDITORÍA DE LÍNEAS POR COMPONENTE (Límite Constitución: 150 líneas) ===");
let violations = 0;
for (const item of targets) {
  const status = item.lines <= 150 ? "✅ OK" : "❌ VIOLACIÓN";
  if (item.lines > 150) violations++;
  console.log(`${status} [${item.lines.toString().padStart(3)} líneas] - ${item.path}`);
}

console.log(`\nTotal analizados: ${targets.length} archivos. Violaciones: ${violations}`);
if (violations > 0) {
  process.exit(1);
}
