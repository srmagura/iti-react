import * as React from 'react'

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

function getPromise(
    returnValue: string,
    duration: number,
    resolve = true
): CancellablePromise<string> {
    let timer: number | undefined

    const promise = new Promise<string>((resolveFn, reject) => {
        timer = setTimeout(() => {
            if (resolve) {
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

async function error() {
    beginTest('error')

    const p = getPromise('5', 500, false)
    console.log('Created promise.')

    try {
        await p
        fail('Promise did not reject.')
    } catch (e) {
        console.log(`Promise rejected with reason: "${e}".`)
        endTest()
    }
}

async function then() {
    beginTest('then')

    const p: CancellablePromise<number> = getPromise('5', 500).then(s => parseInt(s) * 2)
    console.log('Created promise.')

    const x = await p

    if (x !== 10) fail(`Expected: 10    Actual: ${x}`)
    endTest()
}

export class Page extends React.Component<IPageProps> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Cancellable promise test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-test-cancellablepromise'
        })
    }

    render() {
        if (!this.props.ready) return null

        const tests: [string, () => {}][] = [
            ['Basic', basic],
            ['Error', error],
            ['Then', then]
        ]

        return (
            <div>
                <h1>Cancellable Promise Test</h1>
                <p>Check the console to see the results of the tests.</p>
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
