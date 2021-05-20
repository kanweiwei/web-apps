import React, {useEffect, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, ListButton, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';

const FilterOptions = ({style,listVal,onSort, onUpdateCell,onClearFilter,onDeleteFilter}) => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});

    let selectedCells = (listVal.filter(item => item.check === true)).length,
    newArr=[];
    
    useEffect(() => {
        if(listVal.length === selectedCells) {
            setAll(true);
        } else if(listVal.length > selectedCells) {
            setAll(false);
        }
    })

    const [all, setAll] = useState(false);
    
    const onUpdatesCell = (e) => {
        if(e.target.checked) {
            setAll(true);
            newArr = listVal.map(item => item.check = true);
            onUpdateCell(newArr,e.target.checked);
        } else {
            setAll(false);
            onUpdateCell([],false);
        }
    }

    const HandleDeleteFilter = () => {
        onClearFilter();
        setAll(true);
        newArr = listVal.map(item => item.check = true);
        onUpdateCell(newArr, true);
    }
    
    const listValues = listVal.map((value) => 
    <ListItem onChange={e => onUpdateCell(value.id, e.target.checked)}  key={value.value} name='filter-cell' value={value.value} title={value.cellvalue} checkbox checked={value.check}></ListItem>);
    const selectAll = <ListItem onChange={onUpdatesCell} name='filter-cellAll' checkbox checked={all}>Select All</ListItem>;
    return (
        <View style={style}>
            <Page>
            <Navbar title={_t.textFilterOptions}>
            {Device.phone &&
                <NavRight>
                    <Link sheetClose=".picker__sheet">
                        <Icon icon='icon-expand-down'/>
                    </Link>
                </NavRight>
            }
           </Navbar>
           <List>
                <ListItem className='buttons'>
                    <Row>
                        <a className='button' onClick={() => onSort('sortdown')}>
                            <Icon slot="media" icon="sortdown"></Icon>
                        </a>
                        <a className='button' onClick={() => onSort('sortup')}>
                            <Icon slot="media" icon="sortup"></Icon>
                        </a>
                    </Row>
                </ListItem>
           </List>
           <List >
               <ListButton color="black" className="item-link button-raised"  disabled id='button-clear-filter' onClick={HandleDeleteFilter}>{_t.textClearFilter}</ListButton>
               <ListButton color="red" onClick={() => onDeleteFilter()} id="btn-delete-filter">{_t.textDeleteFilter}</ListButton>
           </List>
           <List>
               {selectAll}
               {listValues}
           </List>
            </Page>
        </View>
    )
}



export default FilterOptions