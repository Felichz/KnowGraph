import { useEffect, useRef, useState } from "react";
import { ArrowRight, Send, Sparkles } from "lucide-react";
import { coachChatStream, userFacingAiError } from "../../../ai/client.js";
import { useT } from "../../../i18n/react.js";
import { Button } from "../../primitives/Button.jsx";
import { Markdown } from "../../primitives/Markdown.jsx";
import { Notice } from "../../primitives/Feedback.jsx";
import { TaskStatus } from "../TaskStatus.jsx";

const STARTERS = ["analogy", "interview", "commonMistake", "checkUnderstanding"].map((id) => `study.mentor.starters.${id}`);
const key = (graphId, nodeId) => `lw:mentor:${graphId}:${nodeId}`;
const load = (k) => { try { return JSON.parse(sessionStorage.getItem(k)) ?? []; } catch { return []; } };

// 02 Mentor IA: chat socrático sobre la card (coachChatStream) + borrador de referencia (harness).
export function MentorStage({ node, graph, data, go }) {
  const t = useT();
  const storeKey = key(graph.id, node.id);
  const [messages, setMessages] = useState(() => load(storeKey));
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(null); // texto en streaming
  const [error, setError] = useState(null);
  const abort = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { try { sessionStorage.setItem(storeKey, JSON.stringify(messages.slice(-30))); } catch { /* sin storage */ } }, [messages, storeKey]);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => { listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight }); }, [messages, pending]);

  async function ask(question) {
    const q = question.trim();
    if (!q || pending !== null) return;
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput(""); setError(null); setPending("");
    abort.current = new AbortController();
    try {
      let acc = "";
      const result = await coachChatStream({
        graphId: graph.id, nodeId: node.id, answer: data.draft, contentHash: data.contentHash, node,
        review: null, history, question: q, provider: data.provider, signal: abort.current.signal,
        onDelta: (delta) => { acc += delta; setPending(acc); },
      });
      setMessages((m) => [...m, { role: "assistant", content: result.message.content }]);
    } catch (err) {
      if (err?.name !== "AbortError") setError(userFacingAiError(err, t("study.mentor.error")));
    } finally { setPending(null); }
  }

  const harnessRunning = data.task?.status === "running" && data.task.type === "pedagogical_harness";
  const [introBefore, introAfter = ""] = t("study.mentor.introTitle").split("{concept}");
  return (
    <div className="stage stage--mentor">
      <section className="chat" aria-label={t("study.mentor.chatLabel")}>
        <div className="chat__list" ref={listRef} aria-live="polite">
          {messages.length === 0 && pending === null && (
            <div className="chat__intro">
              <p className="serif chat__intro-title">{introBefore}<em>{node.label}</em>{introAfter}</p>
              <p className="t2">{t("study.mentor.introBody")}</p>
              <div className="chips">{STARTERS.map((k) => { const s = t(k); return <button key={k} type="button" className="chip" onClick={() => ask(s)}>{s}</button>; })}</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`msg msg--${m.role}`}>{m.role === "assistant" ? <Markdown text={m.content} /> : <p>{m.content}</p>}</div>
          ))}
          {pending !== null && <div className="msg msg--assistant is-streaming">{pending ? <Markdown text={pending} /> : <p className="t3">{t("study.mentor.thinking")}</p>}</div>}
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
          <textarea className="composer__input" rows={1} placeholder={t("study.mentor.placeholder")} value={input} aria-label={t("study.mentor.inputLabel")}
            onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); } }} />
          <Button type="submit" variant="primary" icon={Send} loading={pending !== null} disabled={!input.trim()}>{t("study.mentor.send")}</Button>
        </form>
      </section>
      <aside className="mentor-side">
        <section className="side-card">
          <h2 className="side-card__title"><Sparkles size={16} strokeWidth={1.5} aria-hidden="true" /> {t("study.mentor.reference.title")}</h2>
          <p className="t2">{t("study.mentor.reference.body")}</p>
          <TaskStatus task={data.task?.type === "pedagogical_harness" ? data.task : null} onCancel={data.cancelTask} onDismiss={data.dismissTask} onRetry={data.runHarness} />
          {!harnessRunning && <Button variant="secondary" icon={Sparkles} onClick={data.runHarness}>{t("study.mentor.reference.generate")}</Button>}
        </section>
        <Button variant="primary" iconRight={ArrowRight} onClick={() => go("paraphrase")}>{t("study.goParaphrase")}</Button>
      </aside>
    </div>
  );
}
