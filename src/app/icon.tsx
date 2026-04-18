import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          borderRadius: 999,
          border: "2px solid #111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 18,
          fontWeight: 500,
          color: "#111",
          letterSpacing: "-0.04em",
          paddingBottom: 1,
        }}
      >
        su
      </div>
    ),
    { ...size },
  );
}
