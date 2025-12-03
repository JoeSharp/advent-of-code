#!/bin/bash

YEAR=$1
DAY=$2

echo "Creating Day $DAY in year $YEAR"

cp -r src/$YEAR/dayX src/$YEAR/day$DAY

for file in $(ls "src/$YEAR/day$DAY"); do
	echo "Copying File $file"
	sed -i "s/dayX/day$DAY/g" src/$YEAR/day$DAY/$file
done
