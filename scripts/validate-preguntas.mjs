#!/usr/bin/env node
/**
 * Valida src/data/preguntas.json sin dependencias.
 * Uso: npm run validate:preguntas
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "src/data/preguntas.json");

const CATEGORIAS = ["Historia", "Música", "Cine", "Fútbol"];
const DIFICULTADES = ["Fácil", "Media", "Difícil", "Experto"];
const MEDIA = ["none", "youtube", "image", "audio", "iframe"];

const data = JSON.parse(readFileSync(file, "utf8"));
const errores = [];
const ids = new Set();

for (const [i, p] of (data.preguntas ?? []).entries()) {
  const tag = `#${p.id ?? `posición ${i}`}`;
  if (typeof p.id !== "number" || ids.has(p.id)) errores.push(`${tag}: id inválido o repetido`);
  ids.add(p.id);
  if (!CATEGORIAS.includes(p.categoria)) errores.push(`${tag}: categoría "${p.categoria}"`);
  if (p.tipo !== "multiple") errores.push(`${tag}: tipo`);
  if (!p.pregunta?.trim()) errores.push(`${tag}: pregunta vacía`);
  if (!Array.isArray(p.opciones) || p.opciones.length !== 4 || new Set(p.opciones).size !== 4)
    errores.push(`${tag}: opciones (deben ser 4 distintas)`);
  if (!Number.isInteger(p.correcta) || p.correcta < 0 || p.correcta > 3) errores.push(`${tag}: correcta`);
  if (!p.explicacion?.trim()) errores.push(`${tag}: explicación vacía`);
  if (!DIFICULTADES.includes(p.dificultad)) errores.push(`${tag}: dificultad "${p.dificultad}"`);
  if (!p.fuente?.trim()) errores.push(`${tag}: fuente vacía`);
  if (!MEDIA.includes(p.media?.tipo) || typeof p.media?.url !== "string") errores.push(`${tag}: media`);
}

const total = data.preguntas?.length ?? 0;
const porCategoria = Object.fromEntries(
  CATEGORIAS.map((c) => [c, data.preguntas.filter((p) => p.categoria === c).length]),
);
const pendientes = data.preguntas.filter((p) => p.media.tipo !== "none" && !p.media.url.trim()).length;
const todos = data.preguntas.filter((p) => p.todo).length;

console.log(`Preguntas: ${total}`, porCategoria);
console.log(`Multimedia pendiente de URL: ${pendientes} · TODO: ${todos}`);

if (errores.length) {
  console.error(`\n${errores.length} error(es):\n- ${errores.join("\n- ")}`);
  process.exit(1);
}
console.log("✔ preguntas.json es válido");
