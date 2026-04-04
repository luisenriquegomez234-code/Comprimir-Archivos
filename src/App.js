import React, { useState } from "react";
import "./App.css";
import { useEntityProcessing } from "./hooks/useEntityProcessing";
import Header from "./components/Header";
import EntitySelector from "./components/EntitySelector";
import FileSelector from "./components/FileSelector";
import ActionButtons from "./components/ActionButtons";
import CompressionLog from "./components/CompressionLog";

function App() {
  const [files, setFiles] = useState([]);
  const [log, setLog] = useState([]);

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

  const comprimir = async () => {
    if (files.length === 0) {
      alert("Selecciona primero archivos o carpeta.");
      return;
    }

    const zip = new JSZip();
    const logEntries = [];

    for (const file of files) {
      const contenido = await file.arrayBuffer();
      zip.file(file.name, contenido);
      logEntries.push({
        name: file.name,
        date: new Date().toLocaleString(),
      });
    }

    setLog(logEntries);

    const blob = await zip.generateAsync({ type: "blob" });

    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "Comprimido.zip",
          types: [{ description: "Archivo ZIP", accept: { "application/zip": [".zip"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert("ZIP guardado correctamente.");
        return;
      } catch (err) {
        console.error("Error al guardar:", err);
      }
    }

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "Comprimido.zip";
    enlace.click();
  };

  return (
    <div>
      <header className="header">
        <img src="/logo-clinica.png" alt="Logo Aplicación" className="logo" />
        <div className="header-info">
          <h1>Comprimir Archivos</h1>
        </div>
      </header>

      <div className="container">
        <div className="selectors">
          <div className="selector">
            <h2>Escoger Archivos</h2>
            <label className="file-btn">
              Escoger Archivos
              <input type="file" multiple onChange={handleFileChange} />
            </label>
          </div>
          <div className="selector">
            <h2>Escoger Carpeta</h2>
            <label className="folder-btn">
              Escoger Carpeta
              <input type="file" webkitdirectory="true" multiple onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <div className="actions">
          <button className="compress-btn" onClick={comprimir}>
            🚀 Comprimir y Guardar ZIP
          </button>
          <button className="clear-btn" onClick={limpiar}>
            🧹 Limpiar
          </button>
        </div>

        {log.length > 0 && (
          <div className="log">
            <h3>Archivos Incluidos: {log.length}</h3>
            <table>
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Fecha/Hora</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.name}</td>
                    <td>{entry.date}</td>
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
