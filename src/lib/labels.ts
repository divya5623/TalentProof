export function friendlyStatus(status: string) {
  const map: Record<string, string> = {
    draft: "Draft",
    analyzing: "Checking your project…",
    ready: "Ready for quiz",
    assessing: "Quiz in progress",
    completed: "Done — report ready",
    manual_review: "Needs human check",
    queued: "Waiting",
    running: "Running",
    passed: "Tests passed ✓",
    failed: "Tests failed",
    skipped: "Tests skipped",
    blocked: "Blocked",
    pending: "Waiting for you",
    accepted: "Accepted",
    rejected: "Declined",
    active: "In progress",
    submitted: "Submitted",
    evaluated: "Scored",
    issued: "Earned",
  };
  return map[status] || status;
}

export function nextStudentAction(project: {
  status: string;
  assessments?: { id: string }[];
  reports?: { id: string }[];
}) {
  if (project.status === "ready" && project.assessments?.[0]) {
    return {
      label: "Take the quiz about your code",
      href: `/assessments/${project.assessments[0].id}/instructions`,
    };
  }
  if (project.status === "completed" && project.reports?.[0]) {
    return {
      label: "See your report",
      href: `/reports/${project.reports[0].id}`,
    };
  }
  if (project.status === "analyzing") {
    return { label: "Refresh this page", href: "#" };
  }
  return { label: "Open project", href: "#" };
}
