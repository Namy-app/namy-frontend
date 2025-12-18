"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BasicLayout } from "@/layouts/BasicLayout";

export default function PaymentPage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <BasicLayout>
        <div className="pt-14 pb-16">
          <div className="min-h-screen bg-gradient-hero p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground">Payment</h1>
              <p className="text-muted-foreground mt-2">
                Payment page coming soon...
              </p>
            </div>
          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  );
}
