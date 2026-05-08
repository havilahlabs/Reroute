// ─────────────────────────────────────────
// FLOW 3 — Session (screens 7–12)
// ─────────────────────────────────────────

// 07 — Today's Route (modal)
function TodaysRoute() {
  return (
    <Phone>
      <Nav left={<NavClose/>} title="Today's Route"/>
      <div className="scroll">
        <div className="col gap-10" style={{ paddingTop: 8 }}>
          <h1 className="h1" style={{ fontSize: 24, lineHeight: 1.25 }}>What is the one thing you want to protect today?</h1>
          <p className="body-text">A single intention to come back to. Small is fine.</p>
        </div>

        <textarea className="input lg" defaultValue="Finish design proposal — section 2." style={{ resize: 'none' }}/>

        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Or pick a starter</span>
          <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {['Study for 30 min', 'Write one page', 'Finish proposal', 'Sleep without scrolling', 'Read one chapter'].map((t,i) =>
              <span className="chip" key={i}>{t}</span>
            )}
          </div>
        </div>

        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Tags <span style={{ textTransform: 'none', color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></span>
          <div className="row gap-8">
            <span className="chip active">Writing</span>
            <span className="chip">Deep work</span>
            <span className="chip">Personal</span>
            <span className="chip" style={{ borderStyle: 'dashed', borderColor: 'var(--border)', background: 'transparent' }}>+ Add</span>
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <button className="btn btn-primary btn-block" style={{ marginBottom: 8 }}>Set today's route</button>
      </div>
    </Phone>
  );
}

// 08 — Start Session (modal)
function StartSession() {
  const durations = [25, 45, 60, 90];
  return (
    <Phone>
      <Nav left={<NavClose/>} title="New session"/>
      <div className="scroll">
        <div className="col gap-10" style={{ paddingTop: 4 }}>
          <span className="label">Step 1 of 3</span>
          <h1 className="h1" style={{ fontSize: 24 }}>What are you focusing on?</h1>
        </div>

        <div className="input lg" style={{ display: 'flex', alignItems: 'flex-start' }}>
          Finish design proposal —<br/>section&nbsp;2.
        </div>

        <div className="col gap-12">
          <span className="label" style={{ paddingLeft: 4 }}>Duration</span>
          <div className="seg">
            {durations.map(d =>
              <button key={d} className={d === 45 ? 'on' : ''}>
                {d}<span style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}> min</span>
              </button>
            )}
          </div>
          <button style={{
            background: 'transparent', border: '1px dashed var(--border)',
            color: 'var(--text-2)', borderRadius: 14, padding: '12px 0',
            fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
          }}>Custom duration</button>
        </div>

        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Use a routine <span style={{ textTransform: 'none', color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></span>
          <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-alt)', display: 'grid', placeItems: 'center', fontSize: 18 }}>💼</div>
            <div className="grow col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 15 }}>Deep Work</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-2)' }}>45 min · 6 apps blocked</div>
            </div>
            <IconChevD size={16}/>
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <button className="btn btn-primary btn-block" style={{ marginBottom: 8 }}>
          <IconLogo size={16}/> Start session
        </button>
      </div>
    </Phone>
  );
}

// 09 — Active Session
function ActiveSession() {
  const r = 130;
  const c = 2 * Math.PI * r;
  const progress = 0.42; // 42% through
  return (
    <Phone>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        background: 'radial-gradient(circle at 50% 30%, rgba(124,111,205,0.18) 0%, rgba(124,111,205,0) 55%), var(--bg)',
      }}>
        <div className="row between" style={{ padding: '12px 24px 4px' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: 'var(--primary-light)', marginRight: 8, verticalAlign: 'middle' }}/>
            Focus session
          </span>
          <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-3)' }}>9:41 → 10:26</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 28px 24px', justifyContent: 'space-between' }}>

          <div className="ring">
            <svg width="280" height="280">
              <circle cx="140" cy="140" r={r} stroke="rgba(58,54,88,0.5)" strokeWidth="3" fill="none"/>
              <circle cx="140" cy="140" r={r} stroke="url(#grad)" strokeWidth="3" fill="none"
                strokeDasharray={c} strokeDashoffset={c * (1 - progress)} strokeLinecap="round"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A99FE0"/>
                  <stop offset="100%" stopColor="#7C6FCD"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="ring-center">
              <span className="label" style={{ color: 'var(--primary-light)' }}>Working on</span>
              <div className="timer-display mono">26:14</div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 500, fontSize: 14, color: 'var(--text-2)', marginTop: 4, maxWidth: 200 }}>
                Finish design proposal
              </div>
            </div>
          </div>

          <div className="col gap-12" style={{ alignItems: 'center' }}>
            <div style={{
              padding: '14px 18px', borderRadius: 16,
              background: 'rgba(244,236,223,0.06)',
              border: '1px solid rgba(244,236,223,0.14)',
              textAlign: 'center', maxWidth: 280,
            }}>
              <span className="label" style={{ color: 'var(--cream)', opacity: 0.8, fontSize: 11 }}>Your way back</span>
              <div style={{ fontFamily: 'Nunito', fontWeight: 500, fontSize: 15, marginTop: 4, color: 'var(--cream)' }}>
                "Open the document and write one sentence."
              </div>
            </div>

            <button className="btn btn-block" style={{
              background: 'rgba(244,162,97,0.12)',
              color: 'var(--warning)',
              border: '1px solid rgba(244,162,97,0.3)',
              fontWeight: 600,
            }}>I drifted</button>

            <div className="row gap-10" style={{ width: '100%' }}>
              <button className="btn btn-secondary grow"><IconPause size={16}/> Pause</button>
              <button className="btn btn-secondary grow" style={{ color: 'var(--text-2)' }}>End</button>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// 10 — Drift Reroute
