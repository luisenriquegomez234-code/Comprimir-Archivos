import { validarArchivos, calcularTamaño } from "../fileService";

describe("fileService", () => {
  describe("validarArchivos", () => {
    it("debería retornar true cuando el array tiene archivos", () => {
      const files = [
        new File(["contenido1"], "archivo1.txt"),
        new File(["contenido2"], "archivo2.pdf"),
      ];

      const resultado = validarArchivos(files);

      expect(resultado).toBe(true);
    });

    it("debería retornar false cuando el array está vacío", () => {
      const resultado = validarArchivos([]);

      expect(resultado).toBe(false);
    });

    it("debería retornar false cuando files es null", () => {
      const resultado = validarArchivos(null);

      expect(resultado).toBe(false);
    });

    it("debería retornar false cuando files es undefined", () => {
      const resultado = validarArchivos(undefined);

      expect(resultado).toBe(false);
    });

    it("debería retornar true con un solo archivo", () => {
      const files = [new File(["contenido"], "archivo.txt")];

      const resultado = validarArchivos(files);

      expect(resultado).toBe(true);
    });
  });

  describe("calcularTamaño", () => {
    it("debería calcular correctamente el tamaño en Bytes", () => {
      const file = new File(["123"], "archivo.txt"); // 3 bytes

      const tamaño = calcularTamaño([file]);

      expect(tamaño).toBe("3 Bytes");
    });

    it("debería calcular correctamente el tamaño en KB", () => {
      const buffer = new ArrayBuffer(2048); // Exactamente 2 KB
      const file = new File([buffer], "archivo.bin");

      const tamaño = calcularTamaño([file]);

      expect(tamaño).toContain("KB");
    });

    it("debería calcular correctamente el tamaño en MB", () => {
      const buffer = new ArrayBuffer(1048576); // 1 MB exacto
      const file = new File([buffer], "archivo.iso");

      const tamaño = calcularTamaño([file]);

      expect(tamaño).toContain("MB");
    });

    it("debería calcular correctamente el tamaño total de múltiples archivos", () => {
      const file1 = new File(["123"], "archivo1.txt"); // 3 bytes
      const file2 = new File(["456"], "archivo2.txt"); // 3 bytes

      const tamaño = calcularTamaño([file1, file2]);

      expect(tamaño).toBe("6 Bytes");
    });

    it('debería retornar "0 Bytes" con un array vacío', () => {
      const tamaño = calcularTamaño([]);

      expect(tamaño).toBe("0 Bytes");
    });

    it('debería retornar "0 Bytes" cuando files es null', () => {
      const tamaño = calcularTamaño(null);

      expect(tamaño).toBe("0 Bytes");
    });

    it('debería retornar "0 Bytes" cuando files es undefined', () => {
      const tamaño = calcularTamaño(undefined);

      expect(tamaño).toBe("0 Bytes");
    });

    it("debería formatear correctamente con decimales para valores grandes", () => {
      const buffer = new ArrayBuffer(2621440); // Aproximadamente 2.5 MB
      const file = new File([buffer], "archivo.zip");

      const tamaño = calcularTamaño([file]);

      expect(tamaño).toMatch(/\d+\.\d{2}\s(MB|KB)/);
    });

    it("debería usar la unidad más apropiada para archivos de diferentes tamaños", () => {
      const file1Bytes = new File(["a"], "tiny.txt"); // 1 byte
      const file1KB = new File(new Array(1025).fill("a"), "small.txt"); // ~1 KB
      const file1MB = new File(new ArrayBuffer(1048576), "large.bin"); // ~1 MB

      expect(calcularTamaño([file1Bytes])).toContain("Bytes");
      expect(calcularTamaño([file1KB])).toContain("KB");
      expect(calcularTamaño([file1MB])).toContain("MB");
    });
  });
});
