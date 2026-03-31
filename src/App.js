import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [log, setLog] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const companies = {
    positiva: "POSITIVA COMPAÑIA DE SEGUROS S.A",
    saludtotal: "SALUD TOTAL EPS S S.A",
    bolivar: "COMPAÑIA DE SEGUROS BOLIVAR S.A",
    mundial: "COMPAÑIA MUNDIAL DE SEGUROS S.A",
    sanitas: "ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S",
    previsora: "LA PREVISORA S.A COMPAÑÍA DE SEGUROS",
  };

  // Limpiar automáticamente al cargar la página
  useEffect(() => {
    setFiles([]);
    setLog([]);
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const limpiar = () => {
    setFiles([]);
    setLog([]);
  };

  // Funciones auxiliares para extraer información del nombre de archivo
  const extractFileInfo = (fileName) => {
    // Intenta extraer: Prefijo (CTFE, CUV, etc) + Número
    const match = fileName.match(/([A-Z]+)(\d+)/);
    return {
      prefijo: match ? match[1] : "",
      numero: match ? match[2] : "",
      extension: fileName.split(".").pop().toLowerCase(),
      nombreCompleto: fileName,
    };
  };

  const extractNit = (fileName) => {
    // Intenta extraer NIT (ej: 812005130)
    const match = fileName.match(/(\d{10,})/);
    return match ? match[1] : "";
  };

  // Lógica específica por compañía
  const procesarPositiva = async (selectedFiles) => {
    const zipGroups = {};
    const pdfZips = {};
    const logEntries = [];

    for (const file of selectedFiles) {
      const info = extractFileInfo(file.name);
      const ext = info.extension;

      // Archivos para Rips_Prefijo+Numero
      if (["xml", "txt", "json"].includes(ext)) {
        const zipName = `Rips_${info.prefijo}${info.numero}.zip`;
        if (!zipGroups[zipName]) {
          zipGroups[zipName] = new JSZip();
        }
        const content = await file.arrayBuffer();
        zipGroups[zipName].file(file.name, content);
        logEntries.push({ name: file.name, action: `Incluido en ${zipName}` });
      }

      // PDFs (excluir que comienzan con CTFE)
      if (ext === "pdf" && !file.name.startsWith("CTFE")) {
        const zipName = `${info.prefijo}${info.numero}.zip`;
        if (!pdfZips[zipName]) {
          pdfZips[zipName] = new JSZip();
        }
        const content = await file.arrayBuffer();
        pdfZips[zipName].file(file.name, content);
        logEntries.push({ name: file.name, action: `Incluido en ${zipName}` });
      } else if (ext === "pdf" && file.name.startsWith("CTFE")) {
        logEntries.push({
          name: file.name,
          action: "Excluido (PDF con prefijo CTFE)",
        });
      }
    }

    return { zipGroups: { ...zipGroups, ...pdfZips }, logEntries };
  };

  const procesarSaludTotal = async (selectedFiles) => {
    const zipGroups = {};
    const logEntries = [];

    for (const file of selectedFiles) {
      const nit = extractNit(file.name);
      const info = extractFileInfo(file.name);

      if (file.name.includes(".json")) {
        const zipName = `${nit}_${info.prefijo}${info.numero}.zip`;
        if (!zipGroups[zipName]) {
          zipGroups[zipName] = new JSZip();
        }
        const content = await file.arrayBuffer();
        zipGroups[zipName].file(file.name, content);
        logEntries.push({ name: file.name, action: `Incluido en ${zipName}` });
      }
    }

    return { zipGroups, logEntries };
  };

  const procesarBolivar = async (selectedFiles) => {
    const zipData = new JSZip();
    const logEntries = [];

    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop().toLowerCase();

      // Incluir pdf, txt, json (excluir PDFs que comienzan con CTFE)
      if (["pdf", "txt", "json"].includes(ext)) {
        if (ext === "pdf" && file.name.startsWith("CTFE")) {
          logEntries.push({
            name: file.name,
            action: "Excluido (PDF con prefijo CTFE)",
          });
          continue;
        }
        const content = await file.arrayBuffer();
        zipData.file(file.name, content);
        logEntries.push({ name: file.name, action: "Incluido en ZIP" });
      }
    }

    const info = extractFileInfo(selectedFiles[0]?.name || "");
    const zipName = `FAC_${info.prefijo}${info.numero}.zip`;

    return { zipGroups: { [zipName]: zipData }, logEntries };
  };

  const procesarMundial = async (selectedFiles) => {
    const zipGroups = {};
    const logEntries = [];

    for (const file of selectedFiles) {
      if (file.name.endsWith(".pdf")) {
        const nit = extractNit(file.name);
        const info = extractFileInfo(file.name);
        const zipName = `${nit}-${info.prefijo}${info.numero}.zip`;

        zipGroups[zipName] = new JSZip();
        const content = await file.arrayBuffer();
        zipGroups[zipName].file(file.name, content);
        logEntries.push({
          name: file.name,
          action: `Comprimido en ${zipName}`,
        });
      }
    }

    return { zipGroups, logEntries };
  };

  const procesarSanitas = async (selectedFiles) => {
    const zipData = new JSZip();
    const logEntries = [];

    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop().toLowerCase();

      // Incluir ad.xml, pdf, json (excluir PDFs que comienzan con CTFE)
      if (["xml", "pdf", "json"].includes(ext)) {
        if (ext === "pdf" && file.name.startsWith("CTFE")) {
          logEntries.push({
            name: file.name,
            action: "Excluido (PDF con prefijo CTFE)",
          });
          continue;
        }
        const content = await file.arrayBuffer();
        zipData.file(file.name, content);
        logEntries.push({ name: file.name, action: "Incluido en ZIP" });
      }
    }

    const info = extractFileInfo(selectedFiles[0]?.name || "");
    const zipName = `${info.prefijo}${info.numero}.zip`;

    return { zipGroups: { [zipName]: zipData }, logEntries };
  };

  const procesarPrevisora = async (selectedFiles) => {
    const zipGroups = {};
    const logEntries = [];

    // Agrupar por carpeta
    const carpetas = {};
    for (const file of selectedFiles) {
      const ruta = file.webkitRelativePath || file.name;
      const carpeta = ruta.split("/")[0];

      if (["CUV", "RIPS", "SOPORTE"].includes(carpeta)) {
        if (!carpetas[carpeta]) {
          carpetas[carpeta] = [];
        }
        carpetas[carpeta].push(file);
      }
    }

    // Crear ZIP por cada carpeta
    for (const [carpeta, archivos] of Object.entries(carpetas)) {
      const zip = new JSZip();
      for (const file of archivos) {
        const content = await file.arrayBuffer();
        const nombreArchivo = file.name;
        zip.file(nombreArchivo, content);
        logEntries.push({
          name: nombreArchivo,
          action: `Incluido en ${carpeta}.zip`,
        });
      }
      zipGroups[`${carpeta}.zip`] = zip;
    }

    return { zipGroups, logEntries };
  };

  const comprimir = async () => {
    if (files.length === 0) {
      alert("Selecciona primero archivos o carpeta.");
      return;
    }

    if (!selectedCompany) {
      alert("Selecciona una compañía.");
      return;
    }

    let result = { zipGroups: {}, logEntries: [] };

    try {
      switch (selectedCompany) {
        case "positiva":
          result = await procesarPositiva(files);
          break;
        case "saludtotal":
          result = await procesarSaludTotal(files);
          break;
        case "bolivar":
          result = await procesarBolivar(files);
          break;
        case "mundial":
          result = await procesarMundial(files);
          break;
        case "sanitas":
          result = await procesarSanitas(files);
          break;
        case "previsora":
          result = await procesarPrevisora(files);
          break;
        default:
          alert("Compañía no válida");
          return;
      }

      setLog(result.logEntries);

      // Descargar ZIPs
      for (const [zipName, zipData] of Object.entries(result.zipGroups)) {
        const blob = await zipData.generateAsync({ type: "blob" });

        if (window.showSaveFilePicker) {
          try {
            const handle = await window.showSaveFilePicker({
              suggestedName: zipName,
              types: [
                {
                  description: "Archivo ZIP",
                  accept: { "application/zip": [".zip"] },
                },
              ],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (err) {
            console.error("Error al guardar:", err);
          }
        } else {
          const enlace = document.createElement("a");
          enlace.href = URL.createObjectURL(blob);
          enlace.download = zipName;
          enlace.click();
        }
      }

      alert(
        `Compresión completada. Se generaron ${Object.keys(result.zipGroups).length} archivo(s).`,
      );
    } catch (error) {
      console.error("Error en la compresión:", error);
      alert("Error en la compresión: " + error.message);
    }
  };

  return (
    <div>
      <header className="header">
        <img
          src="/logo-clinica.png"
          alt="Logo Aplicación"
          className="logo"
        />
        <div className="header-info">
          <h1>Comprimir Archivos</h1>
          <p>Aplicación de compresión personalizada por compañía</p>
        </div>
      </header>

      <div className="container">
        <div className="company-selector">
          <h2>Selecciona la Compañía</h2>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="company-select"
          >
            <option value="">-- Selecciona una compañía --</option>
            <option value="positiva">POSITIVA COMPAÑIA DE SEGUROS S.A</option>
            <option value="saludtotal">SALUD TOTAL EPS S S.A</option>
            <option value="bolivar">COMPAÑIA DE SEGUROS BOLIVAR S.A</option>
            <option value="mundial">COMPAÑIA MUNDIAL DE SEGUROS S.A</option>
            <option value="sanitas">
              ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S
            </option>
            <option value="previsora">
              LA PREVISORA S.A COMPAÑÍA DE SEGUROS
            </option>
          </select>
        </div>

        <div className="selectors">
          <div className="selector">
            <h2>Escoger Archivos</h2>
            <label className="file-btn">
              Escoger Archivos
              <input
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="selector">
            <h2>Escoger Carpeta</h2>
            <label className="folder-btn">
              Escoger Carpeta
              <input
                type="file"
                webkitdirectory="true"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="files-info">
            <p>
              <strong>Archivos seleccionados:</strong> {files.length}
            </p>
          </div>
        )}

        <div className="actions">
          <button
            className="compress-btn"
            onClick={comprimir}
          >
            🚀 Comprimir y Guardar ZIP
          </button>
          <button
            className="clear-btn"
            onClick={limpiar}
          >
            🧹 Limpiar
          </button>
        </div>

        {log.length > 0 && (
          <div className="log">
            <h3>Proceso de Compresión: {log.length} acciones</h3>
            <table>
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.name}</td>
                    <td>{entry.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
