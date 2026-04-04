import { getSubDirs, getFiles, writeZipFile } from "../fileSystemService";
import { crearZip } from "../compressionService";

const EXTENSIONES_VALIDAS = [".pdf", ".txt", ".json"];

/**
 * COMPAÑIA DE SEGUROS BOLIVAR S.A
 * Estructura: CXC / CTFE+num → pdf+txt+json (excluye CTFE*.pdf) → FAC_CTFE{num}.zip en la misma carpeta
 */
export const procesar = async (cxcHandle, logCallback) => {
  const subDirs = await getSubDirs(cxcHandle);

  for (const { name: ctfeName, handle: ctfeHandle } of subDirs) {
    if (!ctfeName.toUpperCase().startsWith("CTFE")) continue;

    const archivos = await getFiles(ctfeHandle);
    const filtrados = archivos.filter(({ name: n }) => {
      const ext = n.substring(n.lastIndexOf(".")).toLowerCase();
      const esPdfCtfe = ext === ".pdf" && n.toUpperCase().startsWith("CTFE");
      return EXTENSIONES_VALIDAS.includes(ext) && !esPdfCtfe;
    });

    if (filtrados.length > 0) {
      const zipName = `FAC_${ctfeName}.zip`;
      const blob = await crearZip(filtrados);
      await writeZipFile(ctfeHandle, zipName, blob);
      logCallback(
        `📦 ${cxcHandle.name}/${ctfeName}/${zipName} — ${filtrados.length} archivo(s)`
      );
    } else {
      logCallback(`⚠️  ${cxcHandle.name}/${ctfeName} — Sin archivos elegibles (pdf/txt/json)`);
    }
  }
};
