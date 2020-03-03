import React, { useContext } from 'react'
import { useRef } from 'react'
import { Pager } from './Pager'
import { SelectOption, ValidatedSelect } from '../Inputs'
import { getGuid } from '@interface-technologies/iti-react-core'
import { createAction, createReducer } from 'typesafe-actions'
import { ActionType } from 'typesafe-actions'
import { defaults, sortBy } from 'lodash'
import { ItiReactContext } from '../ItiReactContext'

const ALL = 'ALL'
const allPageSize = 10000

function getPageSizeOptions(pageSizes: number[], showAllOption: boolean): SelectOption[] {
    const options: SelectOption[] = sortBy(pageSizes, x => x).map(x => ({
        value: x,
        label: x.toString()
    }))

    if (showAllOption) options.push({ value: ALL, label: 'All' })

    return options
}

interface ConfigurablePagerProps {
    page: number
    pageSize: number
    onChange(page: number, pageSize: number): void

    totalPages: number
    enabled?: boolean

    pageSizes?: number[]
    showAllOption?: boolean
}

export function ConfigurablePager(props: ConfigurablePagerProps) {
    const itiReactContext = useContext(ItiReactContext)

    const {
        page,
        pageSize,
        onChange,
        totalPages,
        enabled,
        showAllOption,
        pageSizes
    } = defaults(
        { ...props },
        { showAllOption: false, pageSizes: itiReactContext.configurablePager.pageSizes }
    )

    const selectIdRef = useRef(getGuid())

    function dispatch(action: PageAction) {
        const updated = pageReducer({ page, pageSize }, action)

        onChange(updated.page, updated.pageSize)
    }

    return (
        <div className="pagination-container">
            <div className="configurable-pager">
                <label htmlFor={selectIdRef.current}>Items per page</label>
                <ValidatedSelect
                    id={selectIdRef.current}
                    name="pageSize"
                    value={pageSize === allPageSize ? ALL : pageSize}
                    onChange={pageSize => {
                        if (pageSize === ALL) {
                            dispatch(pageActions.showAllItems())
                        } else {
                            dispatch(pageActions.setPageSize(pageSize as number))
                        }
                    }}
                    options={getPageSizeOptions(pageSizes, showAllOption)}
                    showValidation={false}
                    validators={[]}
                    enabled={enabled}
                />
                <Pager
                    page={page}
                    onPageChange={page => dispatch(pageActions.setPage(page))}
                    totalPages={totalPages}
                    enabled={enabled}
                    containerClassName=""
                />
            </div>
        </div>
    )
}

//
//
//

export const pageActions = {
    setPage: createAction('SET_PAGE')<number>(),
    setPageSize: createAction('SET_PAGE_SIZE')<number>(),
    showAllItems: createAction('SHOW_ALL_ITEMS')()
}

type PageAction = ActionType<typeof pageActions>

export const pageReducer = createReducer<{ page: number; pageSize: number }, PageAction>(
    undefined as any
)
    .handleAction(pageActions.setPage, (state, action) => ({
        ...state,
        page: action.payload
    }))
    .handleAction(pageActions.setPageSize, (state, action) => {
        const firstVisibleItemIndex = getSkipTake(state.page, state.pageSize).skip
        const pageSize = action.payload

        return {
            page: Math.floor(firstVisibleItemIndex / pageSize) + 1,
            pageSize
        }
    })
    .handleAction(pageActions.showAllItems, () => ({
        page: 1,
        pageSize: allPageSize // for safety, limit the number of items that can be displayed
    }))

function getSkipTake(page: number, pageSize: number) {
    return {
        skip: (page - 1) * pageSize,
        take: pageSize
    }
}