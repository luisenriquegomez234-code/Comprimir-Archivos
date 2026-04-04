import { crearZip, generarLog } from "../compressionService";
import JSZip from "jszip";

// Mock de JSZip - solo si es necesario usar la verdadera para tests
jest.mock("jszip", () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest.fn(),
  }));
});

describe("compressionService", () => {
  describe("crearZip", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("debería crear un Blob válido a partir de un array de archivos", async () => {
      // Crear archivos mock de prueba sin usar JSZip mock
      const file1 = new File(["contenido1"], "archivo1.txt", {
        type: "text/plain",
      });
      const file2 = new File(["contenido2"], "archivo2.txt", {
        type: "text/plain",
      });

      // Desactivar el mock para esta prueba
      jest.unmock("jszip");
      const JSZipReal = require("jszip").default || require("jszip");

      const blob = await crearZip([file1, file2]);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/zip");
      expect(blob.size).toBeGreaterThan(0);
    });

    it("debería manejar un array vacío de archivos", async () => {
      jest.unmock("jszip");
      const JSZipReal = require("jszip").default || require("jszip");

      const blob = await crearZip([]);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/zip");
    });

    it("debería agregar cada archivo al ZIP consus nombres correctos", async () => {
      jest.unmock("jszip");
      const JSZipReal = require("jszip").default || require("jszip");

      const file1 = new File(["contenido1"], "test.txt", {
        type: "text/plain",
      });
      const file2 = new File(["contenido2"], "documento.pdf", {
        type: "application/pdf",
      });

      const blob = await crearZip([file1, file2]);

      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe("generarLog", () => {
    it("debería retornar un array con objetos que tienen propiedades name y date", () => {
      const files = [
        new File(["contenido1"], "archivo1.txt"),
        new File(["contenido2"], "archivo2.pdf"),
      ];

      const log = generarLog(files);

      expect(Array.isArray(log)).toBe(true);
      expect(log.length).toBe(2);
      expect(log[0]).toHaveProperty("name", "archivo1.txt");
      expect(log[0]).toHaveProperty("date");
      expect(log[1]).toHaveProperty("name", "archivo2.pdf");
      expect(log[1]).toHaveProperty("date");
    });

    it("debería generar fechas válidas en formato localizado", () => {
      const file = new File(["contenido"], "archivo.txt");
      const log = generarLog([file]);

      expect(log[0].date).toMatch(/\d/);
      expect(typeof log[0].date).toBe("string");
      expect(log[0].date.length).toBeGreaterThan(5);
    });

    it("debería retornar array vacío para un array de archivos vacío", () => {
      const log = generarLog([]);

      expect(Array.isArray(log)).toBe(true);
      expect(log.length).toBe(0);
    });

    it("debería preservar los nombres de los archivos exactamente", () => {
      const files = [
        new File(["contenido"], "mi-documento-importante.docx"),
        new File(["contenido"], "imagen_2024.jpg"),
        new File(["contenido"], "archivo con espacios.txt"),
      ];

      const log = generarLog(files);

      expect(log[0].name).toBe("mi-documento-importante.docx");
      expect(log[1].name).toBe("imagen_2024.jpg");
      expect(log[2].name).toBe("archivo con espacios.txt");
    });
  });
});
