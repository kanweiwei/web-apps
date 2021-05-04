import React, {Fragment, useState} from 'react';
import {f7, List, Sheet, ListItem, Icon, Row, Button, Page, Navbar, Segmented, BlockTitle, NavRight, Link, Toggle,View} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../common/mobile/utils/device';
const FilterOptions = (props) => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    const [check, setCheck] = useState(false)
    return (
        <View style={props.style}>
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
                        <a className='button no-ripple' onClick={props.SortDown}>
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
               <ListItem>{_t.textDeleteFilter}</ListItem>
           </List>
           <List>
               <ListItem radio checked={check} onClick={() => setCheck(!check)}>Select All</ListItem>
               <ListItem radio checked={check} onClick={() => setCheck(!check)}></ListItem>
           </List>
            </Page>
        </View>
    )
}



export default FilterOptions