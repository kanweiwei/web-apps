import React, {Fragment, useEffect, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';
const FilterOptions = ({style,listValue,selectedCells,SortDown}) => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    const [check, setCheck] = useState(true)
    const updateCell = (e) => {
        setCheck(!check)
    }
    const listValues = listValue.map((value) => 
        <ListItem key={value.value} name={`filter-cell`} title={value.cellvalue} value={value.value} change={() => updateCell()} radio checked={check}></ListItem>
    )
    console.log(listValue)
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
                        <a className='button no-ripple' onClick={SortDown}>
                            <Icon slot="media" icon="sortdown"></Icon>
                        </a>
                        <a className='button'>
                            <Icon slot="media" icon="sortup"></Icon>
                        </a>
                    </Row>
                </ListItem>
           </List>
           <List>
               <ListItem>{_t.textClearFilter}</ListItem>
               <ListItem id="btn-delete-filter">{_t.textDeleteFilter}</ListItem>
           </List>
           <List>
               <ListItem radio checked={check} onClick={() => setCheck(!check)}>Select All</ListItem>
               {listValues}
           </List>
            </Page>
        </View>
    )
}



export default FilterOptions