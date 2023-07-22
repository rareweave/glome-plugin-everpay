const Everpay = require('everpay')

module.exports = {
    id: "everpay",
    setup:async()=>{
        const everpay = Everpay.default?new Everpay.default():new Everpay()
        return {
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