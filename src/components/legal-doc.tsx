import { Fragment } from "react";
import { fillOperator, LEGAL_DRAFT, LEGAL_UPDATED, type LegalBlock, type LegalDoc } from "@/lib/legal";
import { formatDate, type Locale, type T } from "@/lib/i18n";
import { Card } from "@/components/ui";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{fillOperator(block)}</p>;
  if ("list" in block) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {block.list.map((item, i) => <li key={i}>{fillOperator(item)}</li>)}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300">
            {block.table.head.map((h) => <th key={h} className="py-2 pr-4 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row, i) => (
            <tr key={i} className="border-b border-stone-200 align-top">
              {row.map((cell, j) => <td key={j} className="py-2 pr-4">{fillOperator(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalDocument({ doc, t, locale }: { doc: LegalDoc; t: T; locale: Locale }) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("legal.updated", { date: formatDate(LEGAL_UPDATED, locale) })}</p>
      {LEGAL_DRAFT && (
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{t("legal.draft")}</p>
      )}
      <Card className="mt-6 space-y-8 text-sm leading-relaxed text-stone-700">
        <div className="space-y-3">
          {doc.intro.map((block, i) => <Block key={i} block={block} />)}
        </div>
        {doc.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">{section.heading}</h2>
            {section.body.map((block, i) => <Fragment key={i}><Block block={block} /></Fragment>)}
          </section>
        ))}
      </Card>
    </article>
  );
}
