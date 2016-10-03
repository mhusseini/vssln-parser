# vssln-parser
Parses Visual Studio Solution (sln) files and returns information about projects and project dependencies.

## Installation
Install package with NPM and add it to your development dependencies:
```npm install vssln-parser --save-dev```

## Usage
```typescript
var parse = require('vssln-parser').parse;
var fs = require('fs');
    
const stream = fs.createReadStream("test.sln");
parse(stream, solution => {
    for(let project of solution.projects) {
        console.log(project.name);
        console.log(project.type);
        
        for(let dependency of project.projectDependencies) {
            console.log(dependency);
        }
    }
});
```

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)