// App shell: sidebar, top bars and mobile dock. Two destinations: Study and Review.
export default {
  nav: {
    label: "Main navigation",
    views: "Views",
    mobileLabel: "Mobile main navigation",
    map: "Study",
    flashcards: "Review",
    reviewDue: ({ n }) => `${n} due today`,
    search: "Search",
    settings: "Settings",
  },
  sidebar: {
    expand: "Expand sidebar",
    collapse: "Collapse sidebar",
    chooseMap: "Choose curriculum",
    mapTrigger: "Curriculum: {label}. Change",
    searchWithKey: "Search ({key}+K)",
    searchButton: "Search…",
  },
  topbar: {
    focusLabel: "Showing {name}",
    showAll: "Show all areas",
  },
};
