import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ActionButtons from "../ActionButtons";

describe("ActionButtons Component", () => {
  it("debería renderizar dos botones", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    const { container } = render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(2);
  });

  it("debería renderizar botón de comprimir con texto correcto", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    expect(screen.getByText(/Comprimir y Guardar ZIP/i)).toBeInTheDocument();
  });

  it("debería renderizar botón de limpiar", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    expect(screen.getByText(/Limpiar/i)).toBeInTheDocument();
  });

  it("debería llamar a onCompress cuando se hace click en el botón de comprimir", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    const compressButton = screen.getByRole("button", {
      name: /Comprimir y Guardar ZIP/i,
    });
    fireEvent.click(compressButton);

    expect(mockOnCompress).toHaveBeenCalledTimes(1);
  });

  it("debería llamar a onClear cuando se hace click en el botón de limpiar", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    const clearButton = screen.getByRole("button", { name: /Limpiar/i });
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("debería deshabilitar los botones cuando loading es true", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={true}
      />,
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("debería habilitar los botones cuando loading es false", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={false}
      />,
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it("debería habilitar los botones por defecto (sin prop loading)", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('debería mostrar "⏳ Comprimiendo..." cuando loading es true', () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={true}
      />,
    );

    expect(screen.getByText(/Comprimiendo/i)).toBeInTheDocument();
  });

  it('debería mostrar "🚀 Comprimir y Guardar ZIP" cuando loading es false', () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={false}
      />,
    );

    expect(screen.getByText(/🚀 Comprimir y Guardar ZIP/i)).toBeInTheDocument();
  });

  it("debería tener las clases CSS correctas en los botones", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    const { container } = render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    expect(container.querySelector(".compress-btn")).toBeInTheDocument();
    expect(container.querySelector(".clear-btn")).toBeInTheDocument();
  });

  it("debería tener un div con clase actions conteniendo los botones", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    const { container } = render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    const actionsDiv = container.querySelector(".actions");
    expect(actionsDiv).toBeInTheDocument();
    expect(actionsDiv.querySelectorAll("button")).toHaveLength(2);
  });

  it("debería permitir múltiples clicks en los botones", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    const compressButton = screen.getByRole("button", {
      name: /Comprimir y Guardar ZIP/i,
    });
    fireEvent.click(compressButton);
    fireEvent.click(compressButton);

    expect(mockOnCompress).toHaveBeenCalledTimes(2);
  });

  it("debería no llamar a callbacks cuando está en estado loading", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={true}
      />,
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(mockOnCompress).not.toHaveBeenCalled();
    expect(mockOnClear).not.toHaveBeenCalled();
  });

  it("debería mostrar el botón de limpiar con icono", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
      />,
    );

    expect(screen.getByText(/🧹/i)).toBeInTheDocument();
  });

  it("debería cambiar de estado cuando loading cambia de true a false", () => {
    const mockOnCompress = jest.fn();
    const mockOnClear = jest.fn();

    const { rerender } = render(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={true}
      />,
    );

    let buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    rerender(
      <ActionButtons
        onCompress={mockOnCompress}
        onClear={mockOnClear}
        loading={false}
      />,
    );

    buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });
});
