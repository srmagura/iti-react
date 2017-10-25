import * as React from 'react';
import * as BrowserUtil from 'Util/BrowserUtil';
import * as $ from 'jquery';

interface IAntiForgeryTokenState {
    token: string;
}

export class AntiForgeryToken extends React.Component<any, any> {

    state = {
        token: ''
    };

    constructor(props: any) {
        super(props);

        // Can only do this if we're in the browser
        BrowserUtil.documentReady(() => {
            this.setState({ token: $('input[name=__RequestVerificationToken]').val() });
        });
    }

    render() {
        return (
            <input type="hidden" name="__RequestVerificationToken" value={this.state.token} />
        );
    }
}