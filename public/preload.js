const { contextBridge, ipcRenderer } = require("electron");

// Exponemos una API segura al proceso de renderizado (React)
contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  
  // Función para abrir el selector de carpetas nativo y devolver la ruta
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  
  // Funciones de sistema de archivos (envueltas en promesas de IPC)
  listContents: (path) => ipcRenderer.invoke("fs:listContents", path),
  readFile: (path) => ipcRenderer.invoke("fs:readFile", path),
  writeFile: (path, buffer) => ipcRenderer.invoke("fs:writeFile", { path, buffer }),
  mkdir: (path) => ipcRenderer.invoke("fs:mkdir", path),
  
  // Función de ayuda para unir rutas (importante en Windows)
  joinPaths: (...args) => args.join("\\"),
  
  // Verificación de existencia
  exists: (path) => ipcRenderer.invoke("fs:exists", path)
});
