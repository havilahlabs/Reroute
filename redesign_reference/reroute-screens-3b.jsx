// ─────────────────────────────────────────
// FLOW 4 — Routine detail screen 13
// FLOW 5 — Reports & paywall (14, 15, 16)
// FLOW 6 — Utility (17, 18)
// ─────────────────────────────────────────

// 13 — Routine detail
function RoutineDetail() {
  const apps = ['Instagram', 'TikTok', 'X', 'Reddit', 'YouTube', 'Messages'];
  const days = [
    ['M', true], ['T', true], ['W', true], ['T', true], ['F', true], ['S', false], ['S', false]
  ];
  return (
    <Phone>
      <Nav left={<NavBack/>} title="Routine" right={<span style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--primary-light)', fontWeight: 600 }}>Save</span>}/>
      <div className="scroll">
        {/* Header card */}
        <div className="card" style={{
          padding: 22,
          background: 'linear-gradient(135deg, rgba(124,111,205,0.18) 0%, rgba(124,111,205,0.02) 100%), var(--surface)',
          borderColor: 'rgba(169,159,224,0.25)',
        }}>
          <div className="row gap-14">
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(124,111,205,0.22)', display: 'grid', placeItems: 'center', fontSize: 30 }}>💼</div>
            <div className="col gap-4 grow">
              <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em' }}>Deep Work</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>Used 14 times · 89% completion</div>
            </div>
          </div>
        </div>

        {/* Default duration */}
        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Default duration</span>
          <div className="card" style={{ padding: 6 }}>
            <div className="seg">
              <button>25</button>
              <button className="on">45</button>
              <button>60</button>
              <button>90</button>
            </div>
          </div>
        </div>

        {/* Intention template */}
        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Intention template</span>
          <div className="input" style={{ minHeight: 64 }}>
            Make progress on <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{'{task}'}</span> — one section at a time.
          </div>
        </div>

        {/* Blocked apps */}
        <div className="col gap-10">
          <div className="row between" style={{ paddingLeft: 4, paddingRight: 4 }}>
            <span className="label">Blocked apps · Android</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>Edit</span>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {apps.map((a, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px 6px 6px', borderRadius: 999,
                  background: 'var(--surface-alt)',
                  fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: APPS[a], color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{a[0]}</div>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Days active */}
        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Active days</span>
          <div className="card" style={{ padding: 12 }}>
            <div className="row between">
              {days.map(([d, on], i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 999,
                  display: 'grid', placeItems: 'center',
                  background: on ? 'var(--primary)' : 'var(--surface-alt)',
                  color: on ? '#fff' : 'var(--text-2)',
                  fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13,
                }}>{d}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Reminder */}
        <div className="card">
          <div className="set-row" style={{ borderBottom: 'none' }}>
            <div className="list-icon"><IconBell size={18}/></div>
            <div className="grow col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Reminder at 9:00 AM</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>Soft notification, weekdays</div>
            </div>
            <div className="toggle on"/>
          </div>
        </div>

        <button className="btn btn-text btn-block" style={{ color: 'var(--danger)', marginTop: 4 }}>Delete routine</button>
      </div>
    </Phone>
  );
}

// 14 — Weekly Report
function WeeklyReport() {
  const days = [
    { d: 'Mon', v: 0.5, m: 32 },
    { d: 'Tue', v: 0.7, m: 45 },
    { d: 'Wed', v: 0.3, m: 18 },
    { d: 'Thu', v: 0.95, m: 58 },
    { d: 'Fri', v: 0.6, m: 38 },
    { d: 'Sat', v: 0.85, m: 51 },
    { d: 'Sun', v: 0.2, m: 12 },
  ];
  return (
    <Phone>
      <Nav left={<NavBack/>} title="Weekly Report" right={<div className="nav-icon"><IconDoc size={16}/></div>}/>
      <div className="scroll">
        <div className="col gap-6">
          <span className="label" style={{ color: 'var(--cream)', opacity: 0.8 }}>Apr 28 – May 4</span>
          <h1 className="h1" style={{ fontSize: 26, lineHeight: 1.2 }}>A solid week of finding your way back.</h1>
          <p className="body-text">12 sessions, 3h 42m focused, 23 reroutes — every one a return.</p>
        </div>

        {/* Big chart card */}
        <div className="card" style={{ padding: 22 }}>
          <div className="row between" style={{ marginBottom: 16 }}>
            <span className="label">Daily minutes</span>
            <span className="pill-tag" style={{ background: 'rgba(125,211,166,0.16)', color: 'var(--success)' }}>↑ 18% vs last week</span>
          </div>
          <div className="bars" style={{ height: 140 }}>
            {days.map((d, i) => (
              <div key={i} style={{
                background: d.v > 0.8 ? 'linear-gradient(180deg, #C9A57E 0%, #A87E55 100%)' : 'linear-gradient(180deg, var(--primary-light) 0%, var(--primary) 100%)',
                height: `${Math.max(8, d.v * 100)}%`,
                borderRadius: '6px 6px 2px 2px',
                position: 'relative',
              }}>
                {d.v > 0.8 && <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontFamily: 'DM Sans', fontSize: 11, color: 'var(--cream)', fontWeight: 600 }}>{d.m}</div>}
              </div>
            ))}
          </div>
          <div className="bar-labels">
            {days.map((d, i) => <span key={i} style={d.v > 0.8 ? { color: 'var(--cream)', fontWeight: 600 } : {}}>{d.d[0]}</span>)}
          </div>
        </div>

        {/* Highlight cards */}
        <div className="col gap-10">
          <div className="card" style={{
            padding: 16,
            background: 'rgba(244,236,223,0.06)',
            borderColor: 'rgba(244,236,223,0.18)',
          }}>
            <div className="row gap-12">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(244,236,223,0.12)', display: 'grid', placeItems: 'center', color: 'var(--cream)' }}><IconStar size={18}/></div>
              <div className="col gap-2 grow">
                <span className="label" style={{ fontSize: 11, color: 'var(--cream)', opacity: 0.8 }}>Best focus day</span>
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17 }}>Thursday · 58 min</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="row gap-12">
              <div className="list-icon" style={{ background: 'rgba(124,111,205,0.18)', color: 'var(--primary-light)' }}><IconLogo size={18}/></div>
              <div className="col gap-2 grow">
                <span className="label" style={{ fontSize: 11, color: 'var(--primary-light)' }}>Most reroutes</span>
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17 }}>23 returns this week</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="row gap-12">
              <AppGlyph name="Instagram" color={APPS.Instagram}/>
              <div className="col gap-2 grow">
                <span className="label" style={{ fontSize: 11 }}>Most common drift</span>
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17 }}>Instagram · 8 times</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pattern */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(124,111,205,0.15) 0%, rgba(124,111,205,0.02) 100%), var(--surface)',
          borderColor: 'rgba(169,159,224,0.3)',
        }}>
          <span className="label" style={{ color: 'var(--primary-light)' }}>Pattern noticed</span>
          <div style={{ fontFamily: 'Nunito', fontWeight: 500, fontSize: 16, lineHeight: 1.45, marginTop: 8 }}>
            Your focus is strongest <b>before noon</b>. Sessions started after 3 PM had 2× more drifts.
          </div>
        </div>
      </div>
    </Phone>
  );
}

