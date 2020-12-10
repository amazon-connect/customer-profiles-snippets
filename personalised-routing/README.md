# Personalized routing in the contact flows with Amazon Connect Profiles

The index.js file is an example Lambda function code snippet which is invoked in the contact flow to search for existing profiles, using the SearchProfile API using the caller’s phone number as the input. If a profile exists, it is checked for data, such as the name, profileId and any additional information, and returns that data to the contact flow. 

```
var searchResults = await client.searchProfiles({
    "DomainName": "AnyCompanyDomain",
    "KeyName": "_phone",
    "Values": [customerNumber]
}).promise()
if (searchResults.Items.length > 1) {
    var profileid = searchResults.Items[0].ProfileId;
    var firstname = searchResults.Items[0].FirstName;
    var additionalInformation =
    searchResults.Items[0].AdditionalInformation;
}
```
The contact flow then uses this data to greet the customer by their name and can use the details in the additional information to prompt the customer on whether they are calling about a recent subscription they placed or if they
want to renew their subscription. 

In the Lambda function, the call history in the customer profile is also examined. The code snippet checks if the customer has abandoned their last call to the contact center. Based on this information the
contact flow can escalate this contact if necessary. 

```
var listObjectPayload = {
    "DomainName": "AnyCompanyDomain",
    "ObjectTypeName": "CTR",
    "ProfileId": profileid
}
var listObjectResults = await
client.listProfileObjects(listObjectPayload).promise()
var mostRecentCtr = JSON.parse(listObjectResults.Items[0].Object);
var lastCallAbandoned = "false";
if (mostRecentCtr.agent === null){
    console.log("last call was abandoned")
    lastCallAbandoned = "true"
}
```

By leveraging the customer profiles APIs in the contact flow, AnyCompany is able to create a
personalized and dynamic customer experience and quickly connect customers to agents who have the
ability to meet their need.
