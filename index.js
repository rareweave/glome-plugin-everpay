const Everpay = require('everpay')

module.exports={
    setup:async()=>{
        const everpay = new Everpay()
        return {
            async readTxById(id){
                let dataFromEverpay = await everpay.txByHash(id)
                if (!dataFromEverpay || dataFromEverpay.action != "transfer" || dataFromEverpay.internalStatus !='success') {
                    return null
                }
                return {
                    coin: dataFromEverpay.tokenSymbol,
                    timestamp: dataFromEverpay.timestamp,
                    from: dataFromEverpay.from,
                    to:dataFromEverpay.to,
                }
            }
        }
    }
}