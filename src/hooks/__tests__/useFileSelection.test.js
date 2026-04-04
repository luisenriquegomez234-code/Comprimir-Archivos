import { renderHook, act } from "@testing-library/react";
import { useFileSelection } from "../useFileSelection";

describe("useFileSelection Hook", () => {
  it("debería retornar un array vacío en la inicialización", () => {
    const { result } = renderHook(() => useFileSelection());

    expect(result.current.files).toEqual([]);
    expect(result.current.fileCount).toBe(0);
    expect(result.current.isValid).toBe(false);
  });

  it("debería actualizar files cuando handleFileChange es llamado", () => {
    const { result } = renderHook(() => useFileSelection());
    const files = [
      new File(["contenido1"], "archivo1.txt"),
      new File(["contenido2"], "archivo2.pdf"),
    ];

    act(() => {
      const event = {
        target: { files: files },
      };
      result.current.handleFileChange(event);
    });

    expect(result.current.files).toEqual(files);
    expect(result.current.fileCount).toBe(2);
  });

  it("debería actualizar fileCount cuando se agregan archivos", () => {
    const { result } = renderHook(() => useFileSelection());
    const files = [new File(["contenido"], "archivo.txt")];

    act(() => {
      const event = { target: { files: files } };
      result.current.handleFileChange(event);
    });

    expect(result.current.fileCount).toBe(1);
  });

  it("debería calcular totalSize correctamente con un archivo", () => {
    const { result } = renderHook(() => useFileSelection());
    const file = new File(["abc"], "archivo.txt"); // 3 bytes

    act(() => {
      const event = { target: { files: [file] } };
      result.current.handleFileChange(event);
    });

    expect(result.current.totalSize).toBe("3 Bytes");
  });

  it("debería calcular totalSize correctamente con múltiples archivos", () => {
    const { result } = renderHook(() => useFileSelection());
    const file1 = new File(["abc"], "archivo1.txt"); // 3 bytes
    const file2 = new File(["def"], "archivo2.txt"); // 3 bytes

    act(() => {
      const event = { target: { files: [file1, file2] } };
      result.current.handleFileChange(event);
    });

    expect(result.current.totalSize).toBe("6 Bytes");
  });

  it("debería retornar isValid=true cuando hay archivos", () => {
    const { result } = renderHook(() => useFileSelection());
    const files = [new File(["contenido"], "archivo.txt")];

    act(() => {
      const event = { target: { files: files } };
      result.current.handleFileChange(event);
    });

    expect(result.current.isValid).toBe(true);
  });

  it("debería retornar isValid=false cuando files está vacío", () => {
    const { result } = renderHook(() => useFileSelection());

    expect(result.current.isValid).toBe(false);
  });

  it("debería limpiar archivos cuando clearFiles es llamado", () => {
    const { result } = renderHook(() => useFileSelection());
    const files = [new File(["contenido"], "archivo.txt")];

    act(() => {
      const event = { target: { files: files } };
      result.current.handleFileChange(event);
    });

    expect(result.current.files).toHaveLength(1);

    act(() => {
      result.current.clearFiles();
    });

    expect(result.current.files).toEqual([]);
    expect(result.current.fileCount).toBe(0);
    expect(result.current.isValid).toBe(false);
  });

  it("debería resetear el estado completo después de clearFiles", () => {
    const { result } = renderHook(() => useFileSelection());
    const files = [
      new File(["contenido1"], "archivo1.txt"),
      new File(["contenido2"], "archivo2.pdf"),
    ];

    act(() => {
      const event = { target: { files: files } };
      result.current.handleFileChange(event);
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.totalSize).not.toBe("0 Bytes");

    act(() => {
      result.current.clearFiles();
    });

    expect(result.current.files).toEqual([]);
    expect(result.current.fileCount).toBe(0);
    expect(result.current.totalSize).toBe("0 Bytes");
    expect(result.current.isValid).toBe(false);
  });

  it("debería permitir reemplazar archivos", () => {
    const { result } = renderHook(() => useFileSelection());
    const files1 = [new File(["contenido1"], "archivo1.txt")];
    const files2 = [
      new File(["contenido2"], "archivo2.pdf"),
      new File(["contenido3"], "archivo3.doc"),
    ];

    act(() => {
      result.current.handleFileChange({ target: { files: files1 } });
    });

    expect(result.current.fileCount).toBe(1);

    act(() => {
      result.current.handleFileChange({ target: { files: files2 } });
    });

    expect(result.current.fileCount).toBe(2);
    expect(result.current.files).toEqual(files2);
  });

  it("debería retornar todas las propiedades requeridas", () => {
    const { result } = renderHook(() => useFileSelection());

    expect(result.current).toHaveProperty("files");
    expect(result.current).toHaveProperty("handleFileChange");
    expect(result.current).toHaveProperty("clearFiles");
    expect(result.current).toHaveProperty("fileCount");
    expect(result.current).toHaveProperty("totalSize");
    expect(result.current).toHaveProperty("isValid");
  });

  it("debería actualizar totalSize después de handleFileChange", () => {
    const { result } = renderHook(() => useFileSelection());
    const buffer = new ArrayBuffer(2048); // 2 KB
    const file = new File([buffer], "archivo.bin");

    act(() => {
      result.current.handleFileChange({ target: { files: [file] } });
    });

    expect(result.current.totalSize).toContain("KB");
  });
});
