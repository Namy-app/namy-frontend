"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface AutocompleteOption<T> {
  id: string | number;
  label: string;
  value: T;
}

interface AutocompleteProps<T> {
  options: AutocompleteOption<T>[];
  query: string;
  onQueryUpdate: (query: string) => void;
  onSelect: (option: AutocompleteOption<T>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  renderOption?: (option: AutocompleteOption<T>) => ReactNode;
  isLoading?: boolean;
  noResultsMessage?: string;
  maxHeight?: string;
}

export function Autocomplete<T>({
  options,
  query,
  onQueryUpdate,
  onSelect,
  placeholder = "Search...",
  disabled = false,
  className = "",
  optionClassName = "",
  renderOption,
  isLoading = false,
  noResultsMessage = "No results found",
  maxHeight = "max-h-60",
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    onQueryUpdate(newQuery);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectOption = useCallback(
    (option: AutocompleteOption<T>) => {
      onSelect(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelectOption(options[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        aria-autocomplete="list"
        aria-controls="autocomplete-options"
      />

      {isOpen ? (
        <div
          id="autocomplete-options"
          className={`absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden ${maxHeight} overflow-y-auto`}
        >
          {isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              {noResultsMessage}
            </div>
          ) : (
            <ul className="py-1">
              {options.map((option, index) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      index === highlightedIndex ? "bg-gray-100" : ""
                    } ${optionClassName}`}
                  >
                    {renderOption ? renderOption(option) : option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
