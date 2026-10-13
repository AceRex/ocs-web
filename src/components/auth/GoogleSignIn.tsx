import { useEffect, useRef, useState } from 'react'

type GoogleIdentity = {
  initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void; auto_select: boolean }) => void
  renderButton: (element: HTMLElement, options: { type: string; theme: string; size: string; text: string; width: number }) => void
}

declare global {
  interface Window { google?: { accounts: { id: GoogleIdentity } } }
}

let loading: Promise<GoogleIdentity> | undefined
function loadGoogle(): Promise<GoogleIdentity> {
  if (window.google?.accounts.id) return Promise.resolve(window.google.accounts.id)
  if (loading) return loading
  loading = new Promise<GoogleIdentity>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    const timeout = window.setTimeout(() => finish(new Error('Google sign-in took too long to load. Please refresh and try again.')), 15000)
    function finish(error?: Error) {
      window.clearTimeout(timeout)
      script.onload = null
      script.onerror = null
      if (error) { script.remove(); reject(error) }
      else if (window.google?.accounts.id) resolve(window.google.accounts.id)
      else { script.remove(); reject(new Error('Google sign-in is unavailable.')) }
    }
    script.onload = () => finish()
    script.onerror = () => finish(new Error('Unable to load Google sign-in. Check your internet connection.'))
    document.head.appendChild(script)
  }).catch((error) => { loading = undefined; throw error })
  return loading
}

export function GoogleSignIn({ onCredential, onError, disabled = false }: {
  onCredential: (credential: string) => Promise<void> | void
  onError: (message: string) => void
  disabled?: boolean
}) {
  const element = useRef<HTMLDivElement>(null)
  const callbacks = useRef({ onCredential, onError, disabled })
  const [ready, setReady] = useState(false)
  callbacks.current = { onCredential, onError, disabled }
  useEffect(() => {
    let cancelled = false
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { setReady(true); callbacks.current.onError('Google sign-in is not configured.'); return }
    loadGoogle().then((google) => {
      if (cancelled || !element.current) return
      google.initialize({ client_id: clientId, auto_select: false, callback: ({ credential }) => {
        if (cancelled || callbacks.current.disabled) return
        if (!credential) { callbacks.current.onError('Google did not return a sign-in credential.'); return }
        Promise.resolve(callbacks.current.onCredential(credential)).catch(() => {
          callbacks.current.onError('Google sign-in could not be completed. Please try again.')
        })
      } })
      google.renderButton(element.current, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', width: Math.min(400, Math.max(200, element.current.clientWidth)) })
      setReady(true)
    }).catch((error: Error) => { if (!cancelled) { setReady(true); callbacks.current.onError(error.message) } })
    return () => { cancelled = true }
  }, [])
  return <div aria-busy={!ready || disabled} className={disabled ? 'pointer-events-none opacity-60' : ''}>
    {!ready && <p className="text-sm text-slate-500 text-center">Loading Google sign-in…</p>}
    <div ref={element} className="w-full flex justify-center" />
  </div>
}
