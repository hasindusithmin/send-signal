// install express with `npm install express` 
const express = require('express')
const fetch = require('node-fetch')
const app = express()

app.get('/',(req,res)=>res.redirect('https://unitytradeplus.vercel.app/'))

app.get('/:signal', async (req, res) => {
    try {
        // declaration
        let prefix, entries, t1, t2, sl;
        // parse path variable
        const { signal } = req.params;
        // initialize prefix
        prefix = signal;
        const _ = await fetch('https://www.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        const { price } = await _.json()
        // initialize entries
        entries = parseFloat(price)
        // declare & initialize 'x'
        let x = entries * 0.005;
        if (prefix === 'long') {
            sl = entries - x
            t1 = entries + x
            t2 = entries + x + x
        }
        else if (prefix === 'short') {
            sl = entries + x
            t1 = entries - x
            t2 = entries - x - x
        }
        else throw Error("unexpected value;permitted: 'long', 'short'")
        let txt = `
        ➖➖➖➖➖➖➖➖➖➖
        <b><u>Unitytrade+ Crypto Signal</u></b>
        BTC/USDT ${prefix}
        Levarage <b>10X</b>
        Entries ${entries}
        Target1  ${t1}
        Target2  ${t2}
        SL      ${sl}
        ➖➖➖➖➖➖➖➖➖➖
        <pre>
        <b>Risk Warning:</b> Digital asset prices can be volatile. The value of your investment can go down or up and you may not get back the amount invested. You are solely responsible for your investment decisions and <b>codeunity</b> is not liable for any losses you may incur. Please fund your wallet and perform your transactions cautiously. Not financial advice.
        </pre>
        By <a href="https://unitytradeplus.vercel.app/">@unitytrade+</a>
    
        `
        res.status(200).send(txt)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(3000)

// export 'app'
module.exports = app