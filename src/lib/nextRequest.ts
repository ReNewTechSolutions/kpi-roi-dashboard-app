// =========================================================
// File: src/lib/nextRequest.ts
// Tiny helper so Next request APIs work across versions (sync/async).
// =========================================================
import "server-only";

import { cookies, headers } from "next/headers";

type MaybePromise<T> = T | Promise<T>;

async function resolve<T>(v: MaybePromise<T>): Promise<T> {
  return await v;
}

export async function getCookieStore() {
  return await resolve(cookies() as MaybePromise<ReturnType<typeof cookies>>);
}

export async function getHeaderStore() {
  return await resolve(headers() as MaybePromise<ReturnType<typeof headers>>);
}