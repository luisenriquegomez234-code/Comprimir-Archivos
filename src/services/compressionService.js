import JSZip from "jszip";

/**
 * Crea un archivo ZIP a partir de un array de { name, file }
 * donde name es el nombre dentro del ZIP y file es el objeto File
 * @param {Array<{name: string, file: File}>} archivos
 * @returns {Promise<Blob>}
 */
export const crearZip = async (archivos) => {
  const zip = new JSZip();
  for (const { name, file } of archivos) {
    const contenido = await file.arrayBuffer();
    zip.file(name, contenido);
  }
  return await zip.generateAsync({ type: "blob" });
};

/**
 * Genera un log de los archivos procesados
 * @param {File[]} files
 * @returns {Object[]}
 */
export const generarLog = (files) => {
  return files.map((file) => ({
    name: file.webkitRelativePath || file.name,
    date: new Date().toLocaleString(),
  }));
};
