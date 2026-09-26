import { useRef } from "react";
import { ArrowRight, Mic, MicOff, ScanSearch, Sparkles } from "lucide-react";
import { Button } from "../../primitives/Button.jsx";
import { Notice } from "../../primitives/Feedback.jsx";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition.js";
import { CoachPanel } from "./CoachPanel.jsx";
import { useLiveReview } from "./useLiveReview.js";

const SAVE_LABEL = { idle: "", saving: "Guardando…", saved: "Guardado", error: "No se pudo guardar" };

// 03 Parafrasear: explicación propia con autosave, dictado y coaching a pedido.
export function ParaphraseStage({ node, graph, data, go }) {
  const speech = useSpeechRecognition();
  const live = useLiveReview(graph.id, node, data);
  const latest = useRef(data.draft);
  latest.current = data.draft;
  const words = data.draft.trim() ? data.draft.trim().split(/\s+/).length : 0;
  const canReview = data.draft.trim().length >= 20;

  const dictate = () => speech.toggleListening((text) => {
    const current = latest.current;
    data.updateDraft(`${current}${current && !/\s$/.test(current) ? " " : ""}${text}`);
  });

  if (data.loading) return <div className="stage stage--paraphrase" aria-busy="true"><div className="editor editor--loading" /></div>;
  return (
    <div className="stage stage--paraphrase">
      <section className="editor-col">
        <header className="editor-col__head">
          <h2 className="stage__title">Explicalo con tus palabras</h2>
          <p className="t2">Como si se lo contaras a alguien en una entrevista: qué es, por qué existe, cómo lo aplicás y qué puede salir mal.</p>
        </header>
        {data.draftMeta?.isAiGenerated && (
          <Notice tone="info" icon={Sparkles}>Este borrador lo generó la IA. Reescribilo con tus palabras antes de evaluarte para que el puntaje refleje lo que sabés.</Notice>
        )}
        <textarea
          className="editor"
          value={data.draft}
          onChange={(e) => data.updateDraft(e.target.value)}
          placeholder={`Por ejemplo: "${node.label} sirve para…"`}
          aria-label="Tu explicación"
          spellCheck
        />
        <div className="editor__bar">
          <span className="t3 mono" aria-live="polite">{words} palabras{SAVE_LABEL[data.saveState] ? ` · ${SAVE_LABEL[data.saveState]}` : ""}</span>
          <div className="editor__actions">
            {speech.isSupported && (
              <Button variant={speech.isListening ? "danger" : "ghost"} icon={speech.isListening ? MicOff : Mic} onClick={dictate} aria-pressed={speech.isListening}>
                {speech.isListening ? "Detener dictado" : "Dictar"}
              </Button>
            )}
            <Button variant="secondary" icon={ScanSearch} onClick={live.run} loading={live.status === "loading"} loadingLabel="Revisando…"
              disabled={!canReview} disabledReason={!canReview ? "Escribí al menos un par de oraciones" : undefined}>Revisar con IA</Button>
            <Button variant="primary" iconRight={ArrowRight} onClick={() => go("evaluate")} disabled={!canReview} disabledReason={!canReview ? "Escribí tu explicación primero" : undefined}>
              Evaluar
            </Button>
          </div>
        </div>
      </section>
      <CoachPanel node={node} live={live} />
    </div>
  );
}
