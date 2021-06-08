var customerProfileClient = new AWS.CustomerProfiles();
var connectClient = new AWS.Connect();


var getMatchesResponse = await customerProfileClient.getMatches({
    "DomainName": "MyDomain",
    "MaxResults": 10
}).promise();

var potentialMatches = getMatchesResponse.matches;

if (potentialMatches.length > 0) {
    for (var potentialMatch in potentialMatches) {
        var profileIdList = potentialMatch.profileIds;
        var firstProfile = customerProfileClient.searchProfiles({
            "DomainName": "MyDomain",
            "KeyName": "_profileId",
            "Values": [profileIdList[0]]
        }).Items[0];

        var mostRecentUpdatedTime = Date.parse(firstProfile.Attributes.LastUpdatedTime);
        var mainProfileId = firstProfile.ProfileId;
        for (var i = 1; i < profileIdList.length; i++) {
            var currentProfile = customerProfileClient.searchProfiles({
                "DomainName": "MyDomain",
                "KeyName": "_profileId",
                "Values": [profileIdList[i]]
            }).Items[0];

            var currentProfileLastUpdatedTime = Date.parse(currentProfile.Attributes.LastUpdatedTime)
            if (currentProfileLastUpdatedTime > mostRecentUpdatedTime) {
                mainProfileId = currentProfile.ProfileId
                mostRecentUpdatedTime = currentProfileLastUpdatedTime;
            }

            if (firstProfile.PhoneNumber != currentProfile.PhoneNumber ||
                firstProfile.FirstName != currentProfile.FirstName ||
                firstProfile.LastName != currentProfile.LastName ||
                firstProfile.EmailAddress != currentProfile.EmailAddress) {
                    
                connectClient.startTaskContact({
                    "ContactFlowId": "MyContactFlowId",
                    "InstanceId": "MyInstanceId",
                    "Name": "MergeProfilesTask",
                    "Description": "Please validate the following profile IDs: " + JSON.stringify(potentialMatch.profileIds)
                });
                break;
            }
        }

        var index = profileIdList.indexOf(mainProfileId);
        profileIdList.splice(index, 1);

        var mergeProfilesResponse = await customerProfileClient.mergeProfiles({
            DomainName: "MyDomain",
            MainProfileId: mainProfileId,
            ProfileIdsToBeMerged: profileIdList
        }).promise();
    }
}
