import { ReactElement, useEffect } from 'react'
import { cleanUpImproperlyClosedDialog, IError } from '@interface-technologies/iti-react'
import { useReady } from 'components/routing'
import { ErrorType } from '_util/errorHandling'

interface ErrorPageProps {
    error: IError<ErrorType> | undefined
}

export default function Page({ error }: ErrorPageProps): ReactElement | null {
    const { onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Error',
            activeNavbarLink: undefined,
        })

        cleanUpImproperlyClosedDialog()
    }, [onReady])

    if (!error) return null

    return (
        <div>
            <div className="alert alert-danger" role="alert">
                {error.message}
            </div>
            <div>
                <h3>Diagnostic Information</h3>
                {error.diagnosticInfo}
            </div>
        </div>
    )
}
