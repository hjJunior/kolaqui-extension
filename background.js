// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// const baseUrl = 'https://kolaqui.herokuapp.com/api';
const baseUrl = 'https://kolaqui.herokuapp.com/api';

const sendToServer = ({path, method, body}, callback) => {
  return fetch(
    `${baseUrl}/${path}`,
    {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      },
    }
  ).then((result) => {
    debugger;
    callback(result.body);
  });
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'avagraduacao.unievangelica.edu.br'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Pushing to server: ', request);
  debugger;

  sendToServer({
    ...request
  }, (payload) => {
    debugger;
    chrome.runtime.sendMessage(sender.tab.id, payload);
  });
});
