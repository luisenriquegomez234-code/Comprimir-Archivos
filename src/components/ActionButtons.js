import React from "react";
import styles from "./ActionButtons.module.css";

function ActionButtons({ onCompress, onClear, loading = false, hasFolder = false, hasEntity = false }) {
  const canProcess = hasFolder && hasEntity && !loading;

  return (
    <div className={styles.actions}>
      <button
        className={styles.compressBtn}
        onClick={onCompress}
        disabled={!canProcess}
        aria-busy={loading}
        aria-label="Procesar y comprimir archivos según reglas de la entidad"
        title={!hasEntity ? "Selecciona una entidad primero" : !hasFolder ? "Selecciona una carpeta primero" : ""}
      >
        {loading ? (
          <>
            <span className={styles.spinner}>⏳</span>
            Procesando...
          </>
        ) : (
          <>
            🚀
            <span>Procesar y Comprimir</span>
          </>
        )}
      </button>
      <button
        className={styles.clearBtn}
        onClick={onClear}
        disabled={loading}
        aria-label="Limpiar selección"
      >
        🧹 <span>Limpiar</span>
      </button>
    </div>
  );
}

export default ActionButtons;
