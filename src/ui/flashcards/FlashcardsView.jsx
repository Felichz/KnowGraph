import { useMemo, useState } from "react";
import { Layers, Play } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Button } from "../primitives/Button.jsx";
import { Segmented } from "../primitives/Segmented.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { useReviews } from "../state/reviewStore.js";
import { Flashcard } from "./Flashcard.jsx";
import { PracticeDialog } from "./PracticeDialog.jsx";
import { FlashcardModal } from "./FlashcardModal.jsx";
import { dueNodes, reviewOrder } from "../../logic/studyQueue.js";

const FILTERS = [
  { value: "due", labelKey: "flashcards.filters.due" },
  { value: "all", labelKey: "flashcards.filters.all" },
  { value: "pending", labelKey: "flashcards.filters.pending" },
  { value: "below", labelKey: "flashcards.filters.below" },
  { value: "mastery", labelKey: "flashcards.filters.mastery" },
];

function matches(filter, p) {
  if (filter === "pending") return !p.attempts.length;
  if (filter === "below") return p.attempts.length > 0 && !p.isComplete;
  if (filter === "mastery") return p.isComplete;
  return true;
}

// Flashcards (US6 + specs/006): repaso espaciado («Para hoy»), rejilla con estado de nota, modal navegable
// y práctica autoevaluada que reprograma cada card según la valoración.
export function FlashcardsView({ model }) {
  const t = useT();
  const { graph, visible, progress } = model;
  const reviews = useReviews(graph.id);
  const due = useMemo(() => dueNodes(visible, progress, reviews.entries, reviews.today), [visible, progress, reviews.entries, reviews.today]);
  // Hasta que elijas un filtro, se abre en «Para hoy» si hay pendientes (el progreso puede cargar después).
  const [chosen, setFilter] = useState(null);
  const filter = chosen ?? (due.length ? "due" : "all");
  const [practice, setPractice] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const cards = useMemo(() => (filter === "due" ? due
    : visible.filter((n) => matches(filter, progress.of(n.id))).sort((a, b) => a.priority - b.priority)), [visible, filter, progress, due]);
  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.value,
    f.value === "due" ? due.length : visible.filter((n) => matches(f.value, progress.of(n.id))).length])), [visible, progress, due]);
  const startPractice = () => setPractice(filter === "due" ? cards : reviewOrder(cards, progress));

  return (
    <div className="flash">
      <header className="view-head">
        <div>
          <h2 className="view-head__title">{t("flashcards.view.title")}</h2>
          <p className="t2">{t("flashcards.view.help")}</p>
        </div>
        <Button variant="primary" icon={Play} onClick={startPractice} disabled={!cards.length}>
          {filter === "due" ? t("flashcards.view.reviewDue", { n: cards.length }) : t("flashcards.view.practice", { n: cards.length })}
        </Button>
      </header>
      <Segmented label={t("flashcards.filters.label")} value={filter} onChange={setFilter} className="flash__filters"
        options={FILTERS.map((f) => ({ value: f.value, label: `${t(f.labelKey)} · ${counts[f.value]}` }))} />
      {cards.length === 0 ? (
        <EmptyState icon={Layers} title={t(filter === "due" ? "flashcards.view.dueEmptyTitle" : "flashcards.view.emptyTitle")}
          action={filter !== "all" ? <Button onClick={() => setFilter("all")}>{t("flashcards.view.showAll")}</Button> : null}>
          {t(filter === "due" ? "flashcards.view.dueEmptyBody" : "flashcards.view.emptyBody")}
        </EmptyState>
      ) : (
        <ul className="flash__grid">
          {cards.map((node, i) => <li key={node.id}><Flashcard node={node} graph={graph} p={progress.of(node.id)} entry={reviews.entries[node.id]} today={reviews.today} onOpen={() => setOpenIndex(i)} /></li>)}
        </ul>
      )}
      {practice && <PracticeDialog cards={practice} graph={graph} progress={progress} onRate={reviews.rate} onClose={() => setPractice(null)} />}
      {openIndex !== null && cards[openIndex] && (
        <FlashcardModal cards={cards} index={openIndex} graph={graph} progress={progress} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
}
