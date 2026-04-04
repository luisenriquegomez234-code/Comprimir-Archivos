import { useState, useCallback } from "react";
import { getCXCDirs } from "../services/fileSystemService";
import { procesadores } from "../services/entityProcessors";

/**
 * Hook principal para el procesamiento por entidad
 */
export const useEntityProcessing = () => {
  const [rootHandle, setRootHandle] = useState(null);
  const [rootFolderName, setRootFolderName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState([]);
  const [error, setError] = useState(null);

  /** Abre el selector de carpeta raíz usando la File System Access API */
  const seleccionarCarpeta = useCallback(async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      setRootHandle(handle);
      setRootFolderName(handle.name);
      setLog([]);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("No se pudo abrir la carpeta raíz.");
      }
    }
  }, []);

  /** Ejecuta el procesamiento de la entidad seleccionada */
  const procesar = useCallback(
    async (entityId) => {
      if (!rootHandle) {
        const msg = "Selecciona primero una carpeta raíz.";
        setError(msg);
        return { success: false, errorMsg: msg };
      }

      const procesador = procesadores[entityId];
      if (!procesador) {
        const msg = "Entidad no reconocida.";
        setError(msg);
        return { success: false, errorMsg: msg };
      }

      setProcessing(true);
      setError(null);

      const entries = [];
      const addLog = (message) => {
        const entry = { message, date: new Date().toLocaleString() };
        entries.push(entry);
        setLog([...entries]);
      };

      try {
        // ── Detección automática del nivel de carpeta seleccionado ────────────
        // Nivel 1: el usuario seleccionó la carpeta padre (ej: POSITIVA)
        //          → contiene subcarpetas que empiezan con CXC
        // Nivel 2: el usuario seleccionó directamente una carpeta CXC
        //          → la tratamos como si fuera la única CXC a procesar
        // Incorrecto: seleccionó CTFE u otra carpeta que no aplica

        let dirsToProcess = await getCXCDirs(rootHandle);

        if (dirsToProcess.length === 0) {
          const nombreRaiz = rootHandle.name.toUpperCase();

          if (nombreRaiz.startsWith("CXC")) {
            // El usuario seleccionó la carpeta CXC directamente → OK
            addLog(`📂 Carpeta CXC seleccionada directamente: "${rootHandle.name}"`);
            dirsToProcess = [{ name: rootHandle.name, handle: rootHandle }];
          } else {
            // Seleccionó un nivel incorrecto (CTFE, RIPS, etc.)
            const esCTFE = nombreRaiz.startsWith("CTFE");
            const hint = esCTFE
              ? `Seleccionaste "${rootHandle.name}" (carpeta CTFE). Debes subir DOS niveles: selecciona la carpeta que contiene las subcarpetas CXC (ej: "POSITIVA COMPAÑIA DE SEGUROS S.A") o sube UN nivel y selecciona la carpeta CXC (ej: "CXC 122781").`
              : `La carpeta "${rootHandle.name}" no contiene subcarpetas CXC. Selecciona la carpeta padre que contiene las CXC (ej: "POSITIVA COMPAÑIA DE SEGUROS S.A") o la carpeta CXC directamente (ej: "CXC 122781").`;
            addLog(`❌ ${hint}`);
            setError(hint);
            setProcessing(false);
            return { success: false, errorMsg: hint };
          }
        } else {
          addLog(`🔍 ${dirsToProcess.length} carpeta(s) CXC encontrada(s) en "${rootHandle.name}"`);
        }

        for (const { name, handle } of dirsToProcess) {
          addLog(`📂 Procesando: ${name}`);
          await procesador(handle, addLog);
        }

        const zipCount = entries.filter((e) => e.message.startsWith("📦")).length;
        addLog(`✅ Procesamiento completado — ${zipCount} ZIP(s) generados.`);
        setProcessing(false);
        return { success: true, errorMsg: null };
      } catch (err) {
        console.error("Error al procesar:", err);
        const msg = `Error durante el procesamiento: ${err.message}`;
        addLog(`❌ ${msg}`);
        setError(msg);
        setProcessing(false);
        return { success: false, errorMsg: msg };
      }
    },
    [rootHandle]
  );

  /** Limpia todo el estado */
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
