// Phone frame + reusable bits

function Phone({ children, light = false, time = '9:41', noNotch = false }) {
  return (
    <div className={'phone' + (light ? ' light' : '')}>
      <div className="status">
        {!noNotch && <div className="notch"/>}
        <span>{time}</span>
        <span className="right">
          {/* signal */}
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
            <rect x="0" y="7" width="3" height="4" rx="0.6"/>
            <rect x="4.4" y="5" width="3" height="6" rx="0.6"/>
            <rect x="8.8" y="2.5" width="3" height="8.5" rx="0.6"/>
            <rect x="13.2" y="0" width="3" height="11" rx="0.6"/>
          </svg>
          {/* wifi */}
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <path d="M8 2.6c2.2 0 4.2.9 5.6 2.3l1-1A8.8 8.8 0 0 0 8 1a8.8 8.8 0 0 0-6.6 2.9l1 1A7.7 7.7 0 0 1 8 2.6z"/>
            <path d="M8 6.1c1.3 0 2.4.5 3.3 1.4l1-1A6.3 6.3 0 0 0 8 4.6a6.3 6.3 0 0 0-4.3 1.9l1 1A4.5 4.5 0 0 1 8 6.1z"/>
            <circle cx="8" cy="9.4" r="1.3"/>
          </svg>
          {/* battery */}
          <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
            <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.4"/>
            <rect x="2" y="2" width="18" height="7" rx="1.4" fill="currentColor"/>
            <path d="M23 4v3c.7-.3 1.2-1 1.2-1.5 0-.5-.5-1.2-1.2-1.5z" fill="currentColor" opacity="0.5"/>
          </svg>
        </span>
      </div>
      <div className="body">{children}</div>
      <div className="home-ind"/>
    </div>
  );
}

// Bottom tab bar — pass `active` 0–3
function TabBar({ active = 0, light = false }) {
  const items = [
    { i: <IconHome/>, l: 'Home' },
    { i: <IconRoutine/>, l: 'Routines' },
    { i: <IconInsights/>, l: 'Insights' },
    { i: <IconSettings/>, l: 'Settings' },
  ];
  return (
    <div className="tabbar">
      {items.map((it, idx) => (
        <div className={'tab' + (idx === active ? ' active' : '')} key={idx}>
          {it.i}
          <span>{it.l}</span>
        </div>
      ))}
    </div>
  );
}

// Frame cell (number + label) wrapping a phone
function Cell({ n, name, tag, children }) {
  return (
    <div className="frame-cell">
      {children}
      <div className="frame-cap">
        <span className="num">{String(n).padStart(2, '0')}</span>
        <span className="name">{name}</span>
        {tag && <span className="tag">· {tag}</span>}
      </div>
    </div>
  );
}

// Nav bar (top of screen)
function Nav({ left, title, right }) {
  return (
    <div className="nav">
      <div style={{ width: 38 }}>{left}</div>
      <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ width: 38, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

const NavBack = () => <div className="nav-icon"><IconChevL/></div>;
const NavClose = () => <div className="nav-icon"><IconClose/></div>;

Object.assign(window, { Phone, TabBar, Cell, Nav, NavBack, NavClose });
