#!/bin/bash

echo "--Angular Project compiling to package.zip"
ng build
zip -r package.zip dist
rm -R dist
