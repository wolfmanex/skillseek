import { getCurrentUser } from "@/lib/auth";
import { buildExport, loadAccountData } from "@/lib/account-data";

// Downloads everything Skillseek stores about the signed-in user as one JSON file.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const data = buildExport(await loadAccountData(user.id));
  const date = data.exportedAt.slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="skillseek-data-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
