import { listLessons } from "@/lib/course";
import { SidebarNav } from "@/components/SidebarNav";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const lessons = listLessons();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[320px_1fr]">
        <SidebarNav lessons={lessons} />
        <div className="min-h-screen px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
