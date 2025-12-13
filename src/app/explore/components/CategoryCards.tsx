"use client";

import { useRouter } from "next/navigation";

import { Card } from "@/shared/components/Card";

export function CategoryCards(): React.JSX.Element {
  const router = useRouter();

  return (
    <div className="px-6 py-8 flex flex-col-2 gap-3 justify-center align-middle">
      <button onClick={() => router.push("/restaurant")} className="w-full">
        <Card className="p-6 bg-gradient-primary hover:shadow-glow transition-all group border-0 shadow-lg rounded-3xl">
          <div className="flex flex-col items-center text-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
            >
              <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
              <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
              <path d="m2.1 21.8 6.4-6.3" />
              <path d="m19 5-7 7" />
            </svg>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                🍽️ Promos en Restaurantes
              </h2>
              <p className="text-sm text-white/90">
                Descubre descuentos en tus lugares favoritos 🍔
              </p>
            </div>
          </div>
        </Card>
      </button>

      <button onClick={() => router.push("/service")} className="w-full">
        <Card className="p-6 bg-gradient-to-r from-[hsl(var(--services))] to-[hsl(82,70%,60%)] hover:shadow-glow transition-all group border-0 shadow-lg rounded-3xl">
          <div className="flex flex-col items-center text-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                💆‍♀️ Promos en Servicios
              </h2>
              <p className="text-sm text-white/90">
                Descuentos en gimnasios, spas y más 💅
              </p>
            </div>
          </div>
        </Card>
      </button>
    </div>
  );
}
