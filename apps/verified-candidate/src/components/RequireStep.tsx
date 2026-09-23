import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { guardNavigate, isStepUnlocked, lockReason, STEP_PATHS } from '../lib/journey'
import type { JourneyStep } from '../types'
import { LockedGate } from './LockedGate'

/**
 * Deep-link guard for locked journey pages.
 * On mount, if the step is locked, redirect + toast.
 */
export function RequireStep({
  step,
  children,
}: {
  step: JourneyStep
  children: ReactNode
}) {
  const { journey, persona, toast } = useApp()
  const navigate = useNavigate()
  const unlocked = isStepUnlocked(step, journey, persona)

  useEffect(() => {
    if (unlocked) return
    const guard = guardNavigate(STEP_PATHS[step], journey, persona)
    if (!guard.ok) {
      toast(guard.reason, 'warning')
      navigate(guard.redirectTo, { replace: true })
    }
  }, [step, journey, persona, navigate, toast, unlocked])

  if (!unlocked) {
    const reason = lockReason(step, journey, persona)
    const guard = guardNavigate(STEP_PATHS[step], journey, persona)
    return (
      <LockedGate
        title="Step locked"
        reason={reason || 'Complete prior steps to unlock'}
        ctaLabel="Go to next open step"
        ctaTo={guard.ok ? '/' : guard.redirectTo}
      />
    )
  }

  return <>{children}</>
}
