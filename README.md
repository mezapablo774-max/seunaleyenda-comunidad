# Catálogo comunitario — Sé Una Leyenda

Este repositorio es el catálogo de bases de datos (packs de equipos) que la
comunidad de **Sé Una Leyenda** comparte entre sí. El juego lee este
catálogo directamente desde acá vía [jsDelivr](https://www.jsdelivr.com/) —
no hace falta ningún backend aparte.

## ¿Cómo subo mi pack?

1. Desde el Editor del juego, tocá **"Exportar todo"** para generar tu archivo JSON.
2. En GitHub, andá a la carpeta [`packs/`](./packs) y usá **"Add file" → "Upload files"** para subir tu archivo (ej: `packs/mi-liga-2026.json`).
3. Editá [`manifest.json`](./manifest.json) y agregá una entrada nueva **al final** del array `packs`, siguiendo el formato de [`MANIFEST_SCHEMA.md`](./MANIFEST_SCHEMA.md).
4. Abrí un Pull Request. Un chequeo automático valida que todo esté bien formado, y después se revisa a mano antes de aprobar.

Una vez que se mergea tu PR, tu pack aparece en la pestaña **"Comunidad"** del juego.

## Estructura del repo

- `manifest.json` — catálogo de todos los packs aprobados.
- `MANIFEST_SCHEMA.md` — documentación de los campos del manifiesto.
- `packs/` — los archivos JSON de cada pack.
- `.github/PULL_REQUEST_TEMPLATE.md` — checklist que aparece al abrir un PR.
- `.github/workflows/validate-manifest.yml` — valida automáticamente cada PR.

## Reglas

- Un pack por Pull Request.
- Nada de contenido ofensivo o discriminatorio.
- El `id` de tu pack tiene que ser único (el chequeo automático avisa si no lo es).
