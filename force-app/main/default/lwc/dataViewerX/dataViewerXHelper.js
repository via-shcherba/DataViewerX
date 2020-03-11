export default class DataViewerXHelper {

    data;
    paginationList;
    numberPages;
    pageSize;
    pageNumber;

    constructor(data) {
        this.data = data;
        this.pageSize = 5;
        this.pageNumber = 1;
        this.countPages();       
    }

    countPages() {
        let numberRecords = this.data.length;        
        if (this.pageSize > numberRecords) {
            this.numberPages = 1;
        } else {
            this.numberPages = Math.ceil(numberRecords / +this.pageSize);            
        }                   
    }

    setPageNumber() {   
        let totalSize = this.data.length;    
        let recordFrom = (this.pageNumber - 1) * this.pageSize;        
        let recordTo;
        if((recordFrom + this.pageSize) <= totalSize) {           
            recordTo = recordFrom + this.pageSize;
        } else {
            recordTo = (totalSize - recordFrom) + recordFrom;
        }          
        this.paginationList = [];
        for(let i = recordFrom; i < recordTo; i++) {
            if(totalSize > i) {
                this.paginationList.push(this.data[i]);
            }
        }           
    }

    previousPage(event) {
        event.stopPropagation();
        if (this.pageNumber > 1) {
            this.pageNumber--;          
        } 
        this.countPages();
        this.setPageNumber();       
    }

    nextPage(event) {
        event.stopPropagation();
        if(this.pageNumber < this.numberPages) {
            this.pageNumber++;            
        }  
        this.countPages();   
        this.setPageNumber();          
    }
    
    changePageSize(event) {              
        this.pageSize = + event.detail;
        this.countPages();
        this.pageNumber = 1;
        this.setPageNumber();       
    }

    firstPage(event) {
        event.stopPropagation();
        this.pageNumber = 1;
        this.countPages();
        this.setPageNumber();
    }

    lastPage(event) {
        event.stopPropagation();
        this.pageNumber = this.numberPages;
        this.countPages();
        this.setPageNumber();
    }

}