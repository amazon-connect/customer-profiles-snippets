return customerProfilesClient.putProfileObjectType({
    "DomainName": domainName,
    "ObjectTypeName": "PurchasedSubscription",
    "Description": "Subscription Information",
    "AllowProfileCreation": true,
    "ExpirationDays": 400,
    "Fields": {
        "UserId" : {
            "ContentType": "STRING",
            "Source": "_source.UserId",
            "Target": "_profile.AccountNumber"
        },
        "startdate" : {
            "Source": "_source.startDate",
            "Target": "_profile.Attributes.SubscriptionStartDate"
        },
        "enddate" : {
            "Source": "_source.endDate",
            "Target": "_profile.Attributes.SubscriptionEndDate"
        },
        "plantype" : {
            "Source": "_source.planType",
            "Target": "_profile.Attributes.SubscriptionPlanType"
        },
        "discount" : {
            "Source": "_source.discount",
            "Target": "_profile.Attributes.SubscriptionDiscount"
        },
        "price" : {
            "Source": "_source.price",
            "Target": "_profile.Attributes.SubscriptionPrice"
        },
        "status" : {
            "Source": "_source.status",
            "Target": "_profile.Attributes.SubscriptionStatus"
        },
        "autorenew" : {
            "Source": "_source.autoRenew",
            "Target": "_profile.Attributes.SubscriptionAutoRenew"
        }
    },
    "Keys": {
        "_account" : [
            {
                "FieldNames": ["UserId"],
                "StandardIdentifiers" : [ "PROFILE", "UNIQUE" ]
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