// 15 — Paywall
function Paywall() {
  const features = [
    'Unlimited routines',
    'Detailed insights & patterns',
    'Weekly recovery reports',
    'Smart schedules & calendar sync',
    'Advanced unlock rules',
  ];
  return (
    <Phone>
      <Nav left={<NavClose/>} title="" right={<span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>Restore</span>}/>
      <div className="scroll" style={{ paddingTop: 0 }}>
        <div className="col gap-10" style={{ paddingTop: 8 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, #A99FE0 0%, #5D52A8 100%)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 12px 32px -10px rgba(124,111,205,0.6)',
          }}>
            <IconStar size={26}/>
          </div>
          <h1 className="h1" style={{ fontSize: 28, lineHeight: 1.15 }}>Make Reroute personal.</h1>
          <p className="body-text">Unlock routines, weekly reports, and deeper insights — without ads or pressure.</p>
        </div>

        {/* Feature list */}
        <div className="card" style={{ padding: '4px 18px' }}>
          {features.map((f, i) => (
            <div className="list-row" key={i} style={{ padding: '14px 0', gap: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: 'rgba(124,111,205,0.18)',
                color: 'var(--primary-light)',
                display: 'grid', placeItems: 'center',
                flex: '0 0 26px',
              }}><IconCheck size={14} sw={3}/></div>
              <span style={{ fontFamily: 'Nunito', fontWeight: 500, fontSize: 15 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="col gap-10">
          <div className="price-card featured">
            <div style={{ position: 'absolute', top: -10, right: 16, padding: '4px 10px', borderRadius: 999, background: 'var(--cream)', color: '#1A1828', fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>BEST VALUE — SAVE 37%</div>
            <div className="row between" style={{ alignItems: 'flex-start' }}>
              <div className="col gap-4">
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17 }}>Annual</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>£2.50 / month, billed yearly</div>
              </div>
              <div className="col" style={{ alignItems: 'flex-end' }}>
                <div className="mono" style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 22 }}>£29.99</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-3)', textDecoration: 'line-through' }}>£47.88</div>
              </div>
            </div>
          </div>

          <div className="price-card">
            <div className="row between" style={{ alignItems: 'flex-start' }}>
              <div className="col gap-4">
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17 }}>Monthly</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>Cancel anytime</div>
              </div>
              <div className="mono" style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 22 }}>£3.99</div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-block" style={{ height: 58 }}>Start 7-day free trial</button>

        <div style={{ textAlign: 'center', fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.55 }}>
          Free for 7 days, then £29.99/year. Cancel anytime in Settings.<br/>
          <span style={{ color: 'var(--text-2)' }}>Terms · Privacy · Restore purchases</span>
        </div>
      </div>
    </Phone>
  );
}

