import { render, screen } from '@testing-library/react'
import { hasAncestor } from '../..'

test('hasAncestor', () => {
    render(
        <div>
            <div id="d1">
                <div id="d11">
                    <div id="target" data-testid="target" />
                </div>
            </div>
        </div>
    )

    const target = screen.getByTestId('target')

    expect(hasAncestor(target, 'div')).toBe(true)
    expect(hasAncestor(target, '#d11')).toBe(true)
    expect(hasAncestor(target, '#d1')).toBe(true)

    expect(hasAncestor(target, '#target')).toBe(false)
    expect(hasAncestor(target, '.foobar')).toBe(false)
})
