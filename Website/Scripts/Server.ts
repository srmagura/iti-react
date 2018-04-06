import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { renderToString } from 'react-dom/server';

import { ReactViewModel } from 'Models';

import * as PageIndexUtil from 'Util/PageIndexUtil';

export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {
        const reactViewModel = JSON.parse(params.data) as ReactViewModel

        try {
            const html = renderToString(PageIndexUtil.getPage(reactViewModel))

            params.domainTasks.then(() => {
                resolve({ html })
            }, reject)
        } catch (error) {
            reject(error)
        }
    })
});
