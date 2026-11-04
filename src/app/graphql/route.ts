import { type NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  const dest = process.env.STAGING_GRAPHQL_PROXY;
  if (!dest) {
    return new Response("Not found", { status: 404 });
  }

  const body = await request.text();
  const authorization = request.headers.get("authorization");

  const upstream = await fetch(dest, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(authorization ? { authorization } : {}),
    },
    body,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
