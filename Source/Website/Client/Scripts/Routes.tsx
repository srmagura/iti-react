import * as React from 'react';
import { Route } from 'react-router-dom';
//import { Layout } from './components/Layout';
import { Comp } from 'Comp';

function Layout(props: any) {
    return <div>{props.children}</div>
}

export const routes = <Layout>
    <Route exact path='/' component={Comp } />
</Layout>;
