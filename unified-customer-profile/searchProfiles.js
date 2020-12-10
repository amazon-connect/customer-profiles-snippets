return lockeClient.searchProfiles({
      "DomainName": domainName,
      "KeyName": "_account",
      "Values": ['00001']
  }).promise()

.then((data) => {
  console.log('searchProfiles Result');
  console.log(JSON.stringify(data, null, 2));
})
.catch((err) => {
  console.log('searchProfiles Error')
  console.log(JSON.stringify(err, null, 2));
})
