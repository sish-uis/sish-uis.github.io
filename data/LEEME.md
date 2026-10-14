# Cómo actualizar la página

Todo el contenido que cambia seguido está en esta carpeta. No hay que tocar HTML.

| Archivo | Qué controla | Dónde se ve |
|---|---|---|
| `integrantes.json` | Equipo por grupos (Dirección, Estudiantes, Externos…) | /nuestra-gente/ |
| `actividades.json` | Proyectos de extensión: charlas, talleres, cursos, salidas | /proyectos-extension/ |
| `webinarios.json` | Videos de YouTube. **El primero sale destacado en la portada** | /webinarios/ y la portada |

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
- `imagenes`: lista de rutas, p. ej. `["/proyectos-extension/img/foto1.jpg", "/proyectos-extension/img/foto2.jpg"]`. Si está vacía `[]` sale un recuadro de "Fotos próximamente".

## Webinarios
- `id` es el código del video: en `https://www.youtube.com/watch?v=6C4ajkUXtuw` el id es `6C4ajkUXtuw`.
- Para que uno nuevo salga en la portada, ponlo de primero en la lista.
