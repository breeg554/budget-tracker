import React from "react";
import { Link } from "~/link/Link";
import { routes } from "~/routes";
import { ColumnsIcon } from "~/icons/ColumnsIcon";
import { cn } from "~/utils/cn";

interface ScanLinkProps {
  size?: "1" | "2" | "3" | "4";
}
export function ScanLink({ size = "4" }: ScanLinkProps) {
  return (
    <Link
      to={routes.scanReceipt.getPath()}
      className={cn(
        "transition bg-secondary-150 hover:bg-secondary-200 rounded-full text-white flex justify-center items-center shadow-lg shadow-secondary-100/50",
        {
          "w-14 h-14": size === "4",
          "w-12 h-12": size === "3",
          "w-8 h-8": size === "2",
          "w-6 h-6": size === "1",
        },
      )}
    >
      <ColumnsIcon
        width={size === "4" ? 22 : 16}
        height={size === "4" ? 22 : 16}
      />
    </Link>
  );
}
