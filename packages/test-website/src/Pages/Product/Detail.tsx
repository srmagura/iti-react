﻿import React from 'react'
import { ProductDto } from 'Models'
import { PageProps } from 'Components/Routing/RouteProps'
import { api } from 'Api'
import { NavbarLink } from 'Components'
import { Breadcrumbs } from '@interface-technologies/iti-react'
import { CancellablePromise } from 'real-cancellable-promise'

interface PageState {
    product?: ProductDto
}

export default class Page extends React.Component<PageProps, PageState> {
    state: PageState = {}

    ajaxRequest?: CancellablePromise<any>

    async componentDidMount() {
        const { match, onReady, onError } = this.props

        const id = match.params.id as number

        try {
            const product = await (this.ajaxRequest = api.product.get({ id }))

            this.setState({ product })

            onReady({
                title: product.name,
                activeNavbarLink: NavbarLink.Products,
            })
        } catch (e) {
            onError(e)
        }
    }

    render() {
        if (!this.props.ready) return null

        const { product } = this.state

        if (!product) return null

        return (
            <div>
                <Breadcrumbs
                    items={[
                        { path: '/product/list', label: 'Products' },
                        { path: `/product/detail/${product.id}`, label: product.name },
                    ]}
                />
                <h3>{product.name}</h3>
                <p>ID: {product.id}</p>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }
}