const fs = require('fs')

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

module.exports = {
    delDir,
    copyDir(src, dist) {
        const error = fs.existsSync(dist)
        if (error) {
            fs.mkdirSync(dist)
        } else {
            _copy(src, dist)
        }

        function _copy(src, dist) {
            fs.readdirSync(src).forEach((path) => {
                const _src = `${src}/${path}`
                const _dist = `${dist}/${path}`
                if (fs.statSync(_src).isFile()) {
                    fs.writeFileSync(_dist, fs.readFileSync(_src))
                } else if (stat.isDirectory()) {
                    copyDir(_src, _dist)
                }
            })
        }
    }
}