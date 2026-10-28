import { Workspace } from "@/features/workspace";
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  return <Workspace route={slug} />;
}
