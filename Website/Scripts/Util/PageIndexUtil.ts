import { MetaViewModel } from 'Models';
import { pages } from 'Pages/PageIndex';
import * as UrlUtil from 'Util/UrlUtil';

export function getPage(metaViewModel: MetaViewModel) {
    if (!pages.hasOwnProperty(metaViewModel.Page))
        throw new Error(`Could not find ${metaViewModel.Page} in ViewIndex.ts.`);

    UrlUtil.setBaseUrl(metaViewModel.BaseUrl);

    return new (pages[metaViewModel.Page] as any)(metaViewModel.ViewModel) as React.DOMElement<any, any>;
}