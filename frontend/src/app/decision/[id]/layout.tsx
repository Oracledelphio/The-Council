import { MemorySidebar } from "@/components/memory/sidebar";

export default function DecisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#121212] print:h-auto print:overflow-visible print:block">
      <MemorySidebar />
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:block">
        {children}
      </div>
    </div>
  );
}
