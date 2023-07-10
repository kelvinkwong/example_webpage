#!/bin/bash

# https://imagemagick.org/archive/binaries/magick

IMAGEMAGICK="imagemagick"
if [[ ! -f "$IMAGEMAGICK" ]]
then
curl 'https://imagemagick.org/archive/binaries/magick' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Accept-Language: en-AU,en-US;q=0.9,en;q=0.8' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: ImageMagick=k34st66ko4j47jdgb0t39eei1j' \
  -H 'Pragma: no-cache' \
  -H 'Referer: https://imagemagick.org/script/download.php' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (ARRIS_Foxtel_STB_QH5515ZF; Linux armv7l) AppleWebKit/605.1.15 (KHTML, like Gecko) WPE ARRIS_Foxtel_STB_QH5515ZF/1.20.5.5  (Foxtel,QH5515ZF,wired)' \
  -H 'sec-ch-ua: ""' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: ""' \
  --compressed \
  --output "$IMAGEMAGICK"
fi

if [[ -f "$IMAGEMAGICK" ]]
then
    # https://stackoverflow.com/a/630433
    for xcf in $(ls *.xcf)
    do
        chmod +x $IMAGEMAGICK
        command="./$IMAGEMAGICK convert -flatten \"$xcf\" \"${xcf/xcf/png}\""
        echo $command
        eval $command
    done
fi
