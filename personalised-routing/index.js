const AWS = require("aws-sdk");
AWS.config.update({region: 'REGION'});
const client = new AWS.CustomerProfiles();

exports.handler = async (event) => {
    var phoneNumber = event.Details.ContactData.CustomerEndpoint.Address;
    console.log("Customer endpoint address is " + phoneNumber);
    var searchResults  = await client.searchProfiles({
        "DomainName": "AnyCompanyDomain",
        "KeyName": "_phone",
        "Values": [phoneNumber]
    }).promise()

    var profileid = searchResults.Items[0].ProfileId;
    var firstname = searchResults.Items[0].FirstName;
    var additionalInformation = searchResults.Items[0].AdditionalInformation;
    var customervalue = "";
    if (firstname === null) {
        firstname = "unknown"
    }
    // Customise business logic based on the additional information section.

    if (additionalInformation === "Customer is interested in buying a refrigerator") {
        customervalue = "High"
    } else {
        customervalue = "Low"
    }
    console.log(profileid);

    var listObjectPayload = {
        "DomainName": "csatdemo",
        "ObjectTypeName": "CTR",
        "ProfileId": profileid
    }
    var listObjectResults = await client.listProfileObjects(listObjectPayload).promise()
    var mostRecentCtr = JSON.parse(listObjectResults.Items[0].Object);
    var lastCallAbandoned = "false";
    if (mostRecentCtr.agent === null){
        console.log("last call abandoned")
        lastCallAbandoned = "true"
    }
    var response = {
        "ProfileId": profileid,
        "FirstName": firstname,
        "LastCallAbandoned": lastCallAbandoned,
        "CustomerValue": customervalue
    };
    return response
};
