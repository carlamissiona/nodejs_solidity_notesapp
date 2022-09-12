const request = require('request-promise-native')
const filePath = "./hello.sol";
const fs = require('fs')
const Swagger = require('swagger-client');
const {URL} = require('url'); 

const NODE_URL = `https://u0opegxh80-u0at1qn1u7-connect.us0-aws.kaleido.io/`;
const FROM_ADDRESS = "0x74d067ee97df4f2b30076f17de92cafeacb02e1c";
const USERNAME = "u0e71zxolh";
const PASSWORD = "dfi514xRmN3IZs_t7qSiAtJVPlZNysolX7elhnLlSKY";

function authHelper(username, password) {
  return req => {
    req.headers.authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }
}
async function deploy() {

  // Teach the REST API Gateway about our solidity code
  const url = new URL(NODE_URL);
  url.username = USERNAME;
  url.password = PASSWORD;
  url.pathname = "/abis";
  const req = request.post({
    url: url.href,
    qs: { compiler: "0.5" }
  });
  req.form().append("file", fs.createReadStream(filePath));

  // Retrieve a Gateway API that can:
  // - get data from any existing deployed contract that conforms to the ABI
  // - deploy new instances of the contract
  // - subscribe for events that match the signatures in this ABI (globally or on specific instances)
  console.log('Generating Gateway API');
  const { openapi } = await req.json();

  // Create a Swagger client for the OpenAPI specification we just downloaded
  console.log('Downloading OpenAPI defintion for Gateway API');
  let client = await Swagger(openapi, {
    requestInterceptor: authHelper(USERNAME,PASSWORD) // Include security credentials
  });

  // Invoke the constructor with arguments to deploy a new instance
  console.log('Deploying Contract Instance via Gateway API');
  const deploy = await client.apis.default.constructor_post({
    body: { 
      },
    "kld-from": FROM_ADDRESS
  });

  // Retrieve the address of the deployed contract
  let {contractAddress} = deploy.body;

  // Query the contract using the Gateway API (that can talk to any contract)
  console.log('Getting initial value via the getnotes_get() method of the contract');
  const result = await client.apis.default.getnotes_post({ 
  body: {
        _index: 0, 
  }, 
  address: contractAddress});
  console.log(`Initial Value: ${JSON.stringify(result.body)}`);

  // Update the conract by submitting a transaction  set(uint _i, string memory _vl)
  console.log('Setting value via the setValue() method of the contract');
  const resultPost = await client.apis.default.set_post({
    body: {
      _i: 0,
      _vl: "Some notes"
    },
    "kld-from": FROM_ADDRESS,
    "kld-sync": "true", // Block waiting for the response, rather than using full TX streaming
    address: contractAddress,
  });
   resultPosts = await client.apis.default.set_post({
    body: {
      _i: 0,
      _vl: "Some notes"
    },
    "kld-from": FROM_ADDRESS,
    "kld-sync": "true", // Block waiting for the response, rather than using full TX streaming
    address: contractAddress,
  });
   resultPost0 = await client.apis.default.set_post({
    body: {
      _i: 1,
      _vl: "Some notes 1"
    },
    "kld-from": FROM_ADDRESS,
    "kld-sync": "true", // Block waiting for the response, rather than using full TX streaming
    address: contractAddress,
  });
   resultPost1 = await client.apis.default.set_post({
    body: {
      _i: 2,
      _vl: "Some notes 2"
    },
    "kld-from": FROM_ADDRESS,
    "kld-sync": "true", // Block waiting for the response, rather than using full TX streaming
    address: contractAddress,
  });
   resultPost11 = await client.apis.default.set_post({
    body: {
      _i: 3,
      _vl: "Some notes 3"
    },
    "kld-from": FROM_ADDRESS,
    "kld-sync": "true", // Block waiting for the response, rather than using full TX streaming
    address: contractAddress,
  });
  console.log(`Update TX hash: ${JSON.stringify(resultPost.body.transactionHash)}`);

  // Query the value again from the contract
  const resultNew = await client.apis.default.getnotes_post({
    body: {
        _index:1, 
      },
    "kld-from": FROM_ADDRESS,
    address: contractAddress
  });
  console.log(`Updated Value: ${JSON.stringify(resultNew.body)}`);

}
deploy().catch(err => {
  console.error(err.stack);
  process.exit(1);
});