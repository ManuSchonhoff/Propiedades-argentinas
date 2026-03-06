"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn("dropdown-content", className)}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn("dropdown-item", className)}
        {...props}
    />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("dropdown-separator", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};
