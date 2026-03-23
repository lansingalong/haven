import styles from './MemberDetailMenu.module.css'

const PROMPTS = [
  "What is on the member's medication list?",
  'What services is the member eligible for?',
  'When is the best time to contact the member?',
  "When does the member's eligibility end?",
]

export interface MemberDetailMenuProps {
  onSelect: (prompt: string) => void
  onClose: () => void
}

export function MemberDetailMenu({ onSelect, onClose }: MemberDetailMenuProps) {
  return (
    <div className={styles.menu} role="menu">
      {PROMPTS.map((label) => (
        <button
          key={label}
          className={styles.item}
          role="menuitem"
          type="button"
          onClick={() => { onSelect(label); onClose() }}
        >
          <span className={styles.itemLabel}>{label}</span>
        </button>
      ))}
    </div>
  )
}
