"use client";

import {
  Search,
  User as UserIcon,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUsers } from "@/domains/admin/hooks";
import { UserRole } from "@/domains/admin/types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 20;

  const { data, isLoading, error } = useUsers(page, pageSize, false, search);

  const isAdmin =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.SUPER_ADMIN;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-hero p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/explore")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Explore
                </button>
                <h1 className="text-3xl font-bold text-foreground">
                  User Management
                </h1>
              </div>
              <Button
                onClick={() => router.push("/admin/stores")}
                variant="outline"
              >
                View Stores
              </Button>
            </div>
            <p className="text-muted-foreground">
              Manage and view all users on the platform
            </p>
          </div>

          {/* Statistics */}
          {data ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-foreground">
                      {data.paginationInfo.total}
                    </p>
                  </div>
                  <UserIcon className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Page
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {data.paginationInfo.page} /{" "}
                      {data.paginationInfo.totalPages}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}

          {/* Search */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleSearch}>Search</Button>
              {search ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setPage(1);
                  }}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </Card>

          {/* Users List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : null}

          {error ? (
            <Card className="p-6 text-center">
              <p className="text-destructive">
                Error loading users: {error.message}
              </p>
            </Card>
          ) : null}

          {data && data.data.length === 0 ? (
            <Card className="p-12 text-center">
              <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No users found
              </h3>
              <p className="text-muted-foreground">
                {search
                  ? "Try adjusting your search criteria"
                  : "No users in the system"}
              </p>
            </Card>
          ) : null}

          {data && data.data.length > 0 ? (
            <div className="space-y-4">
              {data.data.map((user) => (
                <Card
                  key={user.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {user.displayName || "No name"}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === UserRole.ADMIN ||
                            user.role === UserRole.SUPER_ADMIN
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <span>📱</span>
                            <span>{user.phone}</span>
                          </div>
                        ) : null}
                        {user.city ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {user.city}
                              {user.country ? `, ${user.country}` : null}
                            </span>
                          </div>
                        ) : null}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                        {user.lastSeen ? (
                          <div className="flex items-center gap-2">
                            <span>👁️</span>
                            <span>Last seen {formatDate(user.lastSeen)}</span>
                          </div>
                        ) : null}
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.active ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <span>{user.active ? "Active" : "Inactive"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          {/* Pagination */}
          {data && data.paginationInfo.totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={!data.paginationInfo.hasPreviousPage}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.paginationInfo.page} of{" "}
                {data.paginationInfo.totalPages}
              </span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={!data.paginationInfo.hasNextPage}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
