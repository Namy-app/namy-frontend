"use client";

import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { graphqlClient } from "@/lib/graphql-client";

interface SentNotification {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  sentAt: string;
  recipientCount: number;
  storeIds?: string[];
  storeName?: string;
}

const GET_SENT_NOTIFICATIONS = `
  query GetSentNotifications($page: Int, $first: Int) {
    sentNotifications(page: $page, first: $first) {
      data {
        id
        title
        body
        imageUrl
        sentAt
        recipientCount
        storeIds
        storeName
      }
      total
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export function NotificationsList() {
  const [notifications, setNotifications] = useState<SentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadNotifications = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await graphqlClient.request<{
        sentNotifications: {
          data: SentNotification[];
          total: number;
          pageInfo: { hasNextPage: boolean };
        };
      }>(GET_SENT_NOTIFICATIONS, {
        page: pageNum,
        first: 20,
      });

      if (pageNum === 1) {
        setNotifications(res.sentNotifications.data);
      } else {
        setNotifications((prev) => [...prev, ...res.sentNotifications.data]);
      }
      setHasMore(res.sentNotifications.pageInfo.hasNextPage);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("No se pudieron cargar las notificaciones enviadas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications(1);
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900 font-medium">⚠ {error}</p>
        <p className="text-xs text-amber-800 mt-2">
          El backend necesita implementar la query &quot;sentNotifications&quot;
          para mostrar el historial.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por título o mensaje..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Notifications List */}
      {loading && notifications.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Cargando notificaciones...</p>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No hay resultados"
                : "Sin notificaciones enviadas"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    {notification.imageUrl ? <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={notification.imageUrl}
                          alt={notification.title}
                          className="w-full h-full object-cover"
                        />
                      </div> : null}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {notification.title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap flex-shrink-0">
                          {notification.recipientCount} usuarios
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification.body}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(notification.sentAt)}</span>
                        {notification.storeName ? <span>• {notification.storeName}</span> : null}
                        {notification.storeIds &&
                          notification.storeIds.length > 0 ? <span>
                              • {notification.storeIds.length} restaurante
                              {notification.storeIds.length !== 1 ? "s" : ""}
                            </span> : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load More */}
          {hasMore ? <div className="text-center">
              <button
                onClick={() => {
                  setPage((p) => p + 1);
                  void loadNotifications(page + 1);
                }}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Cargar más"}
              </button>
            </div> : null}
        </>
      )}
    </div>
  );
}
