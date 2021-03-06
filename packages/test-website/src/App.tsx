import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { MyErrorRouteSynchronizer, MyAsyncRouter } from 'components/routing'
import { ItiReactContext, ItiReactCoreContext } from '@interface-technologies/iti-react'
import { getItiReactCoreContextData, itiReactContextData } from 'components'
import { ReactElement } from 'react'
import { configureTestWebsiteStore } from '_redux'
import { queryClient } from 'api/util'
import { QueryClientProvider } from 'react-query'

const { store, runSideEffects } = configureTestWebsiteStore()
runSideEffects()

export function App(): ReactElement {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <ItiReactContext.Provider value={itiReactContextData}>
                        <ItiReactCoreContext.Provider
                            value={getItiReactCoreContextData(store.dispatch)}
                        >
                            <MyErrorRouteSynchronizer />
                            <MyAsyncRouter />
                        </ItiReactCoreContext.Provider>
                    </ItiReactContext.Provider>
                </QueryClientProvider>
            </Provider>
        </BrowserRouter>
    )
}
