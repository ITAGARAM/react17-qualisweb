import React from 'react'
import { Breadcrumb } from 'react-bootstrap';
import { injectIntl } from 'react-intl'
import ScrollContainer from 'react-indiana-drag-scroll'

class BreadcrumbComponent extends React.Component {

    render() {
        return (
            <ScrollContainer className="breadcrumbs-scroll-container">
               <Breadcrumb className="filter-breadcrumbs">
                { this.props.breadCrumbItem && this.props.breadCrumbItem.map((item,index) => (
                    <Breadcrumb.Item key={index}>
                        <span>{item.label && this.props.intl.formatMessage({ id: item.label ? item.label : "" })}</span>
                        <span>{item.value}</span>
                    </Breadcrumb.Item>
                ))}
               </Breadcrumb>
            </ScrollContainer>

        )
    }
}
export default injectIntl(BreadcrumbComponent);