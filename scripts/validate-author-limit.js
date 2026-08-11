#!/usr/bin/env node
// Fase 5: límite de packs nuevos por autor por semana. Corre como paso
// APARTE de validate-manifest.js -no lo toca ni depende de su lógica-,
// así que si ese script cambia de forma el día de mañana, esto sigue
// andando solo. Lee manifest.json tal como queda DESPUÉS de mergear este
// PR (actions/checkout ya trae ese estado en el evento pull_request:
// checkout out el merge commit del PR contra la rama base), agrupa por
// author y cuenta cuántos packs de esa persona tienen addedDate dentro
// de los últimos WINDOW_DAYS días. Si alguien supera el límite, falla el
// check con un mensaje claro. No hace falta git diff: como manifest.json
// ya incluye tanto los packs viejos como los que agrega este PR, cuenta
// bien incluso si alguien intenta colar varios packs en un solo PR.

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(process.cwd(), 'manifest.json');
const MAX_PACKS_PER_AUTHOR_PER_WEEK = 3; // ajustable acá si hace falta
const WINDOW_DAYS = 7;

function fail(msg) {
  // ::error:: es la sintaxis de GitHub Actions para que el mensaje
  // aparezca resaltado en rojo en la pestaña Checks del PR, no solo en
  // el log crudo.
  console.error(`::error::${msg}`);
  process.exitCode = 1;
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    fail(`No se encontró manifest.json en ${MANIFEST_PATH}`);
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (err) {
    // Si el JSON está roto, validate-manifest.js ya lo va a marcar -acá
    // no hace falta duplicar ese error, simplemente no hay nada que
    // contar sin JSON válido-.
    console.log('manifest.json no es JSON válido; el chequeo de límite por autor se salta (validate-manifest.js debería marcar el error de formato).');
    return;
  }

  const packs = Array.isArray(manifest.packs) ? manifest.packs : [];
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const byAuthor = new Map(); // author en minúsculas -> [{id, addedDate, author}, ...]

  packs.forEach((pack) => {
    if (!pack || typeof pack.author !== 'string' || typeof pack.addedDate !== 'string') return;
    const added = new Date(pack.addedDate + 'T00:00:00Z');
    if (Number.isNaN(added.getTime())) return; // formato inválido: lo marca validate-manifest.js, no éste
    if (added < windowStart || added > now) return; // fuera de la ventana de los últimos WINDOW_DAYS días

    const key = pack.author.toLowerCase();
    if (!byAuthor.has(key)) byAuthor.set(key, []);
    byAuthor.get(key).push({ id: pack.id, addedDate: pack.addedDate, author: pack.author });
  });

  let anyOver = false;
  byAuthor.forEach((entries) => {
    if (entries.length > MAX_PACKS_PER_AUTHOR_PER_WEEK) {
      anyOver = true;
      const ids = entries.map((e) => `${e.id} (${e.addedDate})`).join(', ');
      fail(
        `El autor "${entries[0].author}" tiene ${entries.length} packs con addedDate en los últimos ${WINDOW_DAYS} días ` +
        `(máximo permitido: ${MAX_PACKS_PER_AUTHOR_PER_WEEK}): ${ids}. ` +
        `Esperá unos días antes de sumar otro pack, o abrí un Issue si es un caso especial.`
      );
    }
  });

  if (!anyOver) {
    console.log(`OK: ningún autor supera ${MAX_PACKS_PER_AUTHOR_PER_WEEK} packs nuevos en los últimos ${WINDOW_DAYS} días.`);
  }
}

main();
