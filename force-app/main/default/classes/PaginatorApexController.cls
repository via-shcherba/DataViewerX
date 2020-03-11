public with sharing class PaginatorApexController {

    private static Map<String, Schema.SObjectField> getDescribeFields() {
        Schema.SObjectType objectType = getObjectType();
        Schema.DescribeSObjectResult describeResult = objectType.getDescribe(); 
        if (describeResult.isQueryable()) {
            return describeResult.fields.getMap(); 
        } else {
            return null;
        }        
    }

    private static Schema.SObjectType getObjectType() {
        List<sObject> data = DataSetter.setData();
        return data.getSObjectType(); 
    }

    private static Boolean checkAccess() {
        return Boolean.valueOf(getObjectType().getDescribe().isAccessible());
    }

    @AuraEnabled(cacheable=true)
    public static String getObjectName() {        
        return getObjectType().getDescribe().getName();          
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords() { 
        List<sObject> records = new List<sObject>();
        if (checkAccess()) {
            return DataSetter.setData();
        } else {
            return null;  
        }         
    }

    @AuraEnabled(cacheable=true)
    public static List<DataWrapper> getNeededFields() { 
        List<sObject> data = getRecords();
        List<String> fieldsNames = getCurrentFieldsNames(data);
        List<DataWrapper> dataWrappers = new List<DataWrapper>();
        for (String fieldName : fieldsNames) {
            Schema.DescribeFieldResult fieldDescribe = getDescribeField(fieldName);
            if (fieldDescribe.isAccessible()) {
                DataWrapper dataWrapper = new DataWrapper(
                    fieldName, 
                    String.valueOf(fieldDescribe.getType()), 
                    String.valueOf(fieldDescribe.getLabel())
                );
                dataWrappers.add(dataWrapper);
            }
        }
        return dataWrappers;
    }

    private static List<String> getCurrentFieldsNames(List<sObject> data) {
        List<String> currentFieldNames = new List<String>();  
        String jsonString = JSON.serialize(data[0]);
        List<String> couples = jsonString.split('},')[1].replace('}', '').replace('"', '').split(',');
        for (String couple : couples) {
            if (String.isNotBlank(couple.split(':')[0])) {
                currentFieldNames.add(couple.split(':')[0]);
            }           
        }       
        return currentFieldNames;
    }

    private static Schema.DescribeFieldResult getDescribeField(String FieldName) {
        Map<String, Schema.SObjectField> describeFields = getDescribeFields();
        return describeFields.get(FieldName).getDescribe();
    }

}
