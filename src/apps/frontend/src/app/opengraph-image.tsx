import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "maalesef — iş başvuru simülatörü";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        position: "relative",
      }}
    >
      {/* Abstract Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.4,
        }}
      />

      {/* Gradient Blur Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "20%",
          width: "600px",
          height: "600px",
          backgroundColor: "rgba(99, 102, 241, 0.1)", // accent with low opacity
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "10%",
          width: "500px",
          height: "500px",
          backgroundColor: "rgba(239, 68, 68, 0.05)", // red with very low opacity
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      {/* Main Content Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Brand Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            color: "#18181b",
            marginBottom: 16,
            textShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          maalesef
          <span style={{ color: "#6366f1", marginLeft: 4 }}>.</span>
        </div>

        {/* Subtitle / Slogan */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#52525b", // zinc-600
            marginBottom: 56,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Kariyerinize dürüst bir ara verin.
        </div>

        {/* Mock Rejection Notification Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 24,
            padding: "24px 32px",
            border: "1px solid #e4e4e7",
            boxShadow:
              "0 20px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset",
            gap: 20,
            maxWidth: 600,
          }}
        >
          {/* Icon Container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: "#fee2e2", // red-100
              color: "#ef4444", // red-500
            }}
          >
            {/* X Icon SVG */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>X Icon</title>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </div>

          {/* Content Text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#18181b", // zinc-900
                marginBottom: 4,
              }}
            >
              Başvurunuz Reddedildi
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#71717a", // zinc-500
              }}
            >
              Pozisyon dolduruldu, aslında hiç açılmamıştı.
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
