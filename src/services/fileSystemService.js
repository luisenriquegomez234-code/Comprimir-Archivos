/**
 * fileSystemService.js - Capa Híbrida de Acceso a Archivos
 * Detecta si está en Electron (nativo) o Navegador (Web API)
 */

const isElectron = () => !!(window.electronAPI && window.electronAPI.isElectron);

/**
 * Obtiene las subcarpetas de un directorio (handle o ruta)
 */
export const getSubDirs = async (dirHandleOrPath) => {
  if (isElectron()) {
    const contents = await window.electronAPI.listContents(dirHandleOrPath);
    return contents
      .filter(item => item.kind === "directory")
      .map(item => ({
        name: item.name,
        handle: window.electronAPI.joinPaths(dirHandleOrPath, item.name)
      }));
  }
  
  const dirs = [];
  for await (const [name, handle] of dirHandleOrPath.entries()) {
    if (handle.kind === 'directory') {
      dirs.push({ name, handle });
    }
  }
  return dirs;
};

/**
 * Obtiene los archivos de un directorio
 */
export const getFiles = async (dirHandleOrPath) => {
  if (isElectron()) {
    const contents = await window.electronAPI.listContents(dirHandleOrPath);
    const files = [];
    for (const item of contents) {
      if (item.kind === "file") {
        const filePath = window.electronAPI.joinPaths(dirHandleOrPath, item.name);
        const buffer = await window.electronAPI.readFile(filePath);
        // Convertimos Buffer/Uint8Array a File objeto simulado para JSZip
        const file = new File([buffer], item.name);
        files.push({ name: item.name, file, handle: filePath });
      }
    }
    return files;
  }

  const files = [];
  for await (const [name, handle] of dirHandleOrPath.entries()) {
    if (handle.kind === 'file') {
      const file = await handle.getFile();
      files.push({ name, file, handle });
    }
  }
  return files;
};

/**
 * Obtiene o crea un subdirectorio
 */
export const getOrCreateSubDir = async (parentHandleOrPath, name) => {
  if (isElectron()) {
    const subPath = window.electronAPI.joinPaths(parentHandleOrPath, name);
    await window.electronAPI.mkdir(subPath);
    return subPath;
  }
  return await parentHandleOrPath.getDirectoryHandle(name, { create: true });
};

/**
 * Escribe un blob (ZIP) en un directorio
 */
export const writeZipFile = async (dirHandleOrPath, filename, blob) => {
  if (isElectron()) {
    const filePath = window.electronAPI.joinPaths(dirHandleOrPath, filename);
    const arrayBuffer = await blob.arrayBuffer();
    await window.electronAPI.writeFile(filePath, arrayBuffer);
    return;
  }
  
  const fileHandle = await dirHandleOrPath.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
};

/**
 * Obtiene todas las carpetas que comienzan con "CXC"
 */
export const getCXCDirs = async (rootHandleOrPath) => {
  const dirs = await getSubDirs(rootHandleOrPath);
  return dirs.filter(({ name }) => name.toUpperCase().startsWith('CXC'));
};
