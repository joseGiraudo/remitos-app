import { useEffect, useState } from "react";
import type { Client, Product } from "../types";
import { loadClients, loadProducts } from "../utils/loadData";

interface AppData {
  products: Product[];
  clients: Client[];
  loading: boolean;
  error: string | null;
}

export function useAppData(): AppData {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadProducts(), loadClients()])
      .then(([prods, clis]) => {
        if (cancelled) return;
        setProducts(prods);
        setClients(clis);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, clients, loading, error };
}
