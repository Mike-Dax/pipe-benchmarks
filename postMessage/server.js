const { ipcRenderer } = require("electron");

const { port1: clientPort, port2: serverPort } = new MessageChannel();

ipcRenderer.postMessage("port", null, [serverPort]);

const num = 20000;

let start = new Date().getTime();

let received = 0;

let receivedTotalCount = 0;
let sentTotalCount = 0;

let waitingFor = -1;

function sendBatch() {
  start = new Date().getTime();
  for (let index = 0; index <= num; index++) {
    clientPort.postMessage({
      keyA: index,
      keyB: index * 1000
    });
    sentTotalCount += index + index * 1000;
  }

  waitingFor = num;
}

clientPort.onmessage = e => {
  const data = e.data;

  receivedTotalCount += data.keyA + data.keyB;

  if (received === waitingFor) {
    console.log(
      `Finished ping-pong ${num} messages in ${new Date().getTime() -
        start}ms, ${(new Date().getTime() - start) / num}ms per message`,
      receivedTotalCount,
      sentTotalCount
    );
    received = 0;
    waitingFor = -1;
    sendBatch();
  }

  received++;
};

setTimeout(() => {
  sendBatch();
}, 1000);
