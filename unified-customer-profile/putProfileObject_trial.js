const trialObject = {
    id: 'trial-id-1',
    UserId: '00001',
    startDate: '2020-01-19',
    endDate: '2020-03-19',
    trialDays: '90',
    planType: 'Standard',
    status: 'Expired'
};

return customerProfilesClient.putProfileObject({
    "DomainName": domainName,
    "ObjectTypeName": "TrialSubscription",
    "Object": JSON.stringify(trialObject)
}).promise()
.then((data) => {
  console.log('putProfileObject Result');
  console.log(JSON.stringify(data, null, 2));

  return customerProfilesClient.searchProfiles({
      "DomainName": domainName,
      "KeyName": "_account",
      "Values": ['00001']
  }).promise();

})
.then((data) => {
  console.log('searchProfiles Result');
  console.log(JSON.stringify(data, null, 2));
})
.catch((err) => {
  console.log('searchProfiles Error')
  console.log(JSON.stringify(err, null, 2));
})
