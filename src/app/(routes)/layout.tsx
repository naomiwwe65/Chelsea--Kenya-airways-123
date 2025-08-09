import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/header";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-[100dvh]">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Header />
          <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}



