import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '_Redux'
import { MyAsyncRouter } from 'Components/Routing/MyAsyncRouter'
import { UserGuard, MyErrorRouteSynchronizer } from 'Components/Routing'
import { ItiReactContext, ItiReactCoreContext } from '@interface-technologies/iti-react'
import { getItiReactCoreContextData, itiReactContextData } from 'Components'
import { ReactElement } from 'react'

export function App(): ReactElement {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <ItiReactContext.Provider value={itiReactContextData}>
                    <ItiReactCoreContext.Provider
                        value={getItiReactCoreContextData(store.dispatch)}
                    >
                        <MyErrorRouteSynchronizer />
                        <UserGuard>
                            <MyAsyncRouter />
                        </UserGuard>
                    </ItiReactCoreContext.Provider>
                </ItiReactContext.Provider>
            </Provider>
        </BrowserRouter>
    )
}
