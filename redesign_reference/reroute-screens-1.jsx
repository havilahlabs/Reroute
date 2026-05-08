// ─────────────────────────────────────────
// FLOW 1 — Onboarding (screens 1, 2)
// FLOW 2 — Main tabs (screens 3, 4, 5, 6)
// ─────────────────────────────────────────

// 01 — Splash
function Splash() {
  return (
    <Phone>
      <div className="splash">
        <div className="splash-mark">
          <IconLogo size={42}/>
        </div>
        <h1 className="splash-name">Reroute</h1>
        <p className="splash-tag">Find your way back to focus.</p>
        <div className="splash-loader"><span/><span/><span/></div>
      </div>
    </Phone>
  );
}

// 02 — Onboarding carousel (showing slide 2 — "When you drift…")
function Onboarding({ slideIdx = 1 }) {
  const slides = [
    { emoji: '🎯', h: 'Start with one thing.', s: 'Choose what you want to protect your attention for.' },
    { emoji: '🔄', h: 'When you drift, Reroute helps you get back.', s: 'A gentle nudge back to what you meant to do — before you disappear into distractions.' },
    { emoji: '🌿', h: 'No guilt. No streak pressure.', s: 'You don\'t need perfect focus. You just need a way back.' },
    { emoji: '🔒', h: 'Your focus data is private.', s: 'Reroute stores your history locally by default. You\'re in control.' },
    { emoji: '✨', h: 'Ready?', s: 'Set your first focus session — small steps count.' },
  ];
  const s = slides[slideIdx];
  const isLast = slideIdx === 4;

  return (
    <Phone>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 28px 32px' }}>
        <div className="row between" style={{ padding: '8px 0 4px' }}>
          <div style={{ width: 40 }}/>
          <span style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--text-3)' }}>{slideIdx + 1} of 5</span>
          <span style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>{isLast ? '' : 'Skip'}</span>
        </div>

        <div className="onb-art">
          <div className="onb-orbit o3"/>
          <div className="onb-orbit o2"/>
          <div className="onb-orbit o1"/>
          <div className="onb-emoji">{s.emoji}</div>
        </div>

        <div className="col gap-12" style={{ paddingTop: 8, paddingBottom: 16 }}>
          <h1 className="h1">{s.h}</h1>
          <p className="body-text" style={{ fontSize: 16 }}>{s.s}</p>
        </div>

        <div className="dots" style={{ margin: '8px 0 24px' }}>
          {slides.map((_, i) => <span key={i} className={'dot' + (i === slideIdx ? ' active' : '')}/>)}
        </div>

        {isLast ? (
          <button className="btn btn-primary btn-block">Start my first focus session</button>
        ) : (
          <button className="btn btn-primary btn-block">
            Next <IconChevR size={18}/>
          </button>
        )}
      </div>
    </Phone>
  );
}

// 03 — Home
function Home() {
  return (
    <Phone>
      <div className="scroll" style={{ paddingTop: 12 }}>
        <div className="col gap-6" style={{ paddingTop: 4 }}>
          <span className="label">Tuesday, May 6</span>
          <h1 className="h1" style={{ fontSize: 26 }}>Good morning, Sam.</h1>
        </div>

        {/* Today's Route card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(124,111,205,0.22) 0%, rgba(124,111,205,0.04) 100%), var(--surface)',
          borderColor: 'rgba(169,159,224,0.3)',
        }}>
          <div className="row between" style={{ marginBottom: 10 }}>
            <span className="label" style={{ color: 'var(--primary-light)' }}>Today's Route</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-3)' }}>Edit</span>
          </div>
          <div className="h2" style={{ fontSize: 19, lineHeight: 1.3, color: 'var(--text)' }}>
            Finish the design proposal — section 2.
          </div>
          <div className="row gap-8" style={{ marginTop: 14 }}>
            <span className="pill-tag lav">Writing</span>
            <span className="pill-tag cream">45 min plan</span>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="col gap-10">
          <button className="btn btn-primary btn-block">
            <IconLogo size={18}/> Start focus session
          </button>
          <button className="btn btn-secondary btn-block">
            <IconRoutine size={18}/> Start from routine
          </button>
        </div>

        {/* Today summary */}
        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Today's focus</span>
          <div className="card" style={{ padding: 16 }}>
            <div className="stat-grid">
              <div className="stat">
                <div className="v mono">2</div>
                <div className="l">sessions</div>
              </div>
              <div className="stat">
                <div className="v mono">38<span style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}> min</span></div>
                <div className="l">focused</div>
              </div>
              <div className="stat">
                <div className="v mono">4</div>
                <div className="l">reroutes — that matters</div>
              </div>
              <div className="stat">
                <div className="v" style={{ fontSize: 17, fontWeight: 600, paddingTop: 4 }}>Instagram</div>
                <div className="l">main drift</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="card" style={{
          background: 'rgba(244,236,223,0.06)',
          borderColor: 'rgba(244,236,223,0.18)',
        }}>
          <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(244,236,223,0.12)',
              display: 'grid', placeItems: 'center', flex: '0 0 36px',
              color: 'var(--cream)',
            }}>
              <IconLeaf size={18}/>
            </div>
            <div className="col gap-4">
              <span className="label" style={{ color: 'var(--cream)', opacity: 0.8 }}>Insight</span>
              <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15, lineHeight: 1.4 }}>
                Your strongest sessions this week were 20–25 minutes. Try a shorter block today?
              </div>
            </div>
          </div>
        </div>
      </div>
      <TabBar active={0}/>
    </Phone>
  );
}

