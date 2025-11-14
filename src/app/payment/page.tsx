"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Payment</h1>
          <p className="text-muted-foreground mt-2">Payment page coming soon...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
