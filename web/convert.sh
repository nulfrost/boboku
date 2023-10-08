#!/bin/bash

if [[ -z "$1" ]]; then
    echo "Input file missing"
    exit 1
fi

if [[ "$1" == *.webm ]]; then
    echo "Input file is already a .webm file"
    exit 2
fi

input="$1"
output=$(basename "$input" "${input##*.}")webm

ffmpeg -i "$input" -c:v libvpx-vp9 -b:v 0 -crf 30 -pass 1 -row-mt 1 -an -f webm -y /dev/null
ffmpeg -i "$input" -c:v libvpx-vp9 -b:v 0 -crf 30 -pass 2 -row-mt 1 -c:a libopus -b:a 128k -ar 48000 -ac 2 "$output"