import React from "react";

export function ModelMeta({ model, routedVia }) {
  const usedModel = routedVia || model;
  if (!usedModel && !model) {
    return <span className="model-meta model-meta--unknown">Modelo no registrado</span>;
  }

  const wasRouted = Boolean(routedVia && model && routedVia !== model);
  return (
    <span className="model-meta" title={wasRouted ? `Usado: ${usedModel} · solicitado: ${model}` : `Usado: ${usedModel}`}>
      <span className="model-meta__label">MODELO</span>
      <code>{usedModel}</code>
      {wasRouted && <small>pedido: {model}</small>}
    </span>
  );
}
