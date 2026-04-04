import { getSubDirs, getPDFsRecursive, writeZipFile } from "../fileSystemService";
import { crearZip } from "../compressionService";

// NIT del proveedor usado para nombrar los ZIPs — ajustar según necesidad
const NIT = "8120051308";

/**
 * COMPAÑIA MUNDIAL DE SEGUROS S.A
 * Estructura: CXC / {NumCuenta} / CUV + RIPS → cada PDF es un ZIP individual: {NIT}-{CTFE+num}.zip
 * El ZIP se guarda en la carpeta del número de cuenta
 */
export const procesar = async (cxcHandle, logCallback) => {
  const subDirs = await getSubDirs(cxcHandle);

  for (const { name: numName, handle: numHandle } of subDirs) {
    // Solo carpetas numéricas (número de cuenta)
    if (!/^\d+$/.test(numName)) continue;

    // Busca todos los PDFs recursivamente dentro de la carpeta numérica (CUV y RIPS)
    const pdfs = await getPDFsRecursive(numHandle);

    if (pdfs.length === 0) {
      logCallback(`⚠️  ${cxcHandle.name}/${numName} — Sin archivos PDF`);
      continue;
    }

    for (const { name: pdfName, file } of pdfs) {
      const baseName = pdfName.replace(/\.pdf$/i, "");
      const zipName = `${NIT}-${baseName}.zip`;
      const blob = await crearZip([{ name: pdfName, file }]);
      // El ZIP se guarda en la carpeta numérica
      await writeZipFile(numHandle, zipName, blob);
      logCallback(`📦 ${cxcHandle.name}/${numName}/${zipName}`);
    }
  }
};
