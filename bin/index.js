#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const commander = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')

const { delDir, copyDir, downloadSync } = require('../lib/utils')

commander.parse(process.argv)
const distDir = commander.args[1]
const distPath = path.join(process.cwd(), distDir)

;(async () => {
    const url = commander.args[0].replace(/^.*github.com\//, '')
    const downloadTemplatesPath = path.join(__dirname, '../template')
    fs.existsSync(downloadTemplatesPath) && delDir(downloadTemplatesPath)
    const spinner = ora()
    try {
        const checked = await __checkDistPath()
        if (!checked) return

        spinner.start(chalk.yellow('downloading template ...'))
        await downloadSync(url, downloadTemplatesPath)
        spinner.stop()
        console.log(chalk.green('download success!'))

        const templates = fs.readdirSync(path.join(__dirname, '../template/templates'))
        const { template } = await inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: 'choose the template',
                choices: templates
            }
        ])
        const selectedTemplatePath = path.join(downloadTemplatesPath, `/templates/${template}`)

        spinner.start(chalk.yellow(`copying template to ${distPath}`))
        copyDir(selectedTemplatePath, distPath)
        spinner.stop()

        console.log(chalk.green(`create ${distPath} success`))
        console.log(`you can:`)
        console.log(chalk.green(`
$ cd ${distDir}\n
$ npm install \n
        `))
        
    } catch (err) {
        spinner.fail(chalk.red(err.toString()))
    }
})()

async function __checkDistPath() {
    if (fs.existsSync(distPath)) {
        const { del } = await inquirer.prompt([
            {
                type: 'input',
                name: 'del',
                message: `已存在文件夹${distDir}， 是否删除文件夹并继续？(y/n)`,
                default: 'n'
            }
        ])
        if (del === 'y') {
            delDir(distPath)
            return true
        }
        return false
    }
    return true
}