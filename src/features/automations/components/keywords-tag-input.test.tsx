import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { KeywordsTagInput } from './keywords-tag-input'

describe('KeywordsTagInput', () => {
  it('renders initial tags and allows adding new tags via Enter and comma', async () => {
    const onChange = vi.fn()
    await render(
      <KeywordsTagInput
        value={['QUERO', 'PROMO']}
        onChange={onChange}
        placeholder="Digite uma palavra..."
      />,
    )

    await expect.element(page.getByText('QUERO')).toBeInTheDocument()
    await expect.element(page.getByText('PROMO')).toBeInTheDocument()

    const input = page.getByPlaceholder('Digite uma palavra...')
    await expect.element(input).toBeInTheDocument()

    await userEvent.click(input)
    await userEvent.type(input, 'DESCONTO{Enter}')

    expect(onChange).toHaveBeenCalledWith(['QUERO', 'PROMO', 'DESCONTO'])
  })

  it('adds tag when clicking the Add button', async () => {
    const onChange = vi.fn()
    await render(
      <KeywordsTagInput
        value={[]}
        onChange={onChange}
        placeholder="Adicionar..."
      />,
    )

    const input = page.getByPlaceholder('Adicionar...')
    await userEvent.click(input)
    await userEvent.type(input, 'CUPOM')

    const addBtn = page.getByRole('button', { name: 'Adicionar tag' })
    await userEvent.click(addBtn)

    expect(onChange).toHaveBeenCalledWith(['CUPOM'])
  })

  it('removes tag when clicking the remove button on a badge', async () => {
    const onChange = vi.fn()
    await render(
      <KeywordsTagInput
        value={['QUERO', 'PROMO']}
        onChange={onChange}
      />,
    )

    const removeBtn = page.getByRole('button', { name: 'Remover tag QUERO' })
    await userEvent.click(removeBtn)

    expect(onChange).toHaveBeenCalledWith(['PROMO'])
  })

  it('removes the last tag on Backspace when input is empty', async () => {
    const onChange = vi.fn()
    await render(
      <KeywordsTagInput
        value={['QUERO', 'PROMO']}
        onChange={onChange}
        placeholder="Adicionar..."
      />,
    )

    const input = page.getByPlaceholder('Adicionar...')
    await userEvent.click(input)
    await userEvent.keyboard('{Backspace}')

    expect(onChange).toHaveBeenCalledWith(['QUERO'])
  })

  it('does not add duplicate or empty tags', async () => {
    const onChange = vi.fn()
    await render(
      <KeywordsTagInput
        value={['QUERO']}
        onChange={onChange}
        placeholder="Adicionar..."
      />,
    )

    const input = page.getByPlaceholder('Adicionar...')
    await userEvent.click(input)
    await userEvent.type(input, 'quero{Enter}')

    expect(onChange).not.toHaveBeenCalled()
  })
})
