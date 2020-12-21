const marketerAssignedObject = {
    UserId: '00001',
    email: 'test@test.com',
    offerName: '30% Renewal',
    offerViewed: 'false'
};

return customerProfilesClient.putProfileObject({
    "DomainName": domainName,
    "ObjectTypeName": "MarketingAssignedOffers",
    "Object": JSON.stringify(marketerAssignedObject)
}).promise()

.then((data) => {
  console.log('putProfileObject Result');
  console.log(JSON.stringify(data, null, 2));
})
.catch((err) => {
  console.log('putProfileObject Error')
  console.log(JSON.stringify(err, null, 2));
})
