"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useStores } from "@/domains/store/hooks";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

export default function StorePage(): React.JSX.Element {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: storesResult, isLoading, error } = useStores();
  const stores = storesResult?.data ?? [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Stores
              </h1>
              <p className="text-muted-foreground">
                Discover restaurants with amazing discounts
              </p>
            </div>
            <Button
              onClick={() =>
                router.push(isAuthenticated ? "/explore" : "/auth")
              }
              variant="outline"
            >
              {isAuthenticated ? "My Account" : "Login"}
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading stores...</p>
            </div>
          ) : null}

          {error ? (
            <Card className="p-6 shadow-glow">
              <p className="text-destructive">
                Error loading stores: {error.message}
              </p>
            </Card>
          ) : null}

          {stores && stores.length === 0 ? (
            <Card className="p-6 shadow-glow">
              <p className="text-muted-foreground text-center">
                No stores available yet. Check back soon!
              </p>
            </Card>
          ) : null}

          {stores && stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <Card
                  key={store.id}
                  className="p-6 shadow-glow hover:shadow-xl transition-shadow"
                >
                  {store.logo ? (
                    <div className="mb-4 h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={store.logo}
                        alt={store.name}
                        width={320}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}

                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {store.name}
                  </h3>

                  {store.description ? (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {store.description}
                    </p>
                  ) : null}

                  {store.address ? (
                    <p className="text-sm text-muted-foreground mb-2">
                      {store.address}
                    </p>
                  ) : null}

                  {store.phoneNumber ? (
                    <p className="text-sm text-muted-foreground mb-4">
                      {store.phoneNumber}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        store.isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {store.isActive ? "Open" : "Closed"}
                    </span>

                    <Button
                      onClick={() => router.push(`/store/${store.id}`)}
                      variant="outline"
                      className="text-sm"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
