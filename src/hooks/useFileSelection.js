import { useState } from "react";
import { validarArchivos, calcularTamaño } from "../services/fileService";

/**
 * Custom Hook: useFileSelection
 *
 * Encapsula la lógica de selección, validación y gestión de archivos
 *
 * @returns {Object} Objeto con propiedades y métodos para gestionar archivos
 *   - files: Array de archivos seleccionados
 *   - handleFileChange: Callback para cambio de archivos
 *   - clearFiles: Función para limpiar archivos
 *   - fileCount: Número de archivos seleccionados
 *   - totalSize: Tamaño total formateado
 *   - isValid: Boolean indicando si hay archivos válidos
 */
export const useFileSelection = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Acumular: agregar los nuevos archivos a los ya seleccionados (sin duplicados por nombre+tamaño)
    setFiles((prev) => {
      const prevKeys = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const uniqueNew = newFiles.filter((f) => !prevKeys.has(`${f.name}-${f.size}`));
      return [...prev, ...uniqueNew];
    });
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const fileCount = files.length;
  const totalSize = calcularTamaño(files);
  const isValid = validarArchivos(files);

  return {
    files,
    handleFileChange,
    clearFiles,
    fileCount,
    totalSize,
    isValid,
  };
};
