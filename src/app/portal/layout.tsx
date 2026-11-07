import type { Metadata } from "next";
import { Providers } from "@/components/portal/Providers";
import { Shell } from "@/components/portal/Shell";

export const metadata: Metadata = { title: "Portal do estudante", robots: { index: false, follow: false } };

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Shell>{children}</Shell>
    </Providers>
  );
}
