import { getSubDirs, getFiles, writeZipFile } from "../fileSystemService";
import { crearZip } from "../compressionService";

const EXTENSIONES_VALIDAS = [".xml", ".pdf", ".json"];

/**
 * ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S
 * Estructura: CXC / CTFE+num (outer) / CTFE+num (inner, mismo nombre) → xml+pdf(no CTFE*.pdf)+json → CTFE{num}.zip
 */
export const procesar = async (cxcHandle, logCallback) => {
  const subDirs = await getSubDirs(cxcHandle);

  for (const { name: ctfeOuterName, handle: ctfeOuterHandle } of subDirs) {
    if (!ctfeOuterName.toUpperCase().startsWith("CTFE")) continue;

    // La subcarpeta interna tiene el mismo nombre que la externa
    let innerHandle = null;
    try {
      innerHandle = await ctfeOuterHandle.getDirectoryHandle(ctfeOuterName);
    } catch {
      logCallback(
        `⚠️  ${cxcHandle.name}/${ctfeOuterName} — No se encontró subcarpeta interna "${ctfeOuterName}"`
      );
      continue;
    }

    const archivos = await getFiles(innerHandle);
    const filtrados = archivos.filter(({ name: n }) => {
      const ext = n.substring(n.lastIndexOf(".")).toLowerCase();
      const esPdfCtfe = ext === ".pdf" && n.toUpperCase().startsWith("CTFE");
      return EXTENSIONES_VALIDAS.includes(ext) && !esPdfCtfe;
    });

    if (filtrados.length > 0) {
      const zipName = `${ctfeOuterName}.zip`;
      const blob = await crearZip(filtrados);
      await writeZipFile(innerHandle, zipName, blob);
      logCallback(
        `📦 ${cxcHandle.name}/${ctfeOuterName}/${ctfeOuterName}/${zipName} — ${filtrados.length} archivo(s)`
      );
    } else {
      logCallback(
        `⚠️  ${cxcHandle.name}/${ctfeOuterName}/${ctfeOuterName} — Sin archivos elegibles (xml/pdf/json)`
      );
    }
  }
};
