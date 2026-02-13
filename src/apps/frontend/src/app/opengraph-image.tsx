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
        alignItems: "stretch",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px), radial-gradient(circle at 18% 20%, rgba(99,102,241,0.12) 0, transparent 35%), radial-gradient(circle at 85% 75%, rgba(99,102,241,0.08) 0, transparent 35%)",
          backgroundSize: "70px 70px, 70px 70px, auto, auto",
          opacity: 0.45,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          width: "1060px",
          marginLeft: "70px",
          marginRight: "70px",
          padding: "46px 52px",
          backgroundColor: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "30px",
          boxShadow: "0 18px 40px rgba(24,24,27,0.08)",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 36,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            gap: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                backgroundColor: "#eef2ff",
                color: "#4f46e5",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              m
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontSize: 54,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#18181b",
              }}
            >
              maalesef
              <span style={{ color: "#6366f1", marginLeft: 2 }}>.</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                fontSize: 44,
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#18181b",
              }}
            >
              İş başvurusu simülatörü.
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "#71717a",
                letterSpacing: "-0.01em",
              }}
            >
              Kariyerinizde Yeni Bir Sayfa Açmayın.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 600,
                color: "#4f46e5",
                backgroundColor: "#eef2ff",
                border: "1px solid #c7d2fe",
                borderRadius: "999px",
                padding: "8px 14px",
              }}
            >
              AI destekli
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 600,
                color: "#52525b",
                backgroundColor: "#f4f4f5",
                border: "1px solid #e4e4e7",
                borderRadius: "999px",
                padding: "8px 14px",
              }}
            >
              Her zaman maalesef
            </div>
          </div>
        </div>

        <div
          style={{
            width: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 22,
              border: "1px solid #e4e4e7",
              backgroundColor: "#fafafa",
              padding: "22px 24px",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#fee2e2",
                  color: "#ef4444",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title> </title>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <div
                  style={{ fontSize: 17, fontWeight: 700, color: "#18181b" }}
                >
                  EvilCorp İnsan Kaynakları
                </div>
                <div style={{ fontSize: 14, color: "#71717a" }}>
                  noreply@evilcorp.careers
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#18181b" }}>
                Başvurunuz reddedildi.
              </div>
              <div style={{ fontSize: 16, color: "#71717a", lineHeight: 1.35 }}>
                Etkileyici profiliniz kurum standartlarımızı tehdit ettiği için
                süreci sonlandırdık.
              </div>
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
