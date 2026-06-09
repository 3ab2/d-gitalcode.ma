import { Badge } from "@/components/ui/Badge";

export function MessageStatusBadge({
  status,
  labels,
}: {
  status: "OPEN" | "REPLIED";
  labels: { open: string; replied: string };
}) {
  return (
    <Badge variant={status === "REPLIED" ? "green" : "purple"}>
      {status === "REPLIED" ? labels.replied : labels.open}
    </Badge>
  );
}
