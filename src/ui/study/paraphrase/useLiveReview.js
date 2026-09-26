import { useCallback, useEffect, useRef, useState } from "react";
import { liveReviewStream, userFacingAiError } from "../../../ai/client.js";
import { getLiveReview, saveLiveReview } from "../../../ai/learningStore.js";
import { hashAnswer } from "../../../ai/contentHash.js";
import { normalizeLiveReviewState } from "../../../ai/liveReview.js";

// Revisión en vivo del borrador: pista siguiente + cobertura del checklist (a pedido).
export function useLiveReview(graphId, node, data) {
  const [review, setReview] = useState(null);
  const [reviewHash, setReviewHash] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);
  const abort = useRef(null);

  useEffect(() => {
    let alive = true;
    getLiveReview(graphId, node.id).then((saved) => {
      if (!alive || !saved || saved.contentHash !== data.contentHash) return;
      setReview(normalizeLiveReviewState(saved.review));
      setReviewHash(saved.answerHash);
    }).catch(() => {});
    return () => { alive = false; abort.current?.abort(); };
  }, [graphId, node.id, data.contentHash]);

  const run = useCallback(async () => {
    const answer = data.draft.trim();
    if (answer.length < 20) return;
    abort.current?.abort();
    abort.current = new AbortController();
    setStatus("loading"); setError(null);
    try {
      const result = await liveReviewStream({
        graphId, nodeId: node.id, answer, contentHash: data.contentHash, node, provider: data.provider, signal: abort.current.signal,
      });
      const next = normalizeLiveReviewState(result.review);
      const answerHash = hashAnswer(answer);
      setReview(next); setReviewHash(answerHash); setStatus("idle");
      saveLiveReview({ graphId, nodeId: node.id, answerHash, contentHash: data.contentHash, review: result.review }).catch(() => {});
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(userFacingAiError(err, "No se pudo revisar el borrador.")); setStatus("error");
    }
  }, [graphId, node, data.draft, data.contentHash, data.provider]);

  const stale = Boolean(review && reviewHash && reviewHash !== hashAnswer(data.draft.trim()));
  return { review, stale, status, error, run };
}