function DriftReroute() {
  return (
    <Phone>
      <div className="drift-bg">
        <Nav left={<NavClose/>} title=""/>
        <div className="scroll" style={{ paddingTop: 4, gap: 22 }}>
          <div className="col gap-10">
            <span style={{ fontSize: 32 }}>🌿</span>
            <h1 className="h1" style={{ fontSize: 26, color: 'var(--cream)' }}>It happens. Let's get back.</h1>
            <p className="body-text" style={{ fontSize: 15 }}>No pressure. Naming what pulled you helps Reroute help you better.</p>
          </div>

          <div className="card" style={{
            background: 'rgba(124,111,205,0.1)',
            borderColor: 'rgba(169,159,224,0.25)',
          }}>
            <span className="label" style={{ color: 'var(--primary-light)' }}>You were working on</span>
            <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 17, marginTop: 6 }}>
              Finish design proposal — section 2.
            </div>
            <div style={{
              borderTop: '1px solid rgba(169,159,224,0.2)',
              marginTop: 14, paddingTop: 14,
              fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)',
              fontStyle: 'italic',
            }}>
              "Open the document and write one sentence."
            </div>
          </div>

          <div className="col gap-10">
            <span className="label" style={{ paddingLeft: 4 }}>What pulled you?</span>
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {[
                ['Social media', true],
                ['Email', false],
                ['Phone call', false],
                ['News', false],
                ['Boredom', false],
                ['Other', false],
              ].map(([t, on], i) =>
                <span key={i} className={'chip' + (on ? ' active' : '')}>
                  {on && <IconCheck size={12}/>} {t}
                </span>
              )}
            </div>
          </div>

          <div className="col gap-8">
            <span className="label" style={{ paddingLeft: 4 }}>Anything else? <span style={{ textTransform: 'none', color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></span>
            <div className="input" style={{ minHeight: 64, color: 'var(--text-3)', fontStyle: 'italic' }}>
              A note for yourself…
            </div>
          </div>

          <div className="col gap-10">
            <button className="btn btn-primary btn-block">Get back on track</button>
            <button className="btn btn-text btn-block" style={{ color: 'var(--text-2)' }}>Take a 5-minute break instead</button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// 11 — Temporary Unlock
function TemporaryUnlock() {
  return (
    <Phone>
      <Nav left={<NavClose/>} title="Take a break"/>
      <div className="scroll">
        <div className="col gap-10">
          <h1 className="h1" style={{ fontSize: 24 }}>It's okay to step away.</h1>
          <p className="body-text">Tell yourself why and Reroute will hold the door open.</p>
        </div>

        <div className="col gap-10">
          <span className="label" style={{ paddingLeft: 4 }}>Why do you need this?</span>
          <textarea className="input" defaultValue="Quick reply to my partner about dinner." style={{ minHeight: 90, resize: 'none' }}/>
        </div>

        <div className="col gap-12">
          <span className="label" style={{ paddingLeft: 4 }}>How long?</span>
          <div className="seg" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <button>5 min</button>
            <button className="on">10 min</button>
            <button>15 min</button>
          </div>
        </div>

        {/* Soft reassurance card */}
        <div className="card" style={{
          background: 'rgba(125,211,166,0.08)',
          borderColor: 'rgba(125,211,166,0.2)',
          padding: 16,
        }}>
          <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(125,211,166,0.18)',
              display: 'grid', placeItems: 'center',
              color: 'var(--success)', flex: '0 0 32px',
            }}><IconLeaf size={16}/></div>
            <div className="col gap-4">
              <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'var(--success)' }}>
                We'll nudge you when it's time
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-2)' }}>
                Your session pauses and resumes when you come back.
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <button className="btn btn-primary btn-block" style={{ marginBottom: 8 }}>Start 10 min break</button>
      </div>
    </Phone>
  );
}

