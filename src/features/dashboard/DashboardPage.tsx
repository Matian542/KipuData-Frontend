const URL_POWER_BI =
  'https://app.powerbi.com/view?r=eyJrIjoiNmJiMDMwNDktZjhhOS00ZWZjLWE5Y2YtOThlMjRjZDJjZDcyIiwidCI6IjY4MmE0ZTZhLWE3N2YtNDk1OC1hM2FjLTllMjY2ZDE4YWEzNyIsImMiOjR9';

/** Vista general para el dueno: reporte de Power BI incrustado (trae su propia navegacion interna). */
export function DashboardPage() {
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted">Vista general del negocio para el dueno</p>
      </div>

      <div className="min-h-[720px] flex-1 overflow-hidden rounded-xl border-2 border-border shadow-sm">
        <iframe title="Kipu Data - Power BI" src={URL_POWER_BI} className="h-full w-full border-0" allowFullScreen />
      </div>
    </div>
  );
}
