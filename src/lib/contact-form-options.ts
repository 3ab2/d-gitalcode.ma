import { mapService, getAllServices } from "@/lib/services";

export type ContactServiceOption = {
  id: string;
  name: string;
};

type ServiceRecord = Awaited<ReturnType<typeof getAllServices>>[number];

export function toContactServiceOptions(
  services: ServiceRecord[]
): ContactServiceOption[] {
  return services.map((service) => ({
    id: service.id,
    name: mapService(service).title,
  }));
}
