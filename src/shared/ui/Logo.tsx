import iconoClaro from '../../assets/kipu-logo.png';
import iconoSobreVerde from '../../assets/kipu-icon-on-green.png';

interface Props {
  className?: string;
  tamanoIcono?: string;
  /** Variante para fondos verdes: icono con la red en gris claro en vez de verde. */
  sobreVerde?: boolean;
}

export function Logo({ className = '', tamanoIcono = 'h-9', sobreVerde = false }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={sobreVerde ? iconoSobreVerde : iconoClaro} alt="" className={`${tamanoIcono} w-auto object-contain`} />
      <span className="text-xl font-extrabold tracking-tight text-ink">
        Kipu{sobreVerde ? 'Data' : <span className="text-primary-500">Data</span>}
      </span>
    </div>
  );
}
