// install express with `npm install express` 
const express = require('express')
const fetch = require('node-fetch')
const supabase = require('./db')

const app = express()

app.get('/', (req, res) => res.redirect('https://unitytradeplus.vercel.app/'))


function template(signal, first_name, last_name, entries, t1, t2, sl) {
    return `
    ➖➖➖➖➖➖➖➖➖➖
    <b><u>Unitytrade+ Crypto Signal</u></b>
    <u>Hi, ${first_name} ${last_name}</u>
    BTC/USDT ${signal}
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
}


async function sender(img_url, signal, entries, t1, t2, sl) {
    const token = process.env.TOKEN;
    const url = `https://api.telegram.org/bot${token}/sendPhoto`
    const { data, error } = await supabase
        .from('traders')
        .select()
    if (error) throw error
    let promises = []
    for (const { id, first_name, last_name } of data) {
        promises.push(fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "chat_id": id,
                "photo": img_url,
                "caption": template(signal, first_name, last_name, entries, t1, t2, sl),
                "parse_mode": "HTML"
            })
        }))
    }
    Promise.all(promises)
        .then(res=>{
            console.log('success');
        })
        .catch(err=>{
            console.error(err.message);
        })
    return "success"


}

app.get('/:signal', async (req, res) => {
    try {
        // declaration
        let entries, t1, t2, sl;
        // parse path variable
        const { signal } = req.params;
        const _ = await fetch('https://www.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        const { price } = await _.json()
        // initialize entries
        entries = parseFloat(price)
        // declare & initialize 'x'
        let x = entries * 0.005;
        if (signal === 'long') {
            sl = entries - x
            t1 = entries + x
            t2 = entries + x + x
        }
        else if (signal === 'short') {
            sl = entries + x
            t1 = entries - x
            t2 = entries - x - x
        }
        else throw Error("unexpected value;permitted: 'long', 'short'")
        const img_url = (signal === 'long') ? 'https://i.ibb.co/LdLHXTy/buy.jpg' : 'https://i.ibb.co/sCnZXmX/sell.jpg'
        const response = sender(img_url, signal, entries, t1, t2, sl)
        console.log(response);
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

// app.listen(3000)

// export 'app'
module.exports = app