// Vista Flashcards: filtros, cards volteables y diálogo de práctica autoevaluada.
export default {
  filters: {
    label: "Filtrar flashcards",
    due: "Para hoy",
    all: "Todas",
  },
  view: {
    title: "Repaso",
    help: "Abre una card, respóndela mentalmente, revela la respuesta y valora cuánto la sabías: eso programa su próximo repaso.",
    showAll: "Ver todas",
    reviewDue: "Repasar {n} pendientes",
    dueEmptyTitle: "Nada para repasar hoy",
    dueEmptyBody: "Las cards que ya trabajaste vuelven aquí cuando les toca. Valóralas al repasar para programar el siguiente.",
  },
  card: {
    open: "{label}: abrir flashcard",
    hasExplanation: "Tu explicación está guardada",
    dueToday: "Toca hoy",
    nextIn: ({ n }) => `Próximo repaso en ${n} ${n === 1 ? "día" : "días"}`,
    showFront: "{label}: ver frente",
    showAnswer: "{label}: ver respuesta",
    hint: "¿Cómo lo explicarías?",
    keyIdea: "Idea central",
    yourExplanation: "Tu explicación",
    improve: "Mejorar explicación",
    study: "Estudiar",
  },
  modal: {
    position: "{n} / {total}",
    previous: "Card anterior",
    next: "Card siguiente",
    reveal: "Mostrar respuesta",
    space: "Espacio",
    noExplanation: "Aún no escribiste una explicación para esta card.",
    keys: "Espacio muestra la respuesta · 1–4 la valoran · ← → cambian de card",
  },
  done: {
    title: "Todo al día",
    body: ({ n }) => `Repasaste ${n} ${n === 1 ? "card" : "cards"}. Cada una vuelve cuando le toque.`,
    continue: "Seguir estudiando: {label}",
  },
  practice: {
    rateLabel: "¿Qué tan bien la sabías?",
    ratings: { again: "Otra vez", hard: "Difícil", good: "Bien", easy: "Fácil" },
  },
};
