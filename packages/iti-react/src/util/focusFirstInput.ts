export function focusFirstInput(parentElement: HTMLElement): void {
    const selector = ['input', 'select', 'textarea', 'button'].join(', ')

    const candidates = Array.from(parentElement.querySelectorAll<HTMLElement>(selector))

    for (const candidate of candidates) {
        if (candidate.classList.contains('btn-close')) continue
        if (candidate.hasAttribute('readonly')) continue
        if (candidate.hasAttribute('disabled')) continue
        if (candidate.getAttribute('type') === 'hidden') continue

        candidate.focus()
        break
    }
}
