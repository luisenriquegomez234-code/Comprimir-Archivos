import React, { useState } from "react";
import "./App.css";
import { useEntityProcessing } from "./hooks/useEntityProcessing";
import Header from "./components/Header";
import EntitySelector from "./components/EntitySelector";
import FileSelector from "./components/FileSelector";
import ActionButtons from "./components/ActionButtons";
import CompressionLog from "./components/CompressionLog";

function App() {
  const [selectedEntity, setSelectedEntity] = useState("");

  const {
    rootFolderName,
    processing,
    log,
    error,
    seleccionarCarpeta,
    procesar,
    limpiar,
  } = useEntityProcessing();

  const handleProcesar = async () => {
    if (!selectedEntity) {
      alert("❌ Selecciona una entidad primero.");
      return;
    }
    const result = await procesar(selectedEntity);
    if (!result.success && result.errorMsg) {
      alert(`❌ ${result.errorMsg}`);
    }
  };

  const handleLimpiar = () => {
    setSelectedEntity("");
    limpiar();
  };

  return (
    <div className="app">
      <Header
        logoSrc="/logo-clinica.png"
        title="Comprimir Archivos"
      />
      <div className="container">
        <EntitySelector
          value={selectedEntity}
          onChange={setSelectedEntity}
          disabled={processing}
        />
        <FileSelector
          onSelectFolder={seleccionarCarpeta}
          folderName={rootFolderName}
          disabled={processing}
        />
        <ActionButtons
          onCompress={handleProcesar}
          onClear={handleLimpiar}
          loading={processing}
          hasFolder={!!rootFolderName}
          hasEntity={!!selectedEntity}
        />
        <CompressionLog logEntries={log} error={error} />
      </div>
    </div>
  );
}

export default App;
