import { useRef } from "react";
import { useT } from "../../i18n/react.js";
import { NODE_H, NODE_W } from "./graphUtils.js";

const WIDTH = 248;

// Minimapa (specs/003-graph-view §E): el temario completo coloreado por estado y el recuadro
// de la vista actual. Pulsar o arrastrar mueve la cámara a ese punto.
export function GraphMinimap({ layout, states, isActive, bestId, view, size, done, total, onJump }) {
  const t = useT();
  const dragging = useRef(false);
  const s = WIDTH / layout.width;
  const height = Math.max(36, layout.height * s);
  const jump = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onJump((event.clientX - rect.left) / s, (event.clientY - rect.top) / s);
  };
  const vx = (-view.x / view.k) * s;
  const vy = (-view.y / view.k) * s;
  const vw = (size.width / view.k) * s;
  const vh = (size.height / view.k) * s;
  return (
    <div className="gpanel gminimap">
      <div className="gminimap__head">
        <span className="eyebrow">{t("graph.minimap.title")}</span>
        <span className="mono gminimap__count">{t("graph.minimap.mastered", { done, total })}</span>
      </div>
      <svg width={WIDTH} height={height} className="gminimap__svg" role="img" aria-label={t("graph.minimap.label", { done, total })}
        onPointerDown={(event) => { dragging.current = true; event.currentTarget.setPointerCapture?.(event.pointerId); jump(event); }}
        onPointerMove={(event) => { if (dragging.current) jump(event); }}
        onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
        {[...layout.positions.values()].map((pos) => (
          <rect key={pos.node.id} x={pos.x * s} y={pos.y * s} width={Math.max(2, NODE_W * s - 1)} height={Math.max(2, NODE_H * s - 1)} rx={1}
            className={`gmini is-${states.get(pos.node.id)?.kind} ${pos.node.id === bestId ? "is-best" : ""} ${isActive(pos.node.id) ? "" : "is-inactive"}`} />
        ))}
        <rect className="gminimap__view" x={vx} y={vy} width={vw} height={vh} rx={3} />
      </svg>
    </div>
  );
}
