/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let total = 0;

  for (let i = 0; i < data; i++) {
    total += Math.sqrt(i);
  }

  postMessage(total);
});
