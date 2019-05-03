import * as React from 'react'
import * as Loadable from 'react-loadable'

export function CustomLoadable<Props>(loader: () => Promise<React.ComponentType<Props>>) {
    return Loadable({
        loader,
        loading: (props: any) => {
            if (!props.error) return null

            return (
                <div className="react-loadable-error">
                    <div className="container">
                        <div className="alert alert-danger" role="alert">
                            Unable to load the page. Please check your internet connection
                            and refresh the page.
                        </div>
                    </div>
                </div>
            )
        }
    }) as React.ComponentType<Props>
}
