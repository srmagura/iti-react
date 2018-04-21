import * as React from 'react';
import { Title } from 'Components/Title';

interface IPageState {

}

export class Page extends React.Component<{}, IPageState> {
    render() {
        return <Title title="Index">
            <h3>Index</h3>
        </Title>
    }
}