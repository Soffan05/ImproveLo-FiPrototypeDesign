import { useState, useRef, useEffect } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#2A1060',
  bgMid: '#3D1F82',
  card: '#5A3DAA',
  cardHover: '#6848BB',
  divider: 'rgba(255,255,255,0.25)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.6)',
  clockBg: '#FFFFFF',
  clockText: '#2A1060',
  swishGreen: '#2ABB67',
  cancelRedBg: 'rgba(217,64,64,0.12)',
  cancelRedBorder: 'rgba(217,64,64,0.3)',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
}

type Screen = 'home' | 'confirm-swish' | 'confirm-1177' | '1177-landing' | 'bills'

// ─── Swish logo ───────────────────────────────────────────────────────────────
function SwishLogo({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="26" fill="white" />
      <path d="M14 26C14 19.373 19.373 14 26 14C29.86 14 33.3 15.74 35.6 18.5" stroke="#FF6B00" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M38 26C38 32.627 32.627 38 26 38C22.14 38 18.7 36.26 16.4 33.5" stroke="#8B2BE2" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M26 18C29.2 18 32 19.5 33.8 22" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M26 34C22.8 34 20 32.5 18.2 30" stroke="#8B2BE2" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

// ─── Swedbank logo ────────────────────────────────────────────────────────────
function SwedbankLogo({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="26" fill="#EF7B00" />
      <text x="26" y="33" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontWeight="bold">S</text>
    </svg>
  )
}

// ─── 1177 badge ───────────────────────────────────────────────────────────────
function Badge1177({ size = 52 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: '#C0392B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: size * 0.3, color: '#fff', letterSpacing: '-0.5px' }}>1177</span>
    </div>
  )
}

// ─── Clock (device time) ──────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    // Sync to the next full minute, then update every minute
    const start = new Date()
    const msToNextMinute = 60000 - (start.getSeconds() * 1000 + start.getMilliseconds())
    let interval: ReturnType<typeof setInterval> | null = null
    const timeout = setTimeout(() => {
      tick()
      interval = setInterval(tick, 60000)
    }, msToNextMinute)
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [])

  const time = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div style={{ background: T.clockBg, color: T.clockText, borderRadius: 12, padding: '6px 14px', fontFamily: T.sans, fontWeight: 700, fontSize: 20, letterSpacing: '0.04em', lineHeight: 1 }}>
      {time}
    </div>
  )
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ label, sublabel, icon, logo, onPress }: {
  label: string; sublabel: string
  icon: React.ReactNode; logo: React.ReactNode
  onPress: () => void
}) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onPress() }}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: '100%', background: pressed ? T.cardHover : T.card,
        border: 'none', borderRadius: 20, padding: '20px 22px',
        display: 'flex', alignItems: 'center', cursor: 'pointer',
        transform: pressed ? 'scale(0.985)' : 'scale(1)',
        transition: 'transform 0.1s ease, background 0.1s ease',
        textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 18, color: T.text, marginBottom: 8, lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ opacity: 0.65 }}>{icon}</div>
      </div>
      <div style={{ width: 1, alignSelf: 'stretch', background: T.divider, margin: '0 20px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 64 }}>
        {logo}
        <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 500, color: T.textMuted }}>{sublabel}</span>
      </div>
    </button>
  )
}

