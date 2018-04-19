import { createServerRenderer } from 'aspnet-prerendering';
import { renderToString } from 'react-dom/server';

import { ReactViewModel } from 'Models';

import { getPage } from 'Util/Plumbing/GetPage';

export default createServerRenderer(async params => {
    const reactViewModel = JSON.parse(params.data) as ReactViewModel

    const page = await getPage(reactViewModel)
    const html = renderToString(page)

    await params.domainTasks
    return { html }
});
