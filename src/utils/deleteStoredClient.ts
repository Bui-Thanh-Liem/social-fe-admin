export function deleteStoredClient() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("admin_storage");
}
