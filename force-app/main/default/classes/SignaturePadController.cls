public with sharing class SignaturePadController {
    @AuraEnabled
    public static void saveSignature(String recordId, String base64Data) {
        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = 'Signature';
        contentVersion.PathOnClient = 'Signature.png';
        contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
        contentVersion.FirstPublishLocationId = recordId;
        insert contentVersion;
    }

    @AuraEnabled
    public static String getSignature(String recordId) {
        ContentVersion contentVersion = [
            SELECT Id, VersionData
            FROM ContentVersion
            WHERE FirstPublishLocationId = :recordId AND Title = 'Signature'
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];
        return EncodingUtil.base64Encode(contentVersion.VersionData);
    }
}
