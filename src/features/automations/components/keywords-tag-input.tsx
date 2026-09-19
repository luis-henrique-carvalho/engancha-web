import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface KeywordsTagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function KeywordsTagInput({
  value = [],
  onChange,
  placeholder = 'Ex: quero, preco, cupom...',
  disabled = false,
  className,
}: KeywordsTagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = (rawTag: string) => {
    const trimmed = rawTag.trim()
    if (!trimmed) return

    // Normaliza para verificar duplicatas (case insensitive)
    const exists = value.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    if (!exists) {
      onChange([...value, trimmed])
    }
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      e.preventDefault()
      const newTags = [...value]
      newTags.pop()
      onChange(newTags)
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || !inputValue.trim()}
          onClick={() => handleAddTag(inputValue)}
          aria-label="Adicionar tag"
        >
          <Plus className="mr-1.5 size-4" />
          Adicionar
        </Button>
      </div>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, idx) => (
            <Badge
              key={`${tag}-${idx}`}
              variant="secondary"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(idx)}
                disabled={disabled}
                className="ml-1 rounded-full p-0.5 hover:bg-muted focus:outline-none"
                aria-label={`Remover tag ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nenhuma palavra-chave adicionada ainda. Pressione Enter ou vírgula para adicionar.
        </p>
      )}
    </div>
  )
}
