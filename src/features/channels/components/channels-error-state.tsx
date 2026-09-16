import { AlertTriangle } from 'lucide-react'

export function ChannelsErrorState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-14 text-center">
      <AlertTriangle className="size-8 text-destructive/70" />
      <div>
        <p className="font-medium text-destructive">Não foi possível carregar os canais</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
    </div>
  )
}
