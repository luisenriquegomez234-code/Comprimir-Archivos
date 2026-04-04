import { useState } from "react";
import { crearZip, generarLog } from "../services/compressionService";
import { descargarConBlob } from "../services/downloadService";

/**
 * Custom Hook: useCompression
 *
 * Encapsula la lógica de compresión de archivos, descarga y manejo de estados
 *
 * @returns {Object} Objeto con propiedades y métodos para comprimir archivos
 *   - log: Array de entradas del log de compresiones
 *   - loading: Boolean indicando si se está comprimiendo
 *   - error: String con mensaje de error o null
 *   - compress: Función async para comprimir archivos
 *   - clearLog: Función para limpiar el historial de log
 */
export const useCompression = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compress = async (files) => {
    // Validar que existan archivos
    if (!files || files.length === 0) {
      const msg = "Selecciona primero archivos o carpeta.";
      setError(msg);
      return { success: false, errorMsg: msg };
    }

    setLoading(true);
    setError(null);

    try {
      // Crear el ZIP con los archivos
      const blob = await crearZip(files);

      // Generar el log de archivos procesados
      const logEntries = generarLog(files);
      setLog(logEntries);

      // Descargar el archivo usando File API
      const descargado = await descargarConBlob(blob, "Comprimido.zip");

      if (descargado === null) {
        // El usuario canceló el diálogo de guardado — no es un error
        setLoading(false);
        return { success: false, errorMsg: null }; // null = sin mensaje (cancelación silenciosa)
      }

      if (!descargado) {
        const msg = "No se pudo completar la descarga.";
        setError(msg);
        setLoading(false);
        return { success: false, errorMsg: msg };
      }

      setLoading(false);
      return { success: true, errorMsg: null };
    } catch (err) {
      console.error("Error al comprimir:", err);
      const msg = "Error al crear o descargar el archivo.";
      setError(msg);
      setLoading(false);
      return { success: false, errorMsg: msg };
    }
  };

  const clearLog = () => {
    setLog([]);
  };

  return {
    log,
    loading,
    error,
    compress,
    clearLog,
  };
};
