import * as React from 'react'
import { defaults, range } from 'lodash'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    CancellablePromise,
    pseudoCancellable,
    PSEUDO_PROMISE_CANCELLED
} from '@interface-technologies/iti-react'

interface Options {
    resolve?: boolean
    log?: boolean
}

function getPromise<T>(
    returnValue: T,
    duration: number,
    options?: Options
): CancellablePromise<T> {
    let { resolve, log } = defaults(options, { resolve: true, log: false })

    let timer: number | undefined

    const promise = new Promise<T>((resolveFn, reject) => {
        timer = window.setTimeout(() => {
            if (resolve) {
                if (log) console.log(`Resolved: ${returnValue}`)

                resolveFn(returnValue)
            } else {
                reject('Promise rejected for reason XYZ.')
            }
        }, duration)
    })

    const cancel = () => {
        window.clearTimeout(timer)
    }

    return new CancellablePromise(promise, cancel)
}

function beginTest(testName: string) {
    console.log(`===== TEST: ${testName} =====`)
}

function endTest() {
    console.log('SUCCESS')
}

function fail(reason: string) {
    throw new Error('Test failed: ' + reason)
}

async function basic() {
    beginTest('basic')

    const p = getPromise('5', 500)
    console.log('Created promise.')

    const x = await p

    if (x !== '5') fail(`Expected: '5'    Actual: '${x}'`)
    endTest()
}

async function errorCore(p: CancellablePromise<any>) {
    console.log('Created promise.')

    try {
        await p
        fail('Promise did not reject.')
    } catch (e) {
        console.log(`Promise rejected with reason: "${e}".`)
        endTest()
    }
}

async function error() {
    beginTest('error')
    await errorCore(getPromise('5', 500, { resolve: false }))
}

async function then() {
    beginTest('then')

    const p: CancellablePromise<number> = getPromise('5', 500).then(s => parseInt(s) * 2)
    console.log('Created promise.')

    const x = await p

    if (x !== 10) fail(`Expected: 10    Actual: ${x}`)
    endTest()
}

async function thenError() {
    beginTest('thenError')
    await errorCore(getPromise('5', 500, { resolve: false }).then(s => parseInt(s) * 2))
}

async function all() {
    beginTest('all')

    const d = 500

    const p0: CancellablePromise<0> = getPromise<0>(0, 1 * d, { log: true })
    const p1: CancellablePromise<1> = getPromise<1>(1, 2 * d, { log: true })
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
            p5
        ])
        const x6: [0, 1, 2, 3, 4, 5, 6] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6
        ])
        const x7: [0, 1, 2, 3, 4, 5, 6, 7] = await CancellablePromise.all([
            p0,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            p7
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
            p8
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
            p9
        ])
    }

    const x1: [0, 1] = await CancellablePromise.all([p0, p1])

    if (!(x1[0] === 0 && x1[1] === 1)) fail(`x = ${JSON.stringify(x1)}`)

    endTest()
}

async function allError() {
    beginTest('allError')

    const options = { resolve: false }

    // Test should finish after 500 ms
    await errorCore(
        CancellablePromise.all([
            getPromise(0, 500, options),
            getPromise(1, 10000, options)
        ])
    )
}

async function resolve() {
    beginTest('resolve')

    const x = await CancellablePromise.resolve<number>(7)

    if (x !== 7) fail(`Expected: 7    Actual: ${x}`)

    endTest()
}

async function resolveVoid() {
    beginTest('resolveVoid')

    const pVoid: CancellablePromise<void> = CancellablePromise.resolve()
    const pVoid2: CancellablePromise<void> = CancellablePromise.resolve<void>()

    try {
        await pVoid
        await pVoid2
    } catch (e) {
        fail('Promise rejected.')
    }

    endTest()
}

async function pseudoCancellableSuccess() {
    beginTest('pseudoCancellableSuccess')

    try {
        const number = await pseudoCancellable(Promise.resolve(1))
        if (number !== 1) fail('')
    } catch (e) {
        fail('Promise rejected.')
    }

    endTest()
}

async function pseudoCancellableCancelled() {
    beginTest('pseudoCancellableCancelled')

    try {
        const promise = pseudoCancellable(
            new Promise(resolve => setTimeout(resolve, 1000))
        )
        promise.cancel()
        await promise

        fail('Promise resolved when it should not have.')
    } catch (e) {
        if (e !== PSEUDO_PROMISE_CANCELLED) {
            fail(`Expected error to be "${PSEUDO_PROMISE_CANCELLED}" but was: ${e}`)
        }
    }

    endTest()
}

const tests: [string, () => {}][] = [
    ['Basic', basic],
    ['Error', error],
    ['Then', then],
    ['Then error', thenError],
    ['All', all],
    ['All error', allError],
    ['Resolve', resolve],
    ['Resolve void', resolveVoid],
    ['Pseudo cancellable success', pseudoCancellableSuccess],
    ['Pseudo cancellable cancelled', pseudoCancellableCancelled]
]

export class Page extends React.Component<PageProps> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Cancellable promise test',
            activeNavbarLink: NavbarLink.Index,
        })
    }

    runAll = async () => {
        for (const [label, func] of tests) {
            await func()
        }
    }

    render() {
        if (!this.props.ready) return null

        return (
            <div>
                <h1>Cancellable Promise Test</h1>
                <p>Check the console to see the results of the tests.</p>
                <p>
                    <button className="btn btn-primary" onClick={this.runAll}>
                        Run all tests
                    </button>
                </p>
                {tests.map((t, i) => {
                    const [label, func] = t

                    return (
                        <button className="btn btn-secondary mr-3" onClick={func} key={i}>
                            {label}
                        </button>
                    )
                })}
            </div>
        )
    }
}
