import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { ButtonLink, Card } from "@/components/ui";

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");
  const { t } = await getT();

  const roles = [
    { title: t("role.CONTRACTOR"), body: t("home.contractor") },
    { title: t("role.SUBCONTRACTOR"), body: t("home.subcontractor") },
    { title: t("role.SPECIALIST"), body: t("home.specialist") },
  ];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white sm:px-12">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{t("home.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-stone-300">{t("home.subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/signup">{t("home.cta")}</ButtonLink>
          <ButtonLink href="/postings" secondary>{t("home.browse")}</ButtonLink>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.title}>
            <h2 className="font-semibold">{r.title}</h2>
            <p className="mt-2 text-sm text-stone-600">{r.body}</p>
          </Card>
        ))}
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">{t("home.how")}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[t("home.step1"), t("home.step2"), t("home.step3")].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-500 font-bold text-stone-950">{i + 1}</span>
              <span className="text-sm text-stone-700">{s}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
