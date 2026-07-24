import { BarcodeFormat, BrowserMultiFormatReader, HTMLCanvasElementLuminanceSource } from '@zxing/browser';
import { BinaryBitmap, DecodeHintType, HybridBinarizer } from '@zxing/library';
import { CameraOff, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const COOLDOWN_MS = 2000;
const CICLO_MS = 200;
// 0/180 (un mismo escaneo horizontal ya cubre ambos, el lector prueba las dos direcciones),
// 90/-90 para cuando el producto queda sostenido en vertical, y +-15 para una inclinacion leve.
const ANGULOS = [0, 90, -90, 15, -15];

// Solo formatos de codigo de barras de producto (1D): evita que el lector pierda tiempo
// probando QR/PDF417/Aztec/DataMatrix en cada intento.
const HINTS = new Map<DecodeHintType, unknown>([
  [
    DecodeHintType.POSSIBLE_FORMATS,
    [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ],
  ],
]);

const RESTRICCIONES_CAMARA: MediaStreamConstraints = {
  video: {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

interface Props {
  onDetectado: (codigo: string) => void;
  onCerrar: () => void;
}

/** Dibuja el frame actual del video rotado `angulo` grados en `canvas`, ajustando el tamano para no recortar esquinas. */
function dibujarFrameRotado(video: HTMLVideoElement, canvas: HTMLCanvasElement, angulo: number): void {
  const { videoWidth: w, videoHeight: h } = video;
  const radianes = (angulo * Math.PI) / 180;
  const nuevoAncho = Math.ceil(Math.abs(Math.cos(radianes)) * w + Math.abs(Math.sin(radianes)) * h);
  const nuevoAlto = Math.ceil(Math.abs(Math.sin(radianes)) * w + Math.abs(Math.cos(radianes)) * h);
  canvas.width = nuevoAncho;
  canvas.height = nuevoAlto;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.translate(nuevoAncho / 2, nuevoAlto / 2);
  ctx.rotate(radianes);
  ctx.drawImage(video, -w / 2, -h / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Lector de codigo de barras via camara (EAN-13/UPC/Code128...), usando @zxing sobre getUserMedia. */
export function EscanerCodigoBarras({ onDetectado, onCerrar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const ultimoCodigoRef = useRef<{ codigo: string; hora: number } | null>(null);
  // Serializa arranque/parada de la camara: en desarrollo React StrictMode monta-desmonta-monta
  // el efecto, y dos streams en paralelo sobre el mismo <video> dejaban la camara en negro.
  // Encadenando en esta promesa nos aseguramos de que la segunda pasada espere a que la
  // primera termine de liberar la camara antes de volver a pedirla.
  const cadenaRef = useRef<Promise<void>>(Promise.resolve());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lector = new BrowserMultiFormatReader(HINTS);
    let cancelado = false;
    let stream: MediaStream | null = null;
    let temporizador: ReturnType<typeof setTimeout> | null = null;

    function intentarCiclo() {
      const video = videoRef.current;
      if (!video || cancelado || video.readyState < video.HAVE_CURRENT_DATA) {
        if (!cancelado) temporizador = setTimeout(intentarCiclo, CICLO_MS);
        return;
      }

      for (const angulo of ANGULOS) {
        if (cancelado) return;
        try {
          dibujarFrameRotado(video, canvasRef.current, angulo);
          const bitmap = new BinaryBitmap(new HybridBinarizer(new HTMLCanvasElementLuminanceSource(canvasRef.current)));
          const resultado = lector.decodeBitmap(bitmap);
          const codigo = resultado.getText();
          const ahora = Date.now();
          const ultimo = ultimoCodigoRef.current;
          if (!ultimo || ultimo.codigo !== codigo || ahora - ultimo.hora >= COOLDOWN_MS) {
            ultimoCodigoRef.current = { codigo, hora: ahora };
            onDetectado(codigo);
          }
          break;
        } catch {
          // Nada en este angulo: se intenta el siguiente. Es el resultado normal de la mayoria de los frames.
        }
      }

      if (!cancelado) temporizador = setTimeout(intentarCiclo, CICLO_MS);
    }

    cadenaRef.current = cadenaRef.current.then(async () => {
      if (cancelado) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia(RESTRICCIONES_CAMARA);
        if (cancelado) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        intentarCiclo();
      } catch (err) {
        if (cancelado) return;
        const nombre = err instanceof Error ? err.name : '';
        if (nombre === 'NotAllowedError') {
          setError('Permiso de cámara denegado. Habilítalo en el navegador para escanear.');
        } else if (nombre === 'NotFoundError' || nombre === 'OverconstrainedError') {
          setError('No se encontró una cámara disponible en este dispositivo.');
        } else {
          setError('No se pudo iniciar la camara.');
        }
      }
    });

    return () => {
      cancelado = true;
      cadenaRef.current = cadenaRef.current.then(() => {
        if (temporizador) clearTimeout(temporizador);
        stream?.getTracks().forEach((track) => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Escanear código de barras</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full p-1 text-ink-muted hover:bg-surface-alt"
            aria-label="Cerrar escáner"
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
          Acerca el código hasta llenar el recuadro; no hace falta que quede perfecto.
        </p>
      </div>
    </div>
  );
}
