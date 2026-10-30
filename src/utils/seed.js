import newsService from "@/services/newsService";
import eventService from "@/services/eventService";
import programService from "@/services/programService";
import departmentService from "@/services/departmentService";

const addDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

/** Adds clearly-labelled sample content so a new site is not empty. Admins can edit or delete it. */
export async function seedSample() {
  await Promise.all([
    ...[
      ["Sample: Welcome to our new website", "News", "This is a sample story. Replace it from Dashboard → News.", true],
      ["Sample: Public lecture announced", "Announcement", "A sample announcement. Edit or delete it in the dashboard.", false],
      ["Sample: Research collaboration begins", "Research", "A sample research update. Edit or delete it in the dashboard.", false],
    ].map(([title, category, content, featured], i) =>
      newsService.create({ title, category, content, excerpt: content, date: addDays(-i * 3), image: "", featured, status: "published" })),
    ...[
      ["Sample: Open day", addDays(14), "09:00 – 12:00"],
      ["Sample: Policy dialogue", addDays(30), "14:00 – 16:30"],
    ].map(([title, date, time]) =>
      eventService.create({ title, date, time, location: "RUPP campus", description: "Sample event. Edit or delete it in the dashboard.", image: "", status: "published" })),
    ...[
      ["Sample: Bachelor program", "Undergraduate", "4 years"],
      ["Sample: Master program", "Graduate", "2 years"],
      ["Sample: Short course", "Short course", "3 months"],
    ].map(([name, level, duration], i) =>
      programService.create({ name, level, duration, description: "Sample program description.", faculty: "Sample faculty", order: i, image: "", status: "published" })),
    departmentService.create({ name: "Sample faculty", head: "Dr. Sample Name", description: "Sample faculty description.", order: 1, image: "", status: "published" }),
  ]);
}
