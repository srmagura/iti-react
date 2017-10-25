//import * as React from 'react';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { renderToString } from 'react-dom/server';

import { MetaViewModel } from 'Models';

import * as PageIndexUtil from 'Util/PageIndexUtil';

export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {
        const metaViewModel = JSON.parse(params.data) as MetaViewModel;

        try {
            const html = renderToString(PageIndexUtil.getPage(metaViewModel));

            params.domainTasks.then(() => {
                resolve({ html });
            }, reject);
        } catch (error) {
            reject(error);
        }
    });
});
