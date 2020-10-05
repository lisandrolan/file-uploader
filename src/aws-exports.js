const config = {
  Auth: {
    identityPoolId: 'us-east-1:daa39e2c-c363-4b97-91a9-de1ae54c7590',
    region: 'us-east-1',
    userPoolId: 'us-east-1_IZ0rymzBv',
    userPoolWebClientId: '32ouiqpjfne8l0vnsasplhmgvr',
    mandatorySignIn: false,
    aws_mandatory_sign_in: 'enable',
    bucket: 'sqso',
    
  },

  API: {
    endpoints: [
      {
        name: 'superqso',
        endpoint: 'https://hlcyk2ty6c.execute-api.us-east-1.amazonaws.com/Prod',
        region: 'us-east-1'
      }
    ]
  },
  Storage: {
    bucket: 'sqsovpcrds-sqsobucket-12jwrpncf5o8h', // REQUIRED -  Amazon S3 bucket
    region: 'us-east-1', // OPTIONAL -  Amazon service region
    identityPoolId: 'us-east-1:daa39e2c-c363-4b97-91a9-de1ae54c7590'
  },
  Analytics: {
    // OPTIONAL -  Amazon Pinpoint App ID
    disabled: true,
    // OPTIONAL -  Amazon service region
    region: 'us-east-1'
  }
};
export default config;
