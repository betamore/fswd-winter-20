/* eslint no-console: 0 */
"use strict";

var app = require("./server").app;
const port = process.env.PORT || 8000;

app.listen(port, function() {
    console.log(`Server listening on port ${port}!`);
});
