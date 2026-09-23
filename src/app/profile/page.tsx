import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function saveProfile(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  await prisma.studentProfile.update({
    where: { userId: session.id },
    data: {
      headline: String(formData.get("headline") || ""),
      bio: String(formData.get("bio") || ""),
      visibility: String(formData.get("visibility") || "public"),
      availability: String(formData.get("availability") || ""),
      location: String(formData.get("location") || ""),
      skillsJson: JSON.stringify(
        String(formData.get("skills") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    },
  });
  redirect("/profile?saved=1");
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  if (!student) redirect("/login");
  const params = await searchParams;
  const skills = JSON.parse(student.skillsJson || "[]") as string[];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Profile</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Technical profile</h1>
        {params.saved && (
          <p className="mt-4 rounded-md bg-seal-soft px-3 py-2 text-sm text-seal-deep">Saved.</p>
        )}
        <form action={saveProfile} className="panel mt-8 space-y-4 p-6">
          <div>
            <label className="label" htmlFor="headline">
              Headline
            </label>
            <input className="input" id="headline" name="headline" defaultValue={student.headline} />
          </div>
          <div>
            <label className="label" htmlFor="bio">
              Bio
            </label>
            <textarea className="input min-h-24" id="bio" name="bio" defaultValue={student.bio} />
          </div>
          <div>
            <label className="label" htmlFor="skills">
              Skills (comma-separated)
            </label>
            <input className="input" id="skills" name="skills" defaultValue={skills.join(", ")} />
          </div>
          <div>
            <label className="label" htmlFor="visibility">
              Visibility
            </label>
            <select className="input" id="visibility" name="visibility" defaultValue={student.visibility}>
              <option value="public">Public evidence</option>
              <option value="limited">Limited</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="availability">
              Availability
            </label>
            <input
              className="input"
              id="availability"
              name="availability"
              defaultValue={student.availability}
            />
          </div>
          <div>
            <label className="label" htmlFor="location">
              Location (optional)
            </label>
            <input className="input" id="location" name="location" defaultValue={student.location} />
          </div>
          <button className="btn-primary" type="submit">
            Save profile
          </button>
        </form>
      </main>
    </div>
  );
}
