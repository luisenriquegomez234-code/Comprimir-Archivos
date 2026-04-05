import React from "react";
import styles from "./FileSelector.module.css";

function FileSelector({ onSelectFolder, folderName, disabled }) {
  return (
    <div className={styles.selectorContainer}>
      <header className={styles.header}>
        <span className={styles.icon}>📂</span>
        <h2 className={styles.title}>Origen de Archivos</h2>
      </header>
      
      {/* Retirada la pista de ejemplo por petición del usuario */}

      <button
        className={styles.fileBtn}
        onClick={onSelectFolder}
        disabled={disabled}
        type="button"
        aria-label="Abrir explorador para elegir carpeta"
      >
        <span>📂 Examinar Directorio</span>
      </button>

      {folderName && (
        <div className={styles.statusBadge} aria-live="polite">
          <span className={styles.statusIcon}>📍</span>
          <span className={styles.statusLabel}>Ruta Seleccionada:</span>
          <span className={styles.folderName}>{folderName}</span>
        </div>
      )}
    </div>
  );
}

export default FileSelector;
