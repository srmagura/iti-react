import { ReactElement, useState } from 'react'
import {
    Pager,
    FormCheck,
    ConfigurablePager,
    getTotalPages,
    FormGroup,
} from '@interface-technologies/iti-react'

export function PagerSection(): ReactElement {
    return (
        <>
            <NormalPagerSection />
            <ConfigurablePagerSection />
        </>
    )
}

function NormalPagerSection(): ReactElement {
    const [enabled, setEnabled] = useState(true)
    const [totalPages, setTotalPages] = useState(10)
    const [page, setPage] = useState(1)

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Pager</h5>
                <div className="d-flex">
                    <FormGroup label="Total pages" className="me-4">
                        {(id) => (
                            <input
                                id={id}
                                className="form-control"
                                style={{ width: '100px' }}
                                value={totalPages.toString()}
                                onChange={(e) => {
                                    const v = e.currentTarget.value
                                    setTotalPages(
                                        !Number.isNaN(parseInt(v)) ? parseInt(v) : 0
                                    )
                                }}
                            />
                        )}
                    </FormGroup>
                    <FormGroup
                        label={<>&nbsp;</>}
                        className="form-group-horizontal-with-checkbox"
                    >
                        <FormCheck
                            checked={enabled}
                            onChange={() => setEnabled((b) => !b)}
                            label="Enabled"
                        />
                    </FormGroup>
                </div>
                <Pager
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    enabled={enabled}
                />
            </div>
        </div>
    )
}

function ConfigurablePagerSection(): ReactElement {
    const [enabled, setEnabled] = useState(true)
    const [totalItems, setTotalItems] = useState(123)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showAllOption, setShowAllOption] = useState(false)

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">ConfigurablePager</h5>
                <div className="d-flex">
                    <FormGroup label="Total items" className="me-4">
                        {(id) => (
                            <input
                                id={id}
                                className="form-control"
                                style={{ width: '100px' }}
                                value={totalItems.toString()}
                                onChange={(e) => {
                                    const v = e.currentTarget.value
                                    setTotalItems(
                                        !Number.isNaN(parseInt(v)) ? parseInt(v) : 0
                                    )
                                }}
                            />
                        )}
                    </FormGroup>
                    <FormGroup
                        label={<>&nbsp;</>}
                        className="form-group-horizontal-with-checkbox me-4"
                    >
                        <FormCheck
                            checked={showAllOption}
                            onChange={() => setShowAllOption((b) => !b)}
                            label="Show all option"
                        />
                    </FormGroup>
                    <FormGroup
                        label={<>&nbsp;</>}
                        className="form-group-horizontal-with-checkbox"
                    >
                        <FormCheck
                            checked={enabled}
                            onChange={() => setEnabled((b) => !b)}
                            label="Enabled"
                        />
                    </FormGroup>
                </div>
                <ConfigurablePager
                    page={page}
                    pageSize={pageSize}
                    totalPages={getTotalPages(totalItems, pageSize)}
                    onChange={(page, pageSize) => {
                        setPage(page)
                        setPageSize(pageSize)
                    }}
                    enabled={enabled}
                    showAllOption={showAllOption}
                />
            </div>
        </div>
    )
}
