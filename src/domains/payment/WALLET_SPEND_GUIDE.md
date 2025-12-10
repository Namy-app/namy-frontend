# Wallet Spend Integration Guide

Complete guide for integrating wallet spending functionality in your frontend application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Overview

The wallet spend functionality allows users to make internal payments using their wallet balance. It includes:

✅ Balance validation
✅ Atomic DB transactions
✅ Duplicate transaction prevention
✅ Complete transaction history
✅ Real-time balance updates

## Quick Start

### 1. Import the hook

```typescript
import {
  useSpendFromWallet,
  useWallet,
  useWalletBalance,
} from "@/domains/payment/hooks";
```

### 2. Basic usage

```typescript
function MyComponent({ userId }: { userId: string }) {
  const { data: wallet } = useWallet({ userId });
  const { data: balance } = useWalletBalance(wallet?.id || "");
  const spendFromWallet = useSpendFromWallet();

  const handlePayment = async () => {
    try {
      const transaction = await spendFromWallet.mutateAsync({
        walletId: wallet!.id,
        amount: 9900, // 99.00 MXN in cents
        description: "Premium subscription",
        referenceId: "sub-123",
        referenceType: "SUBSCRIPTION",
        metadata: { planType: "monthly" },
      });

      console.log("Payment successful!", transaction);
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay 99.00 MXN
    </button>
  );
}
```

## API Reference

### `useSpendFromWallet()`

React hook for spending from a wallet.

**Returns:** `UseMutationResult<WalletTransaction, Error, SpendFromWalletInput>`

**Input Type: `SpendFromWalletInput`**

```typescript
interface SpendFromWalletInput {
  walletId: string; // Required: Wallet ID
  amount: number; // Required: Amount in cents (e.g., 9900 = 99.00)
  description?: string; // Optional: Transaction description
  referenceId?: string; // Optional: Unique reference (order ID, coupon ID, etc.)
  referenceType?: string; // Optional: Type of reference (ORDER, SUBSCRIPTION, etc.)
  metadata?: Record<string, unknown>; // Optional: Additional data
}
```

**Response Type: `WalletTransaction`**

```typescript
interface WalletTransaction {
  id: string; // Transaction ID
  walletId: string; // Wallet ID
  type: string; // Transaction type ("purchase")
  status: string; // Transaction status ("completed", "pending", "failed")
  amount: number; // Amount in cents
  balanceBefore: number; // Balance before transaction
  balanceAfter: number; // Balance after transaction
  currency: string; // Currency code (e.g., "MXN")
  description?: string; // Transaction description
  metadata?: Record<string, unknown>; // Additional data
  referenceId?: string; // Reference ID
  referenceType?: string; // Reference type
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Update timestamp
  processedAt?: Date; // Processing timestamp
}
```

## Usage Examples

### Example 1: Simple Payment

```typescript
const spendFromWallet = useSpendFromWallet();

const result = await spendFromWallet.mutateAsync({
  walletId: "wallet-id",
  amount: 5000, // 50.00 MXN
  description: "Coffee purchase",
});

console.log(`New balance: ${result.balanceAfter / 100} MXN`);
```

### Example 2: Payment with Duplicate Prevention

```typescript
const handleOrderPayment = async (orderId: string, amount: number) => {
  try {
    await spendFromWallet.mutateAsync({
      walletId: wallet.id,
      amount,
      description: `Order #${orderId}`,
      referenceId: orderId, // Prevents duplicate charges
      referenceType: "ORDER",
      metadata: {
        items: ["item1", "item2"],
        orderDate: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("This order was already paid");
    }
  }
};
```

### Example 3: Balance Check Before Payment

```typescript
const { data: balance } = useWalletBalance(walletId);
const spendFromWallet = useSpendFromWallet();

