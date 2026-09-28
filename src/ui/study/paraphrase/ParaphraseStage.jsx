import { useRef } from "react";
import { ArrowRight, Mic, MicOff, ScanSearch, Sparkles } from "lucide-react";
import { useT } from "../../../i18n/react.js";
import { Button } from "../../primitives/Button.jsx";
import { Notice } from "../../primitives/Feedback.jsx";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition.js";
import { CoachPanel } from "./CoachPanel.jsx";
import { useLiveReview } from "./useLiveReview.js";

const SAVE_KEY = { saving: "study.paraphrase.save.saving", saved: "study.paraphrase.save.saved", error: "study.paraphrase.save.error" };

// 03 Parafrasear: explicación propia con autosave, dictado y coaching a pedido.
export function ParaphraseStage({ node, graph, data, go }) {
  const t = useT();
  const speech = useSpeechRecognition();
  const live = useLiveReview(graph.id, node, data);
  const latest = useRef(data.draft);
  latest.current = data.draft;
  const words = data.draft.trim() ? data.draft.trim().split(/\s+/).length : 0;
  const canReview = data.draft.trim().length >= 20;
  const saveLabel = SAVE_KEY[data.saveState] ? t(SAVE_KEY[data.saveState]) : "";

  const dictate = () => speech.toggleListening((text) => {
    const current = latest.current;
    data.updateDraft(`${current}${current && !/\s$/.test(current) ? " " : ""}${text}`);
  });

  if (data.loading) return <div className="stage stage--paraphrase" aria-busy="true"><div className="editor editor--loading" /></div>;
  return (
    <div className="stage stage--paraphrase">
      <section className="editor-col">
        <header className="editor-col__head">
          <h2 className="stage__title">{t("study.paraphrase.title")}</h2>
          <p className="t2">{t("study.paraphrase.intro")}</p>
        </header>
        {data.draftMeta?.isAiGenerated && (
          <Notice tone="info" icon={Sparkles}>{t("study.paraphrase.aiDraftNotice")}</Notice>
        )}
        <textarea
          className="editor"
          value={data.draft}
          onChange={(e) => data.updateDraft(e.target.value)}
          placeholder={t("study.paraphrase.placeholder", { label: node.label })}
          aria-label={t("study.paraphrase.editorLabel")}
          spellCheck
        />
        <div className="editor__bar">
          <span className="t3 mono" aria-live="polite">{t("study.paraphrase.words", { n: words })}{saveLabel ? ` · ${saveLabel}` : ""}</span>
          <div className="editor__actions">
            {speech.isSupported && (
              <Button variant={speech.isListening ? "danger" : "ghost"} icon={speech.isListening ? MicOff : Mic} onClick={dictate} aria-pressed={speech.isListening}>
                {speech.isListening ? t("study.paraphrase.stopDictation") : t("study.paraphrase.dictate")}
              </Button>
            )}
            <Button variant="secondary" icon={ScanSearch} onClick={live.run} loading={live.status === "loading"} loadingLabel={t("study.paraphrase.reviewing")}
              disabled={!canReview} disabledReason={!canReview ? t("study.paraphrase.minSentences") : undefined}>{t("study.paraphrase.review")}</Button>
            <Button variant="primary" iconRight={ArrowRight} onClick={() => go("evaluate")} disabled={!canReview} disabledReason={!canReview ? t("study.paraphrase.writeFirst") : undefined}>
              {t("common.stages.evaluate")}
            </Button>
          </div>
        </div>
      </section>
      <CoachPanel node={node} live={live} />
    </div>
  );
}
