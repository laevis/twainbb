## v2.0.0

- Breaking: change the interface to pull in the directory structure creation and languagepack JSON (spundle) creation. 
This leaves the "writer" method to wrap the JSON as necessary and then write the file.

## v1.0.1

- Bug fix: Use OS-appropriate path separator in regular expression that pulls locale from file path. See #1