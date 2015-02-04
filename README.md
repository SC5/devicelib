# devicelib

Device loaning system for office use.
Application uses USB device detection to detect attached devices and RFID reader to identify users.

## Installation
devicelib is based to angular-fullstack yeoman generator so installation instructions can also found from https://github.com/DaftMonk/generator-angular-fullstack
  
  Install yeoman
```
npm install -g yo
```

  Install angular-fullstack generator
```  
npm install -g generator-angular-fullstack
```

### OSX
  Install Mongo

OSX:  
```
brew install mongod
```

Install SASS
  
  OSX:
```  
gem install sass
```


### Ubuntu

```
sudo apt-get install mongod sass
```

### Dependencies

  node dependencies
```  
npm install
```

  bower dependencies
```  
bower install
```

## Development

```
grunt serve
```

## Build
```
grunt build
```
Application distribution version can be found from ```/dist``` directory
