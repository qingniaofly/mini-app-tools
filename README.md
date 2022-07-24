# mini-app-tools

A minimal Electron application tools

包含：音乐、小说、图片等小工具

## 说明

- [`app目录`]：electron目录
- [`pages目录`]：js、html、react

## 启动

```bash
# 只启动electron
yarn start

#  先编译pages下面的js和react，拷贝编译后的结果到app/public下面，最后启动electron
yarn dev

# 打包
yarn build

```


## 常见问题

- 1.Electron failed to install correctly, please delete node_modules/electron and try installing again
```bash
# https://github.com/electron/electron/issues/20994
npm set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ 
```