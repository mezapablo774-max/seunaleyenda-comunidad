const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = [
  'id', 'name', 'author', 'description', 'tags',
  'file', 'teamsCount', 'addedDate', 'formatVersion',
];

let ok = true;

function fail(msg) {
  console.error(`❌ ${msg}`);
  ok = false;
}

function main() {
  const root = path.join(__dirname, '..');
  const manifestPath = path.join(root, 'manifest.json');

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    fail(`manifest.json no es JSON válido: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(manifest.packs)) {
    fail('manifest.json debe tener un array "packs"');
    process.exit(1);
  }

  const seenIds = new Set();

  manifest.packs.forEach((pack, i) => {
    const label = `packs[${i}] (id: ${pack.id || '???'})`;

    for (const field of REQUIRED_FIELDS) {
      if (pack[field] === undefined || pack[field] === null || pack[field] === '') {
        fail(`${label}: falta el campo obligatorio "${field}"`);
      }
    }

    if (pack.id) {
      if (seenIds.has(pack.id)) {
        fail(`${label}: el id "${pack.id}" está repetido en el manifiesto`);
      }
      seenIds.add(pack.id);
    }

    if (Array.isArray(pack.tags)) {
      pack.tags.forEach((tag) => {
        if (typeof tag !== 'string' || tag !== tag.toLowerCase() || /\s/.test(tag)) {
          fail(`${label}: el tag "${tag}" debe estar en minúsculas y sin espacios`);
        }
      });
    }

    if (pack.file) {
      const filePath = path.join(root, pack.file);
      if (!fs.existsSync(filePath)) {
        fail(`${label}: no se encontró el archivo "${pack.file}"`);
      } else {
        try {
          JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
          fail(`${label}: "${pack.file}" no es JSON válido: ${e.message}`);
        }
      }
    }
  });

  if (ok) {
    console.log(`✅ manifest.json válido — ${manifest.packs.length} pack(s) revisado(s)`);
  } else {
    process.exit(1);
  }
}

main();
