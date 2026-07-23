import type { Client, Product } from "../types";

// Usamos import.meta.env.BASE_URL para respetar la `base` de Vite y que el
// fetch funcione tanto en dev como servido desde una subruta.
function dataUrl(file: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}data/${file}`.replace(/\/{2,}/g, "/");
}

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(dataUrl(file));
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${file} (HTTP ${res.status})`);
  }
  return (await res.json()) as T;
}

export function loadProducts(): Promise<Product[]> {
  return fetchJson<Product[]>("products.json");
}

export function loadClients(): Promise<Client[]> {
  return fetchJson<Client[]>("clients.json");
}
