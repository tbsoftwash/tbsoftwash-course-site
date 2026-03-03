import { listLessons } from "@/lib/course";
import { getCoreModuleTitles } from "@/lib/moduleTitles";
import { SidebarShell } from "@/components/SidebarShell";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const lessons = listLessons();
  const moduleTitles = getCoreModuleTitles();

  // Make sidebar and content independently scrollable.
  // The page itself should not scroll (prevents the sidebar from moving out of view).
  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="mx-auto flex h-screen max-w-[1600px]">
        <SidebarShell lessons={lessons} moduleTitles={moduleTitles} />
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
