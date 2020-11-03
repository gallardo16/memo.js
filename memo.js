const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const inquirer = require('inquirer')

class Memo {
  constructor () {
//    this.argv = require('minimist')(process.argv.slice(2))
//    this.fs = require('fs')
//    this.inquirer = require('inquirer')
  }

  create () {
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

  showList () {
    const memos = fs.readdirSync('memos')
    for (const memo of memos) {
      const memoContent = fs.readFileSync(`./memos/${memo}`, 'utf-8')
      console.log(memoContent.split('\n')[0])
    }
  }

  show () {
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

  destroy () {
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
}

const memo = new Memo()
if (Object.keys(argv).length === 1) {
  memo.create()
} else if (argv.l) {
  memo.showList()
} else if (argv.r) {
  memo.show()
} else if (argv.d) {
  memo.destroy()
}
