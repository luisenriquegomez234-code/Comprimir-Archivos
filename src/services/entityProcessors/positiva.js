import { getSubDirs, getFiles, writeZipFile } from "../fileSystemService";
import { crearZip } from "../compressionService";

/**
 * POSITIVA COMPAÑIA DE SEGUROS S.A
 *
 * Estructura real en disco:
 *   CXC 122781/
 *     CTFE289320/          ← comprimir TODOS los archivos excepto los que empiezan con "CTFE"
 *     RIPS/
 *       CTFE289320/        ← comprimir: *.xml, ResultadosMSPS*.txt, Rips_*.json
 *
 * Regla CTFE: todos los archivos del directorio EXCEPTO los que comienzan con "CTFE"
 *             (el archivo principal tipo CTFE289320.pdf se excluye)
 *
 * Regla RIPS: archivos de nombre dinámico:
 *   - ad*.xml              → ej: ad08120051300002600552991.xml
 *   - ResultadosMSPS*.txt  → ej: ResultadosMSPS_CTFE289320_ID169945751_A_CUV.txt
 *   - Rips_*.json          → ej: Rips_CTFE289320.json
 */
export const procesar = async (cxcHandle, logCallback) => {
  const subDirs = await getSubDirs(cxcHandle);

  for (const { name, handle } of subDirs) {

    // ── Carpeta CTFE{num} ──────────────────────────────────────────────────────
    // Comprime TODOS los archivos excepto los que comienzan con "CTFE"
    // Genera: CTFE{num}.zip dentro de la misma carpeta
    if (name.toUpperCase().startsWith("CTFE")) {
      const archivos = await getFiles(handle);
      const targets = archivos.filter(
        ({ name: n }) => !n.toUpperCase().startsWith("CTFE")
      );
      if (targets.length > 0) {
        const zipName = `${name}.zip`;
        const blob = await crearZip(targets);
        await writeZipFile(handle, zipName, blob);
        logCallback(
          `📦 ${cxcHandle.name}/${name}/${zipName} — ${targets.length} archivo(s)`
        );
      } else {
        logCallback(`⚠️  ${cxcHandle.name}/${name} — Sin archivos elegibles`);
      }
    }

    // ── Carpeta RIPS ───────────────────────────────────────────────────────────
    // Dentro busca subcarpetas CTFE{num} y comprime los archivos RIPS
    // Genera: Rips_CTFE{num}.zip dentro de cada subcarpeta RIPS/CTFE{num}
    if (name.toUpperCase() === "RIPS") {
      const ripsSubDirs = await getSubDirs(handle);
      for (const { name: ctfeName, handle: ctfeHandle } of ripsSubDirs) {
        if (!ctfeName.toUpperCase().startsWith("CTFE")) continue;

        const archivos = await getFiles(ctfeHandle);

        // Filtro por patrón: soporta nombres dinámicos reales
        const targets = archivos.filter(({ name: n }) => {
          const lower = n.toLowerCase();
          return (
            lower.endsWith(".xml") ||                                      // ad08120051300002600552991.xml
            (lower.startsWith("resultadosmsps") && lower.endsWith(".txt")) || // ResultadosMSPS_*.txt
            (lower.startsWith("rips_") && lower.endsWith(".json"))            // Rips_CTFE*.json
          );
        });

        if (targets.length > 0) {
          const zipName = `Rips_${ctfeName}.zip`;
          const blob = await crearZip(targets);
          await writeZipFile(ctfeHandle, zipName, blob);
          logCallback(
            `📦 ${cxcHandle.name}/RIPS/${ctfeName}/${zipName} — ${targets.length} archivo(s)`
          );
        } else {
          logCallback(
            `⚠️  ${cxcHandle.name}/RIPS/${ctfeName} — Sin archivos RIPS elegibles`
          );
        }
      }
    }
  }
};
