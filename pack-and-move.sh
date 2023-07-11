#! /bin/bash

vsce package
mv -v list-open-files-*.vsix "/mnt/c/Users/$USER/Documents/docs/VSCode/"
