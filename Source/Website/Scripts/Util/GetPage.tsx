import * as React from 'react';
import { ReactViewModel } from 'Models';
import * as UrlUtil from 'Util/UrlUtil';

export async function getPage(metaViewModel: ReactViewModel): Promise<React.ReactElement<any>> {
    const [controller, action] = metaViewModel.Page.split('.')

    UrlUtil.setBaseUrl(metaViewModel.BaseUrl)

    const module = await import(`Pages/${controller}/${action}`)

    const Page = module.Page
    return <Page model={metaViewModel.ViewModel as any} /> as React.ReactElement<any>
}