const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const inquirer = require('inquirer')

if (Object.keys(argv).length === 1) {
  const input = fs.readFileSync('/dev/stdin', 'utf8')
  const filename = `${new Date().getTime()}.txt`

  fs.writeFile(`./memos/${filename}`, input, (err) => {
    if (err) {
      throw err
    } else {
      console.log('メモが作成されました')
    }
  })
}

if (argv.l) {
  const memos = fs.readdirSync('memos')
  for (const memo of memos) {
    const memoContent = fs.readFileSync(`./memos/${memo}`, 'utf-8')
    console.log(memoContent.split('\n')[0])
  }
}

if (argv.r) {
  const memos = fs.readdirSync('memos')
  const memosFirstLine = []

  for (const memo of memos) {
    const memoContent = fs.readFileSync(`./memos/${memo}`, 'utf-8')
    memosFirstLine.push(memoContent.split('\n')[0])
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'memo',
        message: 'Choose a note you want to see:',
        choices: memosFirstLine
      }
    ])
    .then(answers => {
      const noteIdx = memosFirstLine.indexOf(answers.memo)
      const noteFile = memos[noteIdx]
      const content = fs.readFileSync(`./memos/${noteFile}`, 'utf-8')
      console.log(content)
    })
}

if (argv.d) {
  const memos = fs.readdirSync('memos')
  const memosFirstLine = []

  for (const memo of memos) {
    const memoContent = fs.readFileSync(`./memos/${memo}`, 'utf-8')
    memosFirstLine.push(memoContent.split('\n')[0])
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'memo',
        message: 'Choose a note you want to delete:',
        choices: memosFirstLine
      }
    ])
    .then(answers => {
      const noteIdx = memosFirstLine.indexOf(answers.memo)
      const noteFile = memos[noteIdx]
      fs.unlinkSync(`./memos/${noteFile}`)
      console.log('メモを削除しました')
    })
}
