import { noop, range } from 'lodash'
import { performance } from 'perf_hooks'
import { Cancel, CancellablePromise, CancellablePromiseUtil } from '../CancellablePromise'

beforeEach(() => {
    jest.useFakeTimers()
})

interface Options {
    resolve: boolean
}

export function getPromise<T>(
    returnValue: T,
    duration: number,
    options: Options = { resolve: true }
): CancellablePromise<T> {
    let timer: NodeJS.Timeout | undefined
    let rejectFn: (error?: unknown) => void = noop

    const promise = new Promise<T>((resolve, reject) => {
        rejectFn = reject

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
        rejectFn(new Cancel())
    }

    return CancellablePromiseUtil.attachCancel(promise, cancel)
}

describe('CancellablePromiseUtil', () => {
    describe('attachCancel', () => {
        it('resolves', async () => {
            const p = getPromise('5', 500)
            jest.runAllTimers()

            expect(await p).toBe('5')
        })

        it('rejects', async () => {
            const p = getPromise('5', 500, { resolve: false })
            jest.runAllTimers()

            await expect(p).rejects.toThrow()
        })

        it('cancels', async () => {
            const p = getPromise('5', 500)
            p.cancel()

            await expect(p).rejects.toBeInstanceOf(Cancel)
        })
    })

    describe('then', () => {
        it('transforms the result of the original promise', async () => {
            const p: CancellablePromise<number> = CancellablePromiseUtil.then(
                getPromise('5', 500),
                (s) => parseInt(s) * 2
            )
            jest.runAllTimers()

            expect(await p).toBe(10)
        })

        it('rejects when the original promise rejects', async () => {
            const p = CancellablePromiseUtil.then(
                getPromise('5', 500, { resolve: false }),
                (s) => parseInt(s) * 2
            )
            jest.runAllTimers()

            await expect(p).rejects.toThrow()
        })

        it('cancels the original promise when cancel is called', async () => {
            const p = CancellablePromiseUtil.then(
                getPromise('5', 500),
                (s) => parseInt(s) * 2
            )
            p.cancel()

            await expect(p).rejects.toBeInstanceOf(Cancel)
        })
    })

    // test('thenError', async () => {
    //     await assertRejects(
    //         getPromise('5', 500, { resolve: false }).then((s) => parseInt(s) * 2)
    //     )
    // })

    // test('all', async () => {
    //     const d = 100

    //     const p0: CancellablePromise<0> = getPromise<0>(0, 1 * d)
    //     const p1: CancellablePromise<1> = getPromise<1>(1, 2 * d)
    //     const p2: CancellablePromise<2> = getPromise<2>(2, 3 * d)
    //     const p3: CancellablePromise<3> = getPromise<3>(3, 4 * d)
    //     const p4: CancellablePromise<4> = getPromise<4>(4, 5 * d)
    //     const p5: CancellablePromise<5> = getPromise<5>(5, 6 * d)
    //     const p6: CancellablePromise<6> = getPromise<6>(6, 7 * d)
    //     const p7: CancellablePromise<7> = getPromise<7>(7, 8 * d)
    //     const p8: CancellablePromise<8> = getPromise<8>(8, 9 * d)
    //     const p9: CancellablePromise<9> = getPromise<9>(9, 10 * d)

    //     {
    //         // Just testing type checking
    //         /* eslint-disable @typescript-eslint/no-unused-vars */
    //         const y: 0[] = await CancellablePromise.all(range(20).map(() => p0))

    //         const x0: [0] = await CancellablePromise.all([p0])
    //         const x2: [0, 1, 2] = await CancellablePromise.all([p0, p1, p2])
    //         const x3: [0, 1, 2, 3] = await CancellablePromise.all([p0, p1, p2, p3])
    //         const x4: [0, 1, 2, 3, 4] = await CancellablePromise.all([p0, p1, p2, p3, p4])
    //         const x5: [0, 1, 2, 3, 4, 5] = await CancellablePromise.all([
    //             p0,
    //             p1,
    //             p2,
    //             p3,
    //             p4,
    //             p5,
    //         ])
    //         const x6: [0, 1, 2, 3, 4, 5, 6] = await CancellablePromise.all([
    //             p0,
    //             p1,
    //             p2,
    //             p3,
    //             p4,
    //             p5,
    //             p6,
    //         ])
    //         const x7: [0, 1, 2, 3, 4, 5, 6, 7] = await CancellablePromise.all([
    //             p0,
    //             p1,
    //             p2,
    //             p3,
    //             p4,
    //             p5,
    //             p6,
    //             p7,
    //         ])
    //         const x8: [0, 1, 2, 3, 4, 5, 6, 7, 8] = await CancellablePromise.all([
    //             p0,
    //             p1,
    //             p2,
    //             p3,
    //             p4,
    //             p5,
    //             p6,
    //             p7,
    //             p8,
    //         ])
    //         const x9: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] = await CancellablePromise.all([
    //             p0,
    //             p1,
    //             p2,
    //             p3,
    //             p4,
    //             p5,
    //             p6,
    //             p7,
    //             p8,
    //             p9,
    //         ])
    //         /* eslint-enable @typescript-eslint/no-unused-vars */
    //     }

    //     const x1: [0, 1] = await CancellablePromise.all([p0, p1])

    //     expect(x1[0]).toBe(0)
    //     expect(x1[1]).toBe(1)
    // })

    // test('allError', async () => {
    //     const options = { resolve: false }

    //     // Test should finish after 500 ms
    //     const promise = CancellablePromise.all([
    //         getPromise(0, 500, options),
    //         getPromise(1, 10000, options),
    //     ])

    //     await assertRejects(promise)

    //     promise.cancel()
    // })

    // describe('CancellablePromise.resolve', () => {
    //     test('resolve', async () => {
    //         const x = await CancellablePromise.resolve<number>(7)
    //         expect(x).toBe(7)
    //     })

    //     test('resolve<void>', async () => {
    //         const pVoid: CancellablePromise<void> = CancellablePromise.resolve()

    //         try {
    //             await pVoid
    //         } catch (e) {
    //             fail('Promise rejected.')
    //         }
    //     })

    //     // See comment CancellablePromise.resolve
    //     test('resolves even if canceled immediately', async () => {
    //         const promise = CancellablePromise.resolve()
    //         promise.cancel()

    //         try {
    //             await promise
    //         } catch (e) {
    //             fail('Promise rejected.')
    //         }
    //     })
    // })

    // describe('CancellablePromise.reject', () => {
    //     test('reject', async () => {
    //         try {
    //             await CancellablePromise.reject<number>(7)
    //             fail('Promise resolved.')
    //         } catch (e) {
    //             expect(e).toBe(7)
    //         }
    //     })

    //     test('reject<void>', async () => {
    //         try {
    //             const pVoid: CancellablePromise<void> = CancellablePromise.reject()
    //             await pVoid
    //             fail('Promise resolved.')
    //         } catch (e) {
    //             expect(e).toBeUndefined()
    //         }

    //         try {
    //             const pVoid2: CancellablePromise<void> = CancellablePromise.reject<void>()
    //             await pVoid2
    //             fail('Promise resolved.')
    //         } catch (e) {
    //             expect(e).toBeUndefined()
    //         }
    //     })
    // })

    // describe('CancellablePromise.delay', () => {
    //     it('delays', async () => {
    //         const start = performance.now()
    //         await CancellablePromise.delay(200)
    //         const end = performance.now()
    //         expect(end - start).toBeGreaterThan(100)
    //     })

    //     it('can be canceled', async () => {
    //         const promise = CancellablePromise.delay(200)
    //         promise.cancel()

    //         try {
    //             await promise
    //         } catch (e) {
    //             expect((e as Error).message).toBe(PROMISE_CANCELED)
    //         }
    //     })
    // })
})

// describe('pseudoCancellable', () => {
//     test('success', async () => {
//         try {
//             const number = await pseudoCancellable(Promise.resolve(1))
//             expect(number).toBe(1)
//         } catch (e) {
//             fail('Promise rejected.')
//         }
//     })

//     test('canceled', async () => {
//         try {
//             const promise = pseudoCancellable(
//                 new Promise((resolve) => setTimeout(resolve, 1000))
//             )

//             await CancellablePromise.delay(100)
//             promise.cancel()
//             await promise

//             fail('Promise resolved when it should not have.')
//         } catch (e) {
//             expect((e as Error).message).toBe(PROMISE_CANCELED)
//         }
//     })
// })

// describe('buildCancellablePromise', () => {
//     test('cancellation works', async () => {
//         const promise1Duration = 100

//         const overallPromise = buildCancellablePromise(async (capture) => {
//             await capture(getPromise('1', promise1Duration))

//             try {
//                 await capture(getPromise('2', 3 * promise1Duration))
//                 fail('Promise 2 resolved when it should have been canceled.')
//             } catch {
//                 // do nothing
//             }
//         })

//         // Wait until promise1 resolves
//         await getPromise('', 2 * promise1Duration)

//         // This should cause promise2 to be canceled
//         overallPromise.cancel()
//     })

//     test('simultaneous promises captured', async () => {
//         const duration = 100

//         const overallPromise = buildCancellablePromise(async (capture) => {
//             const promise1 = capture(getPromise('1', duration))
//             const promise2 = capture(getPromise('2', duration))

//             try {
//                 await promise1
//                 fail('promise1 resolved')
//             } catch {
//                 // do nothing
//             }

//             try {
//                 await promise2
//                 fail('promise2 resolved')
//             } catch {
//                 // do nothing
//             }
//         })

//         overallPromise.cancel()

//         // Wait to see if either promise resolves
//         await getPromise('', duration * 2)
//     })

//     it('rejects when the inner function rejects', async () => {
//         const error = new Error('test error')

//         try {
//             await buildCancellablePromise(async () => {
//                 throw error
//             })
//             fail('Resolved.')
//         } catch (e) {
//             expect(e).toBe(error)
//         }
//     })

//     it('capture does not handle promise rejections', async () => {
//         const error = new Error('test error')

//         function callApi(): CancellablePromise<never> {
//             return CancellablePromise.reject(error)
//         }

//         try {
//             await buildCancellablePromise(async (capture) => {
//                 await capture(callApi())
//             })
//             fail('Resolved.')
//         } catch (e) {
//             expect(e).toBe(error)
//         }
//     })
// })