// 04 — Routines
function Routines() {
  const routines = [
    { name: 'Morning Focus', emoji: '☀️', dur: '25 min', apps: 4, days: 'Mon – Fri', last: 'Yesterday' },
    { name: 'Deep Work', emoji: '💼', dur: '45 min', apps: 6, days: 'Weekdays', last: '2d ago' },
    { name: 'Bedtime', emoji: '🌙', dur: '30 min', apps: 3, days: 'Every day', last: '5d ago' },
    { name: 'Writing', emoji: '✍️', dur: '60 min', apps: 5, days: 'Sat, Sun', last: 'Last week' },
  ];
  return (
    <Phone>
      <Nav title="Routines" right={<div className="nav-icon" style={{ background: 'var(--primary)' }}><IconPlus/></div>}/>
      <div className="scroll">
        <p className="body-text" style={{ marginTop: -4 }}>Preset focus modes for recurring situations.</p>

        <div className="col gap-12">
          {routines.map((r, i) => (
            <div className="card" key={i} style={{ padding: 18 }}>
              <div className="row gap-14">
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'var(--surface-alt)',
                  display: 'grid', placeItems: 'center',
                  fontSize: 24,
                }}>{r.emoji}</div>
                <div className="col gap-4 grow">
                  <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17 }}>{r.name}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>
                    {r.dur} · {r.apps} apps · {r.days}
                  </div>
                </div>
                <div className="col" style={{ alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-3)' }}>{r.last}</span>
                  <IconChevR size={16}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free plan notice */}
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'rgba(244,162,97,0.08)',
          border: '1px dashed rgba(244,162,97,0.3)',
          fontFamily: 'DM Sans', fontSize: 13, color: 'var(--warning)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <IconStar size={16}/>
          <span>Free includes one routine. <b style={{ color: 'var(--text)' }}>Upgrade for unlimited →</b></span>
        </div>
      </div>
      <TabBar active={1}/>
    </Phone>
  );
}

