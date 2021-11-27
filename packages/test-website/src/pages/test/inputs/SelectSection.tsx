import { ReactElement, useState } from 'react'
import {
    ValidatedSelect,
    SelectValue,
    SelectValidators,
    ValidatedInput,
    getSelectStyles,
    ValidatedAsyncSelect,
    SelectOption,
    AsyncSelectValidators,
    AsyncSelectUtil,
    AsyncSelectValue,
    useFieldValidity,
    Validator,
} from '@interface-technologies/iti-react'
import { api } from 'api'
import { CSSObject } from '@emotion/serialize'
import { ControlProps, GroupBase } from 'react-select'
import { colorOptions, groupedOptionsWithoutFixed } from './SelectOptions'
import { CustomOption } from './CustomOption'
import { TestFormGroup } from './TestFormGroup'

interface SelectSectionProps {
    showValidation: boolean
}

// So that ValidatedSelect won't unnecessarily update
const noValidators: Validator<SelectValue>[] = []
const requiredValidators = [SelectValidators.required()]

export function SelectSection({ showValidation }: SelectSectionProps): ReactElement {
    async function loadSelectOptions(name: string): Promise<SelectOption[]> {
        const products = await api.product.list({
            name,
        })

        return products.map((p) => ({
            value: p.id,
            label: p.name,
        }))
    }

    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [selectValue1, setSelectValue1] = useState<SelectValue | null>(null)
    const [selectValue2, setSelectValue2] = useState<SelectValue | null>(null)
    const [asyncSelectValue7, setAsyncSelectValue7] = useState<AsyncSelectValue | null>(
        null
    )

    return (
        <div className="select-section">
            <TestFormGroup
                label={<>Not required &amp; show validation = false</>}
                valid={fieldValidity.select0}
            >
                {(id) => (
                    <div className="d-flex" style={{ width: 600 }}>
                        {/* Don't set className because we want to test setting width via the prop. */}
                        <ValidatedSelect
                            id={id}
                            name="select0"
                            options={colorOptions}
                            width={200}
                            showValidation={false}
                            validators={noValidators}
                            onValidChange={onChildValidChange}
                            isClearable
                        />
                        <select className="ms-2 form-control">
                            <option>Border color / width test</option>
                        </select>
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup label="Required and controlled" valid={fieldValidity.select1}>
                {(id) => (
                    <ValidatedSelect
                        id={id}
                        name="select1"
                        className="react-select"
                        options={colorOptions}
                        value={selectValue1}
                        onChange={setSelectValue1}
                        validators={requiredValidators}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label='Controlled with grouped options, menuPlacement="top"'
                valid={fieldValidity.select2}
            >
                {(id) => (
                    <ValidatedSelect
                        id={id}
                        name="select2"
                        className="react-select"
                        options={groupedOptionsWithoutFixed}
                        value={selectValue2}
                        onChange={setSelectValue2}
                        validators={requiredValidators}
                        isClearable
                        menuPlacement="top"
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup label="Disabled" valid={fieldValidity.select3}>
                {/* Don't set className because we want to test setting width via the prop. */}
                {(id) => (
                    <div className="d-flex">
                        <div className="me-3">
                            <ValidatedSelect
                                id={id}
                                name="select3"
                                options={colorOptions}
                                width={200}
                                validators={noValidators}
                                defaultValue={colorOptions[0].value}
                                showValidation={false}
                                onValidChange={onChildValidChange}
                                isClearable
                                enabled={false}
                            />
                        </div>
                        <ValidatedInput
                            name="disabledTest"
                            enabled={false}
                            defaultValue="Input for comparison"
                            validators={[]}
                            showValidation={false}
                        />
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Test 0 as a value + isLoading=true"
                valid={fieldValidity.select4}
            >
                {(id) => (
                    <ValidatedSelect
                        id={id}
                        name="select4"
                        className="react-select"
                        options={[
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                            { value: 2, label: '2' },
                        ]}
                        validators={[]}
                        isClearable
                        isLoading
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <div
                style={{
                    position: 'absolute',
                    backgroundColor: 'hsla(0,0%,0%, 0.5)',
                    color: 'white',
                    zIndex: 10,
                    padding: '0.5rem',
                }}
            >
                Make sure the select options display over top of this element (z-index=10)
            </div>
            {/* Because previous element has absolute positioning */}
            <div style={{ height: '4rem' }} />
            <TestFormGroup label="Custom option component" valid={fieldValidity.select5}>
                {(id) => (
                    <ValidatedSelect
                        id={id}
                        name="select5"
                        className="react-select"
                        options={colorOptions}
                        components={{ Option: CustomOption }}
                        validators={noValidators}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Custom styles and blue option disabled"
                valid={fieldValidity.select6}
            >
                {(id) => (
                    <ValidatedSelect
                        id={id}
                        name="select6"
                        className="react-select"
                        options={colorOptions}
                        getStyles={(options) => {
                            const defaultStyles = getSelectStyles(options)

                            return {
                                ...defaultStyles,
                                control: (
                                    base: CSSObject,
                                    props: ControlProps<
                                        SelectOption,
                                        boolean,
                                        GroupBase<SelectOption>
                                    >
                                ) => ({
                                    ...defaultStyles.control(base, props),
                                    backgroundColor: 'lemonchiffon',
                                }),
                            }
                        }}
                        isOptionEnabled={(option) => option.value !== 'blue'}
                        validators={noValidators}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup label="AsyncSelect required" valid={fieldValidity.select7}>
                {(id) => (
                    <ValidatedAsyncSelect
                        id={id}
                        name="select7"
                        className="react-select"
                        width={300}
                        loadOptions={loadSelectOptions}
                        value={asyncSelectValue7}
                        onChange={setAsyncSelectValue7}
                        placeholder={AsyncSelectUtil.getPlaceholder('products')}
                        noOptionsMessage={AsyncSelectUtil.getNoOptionsMessage('products')}
                        isClearable
                        aria-label="Select a product to add"
                        validators={[AsyncSelectValidators.required()]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
        </div>
    )
}