// 16 — Permission Onboarding
function Permissions() {
  return (
    <Phone>
      <Nav title="" right={<span style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--text-2)' }}>Skip</span>}/>
      <div className="scroll" style={{ paddingTop: 0 }}>
        <div className="col gap-10" style={{ paddingTop: 8 }}>
          <span style={{ fontSize: 32 }}>🔐</span>
          <h1 className="h1" style={{ fontSize: 26, lineHeight: 1.2 }}>A few permissions, gently asked.</h1>
          <p className="body-text">Reroute only uses these to do the one job — help you come back.</p>
        </div>

        <div className="col gap-12" style={{ marginTop: 4 }}>
          {/* Notifications — granted */}
          <div className="card" style={{ padding: 18 }}>
            <div className="perm-row" style={{ borderBottom: 'none', padding: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(125,211,166,0.18)', color: 'var(--success)', display: 'grid', placeItems: 'center' }}>
                <IconBell size={20}/>
              </div>
              <div className="col gap-6">
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16 }}>Notifications</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  Soft nudges when your unlock is ending or a routine is about to start.
                </div>
              </div>
              <div className="pill-tag" style={{ background: 'rgba(125,211,166,0.16)', color: 'var(--success)' }}>Granted</div>
            </div>
          </div>

          {/* Usage stats — needed */}
          <div className="card" style={{ padding: 18, borderColor: 'rgba(169,159,224,0.4)' }}>
            <div className="perm-row" style={{ borderBottom: 'none', padding: 0, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,111,205,0.18)', color: 'var(--primary-light)', display: 'grid', placeItems: 'center' }}>
                <IconShield size={20}/>
              </div>
              <div className="col gap-6">
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16 }}>Usage Access <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 500, color: 'var(--text-3)' }}>Android</span></div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  Detect when a blocked app opens during your session — and quietly redirect you.
                </div>
                <button className="btn btn-primary" style={{ height: 40, padding: '0 16px', alignSelf: 'flex-start', marginTop: 8, fontSize: 14 }}>Grant access</button>
              </div>
            </div>
          </div>

          {/* Accessibility — optional */}
          <div className="card" style={{ padding: 18 }}>
            <div className="perm-row" style={{ borderBottom: 'none', padding: 0, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-alt)', color: 'var(--text-2)', display: 'grid', placeItems: 'center' }}>
                <IconLeaf size={20}/>
              </div>
              <div className="col gap-6">
                <div className="row gap-8">
                  <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16 }}>Accessibility</div>
                  <span className="pill-tag cream" style={{ fontSize: 10 }}>Optional</span>
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  Stronger detection for apps that hide. We never read screen content.
                </div>
                <button className="btn btn-secondary" style={{ height: 40, padding: '0 16px', alignSelf: 'flex-start', marginTop: 8, fontSize: 14 }}>Set up later</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <div style={{ textAlign: 'center', fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-3)', padding: '8px 8px 0' }}>
          Reroute never sells data. Permissions stay on your device.
        </div>
      </div>
    </Phone>
  );
}

