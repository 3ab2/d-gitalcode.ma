import { notFound } from "next/navigation";

/** Unknown paths under a locale show that locale's own 404 page. */
export default function UnknownPage() {
  notFound();
}
