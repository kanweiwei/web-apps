import React, {useEffect,useState} from 'react';
import FilterOptions from '../../src/view/FilterOptions';
import { f7,Sheet,Popover, ListItem } from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
import { useTranslation } from 'react-i18next';
const FilterOptionsController = () => {
    const { t } = useTranslation();
    const _t = t('View.Edit', {returnObjects: true});
    const [configFilter, setConfig] = useState(null)
    const [listVal, setListValue] = useState([])
    const [arrayChecked, setChecked] = useState([])
    const dialog = f7.dialog.create({
        title: _t.textErrorTitle,
        text: _t.textErrorMsg,
        buttons: [
            {
                text: 'OK',
            }
        ]
    })
    let indChecked = [],
        isValid = true

    useEffect(() => {
        function onDocumentReady()  {
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
        setConfig(config)
        setClearDisable(config)
        if (Device.phone) { 
            f7.sheet.open('.picker__sheet');
        } else {
            let $target = $$('#idx-context-menu-target')
                        .css({left: `${posX}px`, top: `${posY}px`})
            f7.popover.open('#picker-popover',$target)
        }
        $$('#picker-popover').on('popover:closed', () => $$('[name="filter-cell"]:checked').length > 0 ? null : dialog.open())
    }

    const onSort = (type) => {
        const api = Common.EditorApi.get();
        api.asc_sortColFilter(type == 'sortdown' ? Asc.c_oAscSortOptions.Ascending : Asc.c_oAscSortOptions.Descending, configFilter.asc_getCellId(), configFilter.asc_getDisplayName(), undefined, true);
    }
    
    const onClearFilter = () => {
        const api = Common.EditorApi.get();
        if(api) api.asc_clearFilter();
        for(let i=0; i < arrayChecked.length; i++) {
            arrayChecked[i] = true;
        }
        // setChecked(arrayChecked)
        $$('[name="filter-cell"]').prop('checked', true);
        $$('[name="filter-cellAll"]').prop('checked', true);
    }

    const onDeleteFilter = () => {
        const api = Common.EditorApi.get();
        let formatTableInfo = api.asc_getCellInfo().asc_getFormatTableInfo();
        let tablename = (formatTableInfo) ? formatTableInfo.asc_getTableName() : undefined;
        if(api) {
            api.asc_changeAutoFilter(tablename, Asc.c_oAscChangeFilterOptions.filter, false);
            f7.sheet.close('.picker__sheet');
            f7.popover.close('#picker-popover')
        }
    }

    const setClearDisable = (config) => {
        let $clearFilter = $$("#button-clear-filter");
        let arr = config.asc_getValues();
        let lenCheck = arr.filter((item) => {return item.visible == true}).length
        lenCheck == arr.length ?  $clearFilter.addClass('disabled') : $clearFilter.removeClass('disabled') 
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
        setListValue(arrCells)
        indChecked = idxs;
        setChecked(idxs)
        // let $filterCell = $$('[name="filter-cell"]'),
        //     $filterCellAll = $$('[name="filter-cellAll"]')
        //     if(selectedCells === arrCells.length) {
        //         $filterCellAll.prop('checked', true);
        //         $filterCell.prop('checked', true);
        //     } else {
        //         arrCells.forEach((item,index) => {
        //             $filterCell.eq(index).prop('checked',idxs[index])
        //         })
        //     }
        // $$('.item-checkbox input[type="checkbox"]').on('click', updateCell.bind(null,config))
    }

    // const updateCell = (config, e) => {
    //     const api = Common.EditorApi.get(); 
    //     let $filterCell = $$('[name="filter-cell"]'),
    //         $filterCellAll = $$('[name="filter-cellAll"]'),
    //         filterCellChecked = $$('[name="filter-cell"]:checked').length,
    //         filterCellCheckedAll = $$('[name="filter-cell"]').length
    //     if(e.target.name == "filter-cell") {
    //         if (filterCellChecked < filterCellCheckedAll) {
    //             $filterCellAll.prop('checked', false)
    //         } else if (filterCellChecked === filterCellCheckedAll) {
    //             $filterCellAll.prop('checked', true);
    //         }
    //         indChecked[e.target.value] = e.target.checked;
    //     }
    //     if(e.target.name == "filter-cellAll") {
    //         let checkAll = false;
    //         if(e.target.checked) {
    //             $filterCell.prop('checked', true)
    //             checkAll = true
    //         } else {
    //             $filterCell.prop('checked', false)
    //             checkAll = false;
    //             isValid = false;
    //             filterCellChecked = 0
    //         }
    //         indChecked.forEach((item,index) => {
    //             indChecked[index] = checkAll
    //         })
    //     }
    //     setChecked(indChecked)
    //     filterCellChecked === 0 ? isValid = false : isValid = true
    //     if(isValid) {
    //         let arrCells = config.asc_getValues()
    //         arrCells.forEach((item, index) => {
    //             item.asc_setVisible(indChecked[index])
    //         })
    //         config.asc_getFilterObj().asc_setType(Asc.c_oAscAutoFilterTypes.Filters);
    //         api.asc_applyAutoFilter(config);
    //     }
    //     setClearDisable(config)
    // }
    
    const onUpdateCell = (id=[],state) =>{
        const api = Common.EditorApi.get();
        let selectedCells = $$('[name="filter-cell"]:checked').length
        selectedCells === 0 ? isValid = false : isValid = true
        
        if(Array.isArray(id))  {
            listVal.forEach(item => {item.check = state});
            setListValue([...listVal]);
         } else {
            listVal[id].check = state;
            setListValue([...listVal]);
        if(isValid){
            configFilter.asc_getFilterObj().asc_setType(Asc.c_oAscAutoFilterTypes.Filters);
            configFilter.asc_getValues()[id].asc_setVisible(state); 
            }
            api.asc_applyAutoFilter(configFilter);
        }
    }
    

    return (
        !Device.phone ?
        <Popover id="picker-popover" className="popover__titled">
            <FilterOptions style={{height: '410px'}} onSort={onSort} listVal={listVal} 
             onDeleteFilter={onDeleteFilter} onUpdateCell={onUpdateCell} onClearFilter={onClearFilter} />
        </Popover> :
        <Sheet className="picker__sheet" push >
            <FilterOptions   onSort={onSort} listVal={listVal}
             dialog={dialog} onUpdateCell={onUpdateCell} onDeleteFilter={onDeleteFilter} onClearFilter={onClearFilter}/>
        </Sheet>
    )
}

export default FilterOptionsController;