import catalogData from "@/data/mattress-catalog.json";
import type { Mattress } from "@/contracts/mattress-match";

/**
 * Repository abstraction over the mattress catalog. Backed by a static JSON file today;
 * swapping this file's internals for a database-backed implementation should not require
 * changes in any caller.
 */
const catalog = catalogData as Mattress[];

export function getAllMattresses(): Mattress[] {
  return catalog;
}

export function getMattressById(id: string): Mattress | undefined {
  return catalog.find((m) => m.id === id);
}

export function getMattressBySlug(slug: string): Mattress | undefined {
  return catalog.find((m) => m.slug === slug);
}

export function getMattressesByIds(ids: string[]): Mattress[] {
  return ids
    .map((id) => getMattressById(id))
    .filter((m): m is Mattress => Boolean(m));
}

export function getAllSlugs(): string[] {
  return catalog.map((m) => m.slug);
}
