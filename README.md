# Angular WebExtension starter

A minimal starter kit to quickly get started on your [Angular](https://angular.io/) based webextension(s), made with [Gulp](https://gulpjs.com/).

## Installation

Open a terminal & clone this repository using git:

```
git clone https://github.com/AXeL-dev/angular-webextension-starter.git
```

Then install all the dependencies using npm:

```
cd angular-webextension-starter && npm install
```

Finally, make sure that both **Angular** & **Gulp** CLIs are installed:

```
npm install -g @angular/cli gulp-cli
```

## Usage

```
gulp new --name <EXTENSION_NAME>
```

:warning: All the newly created extensions will be under the `output` folder.

### Arguments

 argument         |  default  | description
----------------- | --------- | ---------------------
 **--name**       | -         | WebExtension name
 **--ver**        | 0.0.0     | WebExtension version
 **--author**     | -         | Author name
 **--url**        | -         | Homepage url
 **--skipTests**  | false     | When true, does not generate `spec.ts` test files for the new extension

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Package

Make sure you have the following package installed `npm install -g web-ext`. Then run:

```
npm run build && npm run package
```

## Contributing

Read [contributing guidelines](https://github.com/AXeL-dev/contributing/blob/master/README.md).

## License

This project is licensed under the [MPL2](LICENSE) license.
