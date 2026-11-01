// Shell de la app: barra lateral, barras superiores y dock móvil. Dos destinos: Estudiar y Repasar.
export default {
  nav: {
    label: "Navegación principal",
    views: "Vistas",
    mobileLabel: "Navegación principal móvil",
    map: "Estudiar",
    flashcards: "Repasar",
    reviewDue: ({ n }) => `${n} para hoy`,
    search: "Buscar",
    settings: "Ajustes",
  },
  sidebar: {
    expand: "Expandir barra lateral",
    collapse: "Contraer barra lateral",
    chooseMap: "Elegir temario",
    mapTrigger: "Temario: {label}. Cambiar",
    searchWithKey: "Buscar ({key}+K)",
    searchButton: "Buscar…",
  },
  topbar: {
    focusLabel: "Mostrando {name}",
    showAll: "Ver todas las áreas",
  },
};
