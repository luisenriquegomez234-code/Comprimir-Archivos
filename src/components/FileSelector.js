import React from "react";
import styles from "./FileSelector.module.css";

function FileSelector({ onSelectFolder, folderName, disabled }) {
  return (
    <div className={styles.selectors}>
      <div className={styles.selector}>
        <h2>📁 Carpeta de Trabajo</h2>
        <p className={styles.hint}>
          Selecciona la <strong>carpeta CXC</strong> (ej: <em>CXC 122781</em>) o la carpeta que la contiene (ej: <em>POSITIVA COMPAÑIA DE SEGUROS S.A</em>)
        </p>
        <button
          className={styles.fileBtn}
          onClick={onSelectFolder}
          disabled={disabled}
          aria-label="Seleccionar carpeta raíz"
        >
          🗂️ Seleccionar Carpeta
        </button>
        {folderName && (
          <div className={styles.selectedInfo} aria-live="polite">
            <span className={styles.selectedInfoTitle}>
              ✅ Carpeta seleccionada:
            </span>
            <span className={styles.folderName}> {folderName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileSelector;
