/**
 * Obtiene las subcarpetas de un directorio handle
 */
export const getSubDirs = async (dirHandle) => {
  const dirs = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'directory') {
      dirs.push({ name, handle });
    }
  }
  return dirs;
};

/**
 * Obtiene los archivos de un directorio handle
 */
export const getFiles = async (dirHandle) => {
  const files = [];
  for await (const [name, handle] of dirHandle.entries()) {
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
export const getOrCreateSubDir = async (parentHandle, name) => {
  return await parentHandle.getDirectoryHandle(name, { create: true });
};

/**
 * Intenta obtener un subdirectorio sin lanzar error si no existe
 */
export const tryGetSubDir = async (parentHandle, name) => {
  try {
    return await parentHandle.getDirectoryHandle(name);
  } catch {
    return null;
  }
};

/**
 * Escribe un blob como archivo en un directorio
 */
export const writeZipFile = async (dirHandle, filename, blob) => {
  const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
};

/**
 * Obtiene todas las carpetas que comienzan con "CXC" en el directorio raíz
 */
export const getCXCDirs = async (rootHandle) => {
  const dirs = await getSubDirs(rootHandle);
  return dirs.filter(({ name }) => name.toUpperCase().startsWith('CXC'));
};

/**
 * Obtiene todos los archivos PDF de forma recursiva en un directorio
 */
export const getPDFsRecursive = async (dirHandle) => {
  const result = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file' && name.toLowerCase().endsWith('.pdf')) {
      const file = await handle.getFile();
      result.push({ name, file, handle });
    } else if (handle.kind === 'directory') {
      const sub = await getPDFsRecursive(handle);
      result.push(...sub);
    }
  }
  return result;
};
