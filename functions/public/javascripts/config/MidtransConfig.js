const midtransClient = require('midtrans-client');

const config = new midtransClient.CoreApi({
    isProduction: true,
    serverKey: "Mid-server-CJJ1sHZyvUthhpnnCGuU7fxd",
    clientKey: "Mid-client-gVlqTD08yQcFwinj",
});

function encodeKeyTrans(){
    return Buffer.from("Mid-server-CJJ1sHZyvUthhpnnCGuU7fxd:")
        .toString("base64");
}

module.exports = {config, encodeKeyTrans};