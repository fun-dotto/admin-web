"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  detectCurrentEnvironment,
  environments,
  type EnvironmentKey,
} from "@/lib/environments";

export function EnvironmentSwitcher() {
  const [currentKey] = useState<EnvironmentKey>(() =>
    typeof window === "undefined"
      ? "local"
      : detectCurrentEnvironment(window.location.origin),
  );

  const currentEnv =
    environments.find((env) => env.key === currentKey) ?? environments[0];

  const handleSelect = (next: EnvironmentKey) => {
    const target = environments.find((env) => env.key === next);
    if (!target || !target.url) return;
    if (target.key === currentKey) return;

    const { pathname, search, hash } = window.location;
    window.location.assign(`${target.url.replace(/\/$/, "")}${pathname}${search}${hash}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Image
                src="/logo.png"
                alt="Dotto Admin"
                width={32}
                height={32}
                priority
                className="size-8 shrink-0 rounded-md"
              />
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Dotto Admin</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentEnv.label}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              環境を切り替え
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {environments.map((env) => {
              const disabled = env.key !== "local" && !env.url;
              const isCurrent = env.key === currentKey;
              return (
                <DropdownMenuItem
                  key={env.key}
                  disabled={disabled}
                  onClick={() => handleSelect(env.key)}
                  className="cursor-pointer"
                >
                  <span className="flex-1">{env.label}</span>
                  {isCurrent ? <Check className="ml-2 size-4" /> : null}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
