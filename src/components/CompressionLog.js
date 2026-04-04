import React from "react";
import styles from "./CompressionLog.module.css";

function CompressionLog({ logEntries, error }) {
  const zipCount = logEntries.filter((e) => e.message && e.message.startsWith("📦")).length;

  if (logEntries.length === 0 && !error) {
    return (
      <div className={styles.log}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📦</div>
          <p className={styles.emptyStateText}>
            Selecciona una entidad y carpeta raíz para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.log}>
      {error && (
        <div className={styles.errorBanner} role="alert">
          ❌ {error}
        </div>
      )}
      {logEntries.length > 0 && (
        <>
          <div className={styles.logHeader}>
            <h3 className={styles.logTitle}>
              Registro de Procesamiento
              {zipCount > 0 && (
                <span className={styles.logBadge}>{zipCount} ZIP{zipCount !== 1 ? "s" : ""}</span>
              )}
            </h3>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Evento</th>
                  <th className={styles.tableHeader}>Fecha/Hora</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {logEntries.map((entry, i) => (
                  <tr
                    className={`${styles.tableRow} ${
                      entry.message && entry.message.startsWith("✅")
                        ? styles.rowSuccess
                        : entry.message && entry.message.startsWith("❌")
                        ? styles.rowError
                        : entry.message && entry.message.startsWith("⚠️")
                        ? styles.rowWarn
                        : ""
                    }`}
                    key={i}
                  >
                    <td className={`${styles.tableCell} ${styles.tableCellFileName}`}>
                      {entry.message}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellDate}`}>
                      {entry.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default CompressionLog;
