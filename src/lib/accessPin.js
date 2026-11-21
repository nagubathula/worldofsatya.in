// SHA-256 of the access code for locked works, so the code itself isn't in the bundle.
export const ACCESS_CODE_HASH = "8c46ec847fa9848854e8f3ef3c720acf04f6aa508ed8bde8c3102508a3201dfe";

export async function verifyAccessPin(pin) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === ACCESS_CODE_HASH;
}
