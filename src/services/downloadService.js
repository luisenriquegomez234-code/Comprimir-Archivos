/**
 * Descarga un archivo usando la File API del navegador
 * Intenta usar showSaveFilePicker si está disponible (mejor UX)
 * Fallback: crea un elemento <a> para descargar (compatible con todos los navegadores)
 * @param {Blob} blob - Blob del archivo a descargar
 * @param {string} filename - Nombre del archivo a guardar (ej: "Comprimido.zip")
 * @returns {Promise<boolean>} - true si la descarga se completó, false si hubo error en el método preferido
 */
export const descargarConBlob = async (blob, filename) => {
  // Prioridad 1: Usar showSaveFilePicker (navegadores modernos)
  // Proporciona mejor control sobre la ubicación de descarga
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "Archivo ZIP",
            accept: { "application/zip": [".zip"] },
          },
        ],
      });

      // Crear stream writeable y escribir el blob
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();

      return true;
    } catch (err) {
      // Si el usuario cancela el diálogo (AbortError), retornar null (no es error)
      if (err.name === "AbortError") {
        console.info("El usuario canceló el diálogo de guardado.");
        return null; // null = cancelado por usuario (no mostrar alerta de error)
      }
      // Otro error: continuar con el fallback
      console.error("Error al usar showSaveFilePicker:", err);
    }
  }

  // Prioridad 2: Fallback usando elemento <a>
  // Compatible con navegadores más antiguos
  try {
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = filename;
    enlace.click();

    // Limpiar el URL creado para liberar memoria
    setTimeout(() => {
      URL.revokeObjectURL(enlace.href);
    }, 100);

    return true;
  } catch (err) {
    console.error("Error en descarga por fallback:", err);
    return false;
  }
};
