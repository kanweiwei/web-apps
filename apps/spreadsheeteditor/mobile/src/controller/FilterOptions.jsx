import React, {useEffect,useState} from 'react';
import FilterOptions from '../../src/view/FilterOptions';
import { f7,Sheet,Popover, ListItem } from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
import { useTranslation } from 'react-i18next';
const FilterOptionsController = () => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    const [listVal, setListValue] = useState([])
    const [selectAll, setselectAll] = useState(null)
    const [dialogValue, setdialogValue] = useState(null)
    let indChecked = [],
        isValid = true
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
        setDataFilterCells(config)
        if (Device.phone) { 
            f7.sheet.open('.picker__sheet');
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
            if(idxs[throughIndex] == undefined) idxs[throughIndex] = item.asc_getVisible();

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
        indChecked = idxs;

        const listValues = arrCells.map((value) => 
        <ListItem key={value.value} value={value.id} name='filter-cell'  title={value.cellvalue} checkbox></ListItem>)
        setListValue(listValues)
        const selectAll = <ListItem name='filter-cellAll' checkbox>Select All</ListItem>
        setselectAll(selectAll)
        let $filterCell = $$('[name="filter-cell"]'),
            $filterCellAll = $$('[name="filter-cellAll"]')
            if(selectedCells === arrCells.length) {
                $filterCellAll.prop('checked', true);
                $filterCell.prop('checked', true);
            } else {
                arrCells.forEach((item,index) => {
                    $filterCell.eq(index).prop('checked',idxs[index])
                })
            }
        $$('.item-checkbox input[type="checkbox"]').on('click', updateCell.bind(null,config))
    }

    const updateCell = (config, e) => {
        const api = Common.EditorApi.get(); 
        let $filterCell = $$('[name="filter-cell"]'),
            $filterCellAll = $$('[name="filter-cellAll"]'),
            filterCellChecked = $$('[name="filter-cell"]:checked').length,
            filterCellCheckedAll = $$('[name="filter-cell"]').length
        if(e.target.name == "filter-cell") {
            if (filterCellChecked < filterCellCheckedAll) {
                $filterCellAll.prop('checked', false)
                filterCellChecked === 0 ? setdialogValue(true) : setdialogValue(false)
            } else if (filterCellChecked === filterCellCheckedAll) {
                $filterCellAll.prop('checked', true);
            }
            indChecked[e.target.value] = e.target.checked;
        }
        if(e.target.name == "filter-cellAll") {
            let checkAll = false;
            if(e.target.checked) {
                $filterCell.prop('checked', true)
                setdialogValue(false)
                checkAll = true
            } else {
                $filterCell.prop('checked', false)
                checkAll = false;
                filterCellChecked = 0
                setdialogValue(true)
            }
            indChecked.forEach((item,index) => {
                indChecked[index] = checkAll
            })
        }
        if(isValid) {
            let arrCells = config.asc_getValues()
            arrCells.forEach((item, index) => {
                item.asc_setVisible(indChecked[index])
            })
            config.asc_getFilterObj().asc_setType(Asc.c_oAscAutoFilterTypes.Filters);
            api.asc_applyAutoFilter(config);
        }
    }

    return (
        !Device.phone ?
        <Popover id="picker-popover">
            <FilterOptions style={{height: '410px'}} SortDown={SortDown} listVal={listVal} 
            selectAll={selectAll} dialogValue={dialogValue}/>
        </Popover> :
        <Sheet className="picker__sheet" push >
            <FilterOptions  SortDown={SortDown} listVal={listVal} 
            selectAll={selectAll} dialogValue={dialogValue}/>
        </Sheet>
    )
}

export default FilterOptionsController;