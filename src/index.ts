import * as commander from 'commander'
import * as inquirer from 'inquirer'
import * as download from 'download-git-repo'
import chalk from 'chalk'
import ora from 'ora'

// inquirer
//     .prompt([
//         {
//             type: 'input',
//             name: 'test',
//             message: 'r u ok',
//             default: 'ok'
//         }
//     ])
//     .then(answers => {
//         console.log(answers)
//     })

// console.log(chalk.blue('1234'))

// let spinner = ora('downloading template ...')
// spinner.start()
// setTimeout(() => {
//     spinner.stop()
// }, 5000)


// download('liwenjie3421/lalm-cli#master', './template', { clone: false }, (err) => {
//     console.log(err || 'download success')
// })