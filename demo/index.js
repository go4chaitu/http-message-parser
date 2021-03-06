(function() {
  /* globals httpMessageParser: true */
  'use strict';

  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const parseButton = document.getElementById('parse');

  parseButton.addEventListener('click', parse);

  function parse() {
    output.innerHTML = '<pre><code>' + escapeHtml(JSON.stringify(httpMessageParser(input.value), null, 2)) + '<code></pre>';
  }

  function escapeHtml(text) {
    return text.replace(/[\"&<>]/g, function (a) {
      return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
    });
  }

  parse();
})();
