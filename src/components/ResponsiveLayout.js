import React, { useEffect, useState } from "react";

const ResponsiveLayout = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector(".App");
      if (!container) return;

      const containerHeight = container.scrollHeight;
      const viewportHeight = window.innerHeight;
      const containerWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Calculer les ratios
      const heightRatio = viewportHeight / containerHeight;
      const widthRatio = viewportWidth / containerWidth;

      // Utiliser le plus petit ratio pour s'assurer que tout est visible
      const newScale = Math.min(heightRatio, widthRatio, 1) * 0.95; // 0.95 pour laisser une petite marge

      setScale(newScale);
    };

    // Mettre à jour la taille initiale
    updateSize();

    // Ajouter l'écouteur de redimensionnement
    window.addEventListener("resize", updateSize);

    // Nettoyer
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="responsive-container"
      style={{
        transformOrigin: "top center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveLayout;
