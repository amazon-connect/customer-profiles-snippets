return lockeClient.putProfileObjectType({
    "DomainName": domainName,
    "ObjectTypeName": "TrialSubscription",
    "Description": "Trial Subscription Signups",
    "AllowProfileCreation": true,
    "ExpirationDays": 100,
    "Fields": {
        "UserId" : {
            "ContentType": "STRING",
            "Source": "_source.UserId",
            "Target": "_profile.AccountNumber"
        },
        "startdate" : {
            "Source": "_source.startDate",
            "Target": "_profile.Attributes.TrialStartDate"
        },
        "enddate" : {
            "Source": "_source.endDate",
            "Target": "_profile.Attributes.TrialEndDate"
        },
        "trialdays" : {
            "Source": "_source.trialDays",
            "Target": "_profile.Attributes.TrialDays"
        },
        "plantype" : {
            "Source": "_source.planType",
            "Target": "_profile.Attributes.TrialPlanType"
        },
        "status" : {
            "Source": "_source.status",
            "Target": "_profile.Attributes.TrialStatus"
        }
    },
    "Keys": {
        "_account" : [
            {
                "FieldNames": ["UserId"],
                "StandardIdentifiers" : [ "PROFILE", "UNIQUE"]
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
