import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/Icons'
import { MemberHeader } from './MemberHeader'
import { ChatWelcome } from './ChatWelcome'
import { MemberDetailMenu } from './MemberDetailMenu'
import { ChatMessages, type Message } from './ChatMessages'
import { AskHavenInput } from './AskHavenInput'
import styles from './HavenWindow.module.css'
import panelStyles from './HavenPanel.module.css'
import { getMockReply, getFollowUp, getFollowUpQuery, getGuardrailMessage } from './mockReplies'

export interface HavenWindowProps {
  memberName?: string
  phone?: string
  memberId?: string
  pcp?: string
  /** Provide to wire a real AI backend; omit to use built-in demo replies */
  onSend?: (value: string) => Promise<string>
  onLearnMore?: () => void
  defaultRight?: number
  defaultBottom?: number
  defaultWidth?: number
  defaultHeight?: number
  /** Member ID used to select the correct mock data set */
  mockMemberId?: string
}

type WindowState = 'open' | 'minimized' | 'closed'
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_W = 360
const MIN_H = 300

export function HavenWindow({
  memberName = 'Henry Tom Garcia',
  phone = '909-851-3064',
  memberId = 'AH000000009',
  pcp = 'Ambetter',
  onSend,
  onLearnMore,
  defaultRight = 24,
  defaultBottom = 24,
  defaultWidth = 500,
  defaultHeight = 657,
  mockMemberId = 'AH0000007',
}: HavenWindowProps) {
  const [winState, setWinState] = useState<WindowState>('closed')
  const [menuOpen, setMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)

  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight })
  const [posReady, setPosReady] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPos({
      left: window.innerWidth - defaultRight - defaultWidth,
      top: window.innerHeight - defaultBottom - defaultHeight,
    })
    setPosReady(true)
  }, [defaultBottom, defaultRight, defaultWidth, defaultHeight])

  /* ── Learn more ── */
  const handleLearnMore = useCallback(() => {
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: 'What does Haven have access to?' }
    const replyMsg: Message = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      content: `Here's what I can and cannot help with:\n\nI don't have access to:\n• Clinical decisions or diagnosis\n• Systems outside this platform\n• Guaranteed accurate information — always verify yourself\n\nI have access to:\n• Member demographics\n• Clinical history\n• Care plan (goals, interventions)\n• Assessments\n• Eligibility\n• Care gaps\n• Claims data`,
    }
    setMessages(prev => [...prev, userMsg, replyMsg])
    setMenuOpen(false)
    setLearnMoreOpen(true)
  }, [])

  /* ── Send a message ── */
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    // If user says "yes", resolve against the last assistant message's follow-up query
    const isYes = /^yes[.!]?\s*$/i.test(trimmed)
    const lastFollowUpQuery = isYes
      ? [...messages].reverse().find(m => m.role === 'assistant' && m.followUpQuery)?.followUpQuery
      : undefined
    const resolvedText = lastFollowUpQuery ?? trimmed

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setMenuOpen(false)
    setLearnMoreOpen(false)
    setLoading(true)

    try {
      // Check guardrails before any backend call
      const guardrail = getGuardrailMessage(resolvedText)
      if (guardrail) {
        await new Promise(r => setTimeout(r, 600))
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: guardrail,
        }])
        return
      }

      let reply: string
      if (onSend) {
        reply = await onSend(resolvedText)
      } else {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 800))
        reply = getMockReply(resolvedText, memberName, mockMemberId)
      }
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        followUp: getFollowUp(resolvedText),
        followUpQuery: getFollowUpQuery(resolvedText),
      }])
    } finally {
      setLoading(false)
    }
  }, [loading, memberName, onSend, messages])

  /* ── Drag ── */
  const dragState = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null)

  const onChromeMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    dragState.current = { startX: e.clientX, startY: e.clientY, startLeft: pos.left, startTop: pos.top }
  }, [pos])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      setPos({
        left: Math.max(0, Math.min(window.innerWidth - size.w, dragState.current.startLeft + dx)),
        top: Math.max(0, Math.min(window.innerHeight - 28, dragState.current.startTop + dy)),
      })
    }
    const onMouseUp = () => { dragState.current = null }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp) }
  }, [size.w])

  /* ── Resize ── */
  const resizeState = useRef<{ dir: ResizeDir; startX: number; startY: number; startLeft: number; startTop: number; startW: number; startH: number } | null>(null)

  const onResizeMouseDown = useCallback((dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    resizeState.current = { dir, startX: e.clientX, startY: e.clientY, startLeft: pos.left, startTop: pos.top, startW: size.w, startH: size.h }
  }, [pos, size])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const r = resizeState.current
      if (!r) return
      const dx = e.clientX - r.startX
      const dy = e.clientY - r.startY
      let { startLeft: newLeft, startTop: newTop, startW: newW, startH: newH } = r
      if (r.dir.includes('e')) newW = Math.max(MIN_W, r.startW + dx)
      if (r.dir.includes('w')) { newW = Math.max(MIN_W, r.startW - dx); newLeft = r.startLeft + (r.startW - newW) }
      if (r.dir.includes('s')) newH = Math.max(MIN_H, r.startH + dy)
      if (r.dir.includes('n')) { newH = Math.max(MIN_H, r.startH - dy); newTop = r.startTop + (r.startH - newH) }
      setSize({ w: newW, h: newH }); setPos({ left: newLeft, top: newTop })
    }
    const onMouseUp = () => { resizeState.current = null }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp) }
  }, [])

  /* ── Window controls ── */
  const handleClose    = () => { setWinState('closed'); setMenuOpen(false); setMessages([]) }
  const handleMinimize = () => setWinState(s => s === 'minimized' ? 'open' : 'minimized')
  const handleMaximize = () => { if (winState === 'minimized') setWinState('open') }

  const openWindow = () => {
    if (!posReady) {
      setPos({ left: window.innerWidth - defaultRight - defaultWidth, top: window.innerHeight - defaultBottom - defaultHeight })
      setPosReady(true)
    }
    setWinState('open')
  }

  if (winState === 'closed') {
    return (
      <button className={styles.fab} onClick={openWindow} aria-label="Open Haven AI assistant" type="button">
        <Icon name="AutoAwesome" size="md" color="inverse" />
        Haven
      </button>
    )
  }

  const isMinimized = winState === 'minimized'
  const windowStyle: React.CSSProperties = posReady
    ? { left: pos.left, top: pos.top, width: size.w, height: isMinimized ? 28 : size.h }
    : { right: defaultRight, bottom: defaultBottom, width: size.w, height: isMinimized ? 28 : size.h }

  const hasMessages = messages.length > 0 || loading

  return (
    <div ref={windowRef} className={styles.window} style={windowStyle} role="dialog" aria-label="Haven AI assistant" aria-modal="false">
      {/* Resize handles */}
      {!isMinimized && (
        <>
          <div className={styles.resizeN}  onMouseDown={onResizeMouseDown('n')}  />
          <div className={styles.resizeS}  onMouseDown={onResizeMouseDown('s')}  />
          <div className={styles.resizeE}  onMouseDown={onResizeMouseDown('e')}  />
          <div className={styles.resizeW}  onMouseDown={onResizeMouseDown('w')}  />
          <div className={styles.resizeNE} onMouseDown={onResizeMouseDown('ne')} />
          <div className={styles.resizeNW} onMouseDown={onResizeMouseDown('nw')} />
          <div className={styles.resizeSE} onMouseDown={onResizeMouseDown('se')} />
          <div className={styles.resizeSW} onMouseDown={onResizeMouseDown('sw')} />
        </>
      )}

      {/* Chrome bar */}
      <div className={styles.chrome} onMouseDown={onChromeMouseDown}>
        <div className={styles.trafficLights}>
          <button className={`${styles.trafficBtn} ${styles.btnClose}`}  onClick={handleClose}    type="button" aria-label="Close"    title="Close"    />
          <button className={`${styles.trafficBtn} ${styles.btnMin}`}    onClick={handleMinimize} type="button" aria-label={isMinimized ? 'Restore' : 'Minimize'} title={isMinimized ? 'Restore' : 'Minimize'} />
          <button className={`${styles.trafficBtn} ${styles.btnMax}`}    onClick={handleMaximize} type="button" aria-label="Maximize"  title="Maximize"  />
        </div>
        <span className={styles.chromeTitle}>Haven</span>
      </div>

      {/* Window body */}
      {!isMinimized && (
        <div className={styles.body}>
          <MemberHeader memberName={memberName} phone={phone} memberId={memberId} pcp={pcp} />

          <div className={panelStyles.chatArea}>
            {/* Back button */}
            {learnMoreOpen && (
              <button
                type="button"
                className={panelStyles.backBtn}
                onClick={() => { setMessages([]); setLearnMoreOpen(false) }}
                aria-label="Back"
              >
                <Icon name="ArrowBack" size="sm" color="action" />
                Back
              </button>
            )}

            {/* Scroll area */}
            <div className={panelStyles.chatScroll}>
              {hasMessages ? (
                <ChatMessages messages={messages} loading={loading} />
              ) : (
                <div className={panelStyles.welcomeWrap}>
                  <ChatWelcome onMemberDetails={() => setMenuOpen(true)} />
                </div>
              )}
            </div>

            {/* Member detail menu — floats above input bar */}
            {menuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <MemberDetailMenu
                  onClose={() => setMenuOpen(false)}
                  onSelect={sendMessage}
                />
              </div>
            )}

            {/* Input + disclaimer */}
            <div className={panelStyles.bottom}>
              <AskHavenInput onSubmit={sendMessage} />
              <p className={panelStyles.disclaimer}>
                Check your responses for accuracy.{' '}
                <button type="button" className={panelStyles.disclaimerLink} onClick={handleLearnMore}>
                  What this assistant can and cannot do
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
