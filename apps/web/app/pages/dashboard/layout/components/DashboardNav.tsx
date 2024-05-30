import React, { PropsWithChildren } from "react";
import { NavLink, NavLinkProps } from "~/components/link/NavLink";
import { routes } from "~/routes";
import { cn } from "~/utils/cn";
import { GearIcon } from "~/icons/GearIcon";
import { BarChartIcon } from "~/icons/BarChartIcon";
import { DashboardIcon } from "~/icons/DashboardIcon";
import { FileTextIcon } from "~/icons/FileTextIcon";
import { ScanLink } from "~/dashboard/layout/components/ScanLink";

interface DashboardNavProps {}

export const DashboardNav: React.FC<DashboardNavProps> = () => {
  return (
    <nav className="w-full px-2 py-4">
      <ul className="grid gap-1 grid-cols-5 relative">
        <DashboardNavItem>
          <DashboardNavLink to={routes.dashboard.getPath()}>
            <DashboardIcon />
            <DashboardNavText>Discover</DashboardNavText>
          </DashboardNavLink>
        </DashboardNavItem>

        <DashboardNavItem>
          <DashboardNavLink to={routes.receipts.getPath()}>
            <FileTextIcon />
            <DashboardNavText>Receipts</DashboardNavText>
          </DashboardNavLink>
        </DashboardNavItem>

        <DashboardNavItem>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3">
            <ScanLink />
          </div>
        </DashboardNavItem>

        <DashboardNavItem>
          <DashboardNavLink to={routes.statistics.getPath()}>
            <BarChartIcon />
            <DashboardNavText>Stats</DashboardNavText>
          </DashboardNavLink>
        </DashboardNavItem>

        <DashboardNavItem>
          <DashboardNavLink to={routes.profile.getPath()}>
            <GearIcon />
            <DashboardNavText>Profile</DashboardNavText>
          </DashboardNavLink>
        </DashboardNavItem>
      </ul>
    </nav>
  );
};

interface DashboardNavLinkProps extends NavLinkProps {}

function DashboardNavLink({ className, ...rest }: DashboardNavLinkProps) {
  return (
    <NavLink
      {...rest}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center w-fit transition hover:text-primary-600",
          { "text-primary-600": isActive, "text-neutral-600": !isActive },
          className,
        )
      }
    />
  );
}

function DashboardNavText({ children }: PropsWithChildren) {
  return <p className="text-xs">{children}</p>;
}

function DashboardNavItem({ children }: PropsWithChildren) {
  return (
    <li className="w-full h-full flex justify-center items-center">
      {children}
    </li>
  );
}
