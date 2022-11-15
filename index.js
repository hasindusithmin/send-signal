// install express with `npm install express` 
const express = require('express')
const app = express()

app.get('/:signal', (req, res) => {
    try {
        const {signal} = req.params;
        res.status(200).json(signal)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

app.listen(3000)

// export 'app'
module.exports = app