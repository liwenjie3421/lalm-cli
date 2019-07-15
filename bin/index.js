#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const commander = require('commander')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const chalk = require('chalk')
const ora = require('ora')

const { delDir, copyDir } = require('../lib/utils')

commander.parse(process.argv)

;(async () => {
    const url = commander.args[0].replace(/^.*github.com\//, '')
    console.log('__dirname', __dirname)
    const templatesPath = path.join(__dirname, '../template')

    fs.existsSync(templatesPath) && delDir(templatesPath)
    let spinner = ora()
    spinner.start(chalk.yellow('downloading template ...'))

    try {
        await new Promise((resolve, reject) => {
            download(url, templatesPath, { clone: false }, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
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
        const newTemplatePath = path.join(templatesPath, `/templates/${template}`)
        const distPath = path.join(process.cwd(), commander.args[1])
        delDir(distPath)
        return
        fs.mkdirSync(distPath)

        spinner.start(chalk.yellow(`copying template to ${commander.args[1]}`))


        copyDir(newTemplatePath, commander.args[1], (err) => {
            if (err) {
                spinner.fail(chalk.red(err.toString()))
            }
        })

        spinner.stop()
        console.log(chalk.green(`create ${commander.args[1]} success`))
        console.log(`
        you can: \n
        $ cd ${distPath}\n
        $ npm install \n
    `)
    } catch (err) {
        spinner.fail(chalk.red(err.toString()))
    }
})()