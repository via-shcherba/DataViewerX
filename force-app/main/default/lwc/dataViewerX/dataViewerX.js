import { LightningElement, track, api } from 'lwc';
import getObjectName from '@salesforce/apex/PaginatorApexController.getObjectName';
import getRecords from '@salesforce/apex/PaginatorApexController.getRecords';
import getNeededFields from '@salesforce/apex/PaginatorApexController.getNeededFields';
import paginatorXHelper from './dataViewerXHelper.js';
import notAvailableLbl from '@salesforce/label/c.notAvailable';
import objectNameLbl from '@salesforce/label/c.object_name';
import pageNumberLbl from '@salesforce/label/c.page_number';
import ofLbl from '@salesforce/label/c.of';

export default class DataViewerX extends LightningElement {

    @api objectName;
    @api columns;
    @api _data;
    @track data;    
    pagination;
    pageNumber;
    numberPages;

    labels = {
        notAvailableLbl,
        objectNameLbl,
        pageNumberLbl,
        ofLbl
    };

    constructor() {
        super(); 
        this.getDataFromApex();           
    }

    setColumns(data) {
        let preparedColumns = [];
        data.forEach(value => {
            let column = {};
            column.label = value.label;
            column.fieldName = value.fieldName;
            column.type = this.columnTypeConvertor(value.dataType);                
            preparedColumns.push(column);
        });
        return preparedColumns;
    }

    async getDataFromApex() {
        let records = await getRecords();  
        if (records) {
            this._data = records;
        }            
        let neededFields = await getNeededFields();
        if (neededFields) {            
            this.columns = this.setColumns(neededFields);           
        } 
        let objName = await getObjectName();
        if (objName) {
            this.objectName = objName;
        }
        this.pagination = new paginatorXHelper(this._data);
        this.checkAlailableButtons();  
        this.data = this.pagination.paginationList;
    }

    columnTypeConvertor(apexType) {
        if (apexType === 'DOUBLE' || apexType === 'INT') {
            return 'number';
        } else if (apexType === 'DATE' || apexType === 'DATETIME') {
            return 'date';
        } else if (apexType !== 'EMAIL' && apexType !== 'PHONE' && apexType !== 'URL' && apexType != 'BOOLEAN') {
            return 'text';
        } else {
            return apexType;
        }
    }

    checkAlailableButtons() {
        if (this.pagination.pageNumber > 1) {
            this.template.querySelector('c-pagination').disableButton('falseprevious');
        }
        if (this.pagination.pageNumber === 1) {
            this.template.querySelector('c-pagination').disableButton('trueprevious');
        }
        if (this.pagination.pageNumber < this.pagination.numberPages) {
            this.template.querySelector('c-pagination').disableButton('falsenext');
        } else {
            this.template.querySelector('c-pagination').disableButton('truenext');
        }
        this.pagination.setPageNumber();
        this.data = this.pagination.paginationList;
        this.pageNumber = this.pagination.pageNumber;
        this.numberPages = this.pagination.numberPages;
    }

    nextPage(event) {
        this.pagination.nextPage(event);        
        this.checkAlailableButtons();
    }

    previousPage(event) {
        this.pagination.previousPage(event);        
        this.checkAlailableButtons();
    }

    firstPage(event) {
        this.pagination.firstPage(event);        
        this.checkAlailableButtons();
    }

    lastPage(event) {
        this.pagination.lastPage(event);        
        this.checkAlailableButtons();
    }

    changePageSize(event) {
        this.pagination.changePageSize(event);        
        this.checkAlailableButtons();
    }

}