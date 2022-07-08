const fs = require('fs-extra')

const paths = {
    root: '..',
    public: 'public',
    pages: 'pages',
    build: 'build',
}
const publicPath = paths.public
const appPublicPagesPath = `${publicPath}/${paths.pages}`


const pagesPath = `${paths.root}/${paths.pages}`

// 确保目录是空的。如果目录非空删除目录内容。如果目录不存在,就创建一个。目录本身并不是删除
fs.emptyDirSync(appPublicPagesPath)

// 拷贝页面路径
copyPagesFolder(pagesPath)

function copyPagesFolder(pagesPath) {
    const childPaths = fs.readdirSync(pagesPath)
    console.log(childPaths)
    childPaths.forEach((name) => {
        const childDir = `${pagesPath}/${name}`
        let from = `${childDir}/${paths.build}`
        const to = `${appPublicPagesPath}/${name}`
        if (!fs.existsSync(from)) {
            from = childDir
        }
        copyFolder(from, to)
    })
}


// 拷贝目录
function copyFolder(from, to) {
    const filterFunc = (src, dest) => { 
        // 如果返回 true 将被复制
        const node_modules = `${src}/node_modules`
        if (fs.existsSync(node_modules)) {
            // 如果有node_modules
            console.log(`${node_modules} is exist`)
            return false
        }
        return true
    }
    fs.copySync(from, to, {
        dereference: true,
        filter: filterFunc
    })
}
