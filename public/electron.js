const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  // Eliminar el menú superior por defecto (File, Edit, etc.)
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, isDev ? "preload.js" : "preload.js")
    },
    title: "Comprimir Archivos - Clínica",
    icon: path.join(__dirname, isDev ? "../public/icon.png" : "icon.png")
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ===== IPC HANDLERS PARA ACCESO NATIVO AL SISTEMA DE ARCHIVOS =====

// Selector de carpetas nativo
ipcMain.handle("dialog:openDirectory", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });
  if (canceled) return null;
  return filePaths[0];
});

// Listar contenidos de un directorio
ipcMain.handle("fs:listContents", async (event, dirPath) => {
  try {
    const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      kind: entry.isDirectory() ? "directory" : "file"
    }));
  } catch (err) {
    console.error("Error listing path:", dirPath, err);
    throw err;
  }
});

// Leer archivo
ipcMain.handle("fs:readFile", async (event, filePath) => {
  try {
    const buffer = await fsPromises.readFile(filePath);
    return buffer; // Devuelve un Buffer (Electron lo convierte a Uint8Array en renderer)
  } catch (err) {
    console.error("Error reading file:", filePath, err);
    throw err;
  }
});

// Escribir archivo
ipcMain.handle("fs:writeFile", async (event, { path: filePath, buffer }) => {
  try {
    // Si Buffer viene como Uint8Array desde renderer, Node lo entiende
    await fsPromises.writeFile(filePath, Buffer.from(buffer));
    return { success: true };
  } catch (err) {
    console.error("Error writing file:", filePath, err);
    throw err;
  }
});

// Crear directorio
ipcMain.handle("fs:mkdir", async (event, dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }
    return { success: true };
  } catch (err) {
    console.error("Error creating directory:", dirPath, err);
    throw err;
  }
});

// Verificar existencia
ipcMain.handle("fs:exists", async (event, pathToCheck) => {
  return fs.existsSync(pathToCheck);
});

// =================================================================

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
