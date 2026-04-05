import React, { useState } from "react";
import "./App.css";
import { useEntityProcessing } from "./hooks/useEntityProcessing";
import EntitySelector from "./components/EntitySelector";
import FileSelector from "./components/FileSelector";
import ActionButtons from "./components/ActionButtons";
import CompressionLog from "./components/CompressionLog";

function App() {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  
  const {
    rootHandle,
    rootFolderName,
    processing,
    log,
    error,
    seleccionarCarpeta,
    procesar,
    limpiar,
  } = useEntityProcessing();

  const handleProcess = async () => {
    if (!selectedEntityId) return;
    if (!rootHandle) return;
    await procesar(selectedEntityId);
  };

  const handleClear = () => {
    limpiar();
    setSelectedEntityId("");
  };

  return (
    <div className="app-wrapper">
      <header className="header">
        <img src="./logo-clinica.png" alt="Logo Clínica" className="logo" />
        <div className="header-info">
          <h1>Comprimir Archivos</h1>
          <p className="header-subtitle">Sistema Automatizado de Procesamiento de Cuentas</p>
        </div>
      </header>

      <main className="container">
        {/* PANEL IZQUIERDO: Selectores y Acciones */}
        <section className="left-panel">
          <div className="card">
            <EntitySelector 
              value={selectedEntityId}
              onChange={setSelectedEntityId}
              disabled={processing}
            />
          </div>

          <div className="card">
            <FileSelector 
              onSelectFolder={seleccionarCarpeta}
              folderName={rootFolderName} // handle o string path
              disabled={processing}
            />
          </div>

          <ActionButtons 
            onCompress={handleProcess}
            onClear={handleClear}
            loading={processing}
            hasFolder={!!rootHandle}
            hasEntity={!!selectedEntityId}
          />
        </section>

        {/* PANEL DERECHO: Registro de Procesamiento */}
        <section className="right-panel">
          <div className="card log-card">
            <CompressionLog 
              logEntries={log}
              error={error}
            />
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Clínica - Departamento de Tecnología</p>
      </footer>
    </div>
  );
}

export default App;
