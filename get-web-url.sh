#!/bin/bash

input=$@

root="$(dirname $(readlink -f $0))/docs/"
hostname="https://kelvinkwong.github.io/example_webpage/"

function get-web-url() {
    for something in $@
    do
        readlink -f "$something" | sed "s@${root}@${hostname}@g"
    done
}

get-web-url $@
