# MalvinizAR · La trivia de Malvinas

Trivia educativa sobre Malvinas para estudiantes secundarios, con la dinámica de un juego de preguntas por categorías: girás la ruleta, respondés, sumás puntos y llenás el **Malvinómetro**.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Firebase (Firestore + Auth, desde el paso 6)

## Cómo correrlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

Otros comandos: `npm run build`, `npm run lint`, `npm run typecheck`.

## Publicación

El sitio se publica solo en **GitHub Pages** cada vez que se sube un cambio a `main`. El proceso está en `.github/workflows/pages.yml`.

https://malvinizar.github.io/malvinizados/

Se exporta como sitio estático (`output: "export"`), así que no necesita servidor.

## Estructura

```
src/
├─ app/                 rutas (inicio, /jugar, /ranking)
├─ components/
│  ├─ brand/            logo
│  ├─ icons/            íconos de categorías (propios)
│  ├─ layout/           fondo, providers, pantallas provisorias
│  └─ ui/               kit visual: Button3D, CreamCard, Ribbon, SolDeMayo, CategoryBadge, StatPill
├─ config/              categorías (color, ícono) y configuración del juego
├─ features/            una carpeta por funcionalidad (home, game, wheel, question, hud, ranking)
└─ lib/                 utilidades (sonido, clases)
```

## Sistema visual

Los colores, la tipografía y los estilos base están en `src/app/globals.css`:

- **Fondo:** azul marino con rayos de sol.
- **Tarjetas:** crema con borde dorado.
- **Cintas de título:** celeste y blanco.
- **Botones:** 3D en amarillo, celeste, verde, rojo, crema y azul.

**Categorías:** Historia (celeste), Música (violeta), Cine (rojo) y Fútbol (verde). Se definen en `src/config/categories.ts`.

Todos los gráficos (Sol de Mayo, íconos, cintas) están dibujados desde cero en SVG. No se usan recursos de terceros.

## Preguntas

Las preguntas están en `src/data/preguntas.json`. No hay ninguna pregunta escrita dentro del código. La versión en planilla para revisar está en `docs/banco-de-preguntas.xlsx`.

- **Validar el archivo:** `npm run validate:preguntas`. También se valida solo antes de cada build.
- **Agregar un video:** buscá la pregunta con `"media": { "tipo": "youtube", "url": "" }` y pegá el link en `url`.

## Sonidos

Los sonidos se generan por código con Web Audio (`src/lib/synth.ts`), así que no hay archivos de audio. Para reemplazar alguno por una grabación propia, copiá el archivo en `public/sounds/` y completá su ruta en `SOURCES`, dentro de `src/lib/sound.ts`.

## Puntaje y Malvinómetro

Los puntos por dificultad, el multiplicador por racha y los nombres de los niveles se configuran en `src/config/scoring.ts`.

## Hoja de ruta

1. ✅ Base del proyecto, sistema visual y pantalla de inicio
2. ✅ Banco de preguntas (borrador de 48, en revisión) con esquema y validación
3. ✅ Ruleta
4. ✅ Pantalla de pregunta, multimedia y explicación
5. ✅ Malvinómetro, puntaje, rachas y resultado
6. ✅ Ranking en Firestore (auth anónima)
7. ⬜ Pulido de animaciones, sonidos y accesibilidad
