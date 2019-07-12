#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const commander = require('commander')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const chalk = require('chalk')
const ora = require('ora')

commander.parse(process.argv)

function delDir(path) {
    let files = []
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach((file, index) => {
            let curPath = `${path}/${file}`
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}

function copyDir(src, dist, callback) {
    fs.access(dist, (err) => {
        if (err) {
            // 目录不存在时创建目录
            fs.mkdirSync(dist)
        }
        _copy(null, src, dist)
    })

    function _copy(err, src, dist) {
        if (err) {
            callback(err)
        } else {
            fs.readdir(src, (err, paths) => {
                if (err) {
                    callback(err)
                } else {
                    paths.forEach((path) => {
                        const _src = src + '/' + path
                        const _dist = dist + '/' + path
                        fs.stat(_src, (err, stat) => {
                            if (err) {
                                callback(err)
                            } else {
                                // 判断是文件还是目录
                                if (stat.isFile()) {
                                    fs.writeFileSync(_dist, fs.readFileSync(_src))
                                } else if (stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}

(async () => {
    const url = commander.args[0].replace(/^.*github.com\//, '')
    const templatePath = path.join(__dirname, '../template')

    fs.existsSync(templatePath) && delDir(templatePath)
    let spinner = ora()
    spinner.start(chalk.yellow('downloading template ...'))

    try {
        await new Promise((resolve, reject) => {
            download(url, templatePath, { clone: false }, (err) => {
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
        const newTemplatePath = path.join(process.cwd(), `./template/templates/${template}`)
        const distPath = path.join(process.cwd(), commander.args[1])
        delDir(distPath)
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