// 12 — End Session
function EndSession() {
  return (
    <Phone>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        background: 'radial-gradient(circle at 50% 0%, rgba(244,236,223,0.1) 0%, rgba(244,236,223,0) 55%), var(--bg)',
      }}>
        <Nav title=""/>
        <div className="scroll" style={{ paddingTop: 0, gap: 20 }}>
          <div className="col gap-12" style={{ alignItems: 'center', paddingTop: 14 }}>
            <span style={{ fontSize: 40 }}>✨</span>
            <h1 className="h1" style={{ fontSize: 26, textAlign: 'center', color: 'var(--cream)' }}>You came back. That counts.</h1>
            <p className="body-text" style={{ textAlign: 'center', maxWidth: 280 }}>
              45 minute session on <b style={{ color: 'var(--text)' }}>Finish design proposal</b>.
            </p>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, columnGap: 12 }}>
              <div className="col gap-4" style={{ alignItems: 'center', padding: 8 }}>
                <div className="big-num mono">38<span style={{ fontSize: 18, color: 'var(--text-2)', fontWeight: 500 }}>m</span></div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-2)' }}>focus minutes</span>
              </div>
              <div className="col gap-4" style={{ alignItems: 'center', padding: 8 }}>
                <div className="big-num mono" style={{ color: 'var(--primary-light)' }}>3</div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-2)' }}>times rerouted</span>
              </div>
              <div className="col gap-4" style={{ alignItems: 'center', padding: 8 }}>
                <div className="big-num mono">1</div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-2)' }}>break taken</span>
              </div>
              <div className="col gap-4" style={{ alignItems: 'center', padding: 8 }}>
                <div className="big-num mono">85<span style={{ fontSize: 18, color: 'var(--text-2)', fontWeight: 500 }}>%</span></div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-2)' }}>focus rate</span>
              </div>
            </div>
          </div>

          {/* Distractions */}
          <div className="col gap-10">
            <span className="label" style={{ paddingLeft: 4 }}>Where it slipped</span>
            <div className="card" style={{ padding: '4px 16px' }}>
              <div className="list-row">
                <AppGlyph name="Instagram" color={APPS.Instagram}/>
                <span className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14 }}>Instagram</span>
                <div style={{ width: 80, height: 6, borderRadius: 999, background: 'var(--surface-alt)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '70%', background: APPS.Instagram, borderRadius: 999 }}/>
                </div>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text-2)', minWidth: 28, textAlign: 'right' }}>2×</span>
              </div>
              <div className="list-row">
                <AppGlyph name="Messages" color={APPS.Messages}/>
                <span className="grow" style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14 }}>Messages</span>
                <div style={{ width: 80, height: 6, borderRadius: 999, background: 'var(--surface-alt)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '35%', background: APPS.Messages, borderRadius: 999 }}/>
                </div>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text-2)', minWidth: 28, textAlign: 'right' }}>1×</span>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="card" style={{
            background: 'rgba(244,236,223,0.06)',
            borderColor: 'rgba(244,236,223,0.18)',
          }}>
            <span className="label" style={{ color: 'var(--cream)', opacity: 0.8 }}>Gentle insight</span>
            <div style={{ fontFamily: 'Nunito', fontWeight: 500, fontSize: 15, lineHeight: 1.45, marginTop: 6, color: 'var(--cream)' }}>
              You drifted, and you came back — three times. That's a skill, not a failure.
            </div>
          </div>

          <div className="col gap-10" style={{ marginTop: 4 }}>
            <button className="btn btn-primary btn-block">Start another</button>
            <button className="btn btn-text btn-block">Done</button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  TodaysRoute, StartSession, ActiveSession, DriftReroute, TemporaryUnlock, EndSession,
});
