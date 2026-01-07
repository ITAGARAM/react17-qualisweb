import React from 'react';
import './react-tag-input.style.css';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
    comma: 188,
    enter: [10, 13],
};

const delimiters = [...KeyCodes.enter];

class TagInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {
        const { tags } =this.props;
       this.props.addTag({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
       this.props.addTag({ tags: [...this.props.tags, tag] });
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.props.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
       this.props.addTag({ tags: newTags });
    }

    render() {
        const { tags } = this.props;
        return (
            <div>
                <ReactTags
                    tags={tags}
                    classNames={"form-control"}
                    // suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters}
                    placeholder={'Type & Press enter to add values'}
                    inputFieldPosition="top"
                />
            </div >
        )
    }
};
export default TagInput;