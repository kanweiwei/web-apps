import React, {Fragment, useEffect, useRef, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, ListButton, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';
const FilterOptions = ({style,listVal,onSort,configFilter, dialog,onClearFilter,onDeleteFilter}) => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    useEffect(() => {
        setCheck(listVal)
    },[listVal])
    const [arrayCheck,setCheck] = useState(listVal)

    const [all, setAll] = useState(false);
    const Closes = () => {
        $$('[name="filter-cell"]:checked').length > 0 ? null : dialog.open()
    }
    const onUpdateCell = (e) => {
        setCheck(arrayCheck.map((item) => item.cellvalue === e.target.value
        ?{...item, check: e.target.checked} :item))
        let selectedCells = $$('[name="filter-cell"]:checked').length
        if(selectedCells == listVal.length) {
            setAll(true)
        } 
       if(e.target.name == "filter-cell") {
            if(selectedCells < listVal.length) {
                setAll(false)
           }
       }
    //    if(true) {
    //     const api = Common.EditorApi.get();
    //     let arrCells = configFilter.asc_getValues()
    //         arrCells.forEach((item, index) => {
    //             item.asc_setVisible(arrayCheck[index])
    //         })
    //         configFilter.asc_getFilterObj().asc_setType(Asc.c_oAscAutoFilterTypes.Filters);
    //         api.asc_applyAutoFilter(configFilter);
    //    }
    }

    const onUpdatesCell = (e) => {
        setAll(e.target.checked)
        setCheck(arrayCheck.map((item) => ({...item, check: e.target.checked})))
    }
    const listValues = arrayCheck.map((value) => 
    <ListItem onChange={onUpdateCell}  key={value.value} name='filter-cell' value={value.value} title={value.cellvalue} checkbox checked={value.check}></ListItem>)
    const selectAll = <ListItem onChange={onUpdatesCell} name='filter-cellAll' checkbox checked={all}>Select All</ListItem>
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