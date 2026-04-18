export function getPaginationPages(
  current: number,
  total_page: number,
): (number | "...")[] {
  // Ít trang → show hết
  if (total_page <= 7) {
    return Array.from({ length: total_page }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Trang đầu
  pages.push(1);

  // Dấu ...
  if (current > 4) {
    pages.push("...");
  }

  // Các trang xung quanh trang hiện tại
  const start = Math.max(2, current - 1);
  const end = Math.min(total_page - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Dấu ...
  if (current < total_page - 3) {
    pages.push("...");
  }

  // Trang cuối
  pages.push(total_page);

  return pages;
}
