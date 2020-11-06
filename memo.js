const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const inquirer = require('inquirer')

class Memo {
  constructor () {
    this.notes = fs.readdirSync('memos')
    this.firstLineOfNotes = []
    for (const note of this.notes) {
      const noteContent = fs.readFileSync(`./memos/${note}`, 'utf-8')
      this.firstLineOfNotes.push(noteContent.split('\n')[0])
    }
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
    console.log(this.firstLineOfNotes.join('\n'))
  }

  show () {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'note',
          message: 'Choose a note you want to see:',
          choices: this.firstLineOfNotes
        }
      ])
      .then(answers => {
        const noteIdx = this.firstLineOfNotes.indexOf(answers.note)
        const noteFile = this.notes[noteIdx]
        const content = fs.readFileSync(`./memos/${noteFile}`, 'utf-8')
        console.log(content)
      })
  }

  destroy () {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'note',
          message: 'Choose a note you want to delete:',
          choices: this.firstLineOfNotes
        }
      ])
      .then(answers => {
        const noteIdx = this.firstLineOfNotes.indexOf(answers.note)
        const noteFile = this.notes[noteIdx]
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
