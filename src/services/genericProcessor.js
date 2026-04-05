import { getSubDirs, getFiles, getOrCreateSubDir, writeZipFile } from "./fileSystemService";
import { crearZip } from "./compressionService";

/**
 * Función de ayuda para obtener el nombre limpio de un handle (que puede ser un objeto handle o un string path)
 */
const getCleanName = (handle) => {
  if (typeof handle === "string") {
    // Si es una ruta (Electron), tomamos el último segmento
    return handle.split(/[\\/]/).pop();
  }
  return handle.name;
};

/**
 * Ejecuta una tarea genérica de configuración sobre un directorio Handle.
 */
export const executeGenericTask = async (parentHandle, targetHandle, task, logCallback, cxcRootHandle = null) => {
  const currentCxcRoot = cxcRootHandle || parentHandle;

  // Si la tarea evalúa la misma raíz (root)
  if (task.folderMatch === "^$") {
    await processFilesHandle(parentHandle, targetHandle, task, logCallback, currentCxcRoot);
    return;
  }

  const subDirs = await getSubDirs(targetHandle);
  const regex = new RegExp(task.folderMatch, "i");

  for (const dir of subDirs) {
    if (regex.test(dir.name)) {
      if (task.subTasks && task.subTasks.length > 0) {
        for (const sub of task.subTasks) {
          // Recursión: dir.handle es ahora el parent para la sub-tarea
          await executeGenericTask(targetHandle, dir.handle, sub, logCallback, currentCxcRoot);
        }
      } else {
        await processFilesHandle(targetHandle, dir.handle, task, logCallback, currentCxcRoot);
      }
    }
  }
};

/**
 * Procesa los archivos dentro del directorio objetivo basado en la regla
 */
const processFilesHandle = async (parentHandle, targetDirHandle, task, logCallback, cxcRootHandle) => {
  const archivos = await getFiles(targetDirHandle);
  const targetFolderName = getCleanName(targetDirHandle);
  
  const includes = task.filesInclude.map(p => new RegExp(p, "i"));
  const excludes = task.filesExclude ? task.filesExclude.map(p => new RegExp(p, "i")) : [];

  const targets = archivos.filter(file => {
    const isIncluded = includes.some(regex => regex.test(file.name));
    if (!isIncluded) return false;
    const isExcluded = excludes.some(regex => regex.test(file.name));
    return !isExcluded;
  });

  if (targets.length === 0) {
    logCallback(`⚠️  ${targetFolderName} — Sin archivos elegibles según reglas.`);
    return;
  }

  // Lógica para determinar la ubicación de SALIDA del ZIP
  let outputHandle = targetDirHandle;
  if (task.outputRelativeTo === "parent") {
    outputHandle = parentHandle; // Subir un nivel
  } else if (task.outputRelativeTo === "cxcRoot") {
    outputHandle = cxcRootHandle; // Ir a la raíz del CXC
  }

  // Si se especificó una subcarpeta de salida (ej: "COMPRIMIDO")
  if (task.outputSubfolder) {
    outputHandle = await getOrCreateSubDir(outputHandle, task.outputSubfolder);
  }

  if (task.eachFileAsZip) {
    for (const file of targets) {
       const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
       const zipName = task.zipName
          .replace("{fileNameWithoutExt}", fileNameWithoutExt)
          .replace("{folderName}", targetFolderName);
          
       const blob = await crearZip([file]);
       await writeZipFile(outputHandle, zipName, blob);
       logCallback(`📦 ${targetFolderName}/${zipName} — (Archivo Individual)`);
    }
  } else {
    const zipName = task.zipName.replace("{folderName}", targetFolderName);
    const blob = await crearZip(targets);
    await writeZipFile(outputHandle, zipName, blob);
    logCallback(`📦 ${targetFolderName}/${zipName} — Generado correctamente.`);
  }
};
