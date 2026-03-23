import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from 'react'
import { Icon, AiAssistant } from '@/components/Icons'
import styles from './HavenChat.module.css'

/* ── Types ── */

export interface HavenMember {
  name: string
  id: string
  dob?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface HavenChatProps {
  member?: HavenMember
  /** Called when the user submits a message. Return the assistant reply. */
  onSend?: (message: string, member?: HavenMember) => Promise<string>
}

/* ── Icon size helpers ── */


/* ── Typing indicator ── */

function TypingIndicator() {
  return (
    <div className={styles.typingWrap}>
      <div className={styles.assistantAvatar}>
        <AiAssistant filled size="sm" color="primary" />
      </div>
      <div className={styles.typingBubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  )
}

/* ── Message bubble ── */

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowAssistant}`}>
      {!isUser && (
        <div className={styles.assistantAvatar} aria-hidden="true">
          <AiAssistant filled size="sm" color="primary" />
        </div>
      )}
      <div className={styles.messageGroup}>
        <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
          {message.content}
        </div>
        <time className={`${styles.timestamp} ${isUser ? styles.timestampUser : ''}`}>{time}</time>
      </div>
    </div>
  )
}

/* ── Suggested prompts ── */

const SUGGESTED_PROMPTS = [
  'Summarize this member\'s active programs',
  'What are the open care gaps?',
  'Draft a care plan note',
  'Show recent service interruptions',
]

/* ── Main component ── */

export function HavenChat({ member, onSend }: HavenChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Auto-scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      let reply: string

      if (onSend) {
        reply = await onSend(trimmed, member)
      } else {
        /* Demo fallback */
        await new Promise(r => setTimeout(r, 1200))
        reply = getDemoReply(trimmed, member)
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  /* Auto-grow textarea */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const isEmpty = messages.length === 0

  return (
    <>
      {/* ── Backdrop ── */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Chat panel ── */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Haven AI assistant"
      >
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <AiAssistant filled size="md" color="inverse" />
            </div>
            <div className={styles.headerText}>
              <span className={styles.headerTitle}>Haven AI</span>
              <span className={styles.headerSub}>Care assistant</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            {member && (
              <div className={styles.memberChip}>
                <Icon name="Person" size="xs" color="inverse" />
                <span>{member.name}</span>
              </div>
            )}
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close Haven AI"
              type="button"
            >
              <Icon name="Close" size="md" color="inverse" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className={styles.messages} aria-live="polite" aria-atomic="false">
          {isEmpty && !loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <AiAssistant filled size="lg" color="primary" />
              </div>
              <p className={styles.emptyTitle}>How can I help?</p>
              {member && (
                <p className={styles.emptyMember}>
                  I have context on <strong>{member.name}</strong>
                </p>
              )}
              <div className={styles.suggestions}>
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    className={styles.suggestionBtn}
                    onClick={() => sendMessage(prompt)}
                    type="button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {loading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this member…"
              rows={1}
              disabled={loading}
              aria-label="Message"
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Icon name="Send" size="md" color="inverse" />
            </button>
          </div>
          <p className={styles.inputHint}>Enter to send · Shift+Enter for new line</p>
        </form>
      </div>

      {/* ── FAB ── */}
      {!open && (
        <button
          className={styles.fab}
          onClick={() => setOpen(true)}
          aria-label="Open Haven AI assistant"
          type="button"
        >
          <Icon name="ChatBubble" size="lg" color="inverse" />
          <span className={styles.fabLabel}>Haven AI</span>
        </button>
      )}
    </>
  )
}

/* ── Demo replies (remove when wiring real API) ── */

function getDemoReply(input: string, member?: HavenMember): string {
  const lower = input.toLowerCase()
  const name = member?.name ?? 'this member'

  if (lower.includes('program')) {
    return `${name} is currently enrolled in 2 active programs:\n\n• **Care Coordination** — enrolled 03/2024, active\n• **Chronic Disease Management** — enrolled 01/2024, active\n\nNo programs are pending closure.`
  }
  if (lower.includes('care gap') || lower.includes('gap')) {
    return `I found 3 open care gaps for ${name}:\n\n1. Annual wellness visit overdue (last: 01/2023)\n2. HbA1c screening not completed this year\n3. Depression screening pending\n\nWould you like me to draft outreach notes for any of these?`
  }
  if (lower.includes('note') || lower.includes('draft')) {
    return `Here's a draft care plan note:\n\n---\n**Date:** ${new Date().toLocaleDateString()}\n**Member:** ${name}\n**Type:** Care Coordination\n\nMember contacted regarding open care gaps. Discussed importance of annual wellness visit and HbA1c screening. Member expressed willingness to schedule. Follow-up call scheduled for next week.\n\n---\nWould you like me to adjust the tone or add specific details?`
  }
  if (lower.includes('interrupt') || lower.includes('service')) {
    return `${name} has 3 active service interruptions:\n\n• **blood test** — flagged 02/15/2024\n• **Nursing Home** — flagged 01/10/2024\n• **demo** — flagged 03/01/2024\n\nAll three are currently unresolved. Would you like to see the full details or take action on any of them?`
  }
  if (lower.includes('allerg')) {
    return `⚠️ ${name} has a documented **life-threatening allergy** on file. Please review the allergy details in the member record before prescribing or recommending any treatments.`
  }
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('call')) {
    return `Best contact details for ${name}:\n\n• **Preferred:** 909-851-3064\n• **Preferred time:** M-F 12pm–1pm\n• **Primary:** 259-391-3698\n\nNote: member has listed multiple communication impairments including hearing and vision considerations.`
  }
  return `I can help you with ${name}'s care. Some things you can ask:\n\n• Active programs and enrollment status\n• Open care gaps\n• Draft care plan notes\n• Service interruptions\n• Contact and communication preferences`
}
