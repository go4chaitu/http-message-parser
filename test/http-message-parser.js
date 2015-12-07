const fs = require('fs');
const stream = require('stream');
const test = require('tape');
const httpMessageParser = require('../http-message-parser');

test('httpMessageParser', function (t) {
  'use strict';

  t.plan(48);

  // Test 1
  (function() {

    const data = fs.readFileSync(`${__dirname}/data/test_1/message.txt`);
    const parsedMessage = httpMessageParser(data);

    t.equal(parsedMessage.method, null);
    t.equal(parsedMessage.url, null);
    t.equal(parsedMessage.statusCode, null);
    t.equal(parsedMessage.statusMessage, null);
    t.equal(parsedMessage.httpVersion, null);
    t.equal(parsedMessage.boundary, 'fe08dcc5-e670-426c-9f13-679a8f3f623d');
    t.equal(parsedMessage.body, null);

    t.deepEqual(parsedMessage.multipart[0].headers, {
      'Content-Type': 'application/json'
    });

    t.equal(Buffer.isBuffer(parsedMessage.multipart[0].body), true);

    t.deepEqual(JSON.parse(parsedMessage.multipart[0].body.toString('utf8')), require('./data/test_1/part_0_body_expected.json'));

    t.deepEqual(parsedMessage.multipart[1].headers, {
      'Content-ID': '<DailyBriefingPrompt.Introduction:0ea4fffd-bf3b-4d67-8d49-4a3af2d0bd51_210149980>',
      'Content-Type': 'audio/mpeg'
    });

    t.equal(Buffer.isBuffer(parsedMessage.multipart[1].body), true);

    t.deepEqual(parsedMessage.multipart[2].headers, {
      'Content-ID': '<DailyBriefingPrompt.SubCategory:02e5604b-e814-4edb-add9-42bff30f5d3a:8ffe382e1b0d889922f61085f4d57927>',
      'Content-Type': 'audio/mpeg'
    });

    t.equal(Buffer.isBuffer(parsedMessage.multipart[2].body), true);

    /* Test the body output file manually with:
     * `cat file.txt | mpg123 -`
     *
     * You should hear "Here's your flash briefing".
     */
    const part0Output = fs.createWriteStream(`${__dirname}/data/test_1/part_1_body_actual.txt`);
    part0Output.write(parsedMessage.multipart[1].body);

     /* You should hear "in NPR news from TuneIn".
     */
    const part1Output= fs.createWriteStream(`${__dirname}/data/test_1/part_2_body_actual.txt`);
    part1Output.write(parsedMessage.multipart[2].body);
  })();

  // Test 2
  (function() {
    const data = fs.readFileSync(`${__dirname}/data/test_2/message.txt`);
    const parsedMessage = httpMessageParser(data);

    t.equal(parsedMessage.method, null);
    t.equal(parsedMessage.url, null);
    t.equal(parsedMessage.statusCode, 200);
    t.equal(parsedMessage.statusMessage, 'OK');
    t.equal(parsedMessage.httpVersion, 1.1);
    t.equal(parsedMessage.boundary, null);
    t.deepEqual(parsedMessage.headers, {
      'Date': 'Mon, 23 May 2005 22:38:34 GMT',
      'Server': 'Apache/1.3.3.7 (Unix) (Red-Hat/Linux)',
      'Last-Modified': 'Wed, 08 Jan 2003 23:11:55 GMT',
      'ETag': '"3f80f-1b6-3e1cb03b"',
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Length': 138,
      'Accept-Ranges': 'bytes',
      'Connection': 'close'
    });
    t.equal(parsedMessage.body.toString('utf8'), `<html>
<head>
  <title>An Example Page</title>
</head>
<body>
  Hello World, this is a very simple HTML document.
</body>
</html>
`);
  })();

  // Test 3
  (function() {
    const data = fs.readFileSync(`${__dirname}/data/test_3/message.txt`);
    const parsedMessage = httpMessageParser(data);

    t.equal(parsedMessage.method, null);
    t.equal(parsedMessage.url, null);
    t.equal(parsedMessage.statusCode, null);
    t.equal(parsedMessage.statusMessage, null);
    t.equal(parsedMessage.httpVersion, null);
    t.equal(parsedMessage.boundary, 'frontier');
    t.deepEqual(parsedMessage.headers, {
      'MIME-Version': 1.0,
      'Content-Type': 'multipart/mixed; boundary=frontier'
    });
    t.equal(parsedMessage.body.toString('utf8'), `This is a message with multiple parts in MIME format.
`);
    t.deepEqual(parsedMessage.multipart[0].headers, {
      'Content-Type': 'text/plain'
    });
    t.equal(parsedMessage.multipart[0].body.toString('utf8'), `This is the body of the message.
`);
    t.deepEqual(parsedMessage.multipart[1].headers, {
      'Content-Type': 'application/octet-stream',
      'Content-Transfer-Encoding': 'base64'
    });
    t.equal(parsedMessage.multipart[1].body.toString('utf8'), `PGh0bWw+CiAgPGhlYWQ+CiAgPC9oZWFkPgogIDxib2R5PgogICAgPHA+VGhpcyBpcyB0aGUg
Ym9keSBvZiB0aGUgbWVzc2FnZS48L3A+CiAgPC9ib2R5Pgo8L2h0bWw+Cg==
`);
  })();

  // Test 4
  (function() {
    const data = fs.readFileSync(`${__dirname}/data/test_4/message.txt`);
    const parsedMessage = httpMessageParser(data);

    t.equal(parsedMessage.method, 'POST');
    t.equal(parsedMessage.url, '/');
    t.equal(parsedMessage.statusCode, null);
    t.equal(parsedMessage.statusMessage, null);
    t.equal(parsedMessage.httpVersion, 1.1);
    t.equal(parsedMessage.boundary, '---------------------------9051914041544843365972754266');
    t.deepEqual(parsedMessage.headers, {
      'Host': 'localhost:8000',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Cookie': '__atuvc=34%7C7; permanent=0; _gitlab_session=226ad8a0be43681acf38c2fab9497240; __profilin=p%3Dt; request_method=GET',
      'Connection': 'keep-alive',
      'Content-Type': 'multipart/form-data; boundary=---------------------------9051914041544843365972754266',
      'Content-Length': 554
    });
    t.equal(parsedMessage.body, null);

    t.deepEqual(parsedMessage.multipart[0].headers, {
      'Content-Disposition': 'form-data; name="text"'
    });
    t.equal(parsedMessage.multipart[0].body.toString('utf8'), `text default.
`);
    t.deepEqual(parsedMessage.multipart[1].headers, {
      'Content-Disposition': 'form-data; name="file1"; filename="a.txt"',
      'Content-Type': 'text/plain'
    });
    t.equal(parsedMessage.multipart[1].body.toString('utf8'), `Content of a.txt.

`);
    t.deepEqual(parsedMessage.multipart[2].headers, {
      'Content-Disposition': 'form-data; name="file2"; filename="a.html"',
      'Content-Type': 'text/html'
    });
    t.equal(parsedMessage.multipart[2].body.toString('utf8'), `<!DOCTYPE html><title>Content of a.html.</title>

`);
  })();
});
