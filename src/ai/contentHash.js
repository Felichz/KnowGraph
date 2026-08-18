/**
 * Hash estable del contenido "estudiable" de una card.
 * Si cambia el contenido de la card, cambia el hash, y los intentos
 * previos quedan marcados como "evaluados con una versión anterior".
 */
export function hashCardContent(node) {
  if (!node) return "sha256:empty";
  const lesson = node.lesson ?? {};
  const canonical = JSON.stringify({
    id: node.id,
    title: node.label ?? node.title ?? "",
    summary: lesson.summary ?? "",
    why: lesson.why ?? "",
    explanation: lesson.explanation ?? "",
    steps: lesson.steps ?? [],
    pitfalls: lesson.pitfalls ?? [],
    audit: lesson.audit ?? null,
  });
  return `sha256:${fnv1a64(canonical).toString(16)}`;
}

export function hashAnswer(answer) {
  return `draft:${fnv1a64(String(answer ?? "")).toString(16)}`;
}

export function hashReconcileInput(draft, messages = []) {
  const canonical = JSON.stringify({
    draft: String(draft ?? "").trim(),
    messages: (Array.isArray(messages) ? messages : []).map((m) => ({
      id: m?.id,
      role: m?.role,
      content: String(m?.content ?? "").trim(),
    })),
  });
  return `reconcile:${fnv1a64(canonical).toString(16)}`;
}

/**
 * FNV-1a 64-bit. No es criptográfico, pero es estable, chico y rápido.
 * Suficiente para detectar cambios de contenido del lado del cliente;
 * la veracidad la mantiene el modelo que evalúa contra ese contenido.
 */
function fnv1a64(input) {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const bytes = new TextEncoder().encode(input);
  for (let i = 0; i < bytes.length; i++) {
    hash ^= BigInt(bytes[i]);
    hash = (hash * prime) & 0xffffffffffffffffn;
  }
  return hash;
}
