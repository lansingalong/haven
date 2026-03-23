import './tokens/variables.css'
import './app.css'
import { useState } from 'react'
import { Icon } from './components'
import { HavenWindow } from './features/Haven/HavenWindow'

const MEMBERS = [
  { id: 'AH0000007', mockId: 'AH0000007', name: 'Henry Tom Garcia', phone: '909-851-3064', pcp: 'Ambetter', dob: '01/01/2001', display: 'Henry Tom Garc' },
  { id: 'AH0000023', mockId: 'AH0000023', name: 'Lisa Thompson',    phone: '703-442-8817', pcp: 'UnitedHealthcare', dob: '03/15/1966', display: 'Lisa Thompson' },
]

/* ─── Mock HealthEdge shell ─────────────────────────────────────────────── */

function TopBar() {
  return (
    <div className="he-topbar">
      <div className="he-topbar-left">
        <span className="he-logo">HEALTH<span className="he-logo-edge">EDGE</span></span>
        <span className="he-context">
          <strong>You are in Care Coordination</strong><br />
          <a href="#" className="he-link">Go to Population Health</a>
        </span>
        <input className="he-search" placeholder="MEMBER NAME" readOnly />
        <input className="he-search he-search-wide" placeholder="Enter text to search" readOnly />
        <button className="he-btn-ghost">Advanced Search ▾</button>
      </div>
      <div className="he-topbar-right">
        <span className="he-user">Welcome <strong>Prudhvi</strong><br /><small>All Access Admin · EST</small></span>
      </div>
    </div>
  )
}

