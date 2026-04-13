export function deleteStorageClient() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("admin_storage");
}
