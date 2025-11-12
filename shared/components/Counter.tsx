"use client";

import { useCounterStore } from "@/store/useCounterStore";

export default function Counter() {
  const { count, increase, decrease, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-xl font-bold">Count: {count}</h2>
      <div className="flex gap-2">
        <button
          onClick={increase}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          +
        </button>
        <button
          onClick={decrease}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          -
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
