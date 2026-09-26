import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, IconButton } from "../primitives/Button.jsx";
import { ScoreRail } from "../primitives/Score.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { useIsMobile } from "../hooks/useMediaQuery.js";
import { actions } from "../state/useWorkspace.js";
import { RouteRow } from "./RouteRow.jsx";
import { useStageOf } from "./useStageOf.js";

// Ruta sugerida: Ahora / Después / Más adelante (INF-020…026, R2).
export function SuggestedRoute({ model }) {
  const mobile = useIsMobile();
  const { guidance, graph, progress } = model;
  const stageOf = useStageOf(graph);
  if (!guidance.primary) {
    return (
      <section className="route route--done" aria-labelledby="route-title">
        <h2 id="route-title" className="sr-only">Ruta sugerida</h2>
        <EmptyState icon={CheckCircle2} title="Ruta completada" compact
          action={<Button variant="primary" onClick={() => actions.setView("progress")}>Ver progreso</Button>}>
          Todas las cards de este foco están dominadas.
        </EmptyState>
      </section>
    );
  }
  if (mobile) return <MobileRoute model={model} stageOf={stageOf} />;
  const [, later, after] = guidance.levels;
  return (
    <section className="route" aria-labelledby="route-title">
      <div className="route__head">
        <h2 id="route-title" className="eyebrow">Ruta sugerida</h2>
        <p className="route__help">Las flechas muestran qué concepto habilita al siguiente. <span className="t3">{graph.subtitle}</span></p>
        {graph.interviewQuestions?.length ? (
          <a className="route__ref" href={graph.interviewQuestionSource} target="_blank" rel="noreferrer noopener">
            {graph.interviewQuestions.length}/110 preguntas de referencia trazadas al mapa <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <div className="route__grid">
        <RouteNow node={guidance.primary} graph={graph} progress={progress} stage={stageOf(guidance.primary.id)} />
        <RouteColumn title="Después" nodes={later} progress={progress} />
        <RouteColumn title="Más adelante" nodes={after} progress={progress} />
      </div>
    </section>
  );
}

function RouteNow({ node, graph, progress, stage, footer }) {
  const p = progress.of(node.id);
  return (
    <article className="route-now card">
      <div className="route-now__top">
        <p className="eyebrow">Ahora</p>
        <CategoryLabel graph={graph} cat={node.cat} className="route-now__cat" />
      </div>
      <h3 className="route-now__title clamp-2">{node.label}</h3>
      <ScoreRail score={p.displayScore} />
      <div className="route-now__meta">
        <span className="route-now__stage clamp-1">Etapa {stage.rank} de {stage.total} · Prioridad #{node.priority}</span>
        <Button variant="primary" size="md" iconRight={ArrowRight} minWidth={148} onClick={() => actions.openCard(node.id)}>
          {footer ? "Estudiar" : "Estudiar ahora"}
        </Button>
      </div>
      {footer}
    </article>
  );
}

function RouteColumn({ title, nodes, progress }) {
  return (
    <div className="route-col">
      <h3 className="eyebrow">{title}</h3>
      {nodes.length ? (
        <ul className="route-col__list">
          {nodes.map((node) => <li key={node.id}><RouteRow node={node} p={progress.of(node.id)} onOpen={() => actions.openCard(node.id)} /></li>)}
        </ul>
      ) : <p className="route-col__empty">No hay nodos disponibles</p>}
    </div>
  );
}

function MobileRoute({ model, stageOf }) {
  const steps = model.guidance.levels.flat().slice(0, 9);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [model.graphId, model.focusCat]);
  const node = steps[Math.min(index, steps.length - 1)];
  const stepper = (
    <div className="route-now__stepper">
      <IconButton icon={ChevronLeft} size="md" label="Concepto anterior" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} />
      <span className="mono t2">{index + 1}/{steps.length}</span>
      <IconButton icon={ChevronRight} size="md" label="Concepto siguiente" disabled={index >= steps.length - 1} onClick={() => setIndex((i) => i + 1)} />
    </div>
  );
  return (
    <section className="route route--mobile" aria-label="Ruta sugerida">
      <RouteNow node={node} graph={model.graph} progress={model.progress} stage={stageOf(node.id)} footer={stepper} />
    </section>
  );
}
