"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  const slides = [
    {
      image: "/onboarding-slide-1-Cofq2ejQ.png",
      title: "Come inteligente, ahorra al instante",
      description:
        "Mira un anuncio rápido y desbloquea descuentos reales en tus lugares favoritos. 🍔💸",
    },
    {
      image: "/onboarding-slide-2-CdHaT8L7.png",
      title: "Descubre qué hay cerca de ti",
      description:
        "Encuentra promociones exclusivas a tu alrededor — come donde te gusta, gastando menos. 🌮📍",
    },
    {
      image: "/onboarding-slide-3-DwHfLKZU.png",
      title: "Tu sabor, tus recompensas",
      description:
        "Sube de nivel y desbloquea más beneficios mientras disfrutas. 🍽️✨",
    },
  ];

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (isDragging) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length, isDragging]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) {
      return;
    }

    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    // If dragged more than 50px, change slide
    if (translateX > 50 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (translateX < -50 && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }

    setTranslateX(0);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-2 flex flex-col items-center justify-center p-6 pt-20">
        <Image
          src="/namy-logo.webp"
          alt="Ñamy Logo"
          width={80}
          height={80}
          className="mb-8 rounded-2xl shadow-glow"
          priority
        />

        {/* Carousel */}
        <div className="relative w-full max-w-2xl pb-12">
          <div
            ref={containerRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="flex -ml-4"
              style={{
                transform: `translate3d(calc(-${currentSlide * 100}% + ${translateX}px), 0px, 0px)`,
                transition: isDragging ? "none" : "transform 0.5s ease-in-out",
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="min-w-0 shrink-0 grow-0 basis-full pl-4"
                >
                  <div className="flex flex-col items-center text-center space-y-6 px-4">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={600}
                      height={600}
                      className="w-full max-w-md h-auto rounded-3xl shadow-elegant pointer-events-none"
                      priority={index === 0}
                    />
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-foreground">
                        {slide.title}
                      </h2>
                      <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex-1 flex flex-col items-center justify-center p-6  bg-background/50 backdrop-blur-sm">
        {isAuthenticated ? (
          <div className="w-full max-w-md ">
            <Link href="/explore" className="mt-3 block ">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:text-accent-foreground px-4 py-2 w-full h-14 border-2 border-border rounded-full font-semibold text-lg hover:bg-accent">
                Explorar Tiendas
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-md ">
            <Link href="/auth">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-lg shadow-glow">
                Registrarse / Iniciar sesión
              </button>
            </Link>
            <Link href="/explore" className="mt-3 block ">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:text-accent-foreground px-4 py-2 w-full h-14 border-2 border-border rounded-full font-semibold text-lg hover:bg-accent">
                Continuar como invitado
              </button>
            </Link>
            <p className="text-sm text-muted-foreground text-center mt-4">
              🔓 Puedes registrarte en cualquier momento para empezar a ahorrar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
