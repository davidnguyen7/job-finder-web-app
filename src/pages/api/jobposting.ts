import seek from "../../scrapers/Seek";

export const prerender = false;
export async function GET({ url }: { url: URL }) {
  const jobname = url.searchParams.get("q");
  console.log("Job name:", jobname);
  if (!jobname) {
    return new Response(
      JSON.stringify({ error: "Missing jobname query parameter." }),
      { status: 400 },
    );
  }
  const content = await seek(jobname);
  return new Response(JSON.stringify({ data: content }));
}
