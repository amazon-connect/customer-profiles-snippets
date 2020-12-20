# Add Custom Integration Objects to Amazon Connect Profiles

This repository provides example API calls for creating custom Amazon Connect Profile object types for storing custom profile objects.  In this example, we have 3 fictitious profile object types:

* Trials - Represents details of a trial subscription of an online product.  Details include start and end dates, plan type, and current status.  
* Subscriptions - Represents details of a paid subscription of an online product. Details include start and end dates, plan type, price paid, current status, and if it will automatically renew or not at the end of the subscription.
* Marketing Assigned Offers - Represents offers assigned to customers for special discounts to encourage customers to move from a trial to a paid subscription. Details include the offer name and if the offer was viewed - tracking an email open event from a marketing platform.

With these profile object types, Amazon Connect agents are provided context to the customer's current status in the buying lifecycle.  Customers who are in the middle of a trial and have an offer and call in can receive help and guidance on how to convert.  Customers who are near the end of a subscription but have not turned on auto-renewal can receive guidance and support on how to ensure they do not lose account access.

The steps below detail the API calls needed (using the AWS NodeJS SDK) to first register the custom profile object types with Amazon Connect Profiles service and then how to register objects as they occur.

## Register the Profile Object Types

First we register the Trial Subscription profile object type:

```
const domainName = 'my-domain-name';

client.putProfileObjectType({
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
}).promise();
```

Next we register the Purchased Subscription profile object type:

```
client.putProfileObjectType({
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
}).promise();
```

Last we register the Marketing Assigned Offer profile object type:


```
client.putProfileObjectType({
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
}).promise();
```

## Submit Profile Objects

Now that we have our profile object types registered, we can start submitting profile objects to the Amazon Connect Profile service. As trials, purchases, and offers are created in the source systems, we can register these objects in Amazon Connect.  

This could be done in a number of ways:
* Trial, Purchase, and Offers could be emitted into Amazon EventBridge as discrete events. A listener could pick up these events and write them to the Amazon Connect Profile service.
* Trial, Purchase, and Offers could be written to a Amazon Simple Notification Service (SNS) topic. Where they could be fanned out to multiple listeners using Amazon Simple Queue Service (SQS) subscriptions for processing.  One subscription could be responsible for writing these events to the Amazon Connect Profile service.
* Trial, Purchase, and Offers could also be submitted in batch for systems with no real-time mechanism by  using Amazon StepFunctions to orchestrate periodic queries in source databases, processing the results and submitting to the the Amazon Connect Profile service.


Example NodeJS SDK call for submitting our trial subscription object:
```
const trialObject = {
  id: 'trial-id-1',
  userId: '00001',
  startDate: '2020-01-19',
  endDate: '2020-03-19',
  trialDays: '90',
  planType: 'Standard',
  status: 'Expired'
};

return client.putProfileObject({
  "DomainName": domainName,
  "ObjectTypeName": "TrialSubscription",
  "Object": JSON.stringify(trialObject)
}).promise();
```

Example NodeJS SDK call for submitting our purchase subscription object:

```
const purchaseObject = {
  UserId: '00001',
  startDate: '2019-03-20',
  endDate: '2020-03-20',
  planType: 'Professional',
  discount: 'None',
  price: '$99.99',
  status: 'Active',
  autoRenew: 'False'
};

client.putProfileObject({
  "DomainName": domainName,
  "ObjectTypeName": "PurchasedSubscription",
  "Object": JSON.stringify(purchaseObject)
}).promise();
```

Example NodeJS SDK call for submitting our marketing assigned offer object:

```
const marketerAssignedObject = {
    UserId: '00001',
    email: 'test@test.com',
    offerName: '30% Renewal',
    offerViewed: 'false'
};

client.putProfileObject({
    "DomainName": domainName,
    "ObjectTypeName": "MarketingAssignedOffers",
    "Object": JSON.stringify(marketerAssignedObject)
}).promise();
```

## Profile Updated

Finally, we can verify that results are being successfully submitted and profile objects are being updated by calling the Amazon Connect Profile service to return one of our example profiles:

Example NodeJS SDK call for receiving a profile by account number:

```
return client.searchProfiles({
      "DomainName": domainName,
      "KeyName": "_account",
      "Values": ['00001']
  }).promise();
```
Results in:
```
{
  "Items": [
    {
      "ProfileId": "43f4f1bcd89248c4800433831c4349c8",
      "AccountNumber": "00001",
      "AdditionalInformation": null,
      "PartyType": null,
      "BusinessName": null,
      "FirstName": null,
      "MiddleName": null,
      "LastName": null,
      "BirthDate": null,
      "Gender": null,
      "PhoneNumber": null,
      "MobilePhoneNumber": null,
      "HomePhoneNumber": null,
      "BusinessPhoneNumber": null,
      "EmailAddress": "test@test.com",
      "PersonalEmailAddress": null,
      "BusinessEmailAddress": null,
      "Attributes": {
        "SubscriptionAutoRenew": "False",
        "SubscriptionDiscount": "None",
        "SubscriptionEndDate": "2020-03-20",
        "SubscriptionPlanType": "Professional",
        "SubscriptionPrice": "$99.99",
        "SubscriptionStartDate": "2019-03-20",
        "SubscriptionStatus": "Active",
        "TrialDays": "90",
        "TrialEndDate": "2020-03-19",
        "TrialPlanType": "Standard",
        "TrialStartDate": "2020-01-19",
        "TrialStatus": "Expired",
        "offerName": "30% Renewal",
        "offerViewed": "false"
      }
    }
  ],
  "NextToken": null
}
```
