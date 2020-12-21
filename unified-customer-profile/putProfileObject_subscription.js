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

return customerProfilesClient.putProfileObject({
    "DomainName": domainName,
    "ObjectTypeName": "PurchasedSubscription",
    "Object": JSON.stringify(purchaseObject)
}).promise()

.then((data) => {
  console.log('putProfileObject Result');
  console.log(JSON.stringify(data, null, 2));
})
.catch((err) => {
  console.log('putProfileObject Error')
  console.log(JSON.stringify(err, null, 2));
})
