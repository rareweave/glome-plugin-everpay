const Everpay = require('everpay')
const crypto = require("crypto");

module.exports = {
    id: "everpay",
    setup:async()=>{
        const everpay = Everpay.default?new Everpay.default():new Everpay()
        return {
            async verifySignature(signerPublickey, message, signature) {
                const dataToVerify = new TextEncoder().encode(message);
                const binarySignature = b64UrlToBuffer(signature);
                const hash = await crypto.subtle.digest("SHA-256", dataToVerify);
        
                const publicJWK = {
                  e: "AQAB",
                  ext: true,
                  kty: "RSA",
                  n: signerPublickey,
                };
        
                const cryptoKey = await crypto.subtle.importKey(
                  "jwk",
                  publicJWK,
                  {
                    name: "RSA-PSS",
                    hash: "SHA-256",
                  },
                  false,
                  ["verify"]
                );
        
                const result = await crypto.subtle.verify(
                  { name: "RSA-PSS", saltLength: 32 },
                  cryptoKey,
                  binarySignature,
                  hash
                );
        
                return result;
            },
            async readTxById(id){
                let dataFromEverpay = await everpay.txByHash(id)
                if (!dataFromEverpay || dataFromEverpay.action != "transfer" || dataFromEverpay.internalStatus != '{"status":"success"}') {
                    return null
                }
                return {
                    coin: dataFromEverpay.tokenSymbol,
                    timestamp: dataFromEverpay.timestamp,
                    amount:dataFromEverpay.amount,
                    from: dataFromEverpay.from,
                    to:dataFromEverpay.to,
                }
            }
        }
    }
}

const b64UrlToBuffer = (b64Url) =>
  new Uint8Array(
    atob(b64Url.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((c) => c.charCodeAt(0))
  ).buffer;
