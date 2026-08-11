# Esquema de `manifest.json`

Este archivo vive en la raíz del repo `seunaleyenda-comunidad` y es la única
fuente de verdad del catálogo comunitario. El juego lo descarga vía jsDelivr
(`cdn.jsdelivr.net/gh/usuario/seunaleyenda-comunidad@main/manifest.json`) y
pinta una tarjeta por cada entrada del array `packs`.

## Estructura general

```json
{
  "version": 1,
  "packs": [ /* array de objetos Pack */ ]
}
```

- **`version`** (number): versión del esquema del manifiesto en sí (no de los
  packs). Sirve para el día que haga falta migrar el formato sin romper
  juegos con caché vieja.
- **`packs`** (array): lista de packs aprobados, en el orden en que fueron
  mergeados.

## Campos de cada Pack

| Campo          | Tipo     | Obligatorio | Descripción                                                                                                                      |
| -------------- | -------- | :---------: | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | string   |      Sí      | Identificador único y corto, en kebab-case (ej: `liga-argentina-2026`). Se usa como key en Firestore para estrellas/usos, así que **una vez publicado no se cambia**. |
| `name`         | string   |      Sí      | Nombre visible en la tarjeta del modal (máx. ~50 caracteres).                                                                     |
| `author`       | string   |      Sí      | Nombre o usuario de GitHub de quien lo subió.                                                                                     |
| `description`  | string   |      Sí      | Descripción corta (máx. ~150 caracteres) de qué contiene el pack.                                                                 |
| `tags`         | string[] |      Sí      | Etiquetas para filtrar (ej: `["sudamerica", "2026", "ligas-menores"]`). Al menos 1, en minúsculas.                                |
| `file`         | string   |      Sí      | Ruta relativa dentro del repo al JSON del pack (ej: `packs/liga-argentina-2026.json`).                                            |
| `teamsCount`   | number   |      Sí      | Cantidad de equipos que incluye el pack. Se muestra en la tarjeta para que la gente sepa el tamaño antes de descargar.            |
| `sizeKB`       | number   |     No      | Peso aproximado del archivo en KB. Ayuda a decidir si descargarlo con datos móviles.                                              |
| `addedDate`    | string   |      Sí      | Fecha del merge del PR, formato `YYYY-MM-DD`.                                                                                     |
| `formatVersion`| number   |      Sí      | Versión del formato interno del pack (el que genera `editorExportAll()`), para que el juego sepa si puede importarlo tal cual con `editorImportAllFile`. |

## Reglas de validación antes de aprobar un PR

1. El `id` no debe repetirse con ninguna entrada existente en `manifest.json`.
2. `file` debe apuntar a un archivo que exista en el mismo PR, dentro de `packs/`.
3. El JSON de `file` debe parsear sin errores y respetar el formato de `editorExportAll()`.
4. `tags` en minúsculas, sin espacios (usar guiones si hace falta, ej. `ligas-menores`).
5. Nada de contenido ofensivo en `name`, `description`, ni en los logos incluidos.
6. La nueva entrada se agrega al **final** del array `packs` (no se reordena ni se edita contenido existente en el mismo PR).

Ver `manifest.json` para un ejemplo completo y funcionando.
