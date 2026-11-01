// Flashcards view: filters, flip cards and the self-rated practice dialog.
export default {
  filters: {
    label: "Filter flashcards",
    due: "Due today",
    all: "All",
  },
  view: {
    title: "Review",
    help: "Open a card to answer it in your head, reveal the answer and rate how well you knew it: that schedules its next review.",
    showAll: "Show all",
    reviewDue: "Review {n} due",
    dueEmptyTitle: "Nothing due today",
    dueEmptyBody: "Cards you have worked on come back here when they are due. Rate them when you review to schedule the next one.",
  },
  card: {
    open: "{label}: open flashcard",
    hasExplanation: "Your explanation is saved",
    dueToday: "Due today",
    nextIn: ({ n }) => `Next review in ${n} ${n === 1 ? "day" : "days"}`,
    showFront: "{label}: show front",
    showAnswer: "{label}: show answer",
    hint: "How would you explain it?",
    keyIdea: "Key idea",
    yourExplanation: "Your explanation",
    improve: "Improve explanation",
    study: "Study",
  },
  modal: {
    position: "{n} / {total}",
    previous: "Previous card",
    next: "Next card",
    reveal: "Show answer",
    space: "Space",
    noExplanation: "You haven't written an explanation for this card yet.",
    keys: "Space shows the answer · 1–4 rate it · ← → move between cards",
  },
  done: {
    title: "All caught up",
    body: ({ n }) => `You reviewed ${n} ${n === 1 ? "card" : "cards"}. Each one comes back when it is due.`,
    continue: "Continue studying: {label}",
  },
  practice: {
    rateLabel: "How well did you know it?",
    ratings: { again: "Again", hard: "Hard", good: "Good", easy: "Easy" },
  },
};
