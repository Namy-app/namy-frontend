"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import {
  useSubCategories,
  useCreateSubCategory,
} from "@/domains/subcategory/hooks";
import type { SubCategory } from "@/domains/subcategory/types";

interface SubCategoryAutocompleteProps {
  value: string; // subcategory ID
  categoryId: string; // parent category ID (required for creating)
  onChange: (subCategoryId: string, subCategoryName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SubCategoryAutocomplete({
  value,
  categoryId,
  onChange,
  placeholder = "Search or create subcategory...",
  disabled = false,
}: SubCategoryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch subcategories for the selected category
  const { data: subCategories = [] } = useSubCategories(
    categoryId ? { categoryId } : undefined
  );
  const createSubCategory = useCreateSubCategory();

  // Find selected subcategory
  const selectedSubCategory = subCategories.find((s) => s.id === value);

  // Filter subcategories based on input
  const filteredSubCategories = subCategories.filter((subCategory) =>
    subCategory.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if input matches any existing subcategory (case-insensitive)
  const exactMatch = subCategories.find(
    (s) => s.name.toLowerCase() === inputValue.toLowerCase().trim()
  );

  // Show create option if input has value, no exact match, and category is selected
  const showCreateOption = inputValue.trim() && !exactMatch && categoryId;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset input to selected subcategory name if exists
        if (selectedSubCategory) {
          setInputValue(selectedSubCategory.name);
        } else {
          setInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedSubCategory]);

  // Update input value when selected subcategory changes
  useEffect(() => {
    if (selectedSubCategory) {
      setInputValue(selectedSubCategory.name);
    }
  }, [selectedSubCategory]);

  // Reset input when category changes
  useEffect(() => {
    if (!value) {
      setInputValue("");
    }
  }, [categoryId, value]);

  const handleSelect = (subCategory: SubCategory) => {
    onChange(subCategory.id, subCategory.name);
    setInputValue(subCategory.name);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (!inputValue.trim() || !categoryId || isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const newSubCategory = await createSubCategory.mutateAsync({
        name: inputValue.trim(),
        categoryId,
      });
      onChange(newSubCategory.id, newSubCategory.name);
      setInputValue(newSubCategory.name);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create subcategory:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const isDisabled = disabled || !categoryId;

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
          onFocus={() => categoryId && setIsOpen(true)}
          placeholder={categoryId ? placeholder : "Select a category first"}
          disabled={isDisabled}
          className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => categoryId && setIsOpen(!isOpen)}
          disabled={isDisabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen && categoryId ? (
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

          {/* Existing subcategories */}
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                type="button"
                onClick={() => handleSelect(subCategory)}
                className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-muted"
              >
                <span>{subCategory.name}</span>
                {subCategory.id === value ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : null}
              </button>
            ))
          ) : !showCreateOption ? (
            <div className="px-4 py-2 text-muted-foreground text-sm">
              No subcategories found. Type to create one.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
