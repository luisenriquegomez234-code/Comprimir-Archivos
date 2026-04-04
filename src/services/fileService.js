/**
 * Valida que exista al menos un archivo seleccionado
 * @param {File[]} files - Array de archivos a validar
 * @returns {boolean} - true si hay archivos, false si está vacío
 */
export const validarArchivos = (files) => {
  return files && files.length > 0;
};

/**
 * Calcula el tamaño total de los archivos y lo formatea como string
 * Soporta unidades: Bytes, KB, MB, GB
 * @param {File[]} files - Array de archivos cuyo tamaño se calculará
 * @returns {string} - Tamaño formateado (ej: "2.5 MB", "150 KB")
 */
export const calcularTamaño = (files) => {
  if (!files || files.length === 0) {
    return "0 Bytes";
  }

  // Calcular tamaño total en bytes
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  // Unidades y sus valores en bytes
  const unidades = [
    { nombre: "GB", bytes: 1073741824 },
    { nombre: "MB", bytes: 1048576 },
    { nombre: "KB", bytes: 1024 },
    { nombre: "Bytes", bytes: 1 },
  ];

  // Encontrar la unidad más apropiada
  for (const unidad of unidades) {
    if (totalBytes >= unidad.bytes) {
      const valor = (totalBytes / unidad.bytes).toFixed(2);
      return `${valor} ${unidad.nombre}`;
    }
  }

  return `${totalBytes} Bytes`;
};
