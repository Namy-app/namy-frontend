"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useCategories, useCreateCategory } from "@/domains/category/hooks";
import type { Category } from "@/domains/category/types";

interface CategoryAutocompleteProps {
  value: string; // category ID
  onChange: (categoryId: string, categoryName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CategoryAutocomplete({
  value,
  onChange,
  placeholder = "Search or create category...",
  disabled = false,
}: CategoryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();

  // Find selected category
  const selectedCategory = categories.find((c) => c.id === value);

  // Filter categories based on input
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if input matches any existing category (case-insensitive)
  const exactMatch = categories.find(
    (c) => c.name.toLowerCase() === inputValue.toLowerCase().trim()
  );

  // Show create option if input has value and no exact match
  const showCreateOption = inputValue.trim() && !exactMatch;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset input to selected category name if exists
        if (selectedCategory) {
          setInputValue(selectedCategory.name);
        } else {
          setInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCategory]);

  // Update input value when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      setInputValue(selectedCategory.name);
    }
  }, [selectedCategory]);

  const handleSelect = (category: Category) => {
    onChange(category.id, category.name);
    setInputValue(category.name);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (!inputValue.trim() || isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const newCategory = await createCategory.mutateAsync({
        name: inputValue.trim(),
      });
      onChange(newCategory.id, newCategory.name);
      setInputValue(newCategory.name);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Create new option */}
          {showCreateOption ? (
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={isCreating}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-muted text-primary border-b border-border"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isCreating ? "Creating..." : `Create "${inputValue.trim()}"`}
              </span>
            </button>
          ) : null}

          {/* Existing categories */}
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category)}
                className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-muted"
              >
                <span>{category.name}</span>
                {category.id === value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))
          ) : !showCreateOption ? (
            <div className="px-4 py-2 text-muted-foreground text-sm">
              No categories found. Type to create one.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
