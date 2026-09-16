export function SimulationFollowerEmailBubble({
  author,
  submittedEmail,
}: {
  author: string
  submittedEmail: string | null
}) {
  return (
    <div
      className="flex justify-end"
      data-testid="simulation-follower-email-response-bubble"
    >
      <div className="max-w-[85%] rounded-lg bg-primary text-primary-foreground p-3 space-y-1 text-xs">
        <div className="flex items-center justify-between gap-2 text-[10px] opacity-80">
          <span>{author}</span>
          <span>Resposta de e-mail</span>
        </div>
        <p className="font-mono">{submittedEmail || 'E-mail enviado'}</p>
      </div>
    </div>
  )
}