// ─── Home screen ──────────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const hour = new Date().getHours()
  const greeting = hour < 5 ? 'God natt' : hour < 12 ? 'God morgon' : hour < 18 ? 'God eftermiddag' : 'God kväll'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 20px 28px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 22, color: T.text }}>{greeting}!</span>
        <Clock />
      </div>

      <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(34px, 9vw, 46px)', fontWeight: 700, color: T.text, lineHeight: 1.15, margin: '0 0 32px 0' }}>
        Vad vill du göra?
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <ServiceCard
          label="Betala räkningar"
          sublabel="Räkningar & autogiro"
          icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="16" height="20" rx="2" stroke="white" strokeWidth="2"/><path d="M8 9h8M8 13h8M8 17h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 18l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="20" cy="20" r="3" stroke="white" strokeWidth="1.8"/></svg>}
          logo={<div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="16" rx="3" stroke="white" strokeWidth="2"/><path d="M2 11h24" stroke="white" strokeWidth="1.5"/><path d="M6 17h4M14 17h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></div>}
          onPress={() => onNavigate('bills')}
        />
        <ServiceCard
          label="Skicka pengar"
          sublabel="Swish"
          icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 14h16M16 9l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          logo={<SwishLogo size={52} />}
          onPress={() => onNavigate('confirm-swish')}
        />
        <ServiceCard
          label="Kika in i bankkonton"
          sublabel="Swedbank"
          icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 12l10-7 10 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="12" width="4" height="9" rx="1" stroke="white" strokeWidth="1.8"/><rect x="12" y="12" width="4" height="9" rx="1" stroke="white" strokeWidth="1.8"/><rect x="18" y="12" width="4" height="9" rx="1" stroke="white" strokeWidth="1.8"/><path d="M3 21h22" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
          logo={<SwedbankLogo size={52} />}
          onPress={() => {}}
        />
        <ServiceCard
          label="Kolla i journal i 1177"
          sublabel="Vårdguiden"
          icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="5" stroke="white" strokeWidth="2"/><path d="M14 8v12M8 14h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>}
          logo={<Badge1177 size={52} />}
          onPress={() => onNavigate('confirm-1177')}
        />
      </div>

      <p style={{ fontFamily: T.sans, fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        Inloggning sker via BankID
      </p>
    </div>
  )
}

// ─── Hold-to-call button ──────────────────────────────────────────────────────
function HoldToCallButton() {
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [called, setCalled] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (called) return
    setHolding(true)
    let p = 0
    intervalRef.current = setInterval(() => {
      p += 2
      setProgress(Math.min(p, 100))
      if (p >= 100) { clearInterval(intervalRef.current!); setCalled(true); setHolding(false) }
    }, 100)
  }
  const end = () => {
    if (!called) { setHolding(false); setProgress(0); if (intervalRef.current) clearInterval(intervalRef.current) }
  }

  return (
    <button
      onPointerDown={start} onPointerUp={end} onPointerLeave={end}
      style={{
        width: '100%', padding: '20px 24px', borderRadius: 18,
        border: `2px solid ${called ? T.swishGreen : 'rgba(255,255,255,0.25)'}`,
        background: called ? `${T.swishGreen}22` : holding ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)',
        color: called ? T.swishGreen : T.text,
        fontFamily: T.sans, fontWeight: 600, fontSize: 17,
        cursor: called ? 'default' : 'pointer',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.2s, color 0.2s', textAlign: 'center',
      }}
    >
      {!called && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: 'rgba(255,255,255,0.12)', transition: 'width 0.1s linear' }} />}
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>{called ? '✓' : '📞'}</span>
        {called ? 'Ringer nu...' : holding ? `Håller... ${Math.round(progress)}%` : 'Håll in 5 sek för att ringa'}
      </span>
    </button>
  )
}

