import { useState, useCallback, useEffect } from "react";
import { getCXCDirs } from "../services/fileSystemService";
import { executeGenericTask } from "../services/genericProcessor";

/**
 * Hook principal para el procesamiento por entidad (Híbrido)
 */
export const useEntityProcessing = () => {
  const [rootHandle, setRootHandle] = useState(null); // Puede ser DirectoryHandle o String (Ruta)
  const [rootFolderName, setRootFolderName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState([]);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Carga de configuración usando ruta relativa para compatibilidad
    fetch("./entidades_config.json")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Error cargando configuración:", err));
  }, []);

  /** Abre el selector de carpeta */
  const seleccionarCarpeta = useCallback(async () => {
    try {
      // Detección de entorno Electron
      if (window.electronAPI && window.electronAPI.isElectron) {
        const path = await window.electronAPI.selectFolder();
        if (path) {
          setRootHandle(path);
          setRootFolderName(path.split("\\").pop());
          setLog([]);
          setError(null);
        }
        return;
      }

      // Fallback a Web API
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      setRootHandle(handle);
      setRootFolderName(handle.name);
      setLog([]);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("No se pudo seleccionar la carpeta.");
      }
    }
  }, []);

  /** Ejecuta el procesamiento */
  const procesar = useCallback(
    async (entityId) => {
      if (!rootHandle) return { success: false, errorMsg: "Selecciona una carpeta." };
      if (!config || !config[entityId]) return { success: false, errorMsg: "Configuración inválida." };

      setProcessing(true);
      setError(null);

      const entries = [];
      const addLog = (message) => {
        const entry = { message, date: new Date().toLocaleString() };
        entries.push(entry);
        setLog([...entries]);
      };

      try {
        let dirsToProcess = await getCXCDirs(rootHandle);

        if (dirsToProcess.length === 0) {
          addLog("❌ No se encontraron carpetas CXC.");
          setProcessing(false);
          return { success: false };
        }

        addLog(`🔍 ${dirsToProcess.length} carpeta(s) CXC encontrada(s).`);

        const entityConfig = config[entityId];

        for (const { name, handle } of dirsToProcess) {
          addLog(`📂 Procesando: ${name}`);
          for (const task of entityConfig.tasks) {
            // Pasamos: (Parent, Target, Task, Log, CXCRoot)
            await executeGenericTask(rootHandle, handle, task, addLog, handle);
          }
        }

        addLog("✅ Procesamiento completado.");
        setProcessing(false);
        return { success: true };
      } catch (err) {
        console.error("Error en procesamiento:", err);
        const msg = `Error: ${err.message}`;
        addLog(`❌ ${msg}`);
        setError(msg);
        setProcessing(false);
        return { success: false };
      }
    },
    [rootHandle, config]
  );

  const limpiar = useCallback(() => {
    setRootHandle(null);
    setRootFolderName("");
    setLog([]);
    setError(null);
  }, []);

  return {
    rootHandle,
    rootFolderName,
    processing,
    log,
    error,
    seleccionarCarpeta,
    procesar,
    limpiar,
  };
};
