import React, {Fragment, useEffect, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, ListButton, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';
const FilterOptions = ({style,listVal,selectAll,onSort,dialog,onClearFilter,onDeleteFilter}) => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    
    const Closes = () => {
        $$('[name="filter-cell"]:checked').length > 0 ? null : dialog.open()
    }
    return (
        <View style={style}>
            <Page>
            <Navbar title={_t.textFilterOptions}>
            {Device.phone &&
                <NavRight>
                    <Link sheetClose=".picker__sheet" onClick={Closes}>
                        <Icon icon='icon-expand-down'/>
                    </Link>
                </NavRight>
            }
           </Navbar>
           <List>
                <ListItem className='buttons'>
                    <Row>
                        <a className='button no-ripple' onClick={() => onSort('sortdown')}>
                            <Icon slot="media" icon="sortdown"></Icon>
                        </a>
                        <a className='button' onClick={() => onSort('sortup')}>
                            <Icon slot="media" icon="sortup"></Icon>
                        </a>
                    </Row>
                </ListItem>
           </List>
           <List >
               <ListButton color="black" className="item-link button-raised"  disabled id='button-clear-filter' onClick={() => onClearFilter()}>{_t.textClearFilter}</ListButton>
               <ListButton color="red" id='button-delete-filter' onClick={() => onDeleteFilter()} id="btn-delete-filter">{_t.textDeleteFilter}</ListButton>
           </List>
           <List>
           {selectAll}
            {listVal}
           </List>
            </Page>
        </View>
    )
}



export default FilterOptions