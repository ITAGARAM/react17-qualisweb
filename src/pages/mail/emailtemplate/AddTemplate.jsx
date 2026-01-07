
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { Editor, EditorTools } from '@progress/kendo-react-editor';
import { Draggable } from 'react-drag-and-drop';
import { Grid, GridColumn,GridNoRecords } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const {
    Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
    ForeColor, BackColor, CleanFormatting,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Indent, Outdent, OrderedList, UnorderedList,
    Undo, Redo, FontSize, FontName, FormatBlock,
    Link, Unlink, InsertImage, ViewHtml,
    InsertTable, InsertFile,
    SelectAll, Print, Pdf,
    AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter,
    DeleteRow, DeleteColumn, DeleteTable,
    MergeCells, SplitCell
} = EditorTools;

class AddTemplate extends Component {
   render() {
    return (
        <Row>
            <Col md={6}>
                <Row>
                    <Col md={12}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                            name= "stemplatename"
                            type="text"
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                            value={this.props.selectedRecord["stemplatename"] ? this.props.selectedRecord["stemplatename"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_SUBJECT" })}
                            name= "ssubject"
                            type="text"
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SUBJECT" })}
                            value={this.props.selectedRecord["ssubject"] ?this.props.selectedRecord["ssubject"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={50}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_EMAILTAG" })}
                            name={"nemailtagcode"} 
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={this.props.selectedRecord ? this.props.selectedRecord["nemailtagcode"] : ""}
                            options={this.props.Tag}
                            optionId="nemailtagcode"
                            optionValue="stagname"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            as={"select"}
                            onChange={(event) => this.props.onComboChange(event, "nemailtagcode")} 
                        />
                    </Col>
                </Row>
            </Col>
            
            <Col md={6}>
                <Row>
                    <Col md={12}>
                        <Grid 
                            resizable
                            scrollable = "scrollable"
                            style={{height: '250px'}}
                            data={process(this.props.EmailTagParameter, { skip: 0, take:this.props.EmailTagParameter.length })}
                          
                        >
                              <GridNoRecords>
                            {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                        </GridNoRecords>
                             <GridColumn width="36px" s
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="text" data={row["dataItem"]}
                                                            >
                                                                <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                                            </Draggable>
                                                        </td>
                                                       
                                                    )}
                                                />
                            <GridColumn  title={this.props.intl.formatMessage({id:"IDS_EMAILTAGPARAMETER"})} 
                                 cell={(row) => (
                                     <td> 
                                            {row["dataItem"]}
                                    </td>
                             )}
                            />
                        </Grid>  

                    </Col>
                </Row>
            </Col>

            <Row Style={"padding:1.5em"}> 
                <Col md={12}>
                    <Editor
                        tools={[
                            [ Bold, Italic, Underline, Strikethrough ],
                            [ Subscript, Superscript ],
                            ForeColor, BackColor, [ CleanFormatting ],
                            [ AlignLeft, AlignCenter, AlignRight, AlignJustify ],
                            [ Indent, Outdent ],
                            [ OrderedList, UnorderedList ],
                            FontSize, FontName, FormatBlock,
                            [ SelectAll ],
                            [ Undo, Redo ],
                            [ Link, Unlink, InsertImage, ViewHtml ],
                            [ InsertTable, InsertFile ],
                            [ Pdf, Print ],
                            [ AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter ],
                            [ DeleteRow, DeleteColumn, DeleteTable ],
                            [ MergeCells, SplitCell ]
                        ]}
                        contentStyle={{ height: 210 }}
                        // defaultContent={props.value}
                        onChange={this.props.onkendoChange}
                        value={this.props.value}
                    />
                </Col>
            </Row>
        </Row>            
    );
}  
};

export default injectIntl(AddTemplate);