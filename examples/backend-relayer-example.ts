async function run() {
  const endpoint = process.env.THIRDWEB_X402_ENDPOINT ?? process.env.X402_ENDPOINT;
  const apiKey = process.env.THIRDWEB_X402_API_KEY ?? process.env.X402_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Set THIRDWEB_X402_ENDPOINT/X402_ENDPOINT and THIRDWEB_X402_API_KEY/X402_API_KEY');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      chainId: 11142220,
      to: process.env.INTENT_MESH_ADDRESS,
      functionName: 'lockEscrow',
      intentId: '0',
      data: '0x',
    }),
  });

  console.log(await response.text());
}

run().catch(console.error);
