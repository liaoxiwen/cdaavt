# CDAAVT
Component dependency analysis and visualization tool.
## 下载
```
npm install cdaavt --save
```
## 使用
在package.json中的script字段中添加：
```
"cdaavt": "cdaavt -r"
```
使用`npm run cdaavt`指令运行

最后会在根目录生成 `testReport.html` 报告