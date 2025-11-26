"use client";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

export function GamificationCard(): React.JSX.Element {
  return (
    <div className="mb-8">
      <div className="px-6">
        <Card className="p-6 bg-linear-to-br from-primary/10 to-[hsl(82,80%,55%)]/10 border-0 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
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
                className="w-6 h-6 text-primary animate-pulse"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              <div>
                <p className="font-bold text-foreground">
                  Estás en el Día 3 de tu streak
                </p>
                <p className="text-sm text-muted-foreground">+30 puntos hoy</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
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
              className="w-5 h-5 text-[hsl(82,80%,55%)]"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Tu nivel actual: Comelón Curioso 🍔
              </p>
              <p className="text-sm text-muted-foreground">2,500 pts</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Ver más detalles
          </Button>
        </Card>
      </div>
    </div>
  );
}
