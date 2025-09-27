import React, { useEffect, useRef } from "react";

interface BashTerminalProps {
  logs: string[];
}

const BashTerminal: React.FC<BashTerminalProps> = ({ logs }) => {
  const logRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll do dołu
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl shadow-lg overflow-hidden">
      {/* Nagłówek terminala */}
      <div className="bg-gray-200 dark:bg-gray-800 px-3 py-2 flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">bash</span>
      </div>

      {/* Terminal */}
      <div
        ref={logRef}
        className="bg-white dark:bg-black text-gray-800 dark:text-green-400 font-mono text-sm p-3 h-96 overflow-y-auto whitespace-pre-wrap"
      >
        {logs.length === 0 ? (
          <span className="text-gray-500 dark:text-gray-600">Waiting...</span>
        ) : (
          logs.map((line, i) => (
            <div key={i}>
              <span className="text-gray-700 dark:text-green-500">$ </span>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BashTerminal;
