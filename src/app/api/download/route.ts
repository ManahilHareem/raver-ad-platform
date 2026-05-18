import { NextRequest, NextResponse } from "next/server";

const extensionMap: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/ogg": ".ogg",
  "audio/wav": ".wav",
  "audio/webm": ".webm",
  "audio/x-m4a": ".m4a",
  "application/pdf": ".pdf",
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  let filename = req.nextUrl.searchParams.get("filename") || "raver-download";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Resolve relative URLs to absolute URLs
    let targetUrl = url;
    if (url.startsWith("/")) {
      targetUrl = `${req.nextUrl.origin}${url}`;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      targetUrl = `${req.nextUrl.origin}/${url}`;
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from source: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type") || "application/octet-stream";
    
    // Determine the correct extension based on Content-Type
    let extension = "";
    const mappedExtension = extensionMap[contentType.toLowerCase().split(";")[0].trim()];
    if (mappedExtension) {
      extension = mappedExtension;
    } else {
      // Fallback: try to guess from the target URL's pathname if content-type is generic
      try {
        const urlObj = new URL(targetUrl);
        const pathname = urlObj.pathname;
        const lastDot = pathname.lastIndexOf(".");
        if (lastDot !== -1) {
          const urlExt = pathname.substring(lastDot);
          if (urlExt.length >= 3 && urlExt.length <= 5) {
            extension = urlExt;
          }
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
    }

    // Default fallback if still not found
    if (!extension) {
      extension = contentType.startsWith("image/") ? ".jpg" : contentType.startsWith("video/") ? ".mp4" : contentType.startsWith("audio/") ? ".mp3" : ".bin";
    }

    // Ensure the filename has the correct extension by stripping the wrong/hardcoded one first
    let cleanFilename = filename;
    const lastDot = filename.lastIndexOf(".");
    if (lastDot !== -1) {
      cleanFilename = filename.substring(0, lastDot);
    }
    const finalFilename = `${cleanFilename}${extension}`;

    // Read response body as arrayBuffer to ensure a complete and uncorrupted file payload
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${finalFilename}"`,
        "Content-Length": data.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error("Proxy download error:", error);
    return NextResponse.json({ error: error.message || "Failed to proxy download" }, { status: 500 });
  }
}
