/**
 * Extracts initials from a full name string
 * @param name - The full name string
 * @returns The first 2 initials, or 1 initial if only one name is provided
 */
export function getInitials(name?: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  // Split the name by spaces and filter out empty strings
  const nameParts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (nameParts.length === 0) {
    return "";
  }

  if (nameParts.length === 1) {
    // Return first initial of the single name
    return nameParts[0]?.[0]?.toUpperCase() ?? "";
  }

  // Return first initial of first name and first initial of second name
  const firstInitial = nameParts[0]?.[0]?.toUpperCase() ?? "";
  const secondInitial = nameParts[1]?.[0]?.toUpperCase() ?? "";
  return firstInitial + secondInitial;
}

export function getUserLevelTitle(level: number): string {
  switch (level) {
    case 2:
      return "Explorador";
    case 3:
      return "Maestro";
    default:
      return "Novato";
  }
}
