import { listLessons } from "@/lib/course";
import { SidebarNav } from "@/components/SidebarNav";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const lessons = listLessons();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "100vh" }}>
      <SidebarNav lessons={lessons} />
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
