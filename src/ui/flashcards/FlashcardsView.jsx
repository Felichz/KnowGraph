import { useMemo, useState } from "react";
import { Layers, Play } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Button } from "../primitives/Button.jsx";
import { Segmented } from "../primitives/Segmented.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { useReviews } from "../state/reviewStore.js";
import { Flashcard } from "./Flashcard.jsx";
import { FlashcardModal } from "./FlashcardModal.jsx";
import { dueNodes, resumeTarget } from "../../logic/studyQueue.js";

// Repasar (specs/007 §4): «Para hoy» o «Todas». Un solo modo — abrir una card es repasarla y valorarla —
// y el botón principal recorre las pendientes de hoy. Al terminar, la app propone volver a estudiar.
export function FlashcardsView({ model }) {
  const t = useT();
  const { graph, visible, progress, guidance } = model;
  const reviews = useReviews(graph.id);
  const due = useMemo(() => dueNodes(visible, progress, reviews.entries, reviews.today), [visible, progress, reviews.entries, reviews.today]);
  const all = useMemo(() => [...visible].sort((a, b) => a.priority - b.priority), [visible]);
  // Hasta que elijas, se abre en «Para hoy» si hay pendientes (el progreso puede cargar después).
  const [chosen, setFilter] = useState(null);
  const filter = chosen ?? (due.length ? "due" : "all");
  const [session, setSession] = useState(null); // { deck, index }
  const cards = filter === "due" ? due : all;
  const resume = resumeTarget(visible, progress);
  const nextStudy = resume ?? (guidance.primary ? { node: guidance.primary, stage: "read" } : null);
  const open = (deck, index) => setSession({ deck: [...deck], index });

  return (
    <div className="flash">
      <header className="view-head">
        <div>
          <h2 className="view-head__title">{t("flashcards.view.title")}</h2>
          <p className="t2">{t("flashcards.view.help")}</p>
        </div>
        {due.length > 0 && (
          <Button variant="primary" size="lg" icon={Play} onClick={() => open(due, 0)}>{t("flashcards.view.reviewDue", { n: due.length })}</Button>
        )}
      </header>
      <Segmented label={t("flashcards.filters.label")} value={filter} onChange={setFilter} className="flash__filters"
        options={[{ value: "due", label: `${t("flashcards.filters.due")} · ${due.length}` }, { value: "all", label: `${t("flashcards.filters.all")} · ${all.length}` }]} />
      {cards.length === 0 ? (
        <EmptyState icon={Layers} title={t("flashcards.view.dueEmptyTitle")}
          action={<Button onClick={() => setFilter("all")}>{t("flashcards.view.showAll")}</Button>}>
          {t("flashcards.view.dueEmptyBody")}
        </EmptyState>
      ) : (
        <ul className="flash__grid">
          {cards.map((node, i) => (
            <li key={node.id}>
              <Flashcard node={node} graph={graph} p={progress.of(node.id)} entry={reviews.entries[node.id]} today={reviews.today} onOpen={() => open(cards, i)} />
            </li>
          ))}
        </ul>
      )}
      {session && (
        <FlashcardModal cards={session.deck} index={session.index} graph={graph} progress={progress} nextStudy={nextStudy}
          onIndex={(index) => setSession((s) => ({ ...s, index }))} onRate={reviews.rate} onClose={() => setSession(null)} />
      )}
    </div>
  );
}