// 17 — Privacy Policy
function PrivacyPolicy() {
  const sections = [
    { h: 'What we store', b: 'Focus sessions, drift events, reroute actions, routines, and app settings. Task text stays on your device unless you choose to export it.' },
    { h: 'Why we use it', b: 'To help you understand your focus patterns and improve future sessions. Never for advertising.' },
    { h: 'Local by default', b: 'All data is stored locally on this device. Optional cloud sync may be added in a future version — you will always choose, and you can opt out at any time.' },
    { h: 'No ads. No selling data.', b: 'Reroute is funded by subscriptions. We do not show ads or sell your data to third parties.' },
    { h: 'Delete your data', b: 'You can delete all local data at any time from Settings → Privacy → Delete all data. The action is immediate and permanent.' },
  ];
  return (
    <Phone>
      <Nav left={<NavBack/>} title="Privacy"/>
      <div className="scroll">
        <div className="col gap-10">
          <span className="label">Last updated · April 28, 2026</span>
          <h1 className="h1" style={{ fontSize: 26 }}>Your focus, your data.</h1>
          <p className="body-text" style={{ fontSize: 14 }}>
            Reroute is built local-first. Here's exactly what we store, why, and how you stay in control.
          </p>
        </div>

        <div className="col gap-16" style={{ marginTop: 4 }}>
          {sections.map((s, i) => (
            <div className="priv-section" key={i}>
              <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16 }}>{s.h}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 14, lineHeight: 1.6, color: 'var(--text-2)' }}>{s.b}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{
          background: 'rgba(125,211,166,0.06)',
          borderColor: 'rgba(125,211,166,0.2)',
          padding: 16,
        }}>
          <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(125,211,166,0.18)', display: 'grid', placeItems: 'center', color: 'var(--success)', flex: '0 0 32px' }}>
              <IconLeaf size={16}/>
            </div>
            <div className="col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'var(--success)' }}>Questions?</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                Email <span style={{ color: 'var(--text)', fontWeight: 600 }}>privacy@reroute.app</span> — a real human replies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// 18 — Demo Blocking overlay
function DemoBlocking() {
  return (
    <Phone>
      <div className="block-overlay">
        {/* Reroute brand strip top */}
        <div style={{
          position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px 6px 8px',
          borderRadius: 999,
          background: 'rgba(124,111,205,0.18)',
          border: '1px solid rgba(169,159,224,0.4)',
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 8, background: 'linear-gradient(135deg, #A99FE0 0%, #5D52A8 100%)', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <IconLogo size={14}/>
          </div>
          <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: 'var(--primary-light)', letterSpacing: '0.02em' }}>REROUTE</span>
        </div>

        {/* App that was blocked */}
        <div className="col gap-10" style={{ alignItems: 'center', marginBottom: 8 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 22,
            background: APPS.Instagram,
            display: 'grid', placeItems: 'center',
            color: '#fff', fontFamily: 'Nunito', fontWeight: 800, fontSize: 36,
            boxShadow: '0 12px 32px -8px rgba(193,53,132,0.5)',
            opacity: 0.55,
          }}>I</div>
          <span className="label" style={{ color: 'var(--text-3)' }}>Instagram is paused</span>
        </div>

        <h1 className="h1" style={{ fontSize: 26, color: 'var(--cream)', maxWidth: 280, lineHeight: 1.25 }}>
          You wanted to focus on something.
        </h1>

        <div style={{
          padding: '14px 18px', borderRadius: 16,
          background: 'rgba(124,111,205,0.12)',
          border: '1px solid rgba(169,159,224,0.3)',
          maxWidth: 300, marginTop: 8,
        }}>
          <span className="label" style={{ color: 'var(--primary-light)', fontSize: 10 }}>Your route</span>
          <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 16, marginTop: 4 }}>
            Finish design proposal — section 2.
          </div>
        </div>

        <div style={{
          fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)',
          fontStyle: 'italic', maxWidth: 260, marginTop: 4, lineHeight: 1.5,
        }}>
          "Open the document and write one sentence."
        </div>

        <div className="col gap-10" style={{ width: '100%', marginTop: 'auto', maxWidth: 320 }}>
          <button className="btn btn-primary btn-block">Go back to focus session</button>
          <button className="btn btn-text btn-block" style={{ color: 'var(--text-2)', fontSize: 14 }}>
            Unlock for 3 minutes →
          </button>
        </div>

        <div style={{
          fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-3)',
          textAlign: 'center', marginTop: 4,
        }}>
          26:14 left · 3 reroutes today
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { RoutineDetail, WeeklyReport, Paywall, Permissions, PrivacyPolicy, DemoBlocking });
