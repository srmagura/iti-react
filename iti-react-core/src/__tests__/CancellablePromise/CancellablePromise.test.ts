import 'jest'
import { range } from 'lodash'
import { performance } from 'perf_hooks'
import { CancellablePromise } from '../../CancellablePromise'

interface Options {
    resolve?: boolean
}

export function getPromise<T>(
    returnValue: T,
    duration: number,
    options: Options = { resolve: true }
): CancellablePromise<T> {
    let timer: NodeJS.Timeout | undefined

    const promise = new Promise<T>((resolve, reject) => {
        timer = setTimeout(() => {
            if (options.resolve) {
                resolve(returnValue)
            } else {
                reject(new Error('Promise rejected for reason XYZ.'))
            }
        }, duration)
    })

    const cancel = (): void => {
        if (timer) clearTimeout(timer)
    }

    return new CancellablePromise(promise, cancel)
}

test('basic', async () => {
    const p = getPromise('5', 500)
    expect(await p).toBe('5')
})

async function assertRejects(p: CancellablePromise<unknown>): Promise<void> {
    try {
        await p
        fail('Promise did not reject.')
    } catch (e) {
        // do nothing
    }
}

test('error', async () => {
    await assertRejects(getPromise('5', 500, { resolve: false }))
})

test('then', async () => {
    const p: CancellablePromise<number> = getPromise('5', 500).then(
        (s) => parseInt(s) * 2
    )
    expect(await p).toBe(10)
})

test('thenError', async () => {
    await assertRejects(
        getPromise('5', 500, { resolve: false }).then((s) => parseInt(s) * 2)
    )
})

test('all', async () => {
    const d = 100

    const p0: CancellablePromise<0> = getPromise<0>(0, 1 * d)
    const p1: CancellablePromise<1> = getPromise<1>(1, 2 * d)
    const p2: CancellablePromise<2> = getPromise<2>(2, 3 * d)
    const p3: CancellablePromise<3> = getPromise<3>(3, 4 * d)
    const p4: CancellablePromise<4> = getPromise<4>(4, 5 * d)
    const p5: CancellablePromise<5> = getPromise<5>(5, 6 * d)
    const p6: CancellablePromise<6> = getPromise<6>(6, 7 * d)
    const p7: CancellablePromise<7> = getPromise<7>(7, 8 * d)
    const p8: CancellablePromise<8> = getPromise<8>(8, 9 * d)
    const p9: CancellablePromise<9> = getPromise<9>(9, 10 * d)

    {
        // Just testing type checking
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const y: 0[] = await CancellablePromise.all(range(20).map(() => p0))

        const x0: [0] = await CancellablePromise.all([p0])
        const x2: [0, 1, 2] = await CancellablePromise.all([p0, p1, p2])
        const x3: [0, 1, 2, 3] = await CancellablePromise.all([p0, p1, p2, p3])
        const x4: [0, 1, 2, 3, 4] = await CancellablePromise.all([p0, p1, p2, p3, p4])
        const x5: [0, 1, 2, 3, 4, 5] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
        ])
        const x6: [0, 1, 2, 3, 4, 5, 6] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
        ])
        const x7: [0, 1, 2, 3, 4, 5, 6, 7] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            p7,
        ])
        const x8: [0, 1, 2, 3, 4, 5, 6, 7, 8] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            p7,
            p8,
        ])
        const x9: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            p7,
            p8,
            p9,
        ])
        /* eslint-enable @typescript-eslint/no-unused-vars */
    }

    const x1: [0, 1] = await CancellablePromise.all([p0, p1])

    expect(x1[0]).toBe(0)
    expect(x1[1]).toBe(1)
})

test('allError', async () => {
    const options = { resolve: false }

    // Test should finish after 500 ms
    await assertRejects(
        CancellablePromise.all([
            getPromise(0, 500, options),
            getPromise(1, 10000, options),
        ])
    )
})

describe('CancellablePromise.resolve', () => {
    test('resolve', async () => {
        const x = await CancellablePromise.resolve<number>(7)
        expect(x).toBe(7)
    })

    test('resolve<void>', async () => {
        const pVoid: CancellablePromise<void> = CancellablePromise.resolve()
        const pVoid2: CancellablePromise<void> = CancellablePromise.resolve<void>()

        try {
            await pVoid
            await pVoid2
        } catch (e) {
            fail('Promise rejected.')
        }
    })

    // See comment CancellablePromise.resolve
    test('resolves even if canceled immediately', async () => {
        const promise = CancellablePromise.resolve()
        promise.cancel()

        try {
            await promise
        } catch (e) {
            fail('Promise rejected.')
        }
    })
})

describe('CancellablePromise.reject', () => {
    test('reject', async () => {
        try {
            await CancellablePromise.reject<number>(7)
            fail('Promise resolved.')
        } catch (e) {
            expect(e).toBe(7)
        }
    })

    test('reject<void>', async () => {
        try {
            const pVoid: CancellablePromise<void> = CancellablePromise.reject()
            await pVoid
            fail('Promise resolved.')
        } catch (e) {
            expect(e).toBeUndefined()
        }

        try {
            const pVoid2: CancellablePromise<void> = CancellablePromise.reject<void>()
            await pVoid2
            fail('Promise resolved.')
        } catch (e) {
            expect(e).toBeUndefined()
        }
    })
})

describe('CancellablePromise.delay', () => {
    it('delays', async () => {
        const start = performance.now()
        await CancellablePromise.delay(200)
        const end = performance.now()
        expect(end - start).toBeGreaterThan(100)
    })

    it('can be canceled', async () => {
        const promise = CancellablePromise.delay(200)
        promise.cancel()
        await assertRejects(promise)
    })
})
