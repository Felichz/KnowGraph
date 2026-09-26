import { ArrowRight, Check } from "lucide-react";
import { getLessonContext, getNodeNeighbors } from "../../../logic/guidance.js";
import { actions } from "../../state/useWorkspace.js";

function NodeLink({ item, done }) {
  return (
    <li>
      <button type="button" className="rail-link" onClick={() => actions.openCard(item.id, { remember: true })}>
        {done ? <Check size={14} strokeWidth={2} className="rail-link__done" aria-label="Dominada" /> : <span className="rail-link__dot" aria-hidden="true" />}
        <span className="clamp-2">{item.label}</span>
        <ArrowRight size={14} strokeWidth={1.5} className="rail-link__arrow" aria-hidden="true" />
      </button>
    </li>
  );
}

// Riel de contexto: dónde encaja la card, qué necesita, qué habilita y preguntas de entrevista.
export function ContextRail({ node, graph, model }) {
  const { checked } = model.progress;
  const n = getNodeNeighbors(graph, node, model.activeCats, checked);
  const prerequisites = node.prerequisites.map((id) => graph.nodeById?.get(id)).filter(Boolean);
  const context = getLessonContext(node, prerequisites, n.missing, graph.categoryContext);
  const related = (node.lesson?.related ?? []).map((id) => graph.nodeById?.get(id)).filter(Boolean);
  const questions = node.interviewQuestions ?? [];
  return (
    <aside className="context-rail" aria-label="Contexto de la card">
      <section className="context-rail__block">
        <h2 className="eyebrow">Dónde encaja</h2>
        <p className="t2">{context}</p>
      </section>
      {prerequisites.length > 0 && (
        <section className="context-rail__block">
          <h2 className="eyebrow">Necesita</h2>
          <ul>{prerequisites.map((item) => <NodeLink key={item.id} item={item} done={checked.has(item.id)} />)}</ul>
        </section>
      )}
      {n.after.length > 0 && (
        <section className="context-rail__block">
          <h2 className="eyebrow">Habilita</h2>
          <ul>{n.after.map((item) => <NodeLink key={item.id} item={item} done={checked.has(item.id)} />)}</ul>
        </section>
      )}
      {related.length > 0 && (
        <section className="context-rail__block">
          <h2 className="eyebrow">Relacionadas</h2>
          <ul>{related.map((item) => <NodeLink key={item.id} item={item} done={checked.has(item.id)} />)}</ul>
        </section>
      )}
      {questions.length > 0 && (
        <section className="context-rail__block">
          <h2 className="eyebrow">Preguntas de entrevista</h2>
          <ul className="context-rail__questions">{questions.map((q) => <li key={q.id}><span className="mono t3">#{q.id}</span> {q.title}</li>)}</ul>
        </section>
      )}
    </aside>
  );
}
