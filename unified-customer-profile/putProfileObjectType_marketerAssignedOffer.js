return lockeClient.putProfileObjectType({
    "DomainName": domainName,
    "ObjectTypeName": "MarketingAssignedOffers",
    "Description": "Marketing Managed Offers",
    "AllowProfileCreation": true,
    "ExpirationDays": 1000,
    "Fields": {
        "UserId" : {
            "ContentType": "STRING",
            "Source": "_source.UserId",
            "Target": "_profile.AccountNumber"
        },
        "email" : {
            "ContentType": "EMAIL_ADDRESS",
            "Source": "_source.email",
            "Target": "_profile.EmailAddress"
        },
        "phone" : {
            "ContentType": "PHONE_NUMBER",
            "Source": "_source.phone",
            "Target": "_profile.PhoneNumber"
        },
        "offer" : {
            "ContentType": "STRING",
            "Source": "_source.offerName",
            "Target": "_profile.Attributes.offerName"
        },
        "offerView" : {
            "ContentType": "STRING",
            "Source": "_source.offerViewed",
            "Target": "_profile.Attributes.offerViewed"
        }
    },
    "Keys": {
        "_account" : [
            {
                "FieldNames": ["UserId"],
                "StandardIdentifiers" : [ "PROFILE", "UNIQUE" ]
            }
        ],
        "_email": [
          {
            "FieldNames": [
              "email"
            ]
          }
        ],
        "_phone": [
          {
            "FieldNames": [
              "phone"
            ]
          }
        ]
    }
}).promise()
.then((data) => {
  console.log('putProfileObjectType Result');
  console.log(JSON.stringify(data, null, 2));
})
.catch((err) => {
  console.log('putProfileObjectType Error')
  console.log(JSON.stringify(err, null, 2));
})
