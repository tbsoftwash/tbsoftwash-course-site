import { listLessons } from "@/lib/course";
import { SidebarShell } from "@/components/SidebarShell";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const lessons = listLessons();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1600px]">
        <SidebarShell lessons={lessons} />
        <div className="min-h-screen flex-1 px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
