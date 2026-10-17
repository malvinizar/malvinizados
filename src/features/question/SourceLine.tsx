import { Fragment } from "react";

/** Muestra la fuente convirtiendo en link cualquier URL que contenga. */
export function SourceLine({ fuente }: { fuente: string }) {
  const parts = fuente.split(/(https?:\/\/[^\s;]+)/g);
  return (
    <p className="text-xs leading-snug text-ink-soft">
      <span className="font-bold">Fuente: </span>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline decoration-dotted underline-offset-2 hover:text-navy-700"
          >
            {new URL(part).hostname.replace(/^www\./, "")}
          </a>
        ) : (
          <Fragment key={i}>{part.replace(/\s–\s*$/, " · ")}</Fragment>
        ),
      )}
    </p>
  );
}
