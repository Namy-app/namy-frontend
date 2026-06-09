"use client";

import { Bell, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import { NotificationFormModal } from "@/app/admin/components/NotificationFormModal";
import { NotificationsList } from "@/app/admin/components/NotificationsList";

export default function AdminNotificationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sent Notifications List - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Notificaciones Enviadas
              </h2>
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Actualizar"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <NotificationsList key={refreshKey} />
          </div>

          {/* Create Section - Sticky on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Crear Nueva Notificación
              </h2>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Enviar Notificación
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Haz clic en el botón para crear y enviar una nueva
                  notificación.
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Crear
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 mt-6">
                <div className="bg-card border border-border rounded-lg p-3">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    🎯 Segmentación
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Envía a restaurantes específicos o a todos.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-3">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    📸 Imágenes
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Imagen única por restaurante.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-3">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    ⏰ Programación
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Envía en el futuro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <NotificationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
