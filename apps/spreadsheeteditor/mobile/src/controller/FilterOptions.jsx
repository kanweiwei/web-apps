import React, {Fragment, useEffect, Component} from 'react';
import FilterOptions from '../../src/view/FilterOptions';
import { f7,Sheet,Popover } from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
class FilterOptionsController extends Component {
    constructor(props) {
        super(props)
        this.onApiFilterOptions = this.onApiFilterOptions.bind(this)
    }
    onDocumentReady() {
        const api = Common.EditorApi.get();
        api.asc_registerCallback('asc_onSetAFDialog',this.onApiFilterOptions);
    }

    onApiFilterOptions() {
        const api = Common.EditorApi.get();
        let rect = api.asc_getCellCoord(),
        posX = rect.asc_getX() + rect.asc_getWidth() - 9,
        posY = rect.asc_getY() + rect.asc_getHeight() - 9;
        console.log(posX,posX)
    }

    componentDidMount() {
        if ( !Common.EditorApi ) {
            Common.Notifications.on({
                'document:ready': this.onDocumentReady
            });
        } else {
            this.onDocumentReady();
        }
    }

    componentWillUnmount() {
        Common.Notifications.off('document:ready', this.onDocumentReady);
        const api = Common.EditorApi.get();
        api.asc_unregisterCallback('asc_onShowPopMenu', this.onApiFilterOptions);
    }

    render() {
        return (
            <Popover id="picker-popover" onPopoverClosed={() =>this.props.onClickToCloseFilter()}>
                <FilterOptions/>
            </Popover>
        )
    }
}

export default FilterOptionsController;