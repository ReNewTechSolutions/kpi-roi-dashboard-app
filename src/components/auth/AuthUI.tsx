"use client";

import React from "react";
import Card from "@/components/Card";

export function AuthCard(props: React.PropsWithChildren<{ title: string }>) {
  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h2 style={{ margin: 0 }}>{props.title}</h2>
      <Card>{props.children}</Card>
    </main>
  );
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inp, ...(props.style ?? {}) }} />;
}

export function AuthButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return <button {...props} style={{ ...btn, ...(props.style ?? {}) }} />;
}

export function AuthStatus({ message }: { message: string | null }) {
  if (!message) return null;
  return <div style={{ fontSize: 13, opacity: 0.85 }}>{message}</div>;
}

const inp: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  width: "100%",
};

const btn: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  cursor: "pointer",
};