import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Page as HomeIndex } from 'Pages/Home/Index';
import { Page as HomePage1 } from 'Pages/Home/Page1';
import { Page as HomePage2 } from 'Pages/Home/Page2';

export const routes = <Layout>
    <Route exact path='/' component={HomeIndex} />
    <Route exact path='/page1' component={HomePage1} />
    <Route exact path='/page2' component={HomePage2} />
</Layout>
