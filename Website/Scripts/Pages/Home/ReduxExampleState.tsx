import { createStore } from 'redux';
import { Action } from 'Util/Action';

/* Each page defines its own Redux state in a separate file. 
 *
 * Recommended to use Redux sparingly, because it takes more code than component state
 * and breaks encapsulation. Use it only for communication between components that do not
 * have a close common ancestor.
 */


export interface IState {
    numberOfClicks: number;
}

const defaultState: IState = {
    numberOfClicks: 0
}

const INCREMENT_CLICKS = 'INCREMENT_CLICKS';
type INCREMENT_CLICKS = void;

export function incrementClicks(): Action<INCREMENT_CLICKS> {
    return {
        type: INCREMENT_CLICKS,
        payload: undefined
    };
}

function reducer(state: IState = defaultState, action: Action<any>): IState {
    switch(action.type) {
        case INCREMENT_CLICKS:
            {
                // Need to downcast to get the right type
                const payload = action.payload as INCREMENT_CLICKS;
                return { ...state, numberOfClicks: state.numberOfClicks + 1 };
            }
    }

    return state;
}

export const store = createStore(reducer);