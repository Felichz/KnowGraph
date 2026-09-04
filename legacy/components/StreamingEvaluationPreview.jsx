import { displayScoreFromRaw } from "../ai/types.js";

const RUBRIC = [
  ["accuracy", "Precisión", 40],
  ["causalityAndTradeoffs", "Causas y trade-offs", 25],
  ["application", "Aplicación", 20],
  ["completeness", "Completitud", 15],
];

export function StreamingEvaluationPreview({ sections = {}, blocks = {} }) {
  const live = buildLiveSections(sections, blocks);
  const rubric = live.rubric;
  const hasAnySection = Object.keys(sections).length > 0 || Object.keys(blocks).length > 0;
  const streamingScore = getStreamingScore(rubric, blocks);

  return (
    <div className="streaming-preview" aria-label="Feedback parcial de la evaluación">
      <div className="streaming-preview__heading">
        <span className="streaming-preview__eyebrow">FEEDBACK EN VIVO</span>
        <span className="streaming-preview__hint">
          {hasAnySection ? "El modelo ya completó algunas secciones" : "Preparando las secciones..."}
        </span>
      </div>

      {streamingScore && (
        <section className={`streaming-preview__total ${streamingScore.isExtra ? "is-extra" : ""}`}>
          <div>
            <span className="streaming-preview__total-label">SCORE PROVISIONAL</span>
            <strong>{streamingScore.displayScore}/120</strong>
          </div>
          <div className="streaming-preview__total-track">
            <span className="streaming-preview__total-fill" style={{ width: `${(streamingScore.displayScore / 120) * 100}%` }} />
            {streamingScore.isExtra && <span className="streaming-preview__total-extra" style={{ width: `${((streamingScore.displayScore - 100) / 120) * 100}%` }} />}
            <span className="streaming-preview__total-threshold" aria-hidden="true" />
          </div>
          <p>{streamingScore.isFormulaReady ? "Los subscores recibidos ya permiten calcularlo; se confirma al terminar la evaluación." : "Base cubierta; esperando los subscores para calcular la profundidad extra."}</p>
        </section>
      )}

      <section className="streaming-preview__section">
        <h4>Rúbrica <span className="streaming-preview__live-badge">SUBSCORES EN VIVO</span></h4>
        <div className="streaming-preview__rubric">
          {RUBRIC.map(([key, label, max]) => {
            const item = rubric?.[key];
            const hasScore = Number.isFinite(item?.score) && Number.isFinite(item?.max) && item.max > 0;
            const visibleScore = hasScore ? displayScoreFromRaw((item.score / item.max) * 100) : 0;
            const baseWidth = `${Math.min(100, visibleScore) / 120 * 100}%`;
            const extraWidth = `${Math.max(0, visibleScore - 100) / 120 * 100}%`;
            return (
              <div className="streaming-preview__rubric-row" key={key}>
                <span>{label}</span>
                {item && hasScore ? (
                  <>
                    <div className="streaming-preview__score-track">
                      <span className="streaming-preview__score-fill" style={{ width: baseWidth }} />
                      {visibleScore > 100 && <span className="streaming-preview__score-extra" style={{ width: extraWidth }} />}
                      <span className="streaming-preview__score-threshold" aria-hidden="true" />
                    </div>
                    <strong>{visibleScore}/120</strong>
                    <p>{item.note || <span className="streaming-skeleton streaming-skeleton--note" />}</p>
                  </>
                ) : (
                  <>
                    <span className="streaming-skeleton streaming-skeleton--bar" />
                    <span className="streaming-skeleton streaming-skeleton--score" />
                    <span className="streaming-skeleton streaming-skeleton--note" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <PreviewTextSection title="Fortalezas" value={live.strengths} kind="list" />
      <PreviewTextSection title="Puntos a revisar" value={live.gaps} kind="gaps" />
      <PreviewTextSection title="Posibles confusiones" value={live.misconceptions} kind="misconceptions" />
      <PreviewTextSection title="Siguiente intento" value={live.nextAttemptPrompt} />
      <PreviewTextSection title="Veredicto" value={live.conciseVerdict} />
    </div>
  );
}

function getStreamingScore(rubric, blocks) {
  const completion = rubric?.completeness;
  const completionScoreBlock = blocks["scoreSummary.rubric.completeness.score"];
  const completionMaxBlock = blocks["scoreSummary.rubric.completeness.max"];
  const completionReady = completionScoreBlock?.complete && completionMaxBlock?.complete
    && Number.isFinite(completion?.score) && Number.isFinite(completion?.max) && completion.max > 0;
  if (!completionReady) return null;

  const coverage = Math.max(0, Math.min(100, Math.round((completion.score / completion.max) * 100)));
  const allScoresReady = RUBRIC.every(([key]) => blocks[`scoreSummary.rubric.${key}.score`]?.complete && Number.isFinite(rubric?.[key]?.score));
  const rawScore = RUBRIC.reduce((sum, [key]) => sum + (Number(rubric?.[key]?.score) || 0), 0);
  const displayScore = coverage < 100
    ? coverage
    : allScoresReady
      ? 100 + Math.max(0, Math.min(20, Math.round(rawScore) - 80))
      : 100;

  return {
    coverage,
    displayScore,
    isExtra: displayScore > 100,
    isFormulaReady: coverage < 100 || allScoresReady,
  };
}

function buildLiveSections(sections, blocks) {
  const live = { ...sections };
  const get = (id) => blocks[id]?.value;
  const has = (id) => Object.prototype.hasOwnProperty.call(blocks, id);

  const rubric = { ...(sections.scoreSummary?.rubric ?? sections.rubric ?? {}) };
  for (const key of RUBRIC.map(([name]) => name)) {
    const scoreId = `scoreSummary.rubric.${key}.score`;
    const maxId = `scoreSummary.rubric.${key}.max`;
    const noteId = `feedback.rubricNotes.${key}`;
    if (!has(scoreId) && !has(maxId) && !has(noteId)) continue;
    const previous = rubric[key] ?? {};
    rubric[key] = {
      ...previous,
      score: toNumber(get(scoreId), previous.score),
      max: toNumber(get(maxId), previous.max),
      note: has(noteId) ? get(noteId) : previous.note,
    };
  }
  if (Object.keys(rubric).length > 0) live.rubric = rubric;

  const strengthEntries = entriesFor(blocks, /^feedback\.strengths\[(\d+)\]$/);
  if (strengthEntries.length > 0) live.strengths = strengthEntries.map(([, block]) => block.value);

  const gapEntries = objectEntries(blocks, "feedback.gaps", ["topic", "explanation", "revisionHint"]);
  if (gapEntries.length > 0) live.gaps = gapEntries.map((item) => ({
    topic: item.topic?.value ?? "",
    explanation: item.explanation?.value ?? "",
    revisionHint: item.revisionHint?.value ?? "",
  }));

  const misconceptionEntries = objectEntries(blocks, "feedback.misconceptions", ["quote", "correction"]);
  if (misconceptionEntries.length > 0) live.misconceptions = misconceptionEntries.map((item) => ({
    quote: item.quote?.value ?? "",
    correction: item.correction?.value ?? "",
  }));

  for (const key of ["nextAttemptPrompt", "conciseVerdict"]) {
    const id = `feedback.${key}`;
    if (has(id)) live[key] = get(id);
  }
  return live;
}

function entriesFor(blocks, pattern) {
  return Object.entries(blocks)
    .map(([id, block]) => [id.match(pattern), block])
    .filter(([match]) => match)
    .sort((a, b) => Number(a[0][1]) - Number(b[0][1]));
}

function objectEntries(blocks, root, fields) {
  const indexes = new Set();
  const escapedRoot = root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escapedRoot}\\[(\\d+)\\]\\.(${fields.join("|")})$`);
  const grouped = new Map();
  for (const [id, block] of Object.entries(blocks)) {
    const match = id.match(pattern);
    if (!match) continue;
    indexes.add(Number(match[1]));
    if (!grouped.has(match[1])) grouped.set(match[1], {});
    grouped.get(match[1])[match[2]] = block;
  }
  return [...indexes].sort((a, b) => a - b).map((index) => grouped.get(String(index)));
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function PreviewTextSection({ title, value, kind }) {
  return (
    <section className="streaming-preview__section">
      <h4>{title}</h4>
      {value ? (
        kind === "list" ? (
          <ul>{value.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>
        ) : kind === "gaps" ? (
          <ul>{value.map((item, index) => <li key={`${index}-${item.topic}`}><strong>{item.topic}:</strong> {item.explanation}</li>)}</ul>
        ) : kind === "misconceptions" ? (
          <ul>{value.map((item, index) => <li key={`${index}-${item.correction}`}><strong>{item.quote ? `“${item.quote}” ` : ""}</strong>{item.correction}</li>)}</ul>
        ) : (
          <p>{value}</p>
        )
      ) : (
        <span className="streaming-skeleton streaming-skeleton--text" />
      )}
    </section>
  );
}
