import React, {useEffect,useState} from 'react';
import FilterOptions from '../../src/view/FilterOptions';
import { f7,Sheet,Popover } from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
import { useTranslation } from 'react-i18next';
const FilterOptionsController = () => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});

    const [listValue, setListValue] = useState([])
    let indChecked = []
    useEffect(() => {
        const onDocumentReady = () => {
            const api = Common.EditorApi.get();
            api.asc_registerCallback('asc_onSetAFDialog',onApiFilterOptions);
        }

        if ( !Common.EditorApi ) {
            Common.Notifications.on('document:ready',onDocumentReady);
        } else {
            onDocumentReady();
        }

        return () => { 
            Common.Notifications.off('document:ready', onDocumentReady);
            const api = Common.EditorApi.get();
            api.asc_unregisterCallback('asc_onSetAFDialog',onApiFilterOptions);
        }

    }, [])

    const onApiFilterOptions= (config) => {
        let rect = config.asc_getCellCoord(),
        posX = rect.asc_getX() + rect.asc_getWidth() - 9,
        posY = rect.asc_getY() + rect.asc_getHeight() - 9;
        if (Device.phone) { 
            f7.sheet.open('.picker__sheet');
            setDataFilterCells(config)
        } else {
            let $target = $$('#idx-context-menu-target')
                        .css({left: `${posX}px`, top: `${posY}px`})
            f7.popover.open('#picker-popover',$target)
        }
    }
    const SortDown = () => {
        const api = Common.EditorApi.get();
        console.log('Sort')
    }

    const setDataFilterCells = (config) => {
        function isNumeric(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }
        let value = null,
            isnumber = null,
            index =0,
            throughIndex = 0,
            selectedCells = 0,
            arrCells = [],
            idxs = []

        config.asc_getValues().forEach(function (item) {
            value = item.asc_getText()
            isnumber = isNumeric(value)
            if(idxs[throughIndex] == undefined) {
                idxs[throughIndex] = item.asc_getVisible();
            }

            arrCells.push({
                id              : index++,
                selected        : false,
                allowSelected   : true,
                cellvalue       : value ? value : _t.textEmptyItem,
                value           : isnumber ? value : (value.length > 0 ? value: _t.textEmptyItem),
                intval          : isnumber ? parseFloat(value) : undefined,
                strval          : !isnumber ? value : '',
                groupid         : '1',
                check           : idxs[throughIndex],
                throughIndex    : throughIndex
            })
            if (idxs[throughIndex]) selectedCells++;
            ++throughIndex;
        });
        setListValue(arrCells)
        indChecked = idxs;
    }
    return (
        !Device.phone ?
        <Popover id="picker-popover">
            <FilterOptions style={{height: '410px'}} SortDown={SortDown} listValue={listValue}/>
        </Popover> :
        <Sheet className="picker__sheet" push >
            <FilterOptions  SortDown={SortDown} listValue={listValue}/>
        </Sheet>
    )
}

export default FilterOptionsController;