public with sharing class DataSetter {

    public static List<sObject> setData() {
        //return [SELECT LastName, FirstName, Phone, Email, CreatedDate FROM Contact LIMIT 50000];
        /*
        return [
            SELECT Id, MasterRecordId, LastName, FirstName, OtherStreet, OtherCity, 
            Name, OtherPostalCode, Phone, Description, OwnerId, CreatedDate, PhotoUrl 
            FROM Contact LIMIT 50000
        ];
        */
        //return [SELECT CreatedDate, Name, Number__c FROM Test__c LIMIT 50000];
        
        return [
            SELECT Id, CaseNumber, Type, Status, Reason, Origin, Priority, LastViewedDate, ContactFax 
            FROM Case
            LIMIT 50000
        ];
        
    }

}
