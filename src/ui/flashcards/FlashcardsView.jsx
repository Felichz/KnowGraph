import { useMemo, useState } from "react";
import { Layers, Play } from "lucide-react";
import { Button } from "../primitives/Button.jsx";
import { Segmented } from "../primitives/Segmented.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { Flashcard } from "./Flashcard.jsx";
import { PracticeDialog } from "./PracticeDialog.jsx";

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Sin intento" },
  { value: "below", label: "Base < 100" },
  { value: "mastery", label: "Dominadas" },
];

function matches(filter, p) {
  if (filter === "pending") return !p.attempts.length;
  if (filter === "below") return p.attempts.length > 0 && !p.isComplete;
  if (filter === "mastery") return p.isComplete;
  return true;
}

// Flashcards (US6): repaso rápido de las cards del foco con volteo y práctica autoevaluada.
export function FlashcardsView({ model }) {
  const { graph, visible, progress } = model;
  const [filter, setFilter] = useState("all");
  const [practice, setPractice] = useState(false);
  const cards = useMemo(() => visible.filter((n) => matches(filter, progress.of(n.id))).sort((a, b) => a.priority - b.priority), [visible, filter, progress]);
  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.value, visible.filter((n) => matches(f.value, progress.of(n.id))).length])), [visible, progress]);

  return (
    <div className="flash">
      <header className="view-head">
        <div>
          <h2 className="view-head__title">Repaso</h2>
          <p className="t2">Tocá una card para darla vuelta. En práctica, respondé mentalmente y autoevaluate.</p>
        </div>
        <Button variant="primary" icon={Play} onClick={() => setPractice(true)} disabled={!cards.length}>Practicar {cards.length}</Button>
      </header>
      <Segmented label="Filtrar flashcards" value={filter} onChange={setFilter} className="flash__filters"
        options={FILTERS.map((f) => ({ ...f, label: `${f.label} · ${counts[f.value]}` }))} />
      {cards.length === 0 ? (
        <EmptyState icon={Layers} title="No hay cards en este filtro" action={filter !== "all" ? <Button onClick={() => setFilter("all")}>Ver todas</Button> : null}>
          Cambiá el filtro o el foco para ver otras cards.
        </EmptyState>
      ) : (
        <ul className="flash__grid">
          {cards.map((node) => <li key={node.id}><Flashcard node={node} graph={graph} p={progress.of(node.id)} /></li>)}
        </ul>
      )}
      {practice && <PracticeDialog cards={cards} graph={graph} progress={progress} onClose={() => setPractice(false)} />}
    </div>
  );
}
