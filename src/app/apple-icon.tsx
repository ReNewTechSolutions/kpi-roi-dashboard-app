/* =========================================================
   File: src/app/apple-icon.tsx
   Fixes corrupted src/app/apple-icon.png by generating at build-time
   ========================================================= */
   import { ImageResponse } from "next/og";

   export const size = { width: 180, height: 180 };
   export const contentType = "image/png";
   
   export default function AppleIcon() {
     const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "MetricROI";
     const initials = appName
       .split(/\s+/)
       .filter(Boolean)
       .slice(0, 2)
       .map((w) => (w[0] ?? "").toUpperCase())
       .join("")
       .slice(0, 3);
   
     return new ImageResponse(
       (
         <div
           style={{
             width: "100%",
             height: "100%",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             background: "#0b0b0b",
             color: "#ffffff",
             fontSize: 72,
             fontWeight: 900,
             borderRadius: 40,
           }}
         >
           {initials || "MR"}
         </div>
       ),
       size,
     );
   }