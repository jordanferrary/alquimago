import { useEffect, useRef } from 'react';

/**
 * Alternativa ao script no index.html. Importação sem dependências de runtime:
 * <Alquimago src="https://.../alquimago.js" />
 * Para usar o script global, NÃO monte este componente simultaneamente.
 */
export function Alquimago({ src = '/alquimago.js', configSrc = '/alquimago.config.json' }: { src?: string; configSrc?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const win = window as Window & {
      ALQUIMAGO_AUTO_MOUNT?: boolean;
      Alquimago?: { mount: (host: Element) => HTMLElement };
    };
    win.ALQUIMAGO_AUTO_MOUNT = false;
    let script: HTMLScriptElement | null = null;
    let widget: HTMLElement | null = null;
    const mount = () => {
      if (target?.isConnected && !widget) {
        const created = win.Alquimago?.mount(target);
        if (created) widget = created;
      }
    };
    if (win.Alquimago) mount();
    else {
      script = document.createElement('script');
      script.src = src;
      script.dataset.config = configSrc;
      script.defer = true;
      script.addEventListener('load', mount);
      document.head.appendChild(script);
    }
    return () => { widget?.remove(); script?.remove(); };
  }, [src, configSrc]);
  return <div ref={ref} data-alquimago-react />;
}
