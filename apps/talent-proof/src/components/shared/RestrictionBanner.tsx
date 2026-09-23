import { Banner } from '../ui/Banner'

export function RestrictionBanner({
  kind,
}: {
  kind: 'oauth' | 'sandbox' | 'llm' | 'malware' | 'sample-exec'
}) {
  const copy = {
    oauth: {
      title: 'OAuth theater — not a live provider connect',
      body: 'GitHub connect is simulated for this hackathon MVP. No real OAuth tokens are issued.',
    },
    sandbox: {
      title: 'No live Docker sandbox on the main server',
      body: 'Untrusted code is never executed here. Use Trusted sample execution fixtures for supported demo stacks, or the Manual review path.',
    },
    llm: {
      title: 'AI interpretation from fixtures — not a live LLM API call',
      body: 'Summaries and questions are pre-authored mock outputs tied to the sample project files.',
    },
    malware: {
      title: 'Malware scanning — out of scope for MVP',
      body: 'A real scanner is not wired. Treat uploads as demo theater only.',
    },
    'sample-exec': {
      title: 'Trusted sample execution (fixture)',
      body: 'Build/test results below are replayed from a controlled sample project. Clearly labeled — not a live sandbox run of arbitrary student code.',
    },
  }[kind]

  return (
    <Banner tone={kind === 'sample-exec' ? 'demo' : 'warn'} title={copy.title}>
      {copy.body}
    </Banner>
  )
}
