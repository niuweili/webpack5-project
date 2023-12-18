### 一个自动合成雪碧图的loader

[spritesmith](https://www.npmjs.com/package/spritesmith)

基于spritesmith来生成雪碧图文件

1. 匹配?__sprite后缀生成sprite.png
2. 替换css中的url

转换前
```
.img1 {
    background: url(./images/box1.png?__sprite);
}

.img2 {
    background: url(./images/box2.png?__sprite);
}
```

转换后

```
.img1 {
    background: url("dist/sprite.png");
}

.img2 {
    background: url("dist/sprite.png");
}
```
