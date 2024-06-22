import { z } from "zod";
import {
  createOrganizationSchema,
  getOrganizationSchema,
} from "./organizationApi.contracts";

export type GetOrganizationDto = z.TypeOf<typeof getOrganizationSchema>;

export type CreateOrganizationDto = z.TypeOf<typeof createOrganizationSchema>;
