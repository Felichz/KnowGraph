// Vista Flashcards: filtros, cards volteables y diálogo de práctica autoevaluada.
export default {
  filters: {
    label: "Filtrar flashcards",
    all: "Todas",
    pending: "Sin intento",
    below: "Base < 100",
    mastery: "Dominadas",
  },
  view: {
    title: "Repaso",
    help: "Tocá una card para darla vuelta. En práctica, respondé mentalmente y autoevaluate.",
    practice: "Practicar {n}",
    emptyTitle: "No hay cards en este filtro",
    emptyBody: "Cambiá el filtro o el foco para ver otras cards.",
    showAll: "Ver todas",
  },
  card: {
    showFront: "{label}: ver frente",
    showAnswer: "{label}: ver respuesta",
    hint: "¿Cómo lo explicarías?",
    keyIdea: "Idea central",
    yourExplanation: "Tu explicación",
    improve: "Mejorar explicación",
    study: "Estudiar",
  },
  practice: {
    title: "Práctica",
    finished: "Terminaste",
    position: "Card {n} de {total}",
    result: "{good} de {total} bien",
    restart: "Practicar de nuevo",
    resultBody: "Las que marcaste como difíciles conviene reescribirlas en Parafrasear.",
    reveal: "Mostrar respuesta",
    openParaphrase: "Abrir en Parafrasear →",
    rateLabel: "¿Qué tan bien la sabías?",
    ratings: { again: "Otra vez", hard: "Difícil", good: "Bien", easy: "Fácil" },
  },
};
