import { SettingSidebar } from "@/components/setting/SettingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SettingSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
