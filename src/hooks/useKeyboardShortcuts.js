import { useEffect } from "react";

export function useKeyboardShortcuts({ onCommandPalette, onEscape, onNext, onPrevious }) {
  useEffect(() => {
    function handleKeyDown(event) {
      // Ctrl+K o Cmd+K para abrir Command Palette
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onCommandPalette?.();
        return;
      }

      // Escape para cerrar modales
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }

      // Flechas para navegar si no está escribiendo en input o textarea
      const target = event.target;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (!isInput) {
        if (event.key === "ArrowRight") onNext?.();
        if (event.key === "ArrowLeft") onPrevious?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCommandPalette, onEscape, onNext, onPrevious]);
}
