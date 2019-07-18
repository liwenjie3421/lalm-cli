const fs = require('fs')

const download = require('download-git-repo')

function delDir(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
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

function copyDir(src, dist) {
    const exist = fs.existsSync(dist)
    if (!exist) {
        fs.mkdirSync(dist, {
            mode: 0777
        })
    } else {
        _copy(src, dist)
    }

    function _copy(src, dist) {
        fs.readdirSync(src).forEach((path) => {
            const _src = `${src}/${path}`
            const _dist = `${dist}/${path}`
            if (fs.statSync(_src).isFile()) {
                fs.writeFileSync(_dist, fs.readFileSync(_src), {
                    mode: 0777
                })
            } else if (stat.isDirectory()) {
                copyDir(_src, _dist)
            }
        })
    }
}

function downloadSync(url, templatesPath) {
    return new Promise((resolve, reject) => {
        download(url, templatesPath, { clone: false }, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

module.exports = {
    delDir,
    copyDir,
    downloadSync
}