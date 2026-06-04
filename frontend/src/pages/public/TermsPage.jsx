import React from 'react'

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', marginBottom: 20 }}>Last updated: June 3, 2026</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 13, color: 'hsl(var(--text-secondary))' }}>
        <section>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>1. Acceptable Use Policy</h3>
          <p>
            TrustNet provides forensic tools to evaluate document parameters. Users agree not to utilize our APIs to maliciously test forged documents to understand detection limits, or attempt to reverse-engineer our proprietary ELA matrices.
          </p>
        </section>

        <section>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>2. Operational SLA Bounds</h3>
          <p>
            While our scanners achieve high accuracy, our reports should be used as advisory metrics. The final compliance approval remains the responsibility of the designated loan officer. TrustNet is not liable for credit underwriting losses.
          </p>
        </section>

        <section>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>3. Subscription Invoicing</h3>
          <p>
            Paid subscriptions renew automatically at the beginning of each billing cycle (monthly or annually). Cancellation requests must be completed in your Billing panel before the renewal date.
          </p>
        </section>
      </div>
    </div>
  )
}
