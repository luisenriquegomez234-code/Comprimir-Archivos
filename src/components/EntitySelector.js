import React from "react";
import styles from "./EntitySelector.module.css";
import { ENTITIES } from "../constants/entities";

function EntitySelector({ value, onChange, disabled }) {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="entity-select">
        🏢 Entidad Aseguradora
      </label>
      <select
        id="entity-select"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Seleccionar entidad aseguradora"
      >
        <option value="">— Seleccione una entidad —</option>
        {ENTITIES.map((entity) => (
          <option key={entity.id} value={entity.id}>
            {entity.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EntitySelector;
