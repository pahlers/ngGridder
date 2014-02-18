# ngGridder

Combine AngularJS and Twitter Bootstrap grid system into an editable grid (codename laughing-meme). Every grid panel loads a directive for settings and the content. Did you know you can nest ngGridder in ngGridder? See the example.

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://github.com/eonlepapillon/ngGridder/blob/master/dist/ngGridder.min.js
[max]: https://github.com/eonlepapillon/ngGridder/blob/master/dist/ngGridder.js

And the *.html files in the [dist][https://github.com/eonlepapillon/ngGridder/blob/master/dist/]

Install ```jQuery```, ```Twitter bootstrap``` and ```Angular``` (duh!).

Prepare your web page. Use the ```./example/index.html``` as an example.
* load all the css (twitter bootstrap and custom css);
* load all  the javascript (jQuery, twitter bootstrap, Angular, ngGridder and all your panels)

Add ```ngGridder``` with all your panels to your list of your dependencies in your app module.

```javascript
angular.module('example', ['ngGridder', 'panel1', 'panel…'])
  .config(function(ngGridderSettingsProvider) {
    ngGridderSettingsProvider.set({
      …
    });
  })
```

## Documentation

### Directive

```html
<ng-gridder layout="layout" panel-types="panelTypes" changed="changed()" editable="editable"></ng-gridder>
```

* layout, layout of the grid, see Layout for structure;
* panelTypes, all the types of panels you can want to choose from;
* changed(), the callback function when the model is changed. It's better not to use the $watch function;
* editable, global editable, true for read-write, false for read-only.

### Settings

With ```ngGridderSettingsProvider``` you can change a few defaults.

```javascript
{
  path: {
    panelDir: './views/panels/', // directory of the panels
    panelHtml: '/panel.html', // template name of the content
    settingsHtml: '/settings.html', // template name of the settings
  },
  template:{
    ngGridder: 'ngGridder.html', // template of the ngGridder directive
    ngGridderRow: 'ngGridder-row.html', // template of the ngGridder row directive
    ngGridderCol: 'ngGridder-col.html' // template of the ngGridder col directive
  },
  panel:{
    minWidth: 1, // Minimal panel width
    maxWidth: 12 // Maximal panel width
  }
}
```

### Layout
 
```javascript
$scope.layout = [
  { // A Row
    cols: [
      { // A col (or panel)
        type: '…', // Name of the panel directory
        width: { // Bootstrap grid system http://getbootstrap.com/css/#grid
          xs: 12, // Class prefix .col-xs-
          sm: 12, // Class prefix .col-sm-
          md: 6, // Class prefix .col-md-
          lg: 3 // Class prefix .col-lg-
        },
        settings: { // An Object with the settings for the panel.
          … 
        }
      }
    ]
  },
  …
];
```

### Panels

A panel needs two html-files and optional a javascript-file:
* panel.html, for the template of the content;
* settings.html, for the template of the settings content;
* *.js, module with contains the directives. See the example for the examples ```abc```, ```def``` and ```grid```

The panel.html and settings.html will be compiled on the fly. The template will be stored in the templateCache.

## Examples
See directory ```./example```

## Grunt

Grunt commands:
* ```grunt serve```, to serve the example
* ```grunt test```, to test the directive
* ```grunt build```, to (re)build the dist versions.
