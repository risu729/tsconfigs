# Risu's tsconfigs

This repository is for [tsconfig presets](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) to be used in my projects.

## Usage

### Install

```bash
bun add --save-dev @risu729/tsconfigs
```

### Configuration

Add the following to your `tsconfig.json` file:

```json
{
	"extends": ["@risu729/tsconfigs/bundler"]
}
```

or if you use tsc to transpile your code:

```json
{
	"extends": ["@risu729/tsconfigs/tsc"]
}
```
