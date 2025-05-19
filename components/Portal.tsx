import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const portalRoot = document.body;
    const el = elRef.current!;
    portalRoot.appendChild(el);
    return () => {
      portalRoot.removeChild(el);
    };
  }, []);

  return createPortal(children, elRef.current);
}
