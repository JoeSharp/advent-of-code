#!/bin/bash

YEAR=$1
DAY=$2

cp -r src/$YEAR/dayX src/$YEAR/day$DAY

for file in $(ls "src/$YEAR/day$DAY"); do
	sed -i "s/dayX/day$DAY/g" src/$YEAR/day$DAY/$file
done
