"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-white group-[.toast]:text-black",
          error:
            "group toast group-[.toaster]:bg-red group-[.toaster]:text-red-600",
          success:
            "group toast group-[.toaster]:bg-green group-[.toaster]:text-green-600",
          warning:
            "group toast group-[.toaster]:bg-yellow group-[.toaster]:text-yellow-600",
          info: "group toast group-[.toaster]:bg-blue group-[.toaster]:text-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
