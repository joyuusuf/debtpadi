// app/api/proxy-image/route.ts
// Proxies Cloudinary image URLs through the Next.js server so the browser
// can fetch them without CORS errors, then the Web Share API can attach
// the real image file to a WhatsApp message.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url param", { status: 400 });
  }

  // Only allow Cloudinary URLs (security — don't proxy arbitrary URLs)
  const allowed = [
    "res.cloudinary.com",
    "cloudinary.com",
  ];
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!allowed.some((h) => hostname.endsWith(h))) {
    return new Response("URL not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: { Accept: "image/*" },
    });

    if (!upstream.ok) {
      return new Response("Failed to fetch image", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Proxy error", { status: 502 });
  }
}
