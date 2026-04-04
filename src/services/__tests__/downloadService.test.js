import { descargarConBlob } from "../downloadService";

describe("downloadService", () => {
  describe("descargarConBlob", () => {
    let mockBlob;

    beforeEach(() => {
      mockBlob = new Blob(["contenido del archivo"], {
        type: "application/zip",
      });

      // Mock para URL.createObjectURL y URL.revokeObjectURL
      jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
      jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

      // Mock para createElement y click
      document.createElement = jest.fn((tag) => {
        if (tag === "a") {
          return {
            href: "",
            download: "",
            click: jest.fn(),
          };
        }
        return document.createElement.bind(document)(tag);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    it("debería crear un enlace descargable válido", async () => {
      const blob = new Blob(["contenido"], { type: "application/zip" });
      const filename = "Comprimido.zip";

      const resultado = await descargarConBlob(blob, filename);

      expect(resultado).toBe(true);
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    });

    it("debería usar el fallback en createElement si showSaveFilePicker no está disponible", async () => {
      window.showSaveFilePicker = undefined;
      const createElementSpy = jest.spyOn(document, "createElement");

      const resultado = await descargarConBlob(mockBlob, "test.zip");

      expect(resultado).toBe(true);
      expect(createElementSpy).toHaveBeenCalledWith("a");
      createElementSpy.mockRestore();
    });

    it("debería establecer las propiedades correctas del elemento de descarga", async () => {
      window.showSaveFilePicker = undefined;
      let mockLink = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      document.createElement = jest.fn(() => mockLink);

      const filename = "MiArchivo.zip";
      await descargarConBlob(mockBlob, filename);

      expect(mockLink.href).toBe("blob:mock-url");
      expect(mockLink.download).toBe("MiArchivo.zip");
      expect(mockLink.click).toHaveBeenCalled();
    });

    it("debería limpiar la URL creada después de la descarga", async () => {
      window.showSaveFilePicker = undefined;
      jest.useFakeTimers();

      const revokeObjectURLSpy = jest.spyOn(URL, "revokeObjectURL");

      await descargarConBlob(mockBlob, "test.zip");
      jest.advanceTimersByTime(100);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
      jest.useRealTimers();
      revokeObjectURLSpy.mockRestore();
    });

    it("debería retornar true cuando la descarga es exitosa", async () => {
      window.showSaveFilePicker = undefined;
      const resultado = await descargarConBlob(mockBlob, "Comprimido.zip");

      expect(resultado).toBe(true);
    });

    it("debería manejar errores de showSaveFilePicker y usar fallback", async () => {
      const console_error_spy = jest
        .spyOn(console, "error")
        .mockImplementation();
      window.showSaveFilePicker = jest
        .fn()
        .mockRejectedValue(new Error("User cancelled"));

      const resultado = await descargarConBlob(mockBlob, "test.zip");

      expect(resultado).toBe(true);
      expect(console_error_spy).toHaveBeenCalledWith(
        "Error al usar showSaveFilePicker:",
        expect.any(Error),
      );

      console_error_spy.mockRestore();
    });

    it("debería retornar false si ambos métodos fallan", async () => {
      const console_error_spy = jest
        .spyOn(console, "error")
        .mockImplementation();
      window.showSaveFilePicker = undefined;
      document.createElement = jest.fn(() => {
        throw new Error("createElement failed");
      });

      const resultado = await descargarConBlob(mockBlob, "test.zip");

      expect(resultado).toBe(false);
      console_error_spy.mockRestore();
    });

    it("debería permitir descargar múltiples archivos en secuencia", async () => {
      window.showSaveFilePicker = undefined;
      const blob1 = new Blob(["contenido1"], { type: "application/zip" });
      const blob2 = new Blob(["contenido2"], { type: "application/zip" });

      const resultado1 = await descargarConBlob(blob1, "archivo1.zip");
      const resultado2 = await descargarConBlob(blob2, "archivo2.zip");

      expect(resultado1).toBe(true);
      expect(resultado2).toBe(true);
    });

    it("debería manejar blobs de diferentes tipos", async () => {
      window.showSaveFilePicker = undefined;
      const pdfBlob = new Blob(["%PDF-1.4"], { type: "application/pdf" });
      const zipBlob = new Blob(["PK"], { type: "application/zip" });

      const resultado1 = await descargarConBlob(pdfBlob, "documento.pdf");
      const resultado2 = await descargarConBlob(zipBlob, "archivo.zip");

      expect(resultado1).toBe(true);
      expect(resultado2).toBe(true);
    });
  });
});
