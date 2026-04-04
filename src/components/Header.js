import React from "react";
import styles from "./Header.module.css";

function Header({ logoSrc, title }) {
  return (
    <header className={styles.header}>
      <img
        src={logoSrc}
        alt="Logo Aplicación"
        className={styles.logo}
      />
      <div className={styles.headerInfo}>
        <h1>{title}</h1>
      </div>
    </header>
  );
}

export default Header;
