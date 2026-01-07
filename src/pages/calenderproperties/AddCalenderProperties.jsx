import React from 'react';
import FormInput from '../../components/form-input/form-input.component';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';


class AddCalenderProperties extends React.Component {

    render() {

        let list = [64, 63, 62, 61, 60, 48, 47, 41, 40, 39, 22, 18, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1]
        let view = [{ label: "Month", value: "month" },
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Agenda", value: "agenda" },
        { label: "TimeLine", value: "timeline" }
        ]

        let week = [{ label: "Sunday", value: "0" },
        { label: "Monday", value: "1" },
        { label: "Tuesday", value: "2" },
        { label: "Wednesday", value: "3" },
        { label: "Thursday", value: "4" },
        { label: "Friday", value: "5" },
        { label: "Saturday", value: "6" },
        ]

        let slotDivision = this.props.masterData.filter(x => x.ncalendersettingcode === 39).length > 0 ?
            [...(this.props.masterData.filter(x => x.ncalendersettingcode === 39)[0])["scalendersettingvalue"].split(",")].map(y => {

                return { "label": y, "value": y }

            }) : [1, 2, 3, 4];
        let slotDurivation = this.props.masterData.filter(x => x.ncalendersettingcode === 39).length > 0 ? [...(this.props.masterData.filter(x => x.ncalendersettingcode === 40)[0])["scalendersettingvalue"].split(",")].map(y => {

            return { "label": y, "value": y }

        }) : [15, 30, 45, 60];

        return (
            <Row>
                <Col md={6}>
                    <FormInput
                        label={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGNAME" })}
                        name={"scalendersettingname"}
                        type="text"
                        onChange={(event) => this.props.onInputOnChange(event)}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGNAME" })}
                        value={this.props.selectedRecord["scalendersettingname"]}
                        isMandatory={false}
                        required={false}
                        maxLength={100}
                    />
                </Col>
                <Col md={6}>
                    {list.some(x => x === this.props.selectedRecord.ncalendersettingcode) ?

                        this.props.selectedRecord.ncalendersettingcode === 11 ||
                            this.props.selectedRecord.ncalendersettingcode === 9 ||
                            this.props.selectedRecord.ncalendersettingcode === 8 ?

                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGVALUE" })}
                                name={"scalendersettingvalue"}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                value={this.props.selectedRecord["scalendersettingvalue"] ? this.props.selectedRecord.ncalendersettingcode === 9 ?
                                    slotDivision.filter(x => x.value === this.props.selectedRecord["scalendersettingvalue"])
                                    : this.props.selectedRecord.ncalendersettingcode === 8 ?
                                        slotDurivation.filter(x => x.value === this.props.selectedRecord["scalendersettingvalue"])
                                        : view.filter(x => x.value === this.props.selectedRecord["scalendersettingvalue"]) : ""}

                                options={this.props.selectedRecord.ncalendersettingcode === 9 ?
                                    slotDivision :
                                    this.props.selectedRecord.ncalendersettingcode === 8 ?
                                        slotDurivation :
                                        view}
                                isMandatory={false}
                                isMulti={false}
                                isClearable={true}
                                isSearchable={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                as={"select"}
                                onChange={(event) => this.props.onComboChange(event.value, "scalendersettingvalue")}

                            />
                            : this.props.selectedRecord.ncalendersettingcode === 47 || this.props.selectedRecord.ncalendersettingcode === 48 ?


                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGVALUE" })}
                                    name={"scalendersettingvalue"}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    value={this.props.selectedRecord["scalendersettingvalue"] ?
                                        week.filter(x => x.value === this.props.selectedRecord["scalendersettingvalue"]) : ""}
                                    options={week}
                                    isMandatory={false}
                                    isMulti={false}
                                    isClearable={true}
                                    isSearchable={false}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                    as={"select"}
                                    onChange={(event) => this.props.onComboChange(event.value, "scalendersettingvalue")}

                                />

                                :

                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGVALUE" })}
                                    name={"scalendersettingvalue"}
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGVALUE" })}
                                    value={this.props.selectedRecord["scalendersettingvalue"]}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={100}
                                />

                        :

                        <CustomSwitch
                            label={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGVALUE" })}
                            type="switch"
                            name={"scalendersettingvalue"}
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_CALENDERSETTINGVALUE" })}
                            defaultValue={this.props.selectedRecord ? parseInt(this.props.selectedRecord["scalendersettingvalue"]) === transactionStatus.YES ? true : false : false}
                            isMandatory={false}
                            required={false}
                            checked={this.props.selectedRecord ? parseInt(this.props.selectedRecord["scalendersettingvalue"]) === transactionStatus.YES ? true : false : false}
                            disabled={false}
                        >
                        </CustomSwitch>

                    }

                </Col>


            </Row>


        )
    }

}

export default injectIntl(AddCalenderProperties);