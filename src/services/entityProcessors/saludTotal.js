import { getSubDirs, getFiles, getOrCreateSubDir, writeZipFile } from "../fileSystemService";
import { crearZip } from "../compressionService";

/**
 * SALUD TOTAL EPS S.S A
 * Estructura: CXC / Numeros / NIT_CTFE+num → *_CUV.json + *_RIPS.json → NIT_CTFE{num}.zip en COMPRIMIDO
 */
export const procesar = async (cxcHandle, logCallback) => {
  const subDirs = await getSubDirs(cxcHandle);
  const numerosEntry = subDirs.find(({ name }) => name === "Numeros");

  if (!numerosEntry) {
    logCallback(`⚠️  ${cxcHandle.name} — No se encontró la carpeta "Numeros"`);
    return;
  }

  const nitCtfeDirs = await getSubDirs(numerosEntry.handle);

  for (const { name: nitCtfeName, handle: nitCtfeHandle } of nitCtfeDirs) {
    const archivos = await getFiles(nitCtfeHandle);
    // Toma archivos JSON (_CUV.json y _RIPS.json)
    const jsonFiles = archivos.filter(({ name: n }) =>
      n.toLowerCase().endsWith(".json")
    );

    if (jsonFiles.length > 0) {
      const zipName = `${nitCtfeName}.zip`;
      const blob = await crearZip(jsonFiles);
      // Guardar dentro de subcarpeta COMPRIMIDO
      const comprimidoHandle = await getOrCreateSubDir(nitCtfeHandle, "COMPRIMIDO");
      await writeZipFile(comprimidoHandle, zipName, blob);
      logCallback(
        `📦 ${cxcHandle.name}/Numeros/${nitCtfeName}/COMPRIMIDO/${zipName} — ${jsonFiles.length} archivo(s)`
      );
    } else {
      logCallback(`⚠️  ${cxcHandle.name}/Numeros/${nitCtfeName} — Sin archivos JSON`);
    }
  }
};
