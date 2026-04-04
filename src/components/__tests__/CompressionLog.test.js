import React from "react";
import { render, screen } from "@testing-library/react";
import CompressionLog from "../CompressionLog";

describe("CompressionLog Component", () => {
  it("debería devolver null cuando no hay entradas de log", () => {
    const { container } = render(<CompressionLog logEntries={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("debería renderizar la tabla cuando hay entradas", () => {
    const logEntries = [
      { name: "archivo1.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo2.pdf", date: "2024-01-01 10:00:01" },
    ];

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
  });

  it("debería renderizar los encabezados de la tabla correctamente", () => {
    const logEntries = [{ name: "archivo.txt", date: "2024-01-01 10:00:00" }];

    render(<CompressionLog logEntries={logEntries} />);

    expect(screen.getByText("Archivo")).toBeInTheDocument();
    expect(screen.getByText("Fecha/Hora")).toBeInTheDocument();
  });

  it("debería renderizar cada entrada del log en una fila", () => {
    const logEntries = [
      { name: "archivo1.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo2.pdf", date: "2024-01-01 10:00:01" },
      { name: "archivo3.doc", date: "2024-01-01 10:00:02" },
    ];

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(3);
  });

  it("debería mostrar el nombre correcto de los archivos", () => {
    const logEntries = [
      { name: "mi-documento.pdf", date: "2024-01-01 10:00:00" },
      { name: "imagen_2024.jpg", date: "2024-01-01 10:00:01" },
    ];

    render(<CompressionLog logEntries={logEntries} />);

    expect(screen.getByText("mi-documento.pdf")).toBeInTheDocument();
    expect(screen.getByText("imagen_2024.jpg")).toBeInTheDocument();
  });

  it("debería mostrar la fecha/hora correcta en la tabla", () => {
    const logEntries = [{ name: "archivo.txt", date: "31/3/2026, 14:30:45" }];

    render(<CompressionLog logEntries={logEntries} />);

    expect(screen.getByText("31/3/2026, 14:30:45")).toBeInTheDocument();
  });

  it("debería mostrar el contador correcto de archivos incluidos", () => {
    const logEntries = [
      { name: "archivo1.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo2.txt", date: "2024-01-01 10:00:01" },
      { name: "archivo3.txt", date: "2024-01-01 10:00:02" },
    ];

    render(<CompressionLog logEntries={logEntries} />);

    expect(screen.getByText("Archivos Incluidos: 3")).toBeInTheDocument();
  });

  it('debería mostrar "Archivos Incluidos: 1" con un solo archivo', () => {
    const logEntries = [{ name: "archivo.txt", date: "2024-01-01 10:00:00" }];

    render(<CompressionLog logEntries={logEntries} />);

    expect(screen.getByText("Archivos Incluidos: 1")).toBeInTheDocument();
  });

  it("debería tener la clase log en el contenedor principal", () => {
    const logEntries = [{ name: "archivo.txt", date: "2024-01-01 10:00:00" }];

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const logDiv = container.querySelector(".log");
    expect(logDiv).toBeInTheDocument();
  });

  it("debería renderizar un encabezado h3 con el texto de archivos incluidos", () => {
    const logEntries = [
      { name: "archivo1.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo2.txt", date: "2024-01-01 10:00:01" },
    ];

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const heading = container.querySelector("h3");
    expect(heading).toHaveTextContent("Archivos Incluidos: 2");
  });

  it("debería tener estructura table > thead > tr con th", () => {
    const logEntries = [{ name: "archivo.txt", date: "2024-01-01 10:00:00" }];

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const thead = container.querySelector("thead");
    const th = container.querySelectorAll("th");
    expect(thead).toBeInTheDocument();
    expect(th).toHaveLength(2);
  });

  it("debería tener estructura table > tbody > tr con td", () => {
    const logEntries = [
      { name: "archivo1.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo2.pdf", date: "2024-01-01 10:00:01" },
    ];

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const tbody = container.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    expect(tbody).toBeInTheDocument();
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelectorAll("td")).toHaveLength(2);
  });

  it("debería renderizar correctamente con un array vacío", () => {
    const { container } = render(<CompressionLog logEntries={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("debería renderizar correctamente cuando logEntries es undefined", () => {
    const { container } = render(<CompressionLog logEntries={undefined} />);

    // El componente debería manejar arrays vacíos o valores undefined
    expect(container.firstChild).toBeNull();
  });

  it("debería manejar archivos con nombres especiales", () => {
    const logEntries = [
      { name: "archivo con espacios.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo-con-guiones.pdf", date: "2024-01-01 10:00:01" },
      { name: "archivo_con_underscores.doc", date: "2024-01-01 10:00:02" },
    ];

    render(<CompressionLog logEntries={logEntries} />);

    expect(screen.getByText("archivo con espacios.txt")).toBeInTheDocument();
    expect(screen.getByText("archivo-con-guiones.pdf")).toBeInTheDocument();
    expect(screen.getByText("archivo_con_underscores.doc")).toBeInTheDocument();
  });

  it("debería manejar múltiples entradas de log correctamente", () => {
    const logEntries = Array.from({ length: 10 }, (_, i) => ({
      name: `archivo${i + 1}.txt`,
      date: `2024-01-01 10:00:0${i}`,
    }));

    const { container } = render(<CompressionLog logEntries={logEntries} />);

    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(10);
    expect(screen.getByText("Archivos Incluidos: 10")).toBeInTheDocument();
  });

  it("debería mostrar la tabla solo cuando hay entradas", () => {
    const { rerender, container } = render(<CompressionLog logEntries={[]} />);

    expect(container.querySelector("table")).not.toBeInTheDocument();

    rerender(
      <CompressionLog
        logEntries={[{ name: "archivo.txt", date: "2024-01-01 10:00:00" }]}
      />,
    );

    expect(container.querySelector("table")).toBeInTheDocument();
  });
});
