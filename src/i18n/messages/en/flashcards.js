// Flashcards view: filters, flip cards and the self-rated practice dialog.
export default {
  filters: {
    label: "Filter flashcards",
    all: "All",
    pending: "Not attempted",
    below: "Below 100",
    mastery: "Mastered",
  },
  view: {
    title: "Review",
    help: "Click a card to flip it. In practice mode, answer in your head and rate yourself.",
    practice: "Practice {n}",
    emptyTitle: "No cards match this filter",
    emptyBody: "Change the filter or focus area to see other cards.",
    showAll: "Show all",
  },
  card: {
    showFront: "{label}: show front",
    showAnswer: "{label}: show answer",
    hint: "How would you explain it?",
    keyIdea: "Key idea",
    yourExplanation: "Your explanation",
    improve: "Improve explanation",
    study: "Study",
  },
  practice: {
    title: "Practice",
    finished: "Finished",
    position: "Card {n} of {total}",
    result: "{good} of {total} rated Good or Easy",
    restart: "Practice again",
    resultBody: "Cards you found hard are worth rewriting in Paraphrase.",
    reveal: "Show answer",
    openParaphrase: "Open in Paraphrase →",
    rateLabel: "How well did you know it?",
    ratings: { again: "Again", hard: "Hard", good: "Good", easy: "Easy" },
  },
};
