import { getSubDirs, getFiles, writeZipFile } from "../fileSystemService";
import { crearZip } from "../compressionService";

/**
 * Comprime todos los archivos de un directorio y guarda el ZIP dentro de él
 */
const comprimirCarpeta = async (dirHandle, zipName, rutaLog, logCallback) => {
  const archivos = await getFiles(dirHandle);
  // Excluir ZIPs ya existentes para no comprimir sobre sí mismos
  const elegibles = archivos.filter(
    ({ name: n }) => !n.toLowerCase().endsWith(".zip")
  );
  if (elegibles.length > 0) {
    const blob = await crearZip(elegibles);
    await writeZipFile(dirHandle, zipName, blob);
    logCallback(`📦 ${rutaLog}/${zipName} — ${elegibles.length} archivo(s)`);
  } else {
    logCallback(`⚠️  ${rutaLog} — Sin archivos para comprimir`);
  }
};

/**
 * LA PREVISORA S.A COMPAÑÍA DE SEGUROS
 * Estructura: CXC / {NumCuenta} / CUV → CUV.zip | RIPS → RIPS.zip
 *             CXC / SOPORTE → SOPORTE.zip
 */
export const procesar = async (cxcHandle, logCallback) => {
  const subDirs = await getSubDirs(cxcHandle);

  for (const { name, handle } of subDirs) {
    // Carpetas numéricas → busca CUV y RIPS dentro
    if (/^\d+$/.test(name)) {
      const innerDirs = await getSubDirs(handle);
      const cuv = innerDirs.find(({ name: n }) => n === "CUV");
      const rips = innerDirs.find(({ name: n }) => n === "RIPS");

      if (cuv) {
        await comprimirCarpeta(
          cuv.handle,
          "CUV.zip",
          `${cxcHandle.name}/${name}/CUV`,
          logCallback
        );
      }
      if (rips) {
        await comprimirCarpeta(
          rips.handle,
          "RIPS.zip",
          `${cxcHandle.name}/${name}/RIPS`,
          logCallback
        );
      }
      if (!cuv && !rips) {
        logCallback(`⚠️  ${cxcHandle.name}/${name} — No se encontraron carpetas CUV ni RIPS`);
      }
    }

    // Carpeta SOPORTE en la raíz de CXC → SOPORTE.zip
    if (name === "SOPORTE") {
      await comprimirCarpeta(
        handle,
        "SOPORTE.zip",
        `${cxcHandle.name}/SOPORTE`,
        logCallback
      );
    }
  }
};
