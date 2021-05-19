import React, {Fragment, useEffect, useRef, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, ListButton, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';
const FilterOptions = ({style,listVal,onSort, onUpdateCell,dialog,onClearFilter,onDeleteFilter}) => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    // useEffect(() => {
    //     onUpdatesCell
    // },[])
    const [arrayCheck,setCheck] = useState(listVal)
    const [all, setAll] = useState(false);

    const Closes = () => {
        $$('[name="filter-cell"]:checked').length > 0 ? null : dialog.open()
    }

    // const handleChange= (e) => {
    //     // setCheck(arrayCheck.map((item) => item.cellvalue === e.target.value
    //     // ?{...item, check: e.target.checked} :item))
    //     let selectedCells = $$('[name="filter-cell"]:checked').length
    //     if(selectedCells == listVal.length) {
    //         setAll(true)
    //         onUpdateCell([])
    //         // listVal.map(value => value.check=true)
    //     } 
    //     if(e.target.name == "filter-cell") {
    //         if(selectedCells < listVal.length) {
    //             setAll(false)
    //        }
    //    }
    // //    onUpdateCell(listVal.value.id, e.target.checked)
    // }
    
    // onUpdateCell(arrayCheck)
    

    let selectedCells = $$('[name="filter-cell"]:checked').length
    
    if(listVal.length === selectedCells) {
        $$('[name="filter-cellAll"]').prop('checked', true);
    } else if(listVal.length > selectedCells){
        $$('[name="filter-cellAll"]').prop('checked', false);
    }
    const onUpdatesCell = (e) => {
        
        onUpdateCell([],e.target.checked)
    }
    
    const listValues = listVal.map((value) => 
    <ListItem onChange={e => onUpdateCell(value.id, e.target.checked)}  key={value.value} name='filter-cell' value={value.value} title={value.cellvalue} checkbox checked={value.check}></ListItem>)
    const selectAll = <ListItem onChange={onUpdatesCell} name='filter-cellAll' checkbox>Select All</ListItem>
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
               <ListButton color="black" className="item-link button-raised"  disabled id='button-clear-filter' onClick={() => onClearFilter()}>{_t.textClearFilter}</ListButton>
               <ListButton color="red" id='button-delete-filter' onClick={() => onDeleteFilter()} id="btn-delete-filter">{_t.textDeleteFilter}</ListButton>
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