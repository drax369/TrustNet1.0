import React from 'react'

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', marginBottom: 20 }}>Last updated: June 3, 2026</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 13, color: 'hsl(var(--text-secondary))' }}>
        <section>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>1. Data Storage Principles</h3>
          <p>
            At TrustNet, our primary objective is to verify document authenticity without compromising applicant privacy. Since our forensic scanners can run locally within your system infrastructure, document payloads (PDF statements, payslips) do not leave your secure premises.
          </p>
        </section>

        <section>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>2. Session Information Collection</h3>
          <p>
            For cloud-deployed versions of our service, session metadata (such as IP addresses, upload timestamps, and client user-agent strings) is analyzed in real-time to compute threat scores. This data is kept strictly inside isolated logs and is automatically purged after 30 days.
          </p>
        </section>

        <section>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>3. Encryption Protocols</h3>
          <p>
            All remote client telemetry exchanges utilize TLS 1.3 encryption. Internal database records, user profiles, and subscription details are secured using AES-256 standard encryption keys.
          </p>
        </section>
      </div>
    </div>
  )
}
