/* =========================================================
   File: src/components/Card.tsx
   ========================================================= */
   import React from "react";

   export type CardProps = React.PropsWithChildren<{
     title?: string;
     right?: React.ReactNode;
     style?: React.CSSProperties;
   }>;
   
   export default function Card({ title, right, children, style }: CardProps) {
     return (
       <section style={{ ...styles.card, ...style }}>
         {title ? (
           <header style={styles.header}>
             <div style={styles.title}>{title}</div>
             {right ? <div>{right}</div> : null}
           </header>
         ) : null}
         <div>{children}</div>
       </section>
     );
   }
   
   const styles: Record<string, React.CSSProperties> = {
     card: {
       border: "1px solid #ddd",
       borderRadius: 18,
       padding: 14,
       display: "grid",
       gap: 12,
       background: "white",
     },
     header: {
       display: "flex",
       alignItems: "baseline",
       justifyContent: "space-between",
       gap: 10,
     },
     title: {
       fontSize: 14,
       fontWeight: 900,
       margin: 0,
     },
   };