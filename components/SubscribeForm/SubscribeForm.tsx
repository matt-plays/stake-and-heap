'use client'

import { useState, FormEvent, SVGProps } from 'react'
import styles from './SubscribeForm.module.css'

function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M13.207 6.232a.75.75 0 0 1 1.06-.025l5.5 5.25a.75.75 0 0 1 0 1.086l-5.5 5.25a.75.75 0 0 1-1.035-1.086l4.146-3.957H4.75a.75.75 0 0 1 0-1.5h12.628l-4.146-3.957a.75.75 0 0 1-.025-1.06" clipRule="evenodd" />
    </svg>
  )
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.wrapper}>
        <p className={`mono ${styles.label}`}>you&apos;re in — we&apos;ll be in touch</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={`mono ${styles.label}`}>get pinged when it drops</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="enter your email address"
          className={`mono ${styles.input}`}
          disabled={status === 'loading'}
          required
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading'}
          aria-label="Subscribe"
        >
          <ArrowRight />
        </button>
      </form>
      {status === 'error' && (
        <p className={`mono ${styles.error}`}>something went wrong — try again</p>
      )}
    </div>
  )
}
