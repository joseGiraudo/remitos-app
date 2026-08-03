# Generador de Remitos

Aplicación web para armar remitos de entrega y descargarlos como PDF, sin necesidad de un backend.

## ¿Qué hace?

- Seleccionás un **cliente** y agregás **productos** con su cantidad y precio unitario.
- El precio se toma del producto pero se puede ajustar por línea sin modificar los datos originales.
- Calcula automáticamente los subtotales y el total del remito.
- Permite agregar **observaciones**.
- Genera y descarga el **remito en PDF** listo para imprimir o enviar.
- Además de los datos precargados, permite **cargar clientes y productos manualmente** desde la misma pantalla.

Los clientes y productos iniciales se leen de archivos JSON en `public/data/` (`clients.json` y `products.json`).

## ¿Por qué JSON y sin backend?

La app fue desarrollada para un **uso específico y acotado**: una operación con un catálogo de productos y una cartera de clientes que cambian poco y son administrados por una sola persona. Bajo esas condiciones, sumar un backend o una base de datos aportaría complejidad y costo de mantenimiento sin un beneficio real.

Por eso las decisiones de diseño fueron:

- **Datos en JSON estáticos** (`public/data/`): editar clientes y productos es tan simple como modificar un archivo de texto y volver a desplegar. No hace falta un panel de administración ni migraciones.
- **Sin backend**: la app es 100% estática, se sirve desde cualquier hosting simple (o incluso local) y no requiere servidores, autenticación ni infraestructura que mantener.
- **Sin almacenamiento persistente**: el remito se arma en memoria y su resultado es el **PDF descargado**, que actúa como registro. No se necesita guardar el estado entre sesiones, así que se evita la complejidad de una base de datos o del `localStorage`.

En resumen, el alcance del proyecto no justifica una arquitectura con backend/storage: el enfoque estático mantiene todo simple, portable y fácil de mantener. Si en el futuro el uso creciera (múltiples usuarios, edición concurrente, historial de remitos), migrar a un backend con base de datos sería el siguiente paso natural.

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como bundler y servidor de desarrollo
- [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) para la generación del PDF

## Cómo correrlo

Requiere [Node.js](https://nodejs.org/).

```bash
# Instalar dependencias
npm install

# Levantar el entorno de desarrollo
npm run dev

# Generar el build de producción
npm run build

# Previsualizar el build
npm run preview
```
