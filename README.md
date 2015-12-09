# http-message-parser

> HTTP message parser in Node.js

# Demo

[http://lab.moogs.io/http-message-parser/demo](http://lab.moogs.io/http-message-parser/demo)

# Install

```bash
npm install http-message-parser
```

# Docs

The function takes in a string or [Buffer](https://nodejs.org/api/buffer.html) (recommended).

The result message body and multipart bodies will always return back as a [Buffer](https://nodejs.org/api/buffer.html) in Node.js in order to retain it's original encoding, for example when it parses a response containing binary audio data it won't stringify the binary data. The library avoids stringifying the body by performing offset slices on the input buffer.

# Usage

Here's an example.

`multipart_example.txt`

```
HTTP/1.1 200 OK
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary=frontier

This is a message with multiple parts in MIME format.
--frontier
Content-Type: text/plain

This is the body of the message.
--frontier
Content-Type: application/octet-stream
Content-Transfer-Encoding: base64

PGh0bWw+CiAgPGhlYWQ+CiAgPC9oZWFkPgogIDxib2R5PgogICAgPHA+VGhpcyBpcyB0aGUg
Ym9keSBvZiB0aGUgbWVzc2FnZS48L3A+CiAgPC9ib2R5Pgo8L2h0bWw+Cg==
--frontier
```

```javascript
const httpMessageParser = require('http-message-parser');

const parsedMessage = httpMessageParser(fs.createReadStream('multipart_example.txt'));

console.log(parsedMessage);
//
{
  httpVersion: 1.1,
  statusCode: 200,
  statusMessage: 'OK',
  method: null,
  url: null,
  headers: {
    'MIME-Version': '1.0'
    'Content-Type': 'multipart/mixed; boundary=frontier'
  },
  body: <Buffer>, // "This is a message with multiple parts in MIME format."
  boundary: 'frontier',
  multipart: [
    {
      headers: {
        'Content-Type': 'text/plain'
      },
      body: <Buffer> // "This is the body of the message."
    },
    {
      headers: {
        'Content-Type': 'application/octet-stream'
        'Content-Transfer-Encoding': 'base64'
      },
      body: <Buffer> // "PGh0bWw+CiAgPGhlYWQ+CiAgPC9oZWFkPgogIDxib2R5Pgog..."
    }
  ]
}
```

# Test

```bash
npm test
```

# License

MIT
