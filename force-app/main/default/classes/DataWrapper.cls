public with sharing class DataWrapper {
   
    @AuraEnabled
    public String fieldName {get; set;}
    @AuraEnabled
    public String dataType {get; set;}
    @AuraEnabled
    public String label {get; set;}

    public DataWrapper(String fieldName, String dataType, String label) {
        this.fieldName = fieldName;
        this.dataType = dataType;
        this.label = label;
    }
    
}
