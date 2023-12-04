export function encodeURI(value) {
  if (!value) return "";
  return encodeURIComponent(value);
}
