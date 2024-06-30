import React from "react";
import { Link } from "~/link/Link";
import { routes } from "~/routes";
import { ColumnsIcon } from "~/icons/ColumnsIcon";
import { cn } from "~/utils/cn";
import { useOrganizationName } from "~/utils/useOrganizationName";
import { BarcodeIcon } from "~/icons/BarcodeIcon";

interface ScanLinkProps {
  size?: "1" | "2" | "3" | "4";
}
export function ScanLink({ size = "4" }: ScanLinkProps) {
  const organizationName = useOrganizationName();
  return (
    <Link
      to={routes.scanReceipt.getPath(organizationName)}
      className={cn(
        "transition bg-primary hover:bg-primary/90 rounded-full text-white flex justify-center items-center shadow-lg shadow-secondary-100/50",
        {
          "w-14 h-14": size === "4",
          "w-12 h-12": size === "3",
          "w-8 h-8": size === "2",
          "w-6 h-6": size === "1",
        },
      )}
    >
      <BarcodeIcon
        className={cn({
          "w-6 h-6": size === "4",
          "w-4 h-4": size !== "4",
        })}
      />
    </Link>
  );
}
