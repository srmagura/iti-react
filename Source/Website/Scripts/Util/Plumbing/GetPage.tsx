import * as React from 'react';
import { ReactViewModel } from 'Models';
import * as UrlUtil from 'Util/UrlUtil';
import {pageBootstrap} from 'Util/Plumbing/PageBootstrap';

export async function getPage(reactViewModel: ReactViewModel): Promise<React.ReactElement<any>> {
    const [controller, action] = reactViewModel.page.split('.')

    pageBootstrap(reactViewModel)

    const module = await import(`Pages/${controller}/${action}`)

    const Page = module.Page
    return <Page model={reactViewModel.viewModel as any} /> as React.ReactElement<any>
}