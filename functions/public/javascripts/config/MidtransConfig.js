const midtransClient = require('midtrans-client');

const config = new midtransClient.CoreApi({
    isProduction: false,
    // serverKey: "Mid-server-CJJ1sHZyvUthhpnnCGuU7fxd",
    // clientKey: "Mid-client-gVlqTD08yQcFwinj",
    serverKey: "SB-Mid-server-q2N1tDSrxJwvePFvSjRb3hO5",
    clientKey: "SB-Mid-client-dMyseBg2AlBqrR2b",
});

function encodeKeyTrans(){
    return Buffer.from("SB-Mid-server-q2N1tDSrxJwvePFvSjRb3hO5:")
        .toString("base64");
}

module.exports = {config, encodeKeyTrans};
