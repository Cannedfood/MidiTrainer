# MidiTrainer

A small single-page app for practicing drums, piano and other instruments with midi output.

Try it online [HERE](https://cannedfood.github.io/MidiTrainer/)

## WIP

This project is work in progress and is currently kind of useless.

## Building

```
npm install
npm run build
```
The only relevant file is `dist/index.html`


## Development

```
npm install
npm run watch # Automatically recompiles on change and provides a server with live updates
```

This project uses `parcel-bundler` to bundle the files.
For where a model-view binding is necessary we use `vue`.

## Notes/Ideas
- [Prerender via parcel plugin?](https://github.com/ABuffSeagull/parcel-plugin-prerender)
- Add [`parcel-plugin-inliner`](https://github.com/shff/parcel-plugin-inliner/issues/10) back in (Currently removed because it messes up `parcel watch`)