function NavBar({ activeMemberId, onMemberChange }: { activeMemberId: string; onMemberChange: (id: string) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const items = ['InPatient', 'OutPatient', 'Pharmacy', 'Complaint']
  const right = ['Quick Links', 'Wellframe', 'Calendar', 'BRE', 'Actions', 'Alerts', 'Admin', 'Config', 'Know', 'Manage', 'Settings']
  const active = MEMBERS.find(m => m.id === activeMemberId) ?? MEMBERS[0]
  return (
    <div className="he-navbar">
      <div className="he-navbar-left">
        <button className="he-nav-item he-nav-home"><Icon name="Home" size="sm" /> Home</button>
        <div style={{ position: 'relative' }}>
          <div className="he-member-pill" style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen(o => !o)}>
            {active.display} ▾
          </div>
          {dropdownOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 180 }}>
              {MEMBERS.map(m => (
                <div
                  key={m.id}
                  onClick={() => { onMemberChange(m.id); setDropdownOpen(false) }}
                  style={{ padding: '10px 16px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, background: m.id === activeMemberId ? '#f0f4ff' : 'transparent', fontWeight: m.id === activeMemberId ? 600 : 400 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5f5f5' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = m.id === activeMemberId ? '#f0f4ff' : 'transparent' }}
                >
                  {m.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {items.map(i => <button key={i} className="he-nav-item">{i}</button>)}
      </div>
      <div className="he-navbar-right">
        {right.map(i => <button key={i} className="he-nav-item he-nav-sm">{i}{['Quick Links','Actions','Admin','Config','Know','Manage','Settings'].includes(i) ? ' ▾' : ''}</button>)}
      </div>
    </div>
  )
}

function MemberBanner() {
  return (
    <div className="he-banner">
      <span className="he-banner-dot" />
      <strong>Henry Tom Garcia-AH0000007</strong>
      <span className="he-banner-meta">DOB 01/01/2001 · 24 yr(s)</span>
      <span className="he-banner-alert"><Icon name="Warning" size="sm" /> Currently accessed by another care staff</span>
      <span className="he-banner-alert"><Icon name="Warning" size="sm" /> Service Interruption</span>
      <span className="he-banner-alert he-banner-allergy"><Icon name="PanTool" size="sm" /> Life Threatening Allergies</span>
    </div>
  )
}

function MemberDetails() {
  return (
    <div className="he-content">
      {/* Tabs */}
      <div className="he-tabs">
        {['Member Details', 'Caregivers', 'Care Team', 'Programs', 'Eligibility', 'UDT'].map((t, i) => (
          <button key={t} className={`he-tab ${i === 0 ? 'he-tab-active' : ''}`}>{t}</button>
        ))}
      </div>

      <div className="he-grid">
        {/* Personal Details */}
        <div className="he-card he-card-wide">
          <h3 className="he-card-title">Personal Details</h3>
          {[
            ['Member Name (F-M-L)', 'Henry Tom Garcia'],
            ['Preferred Name', 'Preferred Name xbeew'],
            ['Gender', 'Male'],
            ['Gender Identity', 'Male'],
            ['Sexual Orientation', 'Not Available'],
            ['Preferred Pronouns', 'He/him/his'],
            ['Date of Birth', 'January 01, 2001'],
            ['New ID', 'AH0000007'],
            ['Member ID', 'AH0000007'],
            ['Preferred Contact Format', 'Not Available'],
            ['Service Interruption', 'blood test, Nursing Home, demo'],
          ].map(([k, v]) => (
            <div className="he-field" key={k}>
              <span className="he-field-label">{k}:</span>
              <span className="he-field-value">{v}</span>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="he-card">
          <h3 className="he-card-title">Languages</h3>
          {[
            ['Primary Language', 'English'],
            ['Preferred Written Language(s)', 'Spanish'],
            ['Preferred Spoken Language(s)', 'English'],
            ['Communication Impairment', 'Visually Impaired, Large Font, Hard of Hearing, Illiterate, Interpreter Needed, Braille Needed, Deaf, Aphasic'],
          ].map(([k, v]) => (
            <div className="he-field" key={k}>
              <span className="he-field-label">{k}:</span>
              <span className="he-field-value">{v}</span>
            </div>
          ))}
        </div>

        {/* Phone Numbers */}
        <div className="he-card he-card-wide">
          <h3 className="he-card-title">Phone Numbers</h3>
          {[
            ['Preferred Phone', '909-851-3064'],
            ['Primary Phone', '259-391-3698'],
            ['Cell Phone', '111-111-1111'],
            ['Alternate Phone', '909-851-3064'],
            ['Fax', '233-366-6778'],
            ['Preferred Time to Call', 'M-F 12pm-1pm'],
          ].map(([k, v]) => (
            <div className="he-field" key={k}>
              <span className="he-field-label">{k}:</span>
              <span className="he-field-value he-link">{v}</span>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="he-card">
          <h3 className="he-card-title">Address</h3>
          {[
            ['Address', 'Address gikmt'],
            ['City', 'CityEfdpM'],
            ['State / Province', 'VA'],
            ['Zip / Postal Code', '20191'],
            ['County', 'ADA COUNTY'],
            ['Country', 'Not Available'],
          ].map(([k, v]) => (
            <div className="he-field" key={k}>
              <span className="he-field-label">{k}:</span>
              <span className="he-field-value">{v}</span>
            </div>
          ))}
        </div>

        {/* Medical IDs */}
        <div className="he-card">
          <h3 className="he-card-title">Medical IDs</h3>
          {[
            ['Primary Insurance', 'Not Available'],
            ['Primary Ins. Policy #', 'XvAicS'],
            ['Secondary Insurance', 'Medicaid'],
            ['Secondary Ins. Policy #', '987676E2'],
          ].map(([k, v]) => (
            <div className="he-field" key={k}>
              <span className="he-field-label">{k}:</span>
              <span className="he-field-value">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeMemberId, setActiveMemberId] = useState(MEMBERS[0].id)
  const member = MEMBERS.find(m => m.id === activeMemberId) ?? MEMBERS[0]

  return (
    <div className="he-shell">
      <TopBar />
      <NavBar activeMemberId={activeMemberId} onMemberChange={setActiveMemberId} />
      <MemberBanner />
      <div className="he-body">
        <div className="he-sidebar">
          {([
            'ChevronRight',
            'Person',
            'Favorite',
            'Work',
            'Assignment',
            'Gavel',
            'Folder',
          ] as const).map((name, i) => (
            <button key={i} className="he-sidebar-btn">
              <Icon name={name} size="sm" />
            </button>
          ))}
        </div>
        <MemberDetails />
      </div>

      {/* ── Haven AI floating window + FAB ── */}
      {/* key={member.id} causes React to unmount+remount on member switch, resetting window state */}
      <HavenWindow
        key={member.id}
        memberName={member.name}
        phone={member.phone}
        memberId={member.id}
        pcp={member.pcp}
        mockMemberId={member.mockId}
      />
    </div>
  )
}
