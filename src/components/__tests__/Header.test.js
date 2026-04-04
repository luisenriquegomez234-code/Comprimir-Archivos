import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header Component", () => {
  const mockLogoSrc = "https://via.placeholder.com/50";
  const mockTitle = "Compresor de Archivos";

  it("debería renderizar el componente sin errores", () => {
    const { container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    expect(container).toBeInTheDocument();
  });

  it("debería renderizar el logo con la imagen correcta", () => {
    render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const logo = screen.getByAltText("Logo Aplicación");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", mockLogoSrc);
  });

  it("debería renderizar el título con el texto correcto", () => {
    render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const title = screen.getByText(mockTitle);
    expect(title).toBeInTheDocument();
  });

  it("debería renderizar el título dentro de un h1", () => {
    render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(mockTitle);
  });

  it("debería tener la clase CSS header en el elemento header", () => {
    const { container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("header");
  });

  it("debería tener la clase CSS logo en la imagen", () => {
    const { container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const logo = container.querySelector("img");
    expect(logo).toHaveClass("logo");
  });

  it("debería tener la clase CSS header-info en el div de información", () => {
    const { container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const headerInfo = container.querySelector(".header-info");
    expect(headerInfo).toBeInTheDocument();
  });

  it("debería actualizar el título cuando la prop cambia", () => {
    const { rerender } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    expect(screen.getByText(mockTitle)).toBeInTheDocument();

    const newTitle = "Nueva App";
    rerender(
      <Header
        logoSrc={mockLogoSrc}
        title={newTitle}
      />,
    );

    expect(screen.getByText(newTitle)).toBeInTheDocument();
    expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();
  });

  it("debería actualizar el logo cuando la prop cambia", () => {
    const { rerender, container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    let logo = screen.getByAltText("Logo Aplicación");
    expect(logo).toHaveAttribute("src", mockLogoSrc);

    const newLogoSrc = "https://via.placeholder.com/100";
    rerender(
      <Header
        logoSrc={newLogoSrc}
        title={mockTitle}
      />,
    );

    logo = screen.getByAltText("Logo Aplicación");
    expect(logo).toHaveAttribute("src", newLogoSrc);
  });

  it("debería renderizar el logo como una imagen válida", () => {
    const { container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const img = container.querySelector('img[alt="Logo Aplicación"]');
    expect(img).toBeInstanceOf(HTMLImageElement);
  });

  it("debería tener una estructura de DOM correcta", () => {
    const { container } = render(
      <Header
        logoSrc={mockLogoSrc}
        title={mockTitle}
      />,
    );

    const header = container.querySelector("header.header");
    expect(header).toBeInTheDocument();

    const logo = header.querySelector("img.logo");
    expect(logo).toBeInTheDocument();

    const headerInfo = header.querySelector(".header-info");
    expect(headerInfo).toBeInTheDocument();

    const h1 = headerInfo.querySelector("h1");
    expect(h1).toBeInTheDocument();
  });
});
