beforeEach(() => {
    jest.useFakeTimers()
})

function delay(duration: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration))
}

// PASS
it('delays', async () => {
    const p = delay(100)
    jest.runAllTimers()

    expect(await p).toBeUndefined()
})

// PASS
it('delays once in a function', async () => {
    async function f(): Promise<void> {
        await delay(100)
    }

    const p = f()
    jest.runAllTimers()

    expect(await p).toBeUndefined()
})

// FAIL: Exceeded timeout of 5000 ms for a test.
it('delays twice in a function', async () => {
    async function f(): Promise<void> {
        await delay(100)
        await delay(100)
    }

    const p = f()
    jest.runAllTimers()
    jest.runAllTimers()
    jest.runAllTimers()
    jest.runAllTimers()

    expect(await p).toBeUndefined()
})

// PASS
it('delays twice in a function using real timers', async () => {
    jest.useRealTimers()

    async function f(): Promise<void> {
        await delay(100)
        await delay(100)
    }

    const p = f()
    expect(await p).toBeUndefined()
})
