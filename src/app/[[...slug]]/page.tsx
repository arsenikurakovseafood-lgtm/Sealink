import { redirect } from "next/navigation";
import { Workspace } from "@/features/workspace";
import { PublicPage } from "@/features/public";
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  if (
    [
      "discover",
      "companies",
      "rfqs",
      "offers",
      "capacity",
      "messages",
      "organization",
      "settings",
    ].includes(slug[0])
  )
    redirect(`/app/${slug.join("/")}`);
  return slug[0] === "app" ? (
    <Workspace route={slug.slice(1)} />
  ) : (
    <PublicPage route={slug[0] || "home"} />
  );
}
