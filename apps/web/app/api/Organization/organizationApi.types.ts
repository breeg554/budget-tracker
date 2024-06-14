import { z } from "zod";
import { getOrganizationSchema } from "./organizationApi.contracts";

export type GetOrganizationDto = z.TypeOf<typeof getOrganizationSchema>;
