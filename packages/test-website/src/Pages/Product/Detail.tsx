import { ReactElement, useState } from 'react'
import { api } from 'api'
import { NavbarLink } from 'Components'
import { Breadcrumbs, useSimpleQuery } from '@interface-technologies/iti-react'
import { useParams } from 'react-router-dom'
import { useReady } from 'Components/Routing'
import { ProductDto } from 'models'

export default function Page(): ReactElement | null {
    const { ready, onReady } = useReady()
    const params = useParams()
    const id = parseInt(params.id!)

    const [product, setProduct] = useState<ProductDto>()

    useSimpleQuery<number, ProductDto>({
        queryParams: id,
        query: (id) => api.product.get({ id }),
        shouldQueryImmediately: () => true,
        onResultReceived: (product) => {
            setProduct(product)

            onReady({
                title: product.name,
                activeNavbarLink: NavbarLink.Products,
            })
        },
    })

    if (!product) return null

    return (
        <div hidden={!ready}>
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
