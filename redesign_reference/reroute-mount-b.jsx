// Mount each screen into its flow container — Reroute.

function mount(id, screens) {
  const root = document.getElementById(id);
  if (!root) return;
  ReactDOM.createRoot(root).render(
    <React.Fragment>
      {screens.map(({ n, name, tag, C, props }) => (
        <Cell key={n} n={n} name={name} tag={tag}>
          <C {...(props || {})}/>
        </Cell>
      ))}
    </React.Fragment>
  );
}

// Flow 1 — Onboarding (1, 2)
mount('flow-1', [
  { n: 1, name: 'Splash',     tag: 'launch',         C: Splash },
  { n: 2, name: 'Onboarding', tag: 'slide 1 of 5',   C: Onboarding, props: { slideIdx: 0 } },
  { n: 2, name: 'Onboarding', tag: 'slide 2 of 5',   C: Onboarding, props: { slideIdx: 1 } },
  { n: 2, name: 'Onboarding', tag: 'slide 3 of 5',   C: Onboarding, props: { slideIdx: 2 } },
  { n: 2, name: 'Onboarding', tag: 'slide 4 of 5',   C: Onboarding, props: { slideIdx: 3 } },
  { n: 2, name: 'Onboarding', tag: 'slide 5 — CTA',  C: Onboarding, props: { slideIdx: 4 } },
]);

// Flow 2 — Main tabs (3, 4, 5, 6)
mount('flow-2', [
  { n: 3, name: 'Home',     tag: 'tab 1', C: Home },
  { n: 4, name: 'Routines', tag: 'tab 2', C: Routines },
  { n: 5, name: 'Insights', tag: 'tab 3', C: Insights },
  { n: 6, name: 'Settings', tag: 'tab 4', C: Settings },
]);

// Flow 3 — Session (7..12)
mount('flow-3', [
  { n: 7,  name: "Today's Route",     tag: 'set intention', C: TodaysRoute },
  { n: 8,  name: 'Start Session',     tag: 'modal',         C: StartSession },
  { n: 9,  name: 'Active Session',    tag: 'focus mode',    C: ActiveSession },
  { n: 10, name: 'Drift / Reroute',   tag: 'core moment',   C: DriftReroute },
  { n: 11, name: 'Temporary Unlock',  tag: 'intentional break', C: TemporaryUnlock },
  { n: 12, name: 'End Session',       tag: 'summary',       C: EndSession },
]);

// Flow 4 — Routine detail (13)
mount('flow-4', [
  { n: 13, name: 'Routine Detail', tag: 'edit & history', C: RoutineDetail },
]);

// Flow 5 — Reports & paywall (14, 15, 16)
mount('flow-5', [
  { n: 14, name: 'Weekly Report',  tag: 'pro feature',  C: WeeklyReport },
  { n: 15, name: 'Paywall',        tag: 'upsell',       C: Paywall },
  { n: 16, name: 'Permissions',    tag: 'iOS / Android', C: Permissions },
]);

// Flow 6 — Utility (17, 18)
mount('flow-6', [
  { n: 17, name: 'Privacy Policy', tag: 'scrollable',   C: PrivacyPolicy },
  { n: 18, name: 'Demo Blocking',  tag: 'full overlay', C: DemoBlocking },
]);
