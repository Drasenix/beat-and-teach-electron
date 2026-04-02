import { ReactNode } from 'react';
import useResizable from '../hooks/useResizable';

type SideBarProps = {
  children: ReactNode;
};

export default function SideBar({ children }: SideBarProps) {
  const {
    size: sidebarWidth,
    handleMouseDown,
    handleKeyDown,
  } = useResizable({
    min: 140,
    max: 340,
    initial: 220,
  });

  return (
    <>
      <div className="daw-sidebar" style={{ width: sidebarWidth }}>
        {children}
      </div>
      <button
        type="button"
        className="daw-resizer"
        aria-label="Resize sidebar"
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
