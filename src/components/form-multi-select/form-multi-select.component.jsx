import React from 'react';
import MultiSelect from 'react-multi-select-component';
import { MultiSelectWrap } from '../form-multi-select/form-multi-select.styles';
import { Form } from 'react-bootstrap';
import { injectIntl } from 'react-intl';

function FormMultiSelect({ 
    name,
    className,
    isMandatory,
    errors,
    ClearIcon,
    label,
    ClearSelectedIcon,
    disableSearch,
    disabled,
    ArrowRenderer,
    focusSearchOnOpen,
    optionId,
    optionValue,
    options,
    value,
    onChange,
    isInvalid,
    allItemSelectedLabel,
    noOptionsLabel,
    searchLabel,
    selectAllLabel,
    ...props

    }) {
        //ALPD-3356
        const filterOptions =  (options, filter) => {
            const filteredOptions = options.filter(option =>
                option.label && option.label.toLowerCase().includes(filter.toLowerCase())
            );
            return filteredOptions;
          };
    return (
        <React.Fragment>
            <Form.Group className="floating-label">
                <MultiSelectWrap>
                    <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
                    <MultiSelect
                        //options={options}
                        options={
                                Object.values((props.sortField ? (
                                        (props.sortOrder  === "ascending" ?
                                                options.sort((itemA, itemB) => itemA[props.sortField] < itemB[props.sortField] ? -1 : 1) 
                                                : options.sort((itemA, itemB) => itemA[props.sortField] > itemB[props.sortField] ? -1 : 1) )
                                    )
                                    : (props.alphabeticalSort ?
                                        options.sort((itemA, itemB) => itemA[optionValue] < itemB[optionValue] ? -1 : 1) : options)
                                    
                                )
                                ).map(item => {
                                    return { label: item[optionValue], value: item[optionId], item: item }
                                })}
                        value={value}
                        onChange={onChange}
                        labelledBy={"Select"}
                        name={name}
                        className={"multi-select-dropdown"}
                        isMandatory={isMandatory}
                        label={label}
                        errors={errors}
                        ClearIcon={ClearIcon}
                        ClearSelectedIcon={ClearSelectedIcon}
                        disableSearch={disableSearch}
                        disabled={disabled}
                        focusSearchOnOpen={true}
                        ArrowRenderer={ArrowRenderer}
                        isInvalid={isInvalid}
                        filterOptions={filterOptions}
                        overrideStrings={{"allItemsAreSelected":props.intl.formatMessage({ id: "IDS_ALLITEMSAREMSELECTED" }),
                        "noOptions":props.intl.formatMessage({ id: "IDS_NOOPTIONS" }),
                        "search":props.intl.formatMessage({ id: "IDS_SEARCH" }),
                        "selectAll": props.intl.formatMessage({ id: "IDS_SELECTALL" }),
                        "selectSomeItems":props.placeholder?props.placeholder: props.intl.formatMessage({ id: "IDS_SELECT..." }),
                        }}
                    />
                </MultiSelectWrap>

                <Form.Control.Feedback type="invalid">
                    { errors }
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    );
}
export default injectIntl(FormMultiSelect);