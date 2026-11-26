/**
 * Addresses to try for a lead notification, in order and without repeats.
 *
 * Without a verified sending domain, Resend delivers only to the account owner, so the
 * address configured in the admin panel can be refused. The owner's address is the last
 * resort: a lead that nobody is told about is a lost customer.
 */
export function leadRecipients(
  ...candidates: (string | null | undefined)[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const candidate of candidates) {
    const address = candidate?.trim();
    if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) continue;
    const key = address.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(address);
  }
  return out;
}
