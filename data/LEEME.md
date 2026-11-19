# Cómo actualizar la página

Todo el contenido que cambia seguido está en esta carpeta. No hay que tocar HTML.

| Archivo | Qué controla | Dónde se ve |
|---|---|---|
| `integrantes.json` | Equipo por grupos (Dirección, Estudiantes, Externos…) | /nuestra-gente/ |
| `actividades.json` | Proyectos de extensión: charlas, talleres, cursos, salidas | /proyectos-extension/ |
| `webinarios.json` | Videos de YouTube. **El primero sale destacado en la portada** | /webinarios/ y la portada |

Las cifras de la portada (actividades, integrantes, webinarios y actas) se cuentan solas a partir de estos archivos y de `/historial-actas/actas/historial.json`.

## Reglas rápidas
- Edita en GitHub con el lápiz (✏️) y guarda con "Commit changes".
- Para agregar algo, copia un bloque `{ ... }` completo y pon una coma `,` entre bloques.
- El texto va siempre entre comillas `"..."`. Si necesitas comillas dentro del texto, usa `\"`.
- Si la página queda en blanco después de un cambio, casi siempre falta o sobra una coma. Pega el archivo en https://jsonlint.com para encontrar el error.

## Integrantes
- `foto`: ruta de la imagen, p. ej. `/assets/img/miembros/Nombre-Apellido.jpg`. Si la dejas `""` salen las iniciales.
- Usa fotos `.jpg` o `.png` (las `.heif` del iPhone no se ven en Chrome).
- `descripcion`: separa párrafos con `\n\n`. Si está vacía, la tarjeta no muestra "Ver perfil".

## Actividades
- `fechaFin` en formato `AAAA-MM-DD`: ordena la lista y pone la etiqueta "Próximamente" si la fecha no ha pasado.
- `categoria`: Charla, Taller, Curso, Salida de campo, Conversatorio, Congreso, Evento o Publicación (cada una tiene su ícono y su filtro).
- La portada muestra las 3 actividades más recientes que tengan fotos. Para que una no salga ahí, agrégale `"enPortada": false`.
- `proyecto`: pon `"jornadas-2026"` para que la actividad salga también en /jornadas-recurso-hidrico/. Con `tipoProducto` se agrupa ("Apropiación social del conocimiento" o "Divulgación pública de la ciencia").
- Si `fechaFin` es solo el año (p. ej. `"2026"`), la actividad se ordena al final de ese año y no muestra fecha.
- `enlace_texto`: texto del botón del enlace (si no lo pones dice "Ver más").
- El video del proyecto Jornadas 2026 va en `proyectos` > `jornadas-2026` > `video` (id de YouTube).
- `imagenes`: lista de rutas, p. ej. `["/proyectos-extension/img/foto1.jpg", "/proyectos-extension/img/foto2.jpg"]`. Si está vacía `[]` sale un recuadro de "Fotos próximamente".

## Webinarios
- `id` es el código del video: en `https://www.youtube.com/watch?v=6C4ajkUXtuw` el id es `6C4ajkUXtuw`.
- Para que uno nuevo salga en la portada, ponlo de primero en la lista.

## Noticias de Instagram (portada)

Por ahora se ponen a mano: en `noticias.json`, dentro de `"instagram"`, van los enlaces de las 3 publicaciones más recientes (la más nueva primero).

Para que se actualicen solas (pendiente): crear un feed JSON gratis en behold.so conectado a la cuenta `sish_uis` (debe ser cuenta profesional; quien maneja el Instagram autoriza con un enlace que da Behold) y pegar la URL `https://feeds.behold.so/...` en `"feedAutomatico"`. La página ya está programada para usarla; si el feed falla, vuelve a la lista manual.

## Integrantes por periodo (Nuestra gente)

- `integrantes.json` es el equipo del periodo actual (el que dice `"actual"` en `historial-equipo.json`).
- `historial-equipo.json` guarda los periodos anteriores. Al cerrar un semestre: copia los grupos de `integrantes.json` como un periodo nuevo al principio de `"periodos"` (con su `id`, p. ej. `"2026-2"`, y una `fuente`), cambia `"actual"` al semestre nuevo y actualiza `integrantes.json`.
- 2025-2 y 2026-1 se armaron con versiones anteriores de esta página.
