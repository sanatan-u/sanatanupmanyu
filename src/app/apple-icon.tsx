import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 110,
          fontWeight: 500,
          color: "#111",
          letterSpacing: "-0.04em",
          border: "6px solid #111",
          borderRadius: 40,
          paddingBottom: 8,
        }}
      >
        su
      </div>
    ),
    { ...size },
  );
}
