import { ArrowRight, ArrowUpRight, Crosshair, Maximize, Minus, Plus } from "lucide-react";
import { Button, IconButton } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";

function names(layout, ids) {
  return [...ids].map((id) => layout.positions.get(id)?.node.label).filter(Boolean);
}

// Overlays flotantes del grafo: lectura, controles, leyenda y panel táctil (INF-044…047).
export function GraphOverlays({ graph, layout, inspected, primary, stageOf, mobile, onPrimary, onFit, onZoom, selectedNode, onStudy, hasCycle }) {
  const node = inspected ? layout.positions.get(inspected)?.node : null;
  const parents = node ? names(layout, layout.parents.get(node.id) ?? []) : [];
  const children = node ? names(layout, layout.children.get(node.id) ?? []) : [];
  const stageFor = node ?? primary;
  return (
    <>
      <section className="gpanel gpanel--read" aria-live="polite">
        {node ? (
          <>
            <p className="gpanel__title">{node.label}</p>
            <p className="gpanel__text"><span className="t3">Necesita</span> {parents.length ? parents.join(", ") : "nada: es punto de partida"}</p>
            <p className="gpanel__text"><span className="t3">Habilita</span> {children.length ? children.join(", ") : "ningún concepto directo"}</p>
          </>
        ) : (
          <>
            <p className="gpanel__title">Ruta sugerida</p>
            <p className="gpanel__text">Mostramos solo el próximo avance. Pasá por un nodo o seleccionalo para ver sus relaciones directas.</p>
          </>
        )}
        {hasCycle && <Notice tone="warn">Detectamos un ciclo en las dependencias; algunas flechas pueden verse fuera de orden.</Notice>}
      </section>
      <div className="gpanel gpanel--controls">
        {stageFor && <span className="gpanel__stage mono">Etapa {stageOf(stageFor.id)} de {layout.maxRank + 1}</span>}
        <div className="gpanel__group" role="group" aria-label="Controles del mapa">
          <IconButton icon={Crosshair} label="Próximo foco" onClick={onPrimary} />
          <IconButton icon={Maximize} label="Ver el mapa completo" onClick={onFit} />
          <IconButton icon={Minus} label="Alejar" onClick={() => onZoom(1 / 1.16)} />
          <IconButton icon={Plus} label="Acercar" onClick={() => onZoom(1.16)} />
        </div>
      </div>
      {!mobile && (
        <div className="gpanel gpanel--legend" aria-label="Leyenda">
          <span><span className="glegend glegend--line" /> Ruta sugerida</span>
          <span><span className="glegend glegend--dash" /> Necesita</span>
          <span className="glegend-text"><span className="is-mastery">✓</span> Dominada · <span className="is-gold">★</span> Extra</span>
          <span className="t3 gpanel__sub clamp-1">{graph.subtitle}</span>
          {graph.interviewQuestions?.length ? (
            <a href={graph.interviewQuestionSource} target="_blank" rel="noreferrer noopener">{graph.interviewQuestions.length}/110 preguntas de referencia <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" /></a>
          ) : null}
        </div>
      )}
      {selectedNode && (
        <div className="gpanel gpanel--selected">
          <p className="gpanel__title clamp-2">{selectedNode.label}</p>
          <Button variant="primary" iconRight={ArrowRight} onClick={() => onStudy(selectedNode.id)}>Estudiar</Button>
        </div>
      )}
    </>
  );
}
