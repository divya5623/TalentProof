import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitBranch, Link2, Upload } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Banner } from '../../components/ui/Banner'
import { RestrictionBanner } from '../../components/shared/RestrictionBanner'
import { useApp } from '../../context/AppContext'
import type { Project, SupportLevel } from '../../types'

type Source = 'zip' | 'github' | 'url'

export function SubmitProject() {
  const { activePersona, addProject } = useApp()
  const nav = useNavigate()
  const [source, setSource] = useState<Source>('github')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Backend / API')
  const [stack, setStack] = useState('Python, Flask, pytest')
  const [contribution, setContribution] = useState('Sole author')
  const [teammates, setTeammates] = useState('')
  const [setup, setSetup] = useState('pip install -r requirements.txt && pytest')
  const [sourceLabel, setSourceLabel] = useState('')
  const [githubConnected, setGitBranchConnected] = useState(false)
  const [zipName, setZipName] = useState('')
  const [manual, setManual] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const stackList = stack.split(',').map((s) => s.trim()).filter(Boolean)
    const unsupported = stackList.some((s) => /rust|java|swift|kotlin/i.test(s))
    const supportLevel: SupportLevel = unsupported ? 'manual' : /django|go|mongo/i.test(stack) ? 'manual' : 'fully'
    const id = `proj-${Date.now()}`
    const project: Project = {
      id,
      studentId: activePersona.id,
      title: title || 'Untitled project',
      category,
      stack: stackList,
      contribution,
      teammates: teammates ? teammates.split(',').map((t) => t.trim()) : [],
      setupNotes: setup,
      sourceType: source,
      sourceLabel:
        sourceLabel ||
        (source === 'zip' ? zipName || 'project.zip' : source === 'github' ? 'github.com/you/repo (theater)' : 'https://example.com'),
      status: supportLevel === 'manual' ? 'manual_review' : 'analyzed',
      submittedAt: new Date().toISOString(),
      skillTags: stackList,
      supportLevel,
      shareId: `share-${id}`,
      files: [
        { path: 'README.md', language: 'Markdown', lines: 40, summary: 'Setup notes from submission' },
        { path: 'src/main.entry', language: stackList[0] || 'Unknown', lines: 120, summary: 'Primary entry (mock)' },
      ],
      observed: {
        structure: [{ label: 'Source', value: source }, { label: 'Files indexed', value: '2 (demo stub)' }],
        languages: [{ name: stackList[0] || 'Unknown', pct: 100, files: 2 }],
        frameworks: stackList.slice(1),
        qualitySignals: [
          { label: 'Submission received', status: 'pass', detail: 'Theater ingest complete' },
          { label: 'Malware scan', status: 'info', detail: 'Out of scope — not run' },
        ],
      },
      ai: {
        summary: 'Stub analysis for newly submitted project. Open a seeded sample project for full fixture depth.',
        strengths: ['Submission metadata complete'],
        concerns: ['Deep file graph not generated for ad-hoc theater uploads'],
        aiDetectSignal: {
          score: 0.4,
          label: 'Signal only',
          disclaimer: 'AI-detect is never definitive.',
        },
      },
      uncertainty: [
        {
          area: 'Full AST / function map',
          reason: 'Ad-hoc submissions use lightweight stubs in this MVP',
          mitigation: 'Use seeded LedgerLite / PulseBoard for the full demo spine',
        },
      ],
      questions: [],
      badges: [
        {
          id: `${id}-obs`,
          name: 'Structure Observed',
          level: 'observed',
          criteria: ['Submission ingested'],
          earned: true,
          earnedAt: new Date().toISOString(),
        },
        {
          id: `${id}-exp`,
          name: 'Explained Under Assessment',
          level: 'explained',
          criteria: ['Assessment completed'],
          earned: false,
        },
        {
          id: `${id}-ver`,
          name: 'Skill Verified',
          level: 'verified',
          criteria: ['Sample exec + explained'],
          earned: false,
        },
      ],
    }
    addProject(project)
    setManual(supportLevel === 'manual')
    nav(`/student/projects/${id}`)
  }

  return (
    <div className="animate-slide-up mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submit project</h1>
        <p className="mt-1 text-sm text-ink-muted">ZIP theater · GitHub connect theater · public URL</p>
      </div>
      <RestrictionBanner kind="malware" />
      <RestrictionBanner kind="oauth" />

      <Card>
        <CardHeader title="Source" subtitle="All paths are simulated for the hackathon MVP" />
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'zip' as const, icon: Upload, label: 'ZIP upload' },
              { id: 'github' as const, icon: GitBranch, label: 'GitHub' },
              { id: 'url' as const, icon: Link2, label: 'Public URL' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSource(s.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs font-semibold ${
                source === s.id ? 'border-teal bg-teal-light text-teal' : 'border-border bg-white text-ink-muted'
              }`}
            >
              <s.icon className="h-5 w-5" />
              {s.label}
            </button>
          ))}
        </div>

        {source === 'zip' && (
          <div className="mt-4">
            <Banner tone="info" title="ZIP upload theater">
              Choose a file name — bytes are not uploaded to a real scanner.
            </Banner>
            <button
              type="button"
              className="mt-3 w-full rounded-xl border border-dashed border-border-strong bg-surface-2 px-4 py-8 text-sm text-ink-muted hover:border-teal"
              onClick={() => setZipName('my-awesome-project.zip')}
            >
              {zipName ? `Selected: ${zipName}` : 'Click to simulate file picker'}
            </button>
          </div>
        )}

        {source === 'github' && (
          <div className="mt-4 space-y-3">
            <Button
              type="button"
              variant={githubConnected ? 'secondary' : 'primary'}
              onClick={() => setGitBranchConnected(true)}
            >
              <GitBranch className="h-4 w-4" />
              {githubConnected ? 'Connected (theater)' : 'Connect GitHub (theater)'}
            </Button>
            <input
              placeholder="owner/repo"
              value={sourceLabel}
              onChange={(e) => setSourceLabel(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        )}

        {source === 'url' && (
          <input
            className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="https://…"
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
          />
        )}
      </Card>

      <Card>
        <form className="space-y-3" onSubmit={submit}>
          <label className="block text-xs font-semibold text-ink-muted">
            Project title
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-semibold text-ink-muted">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option>Backend / API</option>
              <option>Frontend / SPA</option>
              <option>Full-stack</option>
              <option>CLI / Tooling</option>
              <option>Data / ML</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-ink-muted">
            Stack (comma-separated)
            <input value={stack} onChange={(e) => setStack(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-semibold text-ink-muted">
            Your contribution
            <input value={contribution} onChange={(e) => setContribution(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-semibold text-ink-muted">
            Teammates (optional)
            <input value={teammates} onChange={(e) => setTeammates(e.target.value)} placeholder="Name (role), …" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-semibold text-ink-muted">
            Setup notes
            <textarea value={setup} onChange={(e) => setSetup(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm font-mono" />
          </label>
          <Button type="submit" className="w-full">
            Submit for analysis
          </Button>
          {manual && (
            <p className="text-center text-xs text-warn">Stack routed to Manual review path.</p>
          )}
        </form>
      </Card>
    </div>
  )
}
