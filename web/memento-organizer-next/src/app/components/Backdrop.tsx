import { ReactNode } from 'react';

type TBackdropProps = {
  drop: boolean;
  children: ReactNode;
};

export function Backdrop({ drop, children }: TBackdropProps) {
  return (
    <div
      className={`absolute w-screen h-screen backdrop-blur-sm bg-[#00000055] ${
        drop ? 'grid' : 'hidden top-0 left-0'
      } place-content-center z-50`}
    >
      {children}
    </div>
  );
}
