let audioCtx: AudioContext | null = null

/** Call this inside a user-gesture handler to unlock audio on all browsers. */
export function initAudio(): void {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

/** Short attention-chime before a number is called (~400ms). */
export function playChime(): Promise<void> {
  if (!audioCtx) return Promise.resolve()

  return new Promise(resolve => {
    const ctx = audioCtx!
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25)

    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)

    setTimeout(resolve, 420)
  })
}

/** Announce a number via Web Speech API. */
export function announceNumber(
  number: number,
  nickname: string | null,
  rate = 0.85
): void {
  if (!window.speechSynthesis) return

  // Chrome freeze-bug mitigation: cancel before speak
  window.speechSynthesis.cancel()

  const text = nickname ? `${nickname}… ${number}` : String(number)
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.pitch = 1.0
  utterance.volume = 1.0

  window.speechSynthesis.speak(utterance)
}
