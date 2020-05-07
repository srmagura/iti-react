import React, { useState } from 'react'
import {
    Pager,
    FormCheck,
    ConfigurablePager,
    getTotalPages,
} from '@interface-technologies/iti-react'

export function PagerSection() {
    return (
        <>
            <NormalPagerSection />
            <ConfigurablePagerSection />
        </>
    )
}

function NormalPagerSection() {
    const [enabled, setEnabled] = useState(true)
    const [totalPages, setTotalPages] = useState(10)
    const [page, setPage] = useState(1)

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-flex">
                    <div className="form-group mr-4">
                        <label>Total pages</label>
                        <input
                            className="form-control"
                            style={{ width: '100px' }}
                            value={totalPages.toString()}
                            onChange={(e) => {
                                const v = e.currentTarget.value
                                setTotalPages(!isNaN(parseInt(v)) ? parseInt(v) : 0)
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="d-block">&nbsp;</label>
                        <FormCheck
                            checked={enabled}
                            onChange={() => setEnabled((b) => !b)}
                            label="Enabled"
                        />
                    </div>
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

function ConfigurablePagerSection() {
    const [enabled, setEnabled] = useState(true)
    const [totalItems, setTotalItems] = useState(123)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showAllOption, setShowAllOption] = useState(false)

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-flex">
                    <div className="form-group mr-4">
                        <label>Total items</label>
                        <input
                            className="form-control"
                            style={{ width: '100px' }}
                            value={totalItems.toString()}
                            onChange={(e) => {
                                const v = e.currentTarget.value
                                setTotalItems(!isNaN(parseInt(v)) ? parseInt(v) : 0)
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="d-block">&nbsp;</label>
                        <FormCheck
                            checked={showAllOption}
                            onChange={() => setShowAllOption((b) => !b)}
                            label="Show all option"
                        />
                    </div>
                    <div className="form-group">
                        <label className="d-block">&nbsp;</label>
                        <FormCheck
                            checked={enabled}
                            onChange={() => setEnabled((b) => !b)}
                            label="Enabled"
                        />
                    </div>
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