const handlePayment = async () => {
  const amount = 9900; // 99.00 MXN

  if (!balance || balance.availableBalance < amount) {
    toast.error("Insufficient balance");
    return;
  }

  await spendFromWallet.mutateAsync({
    walletId,
    amount,
    description: "Premium subscription",
  });
};
```

### Example 4: With Loading States

```typescript
function PaymentButton({ walletId, amount }: Props) {
  const spendFromWallet = useSpendFromWallet();

  return (
    <button
      onClick={() => spendFromWallet.mutate({ walletId, amount })}
      disabled={spendFromWallet.isPending}
    >
      {spendFromWallet.isPending ? "Processing..." : "Pay Now"}
    </button>
  );
}
```

### Example 5: Complete Payment Flow with Error Handling

```typescript
function CheckoutButton({ userId, items, totalAmount }: Props) {
  const { toast } = useToast();
  const { data: wallet } = useWallet({ userId });
  const { data: balance } = useWalletBalance(wallet?.id || "");
  const spendFromWallet = useSpendFromWallet();

  const handleCheckout = async () => {
    if (!wallet || !balance) {
      toast({ title: "Error", description: "Wallet not found" });
      return;
    }

    if (balance.availableBalance < totalAmount) {
      toast({
        title: "Insufficient Balance",
        description: `Need ${formatAmount(totalAmount - balance.availableBalance)} more`,
        variant: "destructive",
      });
      return;
    }

    try {
      const orderId = generateOrderId();

      const transaction = await spendFromWallet.mutateAsync({
        walletId: wallet.id,
        amount: totalAmount,
        description: `Order #${orderId}`,
        referenceId: orderId,
        referenceType: "ORDER",
        metadata: {
          items: items.map(i => i.id),
          itemCount: items.length,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "✅ Payment Successful",
        description: `Order confirmed! New balance: ${formatAmount(transaction.balanceAfter)}`,
      });

      // Navigate to success page
      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      console.error("Payment error:", error);

      toast({
        title: "Payment Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={spendFromWallet.isPending}
      className="btn-primary"
    >
      {spendFromWallet.isPending ? "Processing..." : `Pay ${formatAmount(totalAmount)}`}
    </button>
  );
}
```

## Best Practices

### 1. Always Check Balance First

```typescript
const { data: balance } = useWalletBalance(walletId);
const hasEnoughBalance = (balance?.availableBalance || 0) >= amount;

if (!hasEnoughBalance) {
  // Show error message
  return;
}
```

### 2. Use Reference IDs to Prevent Duplicates

```typescript
// Good: Prevents double-charging
await spendFromWallet.mutateAsync({
  walletId,
  amount: 9900,
  referenceId: `order-${orderId}`, // Unique identifier
  referenceType: "ORDER",
});

// Bad: Can result in duplicate charges
await spendFromWallet.mutateAsync({
  walletId,
  amount: 9900,
  // No referenceId - duplicate calls will create multiple transactions
});
```

### 3. Store Metadata for Audit Trail

```typescript
await spendFromWallet.mutateAsync({
  walletId,
  amount: 9900,
  metadata: {
    orderId: "ORD-123",
    items: ["item1", "item2"],
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    source: "mobile-app",
  },
});
```

### 4. Handle Errors Gracefully

```typescript
try {
  await spendFromWallet.mutateAsync({
    /* ... */
  });
} catch (error: any) {
  if (error.message.includes("Insufficient funds")) {
    // Show balance top-up options
  } else if (error.message.includes("already exists")) {
    // Payment already processed
  } else {
    // Generic error
  }
}
```

### 5. Show Real-time Balance Updates

```typescript
// The hook automatically invalidates queries on success
const spendFromWallet = useSpendFromWallet();

// After successful payment, these will automatically refresh:
const { data: wallet } = useWallet({ userId });
const { data: balance } = useWalletBalance(walletId);
const { data: transactions } = useWalletTransactions({ walletId });
```

## Error Handling

### Common Errors

| Error                          | Cause                 | Solution                                           |
| ------------------------------ | --------------------- | -------------------------------------------------- |
| "Insufficient funds"           | Balance too low       | Check balance before payment or show top-up option |
| "Transaction...already exists" | Duplicate referenceId | This is expected - payment already processed       |
| "Wallet is inactive"           | Wallet disabled       | Contact support to reactivate                      |
| "Wallet...not found"           | Invalid walletId      | Verify wallet exists for user                      |

### Error Handling Pattern

```typescript
try {
  await spendFromWallet.mutateAsync(input);
} catch (error: any) {
  const message = error?.message || "";

  if (message.includes("Insufficient funds")) {
    toast({
      title: "Insufficient Balance",
      description: "Please add funds to your wallet",
      action: <Link href="/wallet/deposit">Top Up</Link>
    });
  } else if (message.includes("already exists")) {
    toast({
      title: "Already Paid",
      description: "This payment has already been processed",
    });
  } else {
    toast({
      title: "Payment Failed",
      description: "Please try again or contact support",
      variant: "destructive",
    });
  }
}
```

## Testing

### Unit Test Example

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useSpendFromWallet } from "@/domains/payment/hooks";

describe("useSpendFromWallet", () => {
  it("should spend from wallet successfully", async () => {
    const { result } = renderHook(() => useSpendFromWallet());

    await act(async () => {
      const transaction = await result.current.mutateAsync({
        walletId: "test-wallet",
        amount: 1000,
        description: "Test payment",
      });

      expect(transaction.status).toBe("completed");
      expect(transaction.amount).toBe(1000);
    });
  });

  it("should throw error on insufficient balance", async () => {
    const { result } = renderHook(() => useSpendFromWallet());

    await expect(
      result.current.mutateAsync({
        walletId: "test-wallet",
        amount: 999999999,
      })
    ).rejects.toThrow("Insufficient funds");
  });
});
```

### Integration Test Example

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentButton } from "./PaymentButton";

describe("PaymentButton", () => {
  it("should process payment successfully", async () => {
    render(<PaymentButton walletId="test-wallet" amount={1000} />);

    const button = screen.getByRole("button", { name: /pay/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    });
  });
});
```

## Advanced Usage

### Custom Hook with Business Logic

```typescript
export function useCheckoutPayment() {
  const spendFromWallet = useSpendFromWallet();
  const { toast } = useToast();

  const processPayment = async (params: {
    walletId: string;
    items: CartItem[];
    shippingAddress: Address;
  }) => {
    const totalAmount = calculateTotal(params.items);
    const orderId = generateOrderId();

    try {
      const transaction = await spendFromWallet.mutateAsync({
        walletId: params.walletId,
        amount: totalAmount,
        description: `Order #${orderId}`,
        referenceId: orderId,
        referenceType: "ORDER",
        metadata: {
          items: params.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingAddress: params.shippingAddress,
        },
      });

      // Create order in database
      await createOrder({
        orderId,
        transactionId: transaction.id,
        items: params.items,
        totalAmount,
      });

      return { orderId, transaction };
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "Unable to process payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { processPayment, isProcessing: spendFromWallet.isPending };
}
```

## Summary

The wallet spend functionality provides a complete solution for internal payments:

✅ **Secure**: Atomic transactions with balance validation
✅ **Reliable**: Duplicate prevention and error handling
✅ **Fast**: Real-time balance updates
✅ **Flexible**: Support for metadata and references
✅ **Developer-friendly**: Simple API with TypeScript support

For more examples, see [WalletSpendExample.tsx](./components/WalletSpendExample.tsx).
