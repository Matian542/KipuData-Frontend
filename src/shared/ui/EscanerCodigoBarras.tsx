import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { CameraOff, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const COOLDOWN_MS = 2000;

interface Props {
  onDetectado: (codigo: string) => void;
  onCerrar: () => void;
}

/** Lector de codigo de barras via camara (EAN-13/UPC/Code128...), usando @zxing/browser sobre getUserMedia. */
export function EscanerCodigoBarras({ onDetectado, onCerrar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ultimoCodigoRef = useRef<{ codigo: string; hora: number } | null>(null);
  // Serializa arranque/parada de la camara: en desarrollo React StrictMode monta-desmonta-monta
  // el efecto, y dos decodeFromVideoDevice en paralelo sobre el mismo <video> dejaban la camara
  // en negro (dos streams peleando por el mismo elemento). Encadenando en esta promesa nos
  // aseguramos de que la segunda pasada espere a que la primera termine de liberar la camara.
  const cadenaRef = useRef<Promise<void>>(Promise.resolve());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lector = new BrowserMultiFormatReader();
    let cancelado = false;
    let controls: IScannerControls | null = null;

    cadenaRef.current = cadenaRef.current.then(async () => {
      if (cancelado) return;
      try {
        const controlesListos = await lector.decodeFromVideoDevice(
          undefined,
          videoRef.current ?? undefined,
          (resultado) => {
            if (!resultado || cancelado) return;
            const codigo = resultado.getText();
            const ahora = Date.now();
            const ultimo = ultimoCodigoRef.current;
            if (ultimo && ultimo.codigo === codigo && ahora - ultimo.hora < COOLDOWN_MS) return;
            ultimoCodigoRef.current = { codigo, hora: ahora };
            onDetectado(codigo);
          },
        );
        if (cancelado) {
          controlesListos.stop();
          return;
        }
        controls = controlesListos;
      } catch (err) {
        if (cancelado) return;
        const nombre = err instanceof Error ? err.name : '';
        if (nombre === 'NotAllowedError') {
          setError('Permiso de camara denegado. Habilitalo en el navegador para escanear.');
        } else if (nombre === 'NotFoundError' || nombre === 'OverconstrainedError') {
          setError('No se encontro una camara disponible en este dispositivo.');
        } else {
          setError('No se pudo iniciar la camara.');
        }
      }
    });

    return () => {
      cancelado = true;
      cadenaRef.current = cadenaRef.current.then(() => {
        controls?.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Escanear codigo de barras</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full p-1 text-ink-muted hover:bg-surface-alt"
            aria-label="Cerrar escaner"
          >
            <X size={18} />
          </button>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface-alt py-10 text-center">
            <CameraOff size={28} className="text-ink-muted" />
            <p className="max-w-xs text-sm text-ink-muted">{error}</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg bg-black">
            <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
            <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-primary-500/80" />
          </div>
        )}

        <p className="mt-3 text-center text-xs text-ink-muted">
          Apunta la camara al codigo de barras del producto.
        </p>
      </div>
    </div>
  );
}
