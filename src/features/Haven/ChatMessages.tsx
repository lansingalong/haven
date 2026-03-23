import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './ChatMessages.module.css'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
  feedback?: 'up' | 'down' | null
}

export interface ChatMessagesProps {
  messages: Message[]
  /** Show 3-dot typing indicator */
  loading: boolean
  /** Show animated thinking steps before response */
  thinkingSteps?: string[] | null
  onFeedback?: (id: string, value: 'up' | 'down') => void
}

/* ── Thinking steps ── */
function ThinkingSteps({ steps }: { steps: string[] }) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    if (count >= steps.length) return
    const t = setTimeout(() => setCount(c => c + 1), 700)
    return () => clearTimeout(t)
  }, [count, steps.length])

  return (
    <div className={styles.thinkingWrap}>
      {steps.slice(0, count).map((step, i) => {
        const done = i < count - 1
        return (
          <div key={i} className={`${styles.thinkingStep} ${done ? styles.thinkingDone : styles.thinkingActive}`}>
            {done
              ? <Icon name="CheckCircle" size="xs" color="action" />
              : <span className={styles.thinkingSpinner} />
            }
            <span>{step}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Typing indicator ── */
function TypingIndicator() {
  return (
    <div className={styles.row}>
      <div className={styles.typing}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  )
}

/* ── Assistant message with actions ── */
function AssistantMessage({ msg, onFeedback }: { msg: Message; onFeedback?: (id: string, value: 'up' | 'down') => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (msg.isError) {
    return (
      <div className={styles.row}>
        <div className={styles.errorBubble}>
          <div className={styles.errorHeader}>
            <Icon name="ErrorOutline" size="sm" color="error" />
            <span className={styles.errorTitle}>Unable to retrieve data</span>
          </div>
          <p className={styles.errorBody}>{msg.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.assistantGroup}>
      <div className={styles.row}>
        <div className={styles.assistantBubble}>{msg.content}</div>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${copied ? styles.actionBtnActive : ''}`}
          onClick={handleCopy}
          type="button"
          aria-label="Copy response"
          title={copied ? 'Copied!' : 'Copy'}
        >
          <Icon name={copied ? 'Check' : 'ContentCopy'} size="xs" color="action" />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <div className={styles.actionDivider} />
        <button
          className={`${styles.actionBtn} ${msg.feedback === 'up' ? styles.actionBtnActive : ''}`}
          onClick={() => onFeedback?.(msg.id, 'up')}
          type="button"
          aria-label="Helpful"
          title="Helpful"
        >
          <Icon name={msg.feedback === 'up' ? 'ThumbUp' : 'ThumbUpOffAlt'} size="xs" color="action" />
        </button>
        <button
          className={`${styles.actionBtn} ${msg.feedback === 'down' ? styles.actionBtnActive : ''}`}
          onClick={() => onFeedback?.(msg.id, 'down')}
          type="button"
          aria-label="Not helpful"
          title="Not helpful"
        >
          <Icon name={msg.feedback === 'down' ? 'ThumbDown' : 'ThumbDownOffAlt'} size="xs" color="action" />
        </button>
      </div>
    </div>
  )
}

/* ── Main component ── */
export function ChatMessages({ messages, loading, thinkingSteps, onFeedback }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, thinkingSteps])

  return (
    <div className={styles.list}>
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <div key={msg.id} className={styles.userRow}>
            <div className={styles.userBubble}>{msg.content}</div>
          </div>
        ) : (
          <AssistantMessage key={msg.id} msg={msg} onFeedback={onFeedback} />
        )
      )}

      {thinkingSteps && thinkingSteps.length > 0 && (
        <ThinkingSteps steps={thinkingSteps} />
      )}
      {loading && !thinkingSteps && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  )
}
