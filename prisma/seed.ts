import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.integrityEvent.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.assessmentSession.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.testRun.deleteMany();
  await prisma.analysisJob.deleteMany();
  await prisma.verificationReport.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skillExamSession.deleteMany();
  await prisma.claimedSkill.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.skillDefinition.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const student = await prisma.user.create({
    data: {
      email: "student@talentproof.dev",
      passwordHash,
      name: "Aisha Verma",
      role: "student",
      studentProfile: {
        create: {
          headline: "CSE student · Python & backend projects",
          bio: "Building evidence-backed proof of project understanding.",
          visibility: "public",
          availability: "open to internships",
          location: "Hyderabad (optional)",
          skillsJson: JSON.stringify(["Python", "Testing", "Debugging"]),
          journeyStep: 1,
        },
      },
      consentRecords: {
        create: {
          purpose: "platform_terms",
          version: "1.0",
          granted: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  await prisma.user.create({
    data: {
      email: "recruiter@talentproof.dev",
      passwordHash,
      name: "Rohan Mehta",
      role: "recruiter",
      recruiterProfile: {
        create: {
          company: "Nimbus Labs",
          title: "Campus Hiring Lead",
          verified: true,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "reviewer@talentproof.dev",
      passwordHash,
      name: "Neha Iyer",
      role: "reviewer",
    },
  });

  const skills = [
    {
      slug: "python-project-understanding",
      name: "Python Project Understanding",
      description: "Demonstrated understanding of a submitted Python project.",
      criteriaJson: JSON.stringify({
        minTestsPassedRatio: 0.75,
        minUnderstandingScore: 70,
        requireAssessment: true,
        noSeriousIntegrity: true,
      }),
    },
    {
      slug: "debugging-skills",
      name: "Debugging Skills",
      description: "Showed debugging reasoning on project-specific scenarios.",
      criteriaJson: JSON.stringify({ minDebugScore: 65 }),
    },
    {
      slug: "secure-coding",
      name: "Secure Coding",
      description: "Addressed input validation and basic security concerns.",
      criteriaJson: JSON.stringify({ minSecurityScore: 60 }),
    },
  ];

  for (const skill of skills) {
    await prisma.skillDefinition.create({ data: skill });
  }

  console.log("Seeded users:");
  console.log("  student@talentproof.dev / password123");
  console.log("  recruiter@talentproof.dev / password123");
  console.log("  reviewer@talentproof.dev / password123");
  console.log("Student profile id:", student.studentProfile?.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
