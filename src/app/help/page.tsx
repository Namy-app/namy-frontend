"use client";

import {
  HelpCircle,
  Wallet,
  Gift,
  ShoppingBag,
  MessageCircle,
  Mail,
  MessageCircleIcon,
  Search,
} from "lucide-react";
import { useState } from "react";

import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/Accordion";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "@/store/useAuthStore";

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

const faqCategories: FAQCategory[] = [
  {
    id: "general",
    title: "General / Uso de la app",
    icon: <HelpCircle className="h-6 w-6" />,
    color: "text-primary",
    items: [
      {
        question: "¿Qué es Ñamy?",
        answer:
          "Ñamy es una aplicación móvil que te ayuda a encontrar los mejores descuentos y promociones en restaurantes y servicios cercanos. Acumula puntos, sube de nivel y disfruta de beneficios exclusivos.",
      },
      {
        question: "¿Cómo uso los descuentos?",
        answer:
          "Una vez que obtengas un descuento, puedes verlo en tu cartera (wallet). Muestra el código QR en el restaurante o servicio para aplicar el descuento. El código se genera automáticamente basado en tu nivel y suscripción.",
      },
      {
        question: "¿Qué pasa si no uso el descuento en 24 horas?",
        answer:
          "Los descuentos tienen un tiempo de validez de 24 horas. Si no los usas en este período, expirarán y no podrás utilizarlos. Sin embargo, podrás obtener nuevos descuentos.",
      },
    ],
  },
  {
    id: "wallet",
    title: "QR Codes / Wallet",
    icon: <Wallet className="h-6 w-6" />,
    color: "text-secondary",
    items: [
      {
        question: "¿Dónde puedo ver mis códigos QR activos?",
        answer:
          "Puedes ver todos tus códigos QR activos en la sección Wallet (Cartera) de la app. Ahí encontrarás todos los descuentos disponibles con sus códigos listos para usar.",
      },
      {
        question: "¿Cómo marco un código como usado?",
        answer:
          "Cuando uses un descuento en un restaurante o servicio, se marcará automáticamente como usado. Si necesitas marcarlo manualmente, puedes hacerlo desde los detalles del código en tu Wallet.",
      },
      {
        question: "¿Puedo volver a usar un código vencido?",
        answer:
          "No, los códigos vencidos no pueden volver a usarse. Sin embargo, podrás obtener nuevos códigos basados en tu nivel y suscripción premium.",
      },
    ],
  },
  {
    id: "gamification",
    title: "Puntos y Gamificación",
    icon: <Gift className="h-6 w-6" />,
    color: "text-accent",
    items: [
      {
        question: "¿Cómo gano puntos Ñamy?",
        answer:
          "Ganas puntos por usar los descuentos, completar tu racha diaria, y realizar compras en restaurantes asociados. Los puntos se acumulan y te ayudan a subir de nivel.",
      },
      {
        question: "¿Qué es la racha diaria?",
        answer:
          "La racha diaria es un sistema de gamificación que te recompensa por usar la app diariamente. Cada día que uses un descuento, sumas un día a tu racha y ganas puntos bonus.",
      },
      {
        question: "¿Qué es el sistema de niveles y suscripciones premium?",
        answer:
          "Conforme acumulas puntos, subes de nivel desbloqueando nuevos beneficios. La suscripción premium te otorga descuentos más altos (hasta 15%) y acceso a promociones exclusivas.",
      },
    ],
  },
  {
    id: "discounts",
    title: "Descuentos y Restricciones",
    icon: <ShoppingBag className="h-6 w-6" />,
    color: "text-primary",
    items: [
      {
        question: "¿Los descuentos aplican en cualquier momento?",
        answer:
          "La mayoría de descuentos se pueden usar en cualquier momento. Sin embargo, algunos restaurantes pueden tener restricciones de horario o días específicos. Revisa los detalles del descuento antes de usarlo.",
      },
      {
        question: "¿Puedo combinar descuentos con otras promociones?",
        answer:
          "Generalmente no puedes combinar descuentos de Ñamy con otras promociones del establecimiento. Consulta con el restaurante o servicio para confirmar sus políticas.",
      },
      {
        question: "¿Los descuentos son válidos solo en México?",
        answer:
          "Por ahora, Ñamy está disponible en México. Estamos trabajando en expandir a más países próximamente.",
      },
    ],
  },
  {
    id: "support",
    title: "Soporte / Contacto",
    icon: <MessageCircle className="h-6 w-6" />,
    color: "text-secondary",
    items: [
      {
        question: "¿Cómo contacto soporte si tengo un problema?",
        answer:
          "Puedes contactar a nuestro equipo de soporte a través del email support@namy.app o usar la opción de chat en vivo en la app. Respondemos en las próximas 24 horas.",
      },
      {
        question: "¿Puedo sugerir nuevos restaurantes o servicios?",
        answer:
          "¡Claro! Nos encanta recibir sugerencias. Puedes enviar un correo a partners@namy.app con los detalles del restaurante o servicio que deseas agregar.",
      },
    ],
  },
];

export default function HelpPage(): React.JSX.Element {
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(faqCategories);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCategories(faqCategories);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(lowerQuery) ||
            item.answer.toLowerCase().includes(lowerQuery)
        ),
      }))
      .filter((category) => category.items.length > 0);

    setFilteredCategories(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader isAuthenticated={isAuthenticated} />

      <div className="pb-20">
        {/* Header Section with Search */}
        <div className="bg-gradient-hero p-6 pt-16 pb-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ayuda & FAQ
            </h2>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar pregunta..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
        </div>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 max-w-5xl mx-auto">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No encontramos resultados para &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-6 px-6 max-w-5xl mx-auto">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="p-4 bg-card rounded-2xl shadow-md animate-fade-in border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={category.color}>{category.icon}</div>
                  <h2 className="text-lg font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-2">
                  <Accordion type="single" collapsible>
                    {category.items.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Support Section */}
        {filteredCategories.length === faqCategories.length &&
          searchQuery === "" && (
            <div className="mt-8 px-6 max-w-5xl mx-auto">
              <Card className="p-6 bg-card rounded-2xl shadow-md border-border">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <MessageCircleIcon className="h-6 w-6 text-primary" />
                  ¿Necesitas más ayuda?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nuestro equipo está aquí para ayudarte con cualquier pregunta.
                </p>
                <div className="flex flex-col gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg w-full">
                    <Mail className="h-5 w-5 mr-2" />
                    Enviar correo a soporte
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-card w-full"
                  >
                    <MessageCircleIcon className="h-5 w-5 mr-2" />
                    Chat en vivo
                  </Button>
                </div>
              </Card>
            </div>
          )}
      </div>

      <BottomNavigation />
    </div>
  );
}
