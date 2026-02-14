/* =========================================================
   File: src/components/Modal.tsx
   Reusable modal shell (client)
   ========================================================= */
   "use client";

   import React, { useEffect, useRef } from "react";
   
   type ModalProps = {
     open: boolean;
     title: string;
     onClose: () => void;
     children: React.ReactNode;
   };
   
   export default function Modal({ open, title, onClose, children }: ModalProps) {
     const panelRef = useRef<HTMLDivElement>(null);
   
     useEffect(() => {
       if (!open) return;
   
       const prevOverflow = document.body.style.overflow;
       document.body.style.overflow = "hidden";
   
       const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
         if (e.key !== "Tab") return;
   
         const panel = panelRef.current;
         if (!panel) return;
   
         const focusables = panel.querySelectorAll<HTMLElement>(
           'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
         );
         if (!focusables.length) return;
   
         const first = focusables[0];
         const last = focusables[focusables.length - 1];
   
         if (!e.shiftKey && document.activeElement === last) {
           e.preventDefault();
           first.focus();
         } else if (e.shiftKey && document.activeElement === first) {
           e.preventDefault();
           last.focus();
         }
       };
   
       window.addEventListener("keydown", onKeyDown);
   
       const t = window.setTimeout(() => {
         const panel = panelRef.current;
         const firstFocusable = panel?.querySelector<HTMLElement>(
           'button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
         );
         firstFocusable?.focus();
       }, 0);
   
       return () => {
         document.body.style.overflow = prevOverflow;
         window.removeEventListener("keydown", onKeyDown);
         window.clearTimeout(t);
       };
     }, [open, onClose]);
   
     if (!open) return null;
   
     return (
       <div
         role="dialog"
         aria-modal="true"
         aria-label={title}
         style={styles.backdrop}
         onMouseDown={(e) => {
           if (e.target === e.currentTarget) onClose();
         }}
       >
         <div ref={panelRef} style={styles.panel}>
           <div style={styles.header}>
             <div style={styles.title}>{title}</div>
             <button type="button" onClick={onClose} style={styles.iconBtn}>
               ✕
             </button>
           </div>
   
           <div style={styles.body}>{children}</div>
         </div>
       </div>
     );
   }
   
   const styles: Record<string, React.CSSProperties> = {
     backdrop: {
       position: "fixed",
       inset: 0,
       background: "rgba(0,0,0,0.35)",
       display: "grid",
       placeItems: "center",
       padding: 16,
       zIndex: 100,
     },
     panel: {
       width: "min(560px, 100%)",
       borderRadius: 16,
       border: "1px solid #ddd",
       background: "white",
       boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
       overflow: "hidden",
     },
     header: {
       padding: 12,
       borderBottom: "1px solid #eee",
       display: "flex",
       alignItems: "center",
       justifyContent: "space-between",
       gap: 12,
     },
     title: {
       fontSize: 14,
       fontWeight: 700,
     },
     iconBtn: {
       border: "1px solid #ddd",
       borderRadius: 10,
       background: "transparent",
       padding: "6px 10px",
       cursor: "pointer",
     },
     body: {
       padding: 12,
     },
   };