(async () => {
    const jwt = require('atlassian-jwt');
    const moment = require('moment');

    const now = moment().utc();

    // Simple form of [request](https://npmjs.com/package/request) object
    const req = jwt.fromMethodAndUrl('GET', 'https://atsolutions.atlassian.net/rest/api/latest/serverInfo');

    const tokenData = {
        "iss": 'issuer-val',
        "iat": now.unix(), // The time the token is generated
        "exp": now.add(3, 'minutes').unix(), // Token expiry time (recommend 3 minutes after issuing)
        "qsh": jwt.createQueryStringHash(req) // [Query String Hash](https://developer.atlassian.com/cloud/jira/platform/understanding-jwt/#a-name-qsh-a-creating-a-query-string-hash)
    };

    const secret = 'mU2yiMXJ0U9uhp3sSU98FEE9';

    const token = jwt.encodeSymmetric(tokenData, secret);
    console.log(token);

    const decoded = jwt.decodeSymmetric(token,null, true);
    console.log(decoded); 
})()