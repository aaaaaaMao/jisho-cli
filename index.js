#! /usr/bin/env node

const { program } = require('commander')
const JishoApi = require('unofficial-jisho-api')
const Table = require('cli-table3')

const jisho = new JishoApi()

program
  .option('-p, --phrase', 'search for phrase')
  .option('-en, --english', 'search for phrase of english word')

async function main() {
  program.parse(process.argv)
  const options = program.opts()

  let search = program.args.join().trim()
  if (options.english) {
    search = `"${search}"`
  }
  console.log(search)
  const result = await jisho.searchForPhrase(search)

  const header = ['word', 'reading', 'is_common', 'jlpt']
  const table = new Table({
    head: header,
    colWidths: [20, 30, 14, 10],
    colAligns: ['left'],
    style: { 'padding-right': 0 }
  })

  for (const item of result.data) {
    if (item.japanese && Array.isArray(item.japanese)) {
      const jlpt = item.jlpt && Array.isArray(item.jlpt)
        ? item.jlpt.join(' ')
        : ''
      for (const jp of item.japanese) {
        table.push([jp.word || '', jp.reading || '', item.is_common || '', jlpt])
      }
    }
  }
  console.log(table.toString())
  // console.log(JSON.stringify(result.data[0], null, 2))
}

main().catch(console.error)
