# Linux Command

这个仓库是克隆自 [jaywcjlove/linux-command](https://github.com/jaywcjlove/linux-command)，在此基础上做了些改动。

## Web 版本

- 示例网站：[Linux命令搜索引擎](https://www.piwind.com/apps/linux-command/)

你可以随意部署 web 版，这非常简单，只需要克隆 `gh-pages` 分支代码到你的静态服务就可以了。你也可以将 `command` 目录中的 Markdown 文件拿去自己生成 HTML。

## 有关CI和部署方式

- 写法1（本仓库目前用的）：

  ```yaml
        - name: Deploy to GitHub Pages
          run: |
            git config --global user.name "GitHub Actions"
            git config --global user.email "actions@github.com"
            cat .gitignore > .gitignore.backup
            git checkout --orphan gh-pages-temp
            git rm -rf .
            mv .gitignore.backup .gitignore
            cp -r .deploy/. .
            git add -A -- . ':!.gitignore'
            git commit -m "Deploy to GitHub Pages"
            git push origin gh-pages-temp:gh-pages --force
  ```

  摧毁gh-pages原分支的所有内容，得到只有1个commit的分支，好处是不会让gh-pages的分支越变越大，坏处是部署后的项目每次更新都是删除后重新克隆。

  **示例部署和更新：**

  ```bash
  ## 部署
  cd /data/linux/project
  git clone --branch gh-pages https://github.com/piwind/linux-command.git
  
  ## 更新
  rm -rf /data/linux/project/linux-command
  cd /data/linux/project
  git clone --branch gh-pages https://github.com/piwind/linux-command.git
  ```

- 写法2：

  ```yaml
        - name: Deploy to GitHub Pages
          uses: JamesIves/github-pages-deploy-action@v4
          with:
            folder: .deploy
            branch: gh-pages
  ```

  传统的推送方式，gh-pages会记录完整的commits，方便查看改动和更新，缺点是会让gh-pages的分支体积变大（但是本仓库去掉了构建后的二进制产物，体积过大的问题也几乎不会发生）

  **传统部署和更新方式：**

  ```bash
  ## 部署
  cd /data/linux/project
  git clone --branch gh-pages https://github.com/piwind/linux-command.git
  
  ## 更新
  cd /data/linux/project/linux-command
  git pull
  ```

  **保持干净本地仓库的方式：**

  ```bash
  ## 部署
  cd /data/linux/project
  # 添加depth 1以仅保留最新的commit，避免本地仓库体积过大
  git clone --depth 1 --branch gh-pages https://github.com/piwind/linux-command.git
  
  ## 更新
  cd /data/linux/project/linux-command
  # 仅获取最新的一次commit
  git fetch origin --depth=1
  # 硬重置到最新提交，丢弃本地历史
  git reset --hard origin/gh-pages
  # 清理未跟踪文件
  git clean -fd
  # 删除本地已存在的旧commit的对象
  git gc --prune=now
  ```

## TODO

- 纠正错误、添加实例 两个按钮的链接要改下

