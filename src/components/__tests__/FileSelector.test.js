import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileSelector from "../FileSelector";

describe("FileSelector Component", () => {
  it("debería renderizar sin errores", () => {
    const mockOnFileChange = jest.fn();
    render(<FileSelector onFileChange={mockOnFileChange} />);

    expect(screen.getByText("Escoger Archivos")).toBeInTheDocument();
  });

  it("debería renderizar dos inputs de archivo", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const inputs = container.querySelectorAll('input[type="file"]');
    expect(inputs).toHaveLength(2);
  });

  it("debería renderizar input con atributo multiple para archivos", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]:not([webkitdirectory])',
    );
    expect(fileInput).toHaveAttribute("multiple");
  });

  it("debería renderizar input con atributo webkitdirectory para carpeta", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const folderInput = container.querySelector("input[webkitdirectory]");
    expect(folderInput).toHaveAttribute("multiple");
  });

  it("debería llamar a onFileChange cuando se seleccionan archivos", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]:not([webkitdirectory])',
    );
    const file = new File(["contenido"], "archivo.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnFileChange).toHaveBeenCalledTimes(1);
    expect(mockOnFileChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([file]),
        }),
      }),
    );
  });

  it("debería pasar múltiples archivos al callback", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]:not([webkitdirectory])',
    );
    const file1 = new File(["contenido1"], "archivo1.txt");
    const file2 = new File(["contenido2"], "archivo2.pdf");

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    expect(mockOnFileChange).toHaveBeenCalledTimes(1);
    const callArgs = mockOnFileChange.mock.calls[0][0];
    expect(callArgs.target.files).toHaveLength(2);
  });

  it('debería renderizar el título "Escoger Archivos"', () => {
    const mockOnFileChange = jest.fn();
    render(<FileSelector onFileChange={mockOnFileChange} />);

    expect(screen.getByText("Escoger Archivos")).toBeInTheDocument();
  });

  it('debería renderizar el título "Escoger Carpeta"', () => {
    const mockOnFileChange = jest.fn();
    render(<FileSelector onFileChange={mockOnFileChange} />);

    expect(screen.getByText("Escoger Carpeta")).toBeInTheDocument();
  });

  it("debería tener etiqueta con clase file-btn para archivos", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const fileLabel = container.querySelector("label.file-btn");
    expect(fileLabel).toBeInTheDocument();
    expect(fileLabel).toHaveTextContent("Escoger Archivos");
  });

  it("debería tener etiqueta con clase folder-btn para carpeta", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const folderLabel = container.querySelector("label.folder-btn");
    expect(folderLabel).toBeInTheDocument();
    expect(folderLabel).toHaveTextContent("Escoger Carpeta");
  });

  it("debería tener div selector para archivos", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const selectors = container.querySelectorAll(".selector");
    expect(selectors).toHaveLength(2);
  });

  it("debería tener div selectors conteniendo todos los selectores", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const selectorsContainer = container.querySelector(".selectors");
    expect(selectorsContainer).toBeInTheDocument();
    expect(selectorsContainer.querySelectorAll(".selector")).toHaveLength(2);
  });

  it("debería permitir seleccionar archivos múltiples en la entrada de archivos", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]:not([webkitdirectory])',
    );
    expect(fileInput).toHaveAttribute("multiple");
  });

  it("debería permitir seleccionar múltiples archivos en la entrada de carpeta", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const folderInput = container.querySelector("input[webkitdirectory]");
    expect(folderInput).toHaveAttribute("multiple");
  });

  it("debería manejar múltiples cambios de archivo secuencialmente", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]:not([webkitdirectory])',
    );
    const file1 = new File(["contenido1"], "archivo1.txt");
    const file2 = new File(["contenido2"], "archivo2.txt");

    fireEvent.change(fileInput, { target: { files: [file1] } });
    expect(mockOnFileChange).toHaveBeenCalledTimes(1);

    fireEvent.change(fileInput, { target: { files: [file2] } });
    expect(mockOnFileChange).toHaveBeenCalledTimes(2);
  });

  it("debería mantener la estructura h2 para títulos", () => {
    const mockOnFileChange = jest.fn();
    const { container } = render(
      <FileSelector onFileChange={mockOnFileChange} />,
    );

    const headings = container.querySelectorAll("h2");
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent("Escoger Archivos");
    expect(headings[1]).toHaveTextContent("Escoger Carpeta");
  });
});
