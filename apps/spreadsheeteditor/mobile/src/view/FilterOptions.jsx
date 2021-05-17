import React, {Fragment, useEffect, useRef, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, ListButton, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';

// const FilterOptions = ({style,listVal,onSort, onUpdateCell, dialog,onClearFilter,onDeleteFilter}) => {
const FilterOptions = props => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});

    useEffect(() => {
        // setCheck(listVal)
    },[]);
    // const [arrayCheck,setCheck] = useState(listVal);

    const [all, setAll] = useState(false);

    const Closes = () => {
        // $$('[name="filter-cell"]:checked').length > 0 ? null : dialog.open()
    };

    const handleChange= (e) => {
       //  setCheck(arrayCheck.map((item) => item.cellvalue === e.target.value
       //  ?{...item, check: e.target.checked} :item))
       //  let selectedCells = $$('[name="filter-cell"]:checked').length
       //  if(selectedCells == listVal.length) {
       //      setAll(true)
       //  }
       //  if(e.target.name == "filter-cell") {
       //      if(selectedCells < listVal.length) {
       //          setAll(false)
       //     }
       // }
    };

    // onUpdateCell(arrayCheck);

    // const onUpdatesCell = (e) => {
    //     setAll(e.target.checked);
        // setCheck(arrayCheck.map((item) => ({...item, check: e.target.checked})))
    // };

    return (
        <View style={props.style}>
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
                        <a className='button' onClick={() => this.props.onSort('sortdown')}>
                            <Icon slot="media" icon="sortdown"></Icon>
                        </a>
                        <a className='button' onClick={() => this.props.onSort('sortup')}>
                            <Icon slot="media" icon="sortup"></Icon>
                        </a>
                    </Row>
                </ListItem>
           </List>
           <List >
               <ListButton color="black" className="item-link button-raised"  disabled id='button-clear-filter' onClick={() => this.props.onClearFilter()}>{_t.textClearFilter}</ListButton>
               <ListButton color="red" onClick={() => this.props.onDeleteFilter()} id="btn-delete-filter">{_t.textDeleteFilter}</ListButton>
           </List>
           <List>
               <ListItem onChange={e => this.props.onUpdateCell([])} name='filter-cellAll' checkbox checked={all}>Select All</ListItem>
                {props.listVal.map( value =>
                    <ListItem onChange={e => props.onUpdateCell(value.id, e.target.checked)}  key={value.value} name='filter-cell' value={value.value} title={value.cellvalue} checkbox checked={value.check}></ListItem>
                )}
           </List>
            </Page>
        </View>
    )
}



export default FilterOptions