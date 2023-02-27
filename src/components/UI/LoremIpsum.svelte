<script lang="ts">
  // コンポーネントプロパティ
  export let lineLength = 40  // Characters per line
  export let lineCount = 20   // Count of lines per div
  export let blockCount = 1   // Count of div
  export let blockGap = 1     // margin-bottom of div (em)

  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, '
    + 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
    + 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris '
    + 'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in '
    + 'reprehenderit in voluptate velit esse cillum dolore eu fugiat '
    + 'nulla pariatur. Excepteur sint occaecat cupidatat non proident, '
    + 'sunt in culpa qui officia deserunt mollit anim id est laborum. '

  function makeLine(pos, len) {
    let line
    if (pos + len > loremIpsum.length) {
      line = loremIpsum.substring(pos, loremIpsum.length)
        + makeLine(0, len - (loremIpsum.length - pos))
    } else {
      line = loremIpsum.substring(pos, pos + len)
    }
    return line
  }

  let innerHtml = ((lineLength, lineCount, blockCount) => {
    lineLength = Math.max(lineLength, 1)
    lineCount = Math.max(lineCount, 1)
    blockCount = Math.max(blockCount, 1)

    let html = ''
    for (let i = 0; i < blockCount; i++) {
      if (i < blockCount - 1) {
        html += `<div style="margin-bottom: ${blockGap}em">`
      } else {
        html += '<div>'
      }
      let pos = 0
      let blockContent = ''
      for (let j = 0; j < lineCount; j++) {
        blockContent += makeLine(pos, lineLength)
        if (j < lineCount - 1) {
          blockContent += '<br>'
        }
        pos = (pos + lineLength) % loremIpsum.length
      }
      html += blockContent + '</div>'
    }
    return html
  })(lineLength, lineCount, blockCount)
</script>

<div>{@html innerHtml}</div>

