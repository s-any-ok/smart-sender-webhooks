export type PageItem = number | 'gap';

export function getPageItems(current: number, last: number, siblings = 1): PageItem[] {
  const pages = new Set<number>([1, last]);
  for (let page = current - siblings; page <= current + siblings; page += 1) {
    if (page >= 1 && page <= last) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((page, index): PageItem[] => {
    const previous = sorted[index - 1];
    if (previous === undefined || page - previous === 1) return [page];
    return page - previous === 2 ? [previous + 1, page] : ['gap', page];
  });
}
