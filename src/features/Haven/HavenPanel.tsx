import { Icon } from '@/components/Icons'
import { MemberHeader } from './MemberHeader'
import { ChatWelcome } from './ChatWelcome'
import { AskHavenInput } from './AskHavenInput'
import styles from './HavenPanel.module.css'

export interface HavenPanelProps {
  memberName?: string
  phone?: string
  memberId?: string
  pcp?: string
  onPromptClick?: (prompt: string) => void
  onSend?: (value: string) => void
  onLearnMore?: () => void
}

/* ── Browser chrome traffic lights ── */
function TrafficLights() {
  return (
    <div className={styles.trafficLights}>
      <span className={`${styles.dot} ${styles.red}`} />
      <span className={`${styles.dot} ${styles.yellow}`} />
      <span className={`${styles.dot} ${styles.green}`} />
    </div>
  )
}

export function HavenPanel({
  memberName = 'Henry Tom Garcia',
  phone = '909-851-3064',
  memberId = 'AH000000009',
  pcp = 'Ambetter',
  onPromptClick,
  onSend,
  onLearnMore,
}: HavenPanelProps) {
  return (
    <div className={styles.frame}>
      {/* 1 — Browser chrome */}
      <div className={styles.chrome}>
        <TrafficLights />
        <span className={styles.chromeTitle}>Haven</span>
        <button className={styles.shareBtn} type="button" aria-label="Share">
          <Icon name="IosShare" size="sm" color="action" />
        </button>
      </div>

      {/* 2 — Member header */}
      <MemberHeader
        memberName={memberName}
        phone={phone}
        memberId={memberId}
        pcp={pcp}
      />

      {/* 3 — Chat area */}
      <div className={styles.chatArea}>
        <div className={styles.chatScroll}>
          <div className={styles.welcomeWrap}>
            <ChatWelcome onMemberDetails={() => onPromptClick?.('Get member details')} />
          </div>
        </div>

        {/* 4 — Input + disclaimer pinned to bottom */}
        <div className={styles.bottom}>
          <AskHavenInput onSubmit={onSend} />
          <p className={styles.disclaimer}>
            Check your responses for accuracy.{' '}
            <button
              type="button"
              className={styles.disclaimerLink}
              onClick={onLearnMore}
            >
              What this assistant can and cannot do
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
