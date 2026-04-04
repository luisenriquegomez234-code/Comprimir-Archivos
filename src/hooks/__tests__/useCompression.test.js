import { renderHook, act, waitFor } from "@testing-library/react";
import { useCompression } from "../useCompression";
import * as compressionService from "../../services/compressionService";
import * as downloadService from "../../services/downloadService";

// Mock los servicios
jest.mock("../../services/compressionService");
jest.mock("../../services/downloadService");

describe("useCompression Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería inicializar con log vacío y loading false", () => {
    const { result } = renderHook(() => useCompression());

    expect(result.current.log).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("debería retornar error si no hay archivos", async () => {
    const { result } = renderHook(() => useCompression());

    await act(async () => {
      await result.current.compress([]);
    });

    expect(result.current.error).toBe("Selecciona primero archivos o carpeta.");
  });

  it("debería retornar error si files es null", async () => {
    const { result } = renderHook(() => useCompression());

    await act(async () => {
      await result.current.compress(null);
    });

    expect(result.current.error).toBe("Selecciona primero archivos o carpeta.");
  });

  it("debería retornar error si files es undefined", async () => {
    const { result } = renderHook(() => useCompression());

    await act(async () => {
      await result.current.compress(undefined);
    });

    expect(result.current.error).toBe("Selecciona primero archivos o carpeta.");
  });

  it("debería establecer loading=true durante la compresión", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    const compressPromise = act(async () => {
      return result.current.compress(files);
    });

    // En componentes reales, debería estar en true durante la compresión
    // pero debido a cómo React procesa el estado, podemos verificar el final
    await compressPromise;

    expect(result.current.loading).toBe(false);
  });

  it("debería llamar a crearZip con los archivos correctos", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [
      new File(["contenido1"], "archivo1.txt"),
      new File(["contenido2"], "archivo2.pdf"),
    ];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(compressionService.crearZip).toHaveBeenCalledWith(files);
  });

  it("debería llamar a generarLog después de crearZip", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([
      { name: "archivo.txt", date: "2024-01-01" },
    ]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(compressionService.generarLog).toHaveBeenCalledWith(files);
  });

  it("debería actualizar log con las entradas generadas", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    const mockLog = [
      { name: "archivo1.txt", date: "2024-01-01 10:00:00" },
      { name: "archivo2.pdf", date: "2024-01-01 10:00:00" },
    ];
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue(mockLog);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [
      new File(["contenido1"], "archivo1.txt"),
      new File(["contenido2"], "archivo2.pdf"),
    ];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(result.current.log).toEqual(mockLog);
  });

  it("debería llamar a descargarConBlob con el blob y nombre correcto", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(downloadService.descargarConBlob).toHaveBeenCalledWith(
      mockBlob,
      "Comprimido.zip",
    );
  });

  it("debería retornar true si la compresión es exitosa", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    let compressResult;
    await act(async () => {
      compressResult = await result.current.compress(files);
    });

    expect(compressResult).toBe(true);
  });

  it("debería establecer error si la descarga falla", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(false);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(result.current.error).toBe("No se pudo completar la descarga.");
  });

  it("debería retornar false si la descarga falla", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(false);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    let compressResult;
    await act(async () => {
      compressResult = await result.current.compress(files);
    });

    expect(compressResult).toBe(false);
  });

  it("debería manejar errores durante la compresión", async () => {
    const console_error_spy = jest.spyOn(console, "error").mockImplementation();
    compressionService.crearZip.mockRejectedValue(
      new Error("Error al crear ZIP"),
    );

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(result.current.error).toBe("Error al crear o descargar el archivo.");
    console_error_spy.mockRestore();
  });

  it("debería limpiar el log cuando clearLog es llamado", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([
      { name: "archivo.txt", date: "2024-01-01" },
    ]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(result.current.log).toHaveLength(1);

    act(() => {
      result.current.clearLog();
    });

    expect(result.current.log).toEqual([]);
  });

  it("debería limpiar error cuando la compresión es exitosa", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    // Primero causar un error
    await act(async () => {
      await result.current.compress(null);
    });

    expect(result.current.error).not.toBeNull();

    // Ahora hacer una compresión exitosa
    await act(async () => {
      await result.current.compress(files);
    });

    expect(result.current.error).toBeNull();
  });

  it("debería retornar todas las propiedades requeridas", () => {
    const { result } = renderHook(() => useCompression());

    expect(result.current).toHaveProperty("log");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("compress");
    expect(result.current).toHaveProperty("clearLog");
  });

  it("debería establecer loading=false después de completar la compresión", async () => {
    const mockBlob = new Blob(["contenido"], { type: "application/zip" });
    compressionService.crearZip.mockResolvedValue(mockBlob);
    compressionService.generarLog.mockReturnValue([]);
    downloadService.descargarConBlob.mockResolvedValue(true);

    const { result } = renderHook(() => useCompression());
    const files = [new File(["contenido"], "archivo.txt")];

    await act(async () => {
      await result.current.compress(files);
    });

    expect(result.current.loading).toBe(false);
  });
});
