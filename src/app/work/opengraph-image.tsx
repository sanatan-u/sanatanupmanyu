import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `Work & Platforms — ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "Georgia, serif",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              border: "2px solid #111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontStyle: "italic",
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              paddingBottom: 4,
            }}
          >
            su
          </div>
          <div style={{ fontSize: 28, fontWeight: 500 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#111111",
            }}
          >
            Work & Platforms
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#3a3a3a",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            AI platforms · clinical intelligence · regulatory automation
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
