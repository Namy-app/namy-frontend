"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { BasicLayout } from "@/layouts/BasicLayout";

function ComingSoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "esta función";

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-sm shadow-sm z-20">
        <div className="flex items-center justify-between h-14 max-w-5xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver</span>
          </button>

          <button
            onClick={() => router.push("/explore")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src="/namy-logo.webp"
              alt="Ñamy Logo"
              width={40}
              height={40}
              className="h-10 w-auto rounded-lg"
            />
          </button>

          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-14">
        <div className="max-w-2xl w-full text-center">
          {/* Animated Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Sparkles className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¡Próximamente!
          </h1>

          {/* Feature Name */}
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-gradient-primary rounded-full">
              <p className="text-2xl md:text-3xl font-bold text-white capitalize">
                {feature}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Estamos trabajando en algo increíble para ti. Esta función estará
            disponible muy pronto.
          </p>

          {/* Features List */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              ¿Qué puedes esperar?
            </h2>
            <div className="space-y-4 text-left">
              {(feature === "Top Ñamy" || feature === "Ñamy") && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">🏆</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Tabla de Clasificación
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Compite con otros usuarios y sube en el ranking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">⭐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Puntos y Logros
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Gana puntos por visitas, reseñas y descuentos canjeados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Recompensas Exclusivas
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Desbloquea descuentos especiales al alcanzar nuevos
                        niveles
                      </p>
                    </div>
                  </div>
                </>
              )}

              {feature === "Mural" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">📸</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Galería de Fotos
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Comparte fotos de tus platillos favoritos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Comunidad Interactiva
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Conecta con otros amantes de la buena comida
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">🎨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Inspiración Culinaria
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Descubre nuevos platillos y experiencias gastronómicas
                      </p>
                    </div>
                  </div>
                </>
              )}

              {feature !== "Top Ñamy" &&
                feature !== "Ñamy" &&
                feature !== "Mural" && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary">✨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Nuevas Funcionalidades
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Estamos preparando características increíbles para
                        mejorar tu experiencia
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/explore")}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Explorar Descuentos
            </button>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-card text-foreground rounded-full font-semibold hover:bg-muted transition-colors border border-border"
            >
              Volver Atrás
            </button>
          </div>

          {/* Footer Note */}
          <p className="mt-12 text-sm text-muted-foreground">
            ¿Tienes sugerencias? Contáctanos en{" "}
            <a
              href="mailto:soporte@namy.com"
              className="text-primary hover:underline"
            >
              soporte@namy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <BasicLayout>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <ComingSoonContent />
      </Suspense>
    </BasicLayout>
  );
}
