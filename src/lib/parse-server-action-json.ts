export function parseServerActionJson<T>(value: string, fallback: T): T {
  try {
    const parsed = JSON.parse(value) as T | { error?: string };

    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "error" in parsed &&
      typeof parsed.error === "string"
    ) {
      return fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}