// ─── Shared confirm screen ────────────────────────────────────────────────────
function ConfirmScreen({ onBack, onConfirm, header, title, body }: {
  onBack: () => void; onConfirm: () => void
  header: React.ReactNode; title: string; body: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: T.bgMid, padding: '40px 22px 22px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 16, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, padding: '7px 14px', color: T.text, fontFamily: T.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          ← Tillbaka
        </button>
        {header}
      </div>

      <div style={{ flex: 1, padding: '24px 20px 28px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
        <div style={{ background: T.card, borderRadius: 20, padding: '24px 22px', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>🔐</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 10, lineHeight: 1.3 }}>{title}</h2>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.textMuted, lineHeight: 1.65, margin: 0 }}>{body}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button onClick={onBack} style={{ padding: '18px 12px', borderRadius: 16, background: T.cancelRedBg, border: `1.5px solid ${T.cancelRedBorder}`, color: '#FF7070', fontFamily: T.sans, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Nej</button>
          <button onClick={onConfirm} style={{ padding: '18px 12px', borderRadius: 16, background: T.swishGreen, border: 'none', color: '#fff', fontFamily: T.sans, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 20px rgba(42,187,103,0.35)' }}>Ja</button>
        </div>

        <div style={{ background: T.card, borderRadius: 20, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
          <p style={{ fontFamily: T.sans, fontSize: 15, color: T.textMuted, lineHeight: 1.6, margin: 0 }}>
            Känner du dig osäker? Håll knappen nedan i 5 sekunder — då ringer vi din stödperson.
          </p>
          <HoldToCallButton />
        </div>
      </div>
    </div>
  )
}

// ─── 1177 landing screen ──────────────────────────────────────────────────────
function Landing1177Screen({ onHome }: { onHome: () => void }) {
  const W = {
    bg: '#FFFFFF',
    card: '#F4F1FA',
    cardBorder: '#E4DDF3',
    text: '#1E1E2E',
    textMuted: '#5F5B6E',
    divider: '#E4DDF3',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%', background: W.bg }}>
      {/* 1177 branded header */}
      <div style={{ background: '#C0392B', padding: '32px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Badge1177 size={48} />
          <div>
            <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 26, color: '#fff' }}>1177</div>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Vårdguiden — Inloggad</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 16, background: W.bg }}>
        <div style={{ background: W.card, border: `1px solid ${W.cardBorder}`, borderRadius: 20, padding: '22px' }}>
          <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: W.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Din journal</div>
          {[
            { label: 'Senaste besök', value: '12 mars 2025 — Vårdcentralen Solna' },
            { label: 'Läkemedel', value: '2 aktiva recept' },
            { label: 'Provsvar', value: '1 nytt svar att läsa' },
          ].map((row) => (
            <div key={row.label} style={{ borderTop: `1px solid ${W.divider}`, paddingTop: 14, marginTop: 14 }}>
              <div style={{ fontFamily: T.sans, fontSize: 13, color: W.textMuted, marginBottom: 3 }}>{row.label}</div>
              <div style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 500, color: W.text }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: W.card, border: `1px solid ${W.cardBorder}`, borderRadius: 20, padding: '18px 22px' }}>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: W.textMuted, lineHeight: 1.6, margin: 0 }}>
            ℹ️ Du loggas ut automatiskt från 1177 när du går tillbaka till hemskärmen.
          </p>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={onHome}
          style={{
            width: '100%', padding: '22px 24px', borderRadius: 20,
            background: T.swishGreen, border: 'none', color: '#fff',
            fontFamily: T.sans, fontWeight: 700, fontSize: 20, cursor: 'pointer',
            boxShadow: '0 6px 28px rgba(42,187,103,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>🏠</span>
          Gå tillbaka till hemskärmen
        </button>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: W.textMuted, textAlign: 'center', margin: 0 }}>
          Du loggas ut från 1177 automatiskt
        </p>
      </div>
    </div>
  )
}

// ─── Bills screen ─────────────────────────────────────────────────────────────
function BillsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: T.bgMid, padding: '40px 22px 22px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 16, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, padding: '7px 14px', color: T.text, fontFamily: T.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          ← Tillbaka
        </button>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: T.text, marginTop: 4 }}>📄 Betala räkningar</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: T.card, borderRadius: 20, padding: 32, textAlign: 'center' }}>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.textMuted, lineHeight: 1.6 }}>Funktionen öppnas via din bank.<br />Logga in med BankID för att fortsätta.</p>
          <button style={{ marginTop: 20, padding: '16px 32px', borderRadius: 14, background: T.swishGreen, border: 'none', color: '#fff', fontFamily: T.sans, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 20px rgba(42,187,103,0.3)' }}>Logga in med BankID</button>
        </div>
      </div>
    </div>
  )
}

// ─── App shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <div style={{ minHeight: '100vh', background: '#1A0840', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      {/* Phone shell — neutral, no OS chrome */}
      <div style={{
        width: '100%', maxWidth: 400, minHeight: 720,
        background: T.bg,
        borderRadius: 36,
        border: '1.5px solid rgba(255,255,255,0.1)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
          {screen === 'confirm-swish' && (
            <ConfirmScreen
              onBack={() => setScreen('home')}
              onConfirm={() => setScreen('home')}
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <SwishLogo size={48} />
                  <div>
                    <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: T.text }}>Swish</div>
                    <div style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted }}>Skicka pengar</div>
                  </div>
                </div>
              }
              title="Du håller på att öppna Swish"
              body="Du loggar in för att skicka pengar via Swish. Stämmer det?"
            />
          )}
          {screen === 'confirm-1177' && (
            <ConfirmScreen
              onBack={() => setScreen('home')}
              onConfirm={() => setScreen('1177-landing')}
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Badge1177 size={48} />
                  <div>
                    <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: T.text }}>1177</div>
                    <div style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted }}>Vårdguiden</div>
                  </div>
                </div>
              }
              title="Du håller på att öppna 1177"
              body="Du loggar in hos 1177 Vårdguiden för att se din journal. Stämmer det?"
            />
          )}
          {screen === '1177-landing' && <Landing1177Screen onHome={() => setScreen('home')} />}
          {screen === 'bills' && <BillsScreen onBack={() => setScreen('home')} />}
        </div>
      </div>
    </div>
  )
}