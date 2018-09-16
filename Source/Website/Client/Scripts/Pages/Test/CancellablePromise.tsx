import * as React from 'react'
import { defaults } from 'lodash'
import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog,
    CancellablePromise
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
        timer = setTimeout(() => {
            if (resolve) {
                if (log) console.log(`Resolved: ${returnValue}`)

                resolveFn(returnValue)
            } else {
                reject('Promise rejected for reason XYZ.')
            }
        }, duration)
    })

    const cancel = () => {
        clearTimeout(timer)
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

async function all() {
    beginTest('all')

    const d = 500
    const options = { log: true }

    const p0: CancellablePromise<0> = getPromise<0>(0, 1 * d, options)
    const p1: CancellablePromise<1> = getPromise<1>(1, 2 * d, options)

    const x: [0, 1] = await CancellablePromise.all([p0, p1])

    if (!(x[0] === 0 && x[1] === 1)) fail(`x = ${JSON.stringify(x)}`)
    endTest()
}

async function resolve() {
    beginTest('resolve')

    const x = await CancellablePromise.resolve<number>(7)

    if (x !== 7) fail(`Expected: 7    Actual: ${x}`)
    endTest()
}

const tests: [string, () => {}][] = [
    ['Basic', basic],
    ['Error', error],
    ['Then', then],
    ['All', all],
    ['Resolve', resolve]
]

export class Page extends React.Component<IPageProps> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Cancellable promise test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-test-cancellablepromise'
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
