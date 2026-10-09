import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Nav } from "@/components/nav";
import { getT } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Skillseek",
  description: "Find construction subcontractors and skilled specialists across the EU.",
  applicationName: "Skillseek",
  authors: [{ name: "Wolfman OÜ" }],
  publisher: "Wolfman OÜ",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { t, locale } = await getT();
  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-stone-50 text-stone-900">
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500">
          <p>{t("footer.tagline")}</p>
          <p className="mt-1">{t("footer.owner", { year: new Date().getFullYear() })}</p>
        </footer>
      </body>
    </html>
  );
}
