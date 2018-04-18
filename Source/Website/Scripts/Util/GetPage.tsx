import * as React from 'react';
import { ReactViewModel } from 'Models';
import * as UrlUtil from 'Util/UrlUtil';

export async function getPage(metaViewModel: ReactViewModel): Promise<React.ReactElement<any>> {
    const [controller, action] = metaViewModel.page.split('.')

    UrlUtil.setBaseUrl(metaViewModel.baseUrl)

    const module = await import(`Pages/${controller}/${action}`)

    const Page = module.Page
    return <Page model={metaViewModel.viewModel as any} /> as React.ReactElement<any>
}