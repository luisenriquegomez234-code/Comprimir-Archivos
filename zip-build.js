const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "build");
const outputPath = path.join(__dirname, "build.zip");

async function createZip() {
  const zip = new JSZip();

  function addFolder(folderPath, zipFolder) {
    const items = fs.readdirSync(folderPath);
    items.forEach(item => {
      const fullPath = path.join(folderPath, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        addFolder(fullPath, zipFolder.folder(item));
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
      }
    });
  }

  addFolder(buildPath, zip);

  const content = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(outputPath, content);
  console.log("✅ Build comprimido en build.zip");
}

createZip().catch(err => console.error("❌ Error al comprimir:", err));