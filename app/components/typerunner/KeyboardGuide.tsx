/**
 * Visual keyboard guide showing finger placement
 */

import { KEYBOARD_ROWS, FINGER_COLORS } from '@/lib/typerunner/constants';

interface KeyboardGuideProps {
  activeKey: string | null;
}

export default function KeyboardGuide({ activeKey }: KeyboardGuideProps) {
  return (
    <div className="bg-black/50 p-4 rounded-xl border border-gray-700 w-full max-w-lg mx-auto mb-6">
      <div className="flex flex-col gap-1 items-center">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center w-full">
            {row.map((keyData, j) => {
              const isActive = activeKey === keyData.k;
              return (
                <div
                  key={j}
                  className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold shadow-sm transition-all duration-75"
                  style={{
                    backgroundColor: isActive ? '#ffffff' : FINGER_COLORS[keyData.f],
                    color: isActive ? FINGER_COLORS[keyData.f] : '#000000',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isActive
                      ? `0 0 15px ${FINGER_COLORS[keyData.f]}, 0 0 5px white`
                      : 'none',
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  {keyData.k.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-3 px-4 uppercase font-mono tracking-wider">
        <span className="text-red-500">Left Pinky</span>
        <span className="text-cyan-500">Right Index</span>
        <span className="text-pink-500">Right Pinky</span>
      </div>
    </div>
  );
}

