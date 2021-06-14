const express = require('express')
const router = express.Router()
const records = require('./records');

asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

router.get('/quotes', asyncHandler(async (req, res) => {
    const quotes = await records.getQuotes()
    if (quotes) {
        res.json(quotes)
    } else {
        res.status(404).json({
            message: "Quotes not found"
        })
    }
}))

router.get('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id)
    if (quote) {
        res.json(quote)
    } else {
        res.status(404).json({
            message: "Quote not found."
        })
    }
}))

router.get('/quotes/quote/random', asyncHandler(async (req, res) => {
    const quote = await records.getRandomQuote()
    res.json(quote)
}))

router.post('quotes', asyncHandler(async (req, res) => {
    if (req.body.author && req.body.quote) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        })
        res.status(200).json(quote)
    } else {
        res.status(400).json({
            message: "Bad request: Quote and author required."
        })
    }
}))

router.put('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;

        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({
            message: "Quote Not Found"
        });
    }
}));

router.delete('/quotes/:id', asyncHandler(async (req, res, next) => {
    const quote = await records.getQuote(req.params.id)
    if (quote) {
        await records.deleteQuote(quote)
        res.status(204).end()
    } else {
        res.status(404).json({
            message: "Quote not found."
        })
    }
}))

module.exports = router