// 05 — Insights
function Insights() {
  const days = [
    { d: 'M', v: 0.5 },
    { d: 'T', v: 0.7 },
    { d: 'W', v: 0.3 },
    { d: 'T', v: 0.85 },
    { d: 'F', v: 0.6 },
    { d: 'S', v: 0.95, today: true },
    { d: 'S', v: 0,  dim: true },
  ];
  return (
    <Phone>
      <Nav title="Insights" right={<span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>Week</span>}/>
      <div className="scroll">
        {/* Big stats row */}
        <div className="card" style={{ padding: 22 }}>
          <span className="label">This week</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 10 }}>
            <div className="col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 200, fontSize: 44, letterSpacing: '-1.5px', lineHeight: 1 }}>
                <span className="mono">3h 42m</span>
              </div>
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>focus minutes</span>
            </div>
            <div className="col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 200, fontSize: 44, letterSpacing: '-1.5px', lineHeight: 1 }}>
                <span className="mono">12</span>
              </div>
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>sessions completed</span>
            </div>
            <div className="col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 200, fontSize: 44, letterSpacing: '-1.5px', lineHeight: 1, color: 'var(--primary-light)' }}>
                <span className="mono">23</span>
              </div>
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>times rerouted</span>
            </div>
            <div className="col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 200, fontSize: 44, letterSpacing: '-1.5px', lineHeight: 1 }}>
                <span className="mono">5</span>
                <span style={{ fontSize: 18, color: 'var(--text-2)', fontWeight: 500 }}> days</span>
              </div>
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>showing up</span>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="card">
          <div className="row between" style={{ marginBottom: 14 }}>
            <span className="label">Daily minutes</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-3)' }}>peak: 58 min</span>
          </div>
          <div className="bars">
            {days.map((d, i) => (
              <div key={i} className={'b' + (d.dim ? ' dim' : '')}
                style={{ height: `${Math.max(8, d.v * 100)}%`,
                opacity: d.today ? 1 : 0.85 }}/>
            ))}
          </div>
          <div className="bar-labels">
            {days.map((d, i) => <span key={i} style={d.today ? { color: 'var(--primary-light)', fontWeight: 600 } : {}}>{d.d}</span>)}
          </div>
        </div>

        {/* Top distractions */}
        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Top distractions</span>
          <div className="card" style={{ padding: '4px 18px' }}>
            {[
              { app: 'Instagram', n: 8, color: APPS.Instagram },
              { app: 'YouTube', n: 5, color: APPS.YouTube },
              { app: 'Messages', n: 3, color: APPS.Messages },
            ].map((r, i) => (
              <div className="list-row" key={i}>
                <AppGlyph name={r.app} color={r.color}/>
                <div className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>{r.app}</div>
                <span className="mono" style={{ fontSize: 14, color: 'var(--text-2)' }}>{r.n} drifts</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-text" style={{ alignSelf: 'flex-start', padding: '8px 4px', display: 'flex', gap: 6, alignItems: 'center', background: 'transparent', border: 0 }}>
          View weekly report <IconChevR size={14}/>
        </button>
      </div>
      <TabBar active={2}/>
    </Phone>
  );
}

// 06 — Settings
function Settings() {
  return (
    <Phone>
      <Nav title="Settings"/>
      <div className="scroll" style={{ gap: 8 }}>
        {/* Account */}
        <div className="set-sec">
          <span className="label">Account</span>
          <div className="card">
            <div className="set-row">
              <div className="list-icon"><IconUser size={18}/></div>
              <div className="grow col gap-4">
                <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Sam Wright</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>sam@hey.com</div>
              </div>
              <IconChevR size={16}/>
            </div>
            <div className="set-row">
              <div className="list-icon" style={{ background: 'rgba(124,111,205,0.18)', color: 'var(--primary-light)' }}><IconStar size={18}/></div>
              <div className="grow col gap-4">
                <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Subscription</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--primary-light)' }}>Free plan · upgrade for unlimited routines</div>
              </div>
              <IconChevR size={16}/>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="set-sec">
          <span className="label">Notifications</span>
          <div className="card">
            <div className="set-row">
              <div className="list-icon"><IconBell size={18}/></div>
              <div className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Gentle reminders</div>
              <div className="toggle on"/>
            </div>
            <div className="set-row">
              <div className="list-icon"><IconCal size={18}/></div>
              <div className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Routine reminders</div>
              <div className="toggle on"/>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="set-sec">
          <span className="label">Appearance</span>
          <div className="card" style={{ padding: 6 }}>
            <div className="seg" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <button><IconSun size={16}/> Light</button>
              <button className="on"><IconMoon size={16}/> Dark</button>
              <button>Auto</button>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="set-sec">
          <span className="label">Privacy</span>
          <div className="card">
            <div className="set-row">
              <div className="list-icon"><IconLock size={18}/></div>
              <div className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Privacy policy</div>
              <IconChevR size={16}/>
            </div>
            <div className="set-row">
              <div className="list-icon"><IconShield size={18}/></div>
              <div className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>App permissions</div>
              <IconChevR size={16}/>
            </div>
            <div className="set-row">
              <div className="list-icon"><IconHelp size={18}/></div>
              <div className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Support &amp; help</div>
              <IconChevR size={16}/>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-3)', padding: '10px 0' }}>
          Reroute v1.2.0
        </div>
      </div>
      <TabBar active={3}/>
    </Phone>
  );
}

Object.assign(window, { Splash, Onboarding, Home, Routines, Insights, Settings });
