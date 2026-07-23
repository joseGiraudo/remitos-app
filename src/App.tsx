import { DeliveryNoteForm } from "./components/DeliveryNoteForm";
import { useAppData } from "./hooks/useAppData";

export default function App() {
  const { products, clients, loading, error } = useAppData();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Generador de Remitos</h1>
      </header>

      <main className="app-main">
        {loading && <p className="status">Cargando datos...</p>}
        {error && <p className="status error-msg">Error: {error}</p>}
        {!loading && !error && (
          <DeliveryNoteForm products={products} clients={clients} />
        )}
      </main>
    </div>
  );
}
