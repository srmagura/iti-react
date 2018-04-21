import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Routes as HomeRoutes } from 'Pages/Home/Routes';

export const routes = <Layout>
    <HomeRoutes />
</Layout>
