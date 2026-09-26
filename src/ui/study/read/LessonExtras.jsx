import { CodeBlock } from "../../primitives/CodeBlock.jsx";
import { Mermaid } from "../../primitives/Mermaid.jsx";

// Bloques opcionales de la lección: comparación de código, tabla, diagramas, notas de docs y fuentes.
export function LessonExtras({ lesson, graph }) {
  const language = graph.id === "rails" ? "ruby" : undefined;
  const cmp = lesson.codeComparison;
  return (
    <>
      {cmp?.naive && cmp?.production && (
        <section className="lesson__section">
          <h2 className="lesson__h">Ingenuo vs. producción</h2>
          <div className="compare">
            <div className="compare__col compare__col--naive">
              <CodeBlock code={cmp.naive.code} label={cmp.naive.label} language={language} />
              {cmp.naive.whyItFails && <p className="compare__note"><strong>Por qué falla.</strong> {cmp.naive.whyItFails}</p>}
            </div>
            <div className="compare__col compare__col--prod">
              <CodeBlock code={cmp.production.code} label={cmp.production.label} language={language} />
              {cmp.production.tradeOff && <p className="compare__note"><strong>Trade-off.</strong> {cmp.production.tradeOff}</p>}
            </div>
          </div>
        </section>
      )}
      {lesson.table?.columns && (
        <section className="lesson__section">
          <h2 className="lesson__h">{lesson.tableLabel || lesson.tableTitle || "Comparación"}</h2>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr>{lesson.table.columns.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
              <tbody>{lesson.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      )}
      {lesson.mermaid && (
        <section className="lesson__section">
          <h2 className="lesson__h">{lesson.diagramTitle || "Diagrama"}</h2>
          <Mermaid chart={lesson.mermaid} />
        </section>
      )}
      {!lesson.mermaid && Array.isArray(lesson.diagram) && lesson.diagram.length > 0 && (
        <section className="lesson__section">
          <h2 className="lesson__h">{lesson.diagramTitle || "Flujo"}</h2>
          <ol className="flow">
            {lesson.diagram.map((step, i) => (
              <li key={i} className="flow__step"><strong>{step.label}</strong>{step.detail && <span className="t2">{step.detail}</span>}</li>
            ))}
          </ol>
        </section>
      )}
      {lesson.docNotes?.length > 0 && (
        <section className="lesson__section">
          <h2 className="lesson__h">Notas de la documentación</h2>
          <ul className="lesson__notes">{lesson.docNotes.map((note, i) => <li key={i}>{note}</li>)}</ul>
        </section>
      )}
      {lesson.sources?.length > 0 && (
        <section className="lesson__section">
          <h2 className="lesson__h">Fuentes</h2>
          <ul className="lesson__sources">
            {lesson.sources.map((s, i) => <li key={i}><a href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a></li>)}
          </ul>
        </section>
      )}
    </>
  );
}
