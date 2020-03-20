# pipe-benchmarks

Some benchmarks of IPC methods within Electron.

You'll need to build Electron 10 yourself and run it against `main.js`.

Results

```
sendTo x 1.51 ops/sec ±0.46% (12 runs sampled)
MessageChannel x 1.19 ops/sec ±2.43% (10 runs sampled)
```
