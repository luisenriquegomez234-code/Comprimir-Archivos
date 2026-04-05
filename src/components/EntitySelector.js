import React, { useState, useEffect } from "react";
import styles from "./EntitySelector.module.css";

function EntitySelector({ value, onChange, disabled }) {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    // Carga dinámica desde la configuración raíz
    fetch("./entidades_config.json")
      .then(res => res.json())
      .then(data => {
        const entityList = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name
        }));
        
        // Ordenamos las entidades de forma alfabética/numérica como solicitó el usuario
        entityList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
        
        setEntities(entityList);
      })
      .catch(err => console.error("Error cargando entidades:", err));
  }, []);

  return (
    <div className={styles.selectorContainer}>
      <header className={styles.header}>
        <span className={styles.icon}>🏢</span>
        <h2 className={styles.title}>Entidad Aseguradora</h2>
      </header>

      <div className={styles.inputWrapper}>
        <select
          id="entity-select"
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="Seleccionar entidad aseguradora"
        >
          <option value="">— Elija una Entidad —</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
        <div className={styles.selectArrow}>▼</div>
      </div>
    </div>
  );
}

export default EntitySelector;
