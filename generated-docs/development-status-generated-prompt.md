Last updated: 2026-02-14

# 開発状況生成プロンプト（開発者向け）

## 生成するもの：
- 現在openされているissuesを3行で要約する
- 次の一手の候補を3つlistする
- 次の一手の候補3つそれぞれについて、極力小さく分解して、その最初の小さな一歩を書く

## 生成しないもの：
- 「今日のissue目標」などuserに提案するもの
  - ハルシネーションの温床なので生成しない
- ハルシネーションしそうなものは生成しない（例、無価値なtaskや新issueを勝手に妄想してそれをuserに提案する等）
- プロジェクト構造情報（来訪者向け情報のため、別ファイルで管理）

## 「Agent実行プロンプト」生成ガイドライン：
「Agent実行プロンプト」作成時は以下の要素を必ず含めてください：

### 必須要素
1. **対象ファイル**: 分析/編集する具体的なファイルパス
2. **実行内容**: 具体的な分析や変更内容（「分析してください」ではなく「XXXファイルのYYY機能を分析し、ZZZの観点でmarkdown形式で出力してください」）
3. **確認事項**: 変更前に確認すべき依存関係や制約
4. **期待する出力**: markdown形式での結果や、具体的なファイル変更

### Agent実行プロンプト例

**良い例（上記「必須要素」4項目を含む具体的なプロンプト形式）**:
```
対象ファイル: `.github/workflows/translate-readme.yml`と`.github/workflows/call-translate-readme.yml`

実行内容: 対象ファイルについて、外部プロジェクトから利用する際に必要な設定項目を洗い出し、以下の観点から分析してください：
1) 必須入力パラメータ（target-branch等）
2) 必須シークレット（GEMINI_API_KEY）
3) ファイル配置の前提条件（README.ja.mdの存在）
4) 外部プロジェクトでの利用時に必要な追加設定

確認事項: 作業前に既存のworkflowファイルとの依存関係、および他のREADME関連ファイルとの整合性を確認してください。

期待する出力: 外部プロジェクトがこの`call-translate-readme.yml`を導入する際の手順書をmarkdown形式で生成してください。具体的には：必須パラメータの設定方法、シークレットの登録手順、前提条件の確認項目を含めてください。
```

**避けるべき例**:
- callgraphについて調べてください
- ワークフローを分析してください
- issue-noteの処理フローを確認してください

## 出力フォーマット：
以下のMarkdown形式で出力してください：

```markdown
# Development Status

## 現在のIssues
[以下の形式で3行でオープン中のissuesを要約。issue番号を必ず書く]
- [1行目の説明]
- [2行目の説明]
- [3行目の説明]

## 次の一手候補
1. [候補1のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```

2. [候補2のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```

3. [候補3のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```
```


# 開発状況情報
- 以下の開発状況情報を参考にしてください。
- Issue番号を記載する際は、必ず [Issue #番号](../issue-notes/番号.md) の形式でMarkdownリンクとして記載してください。

## プロジェクトのファイル一覧
- .github/actions-tmp/.github/workflows/call-callgraph.yml
- .github/actions-tmp/.github/workflows/call-daily-project-summary.yml
- .github/actions-tmp/.github/workflows/call-issue-note.yml
- .github/actions-tmp/.github/workflows/call-rust-windows-check.yml
- .github/actions-tmp/.github/workflows/call-translate-readme.yml
- .github/actions-tmp/.github/workflows/callgraph.yml
- .github/actions-tmp/.github/workflows/check-large-files.yml
- .github/actions-tmp/.github/workflows/check-recent-human-commit.yml
- .github/actions-tmp/.github/workflows/daily-project-summary.yml
- .github/actions-tmp/.github/workflows/issue-note.yml
- .github/actions-tmp/.github/workflows/rust-windows-check.yml
- .github/actions-tmp/.github/workflows/translate-readme.yml
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/callgraph.ql
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/codeql-pack.lock.yml
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/qlpack.yml
- .github/actions-tmp/.github_automation/callgraph/config/example.json
- .github/actions-tmp/.github_automation/callgraph/docs/callgraph.md
- .github/actions-tmp/.github_automation/callgraph/presets/callgraph.js
- .github/actions-tmp/.github_automation/callgraph/presets/style.css
- .github/actions-tmp/.github_automation/callgraph/scripts/analyze-codeql.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/callgraph-utils.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/check-codeql-exists.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/check-node-version.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/common-utils.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/copy-commit-results.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/extract-sarif-info.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/find-process-results.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/generate-html-graph.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/generateHTML.cjs
- .github/actions-tmp/.github_automation/check-large-files/README.md
- .github/actions-tmp/.github_automation/check-large-files/check-large-files.toml.example
- .github/actions-tmp/.github_automation/check-large-files/scripts/check_large_files.py
- .github/actions-tmp/.github_automation/check_recent_human_commit/scripts/check-recent-human-commit.cjs
- .github/actions-tmp/.github_automation/project_summary/docs/daily-summary-setup.md
- .github/actions-tmp/.github_automation/project_summary/prompts/development-status-prompt.md
- .github/actions-tmp/.github_automation/project_summary/prompts/project-overview-prompt.md
- .github/actions-tmp/.github_automation/project_summary/scripts/ProjectSummaryCoordinator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/DevelopmentStatusGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/GitUtils.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/IssueTracker.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/generate-project-summary.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/CodeAnalyzer.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectAnalysisOrchestrator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectDataCollector.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectDataFormatter.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectOverviewGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/BaseGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/FileSystemUtils.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/ProjectFileUtils.cjs
- .github/actions-tmp/.github_automation/translate/docs/TRANSLATION_SETUP.md
- .github/actions-tmp/.github_automation/translate/scripts/translate-readme.cjs
- .github/actions-tmp/.gitignore
- .github/actions-tmp/.vscode/settings.json
- .github/actions-tmp/LICENSE
- .github/actions-tmp/README.ja.md
- .github/actions-tmp/README.md
- .github/actions-tmp/_config.yml
- .github/actions-tmp/generated-docs/callgraph.html
- .github/actions-tmp/generated-docs/callgraph.js
- .github/actions-tmp/generated-docs/development-status-generated-prompt.md
- .github/actions-tmp/generated-docs/development-status.md
- .github/actions-tmp/generated-docs/project-overview-generated-prompt.md
- .github/actions-tmp/generated-docs/project-overview.md
- .github/actions-tmp/generated-docs/style.css
- .github/actions-tmp/googled947dc864c270e07.html
- .github/actions-tmp/issue-notes/10.md
- .github/actions-tmp/issue-notes/11.md
- .github/actions-tmp/issue-notes/12.md
- .github/actions-tmp/issue-notes/13.md
- .github/actions-tmp/issue-notes/14.md
- .github/actions-tmp/issue-notes/15.md
- .github/actions-tmp/issue-notes/16.md
- .github/actions-tmp/issue-notes/17.md
- .github/actions-tmp/issue-notes/18.md
- .github/actions-tmp/issue-notes/19.md
- .github/actions-tmp/issue-notes/2.md
- .github/actions-tmp/issue-notes/20.md
- .github/actions-tmp/issue-notes/21.md
- .github/actions-tmp/issue-notes/22.md
- .github/actions-tmp/issue-notes/23.md
- .github/actions-tmp/issue-notes/24.md
- .github/actions-tmp/issue-notes/25.md
- .github/actions-tmp/issue-notes/26.md
- .github/actions-tmp/issue-notes/27.md
- .github/actions-tmp/issue-notes/28.md
- .github/actions-tmp/issue-notes/29.md
- .github/actions-tmp/issue-notes/3.md
- .github/actions-tmp/issue-notes/30.md
- .github/actions-tmp/issue-notes/35.md
- .github/actions-tmp/issue-notes/38.md
- .github/actions-tmp/issue-notes/4.md
- .github/actions-tmp/issue-notes/40.md
- .github/actions-tmp/issue-notes/42.md
- .github/actions-tmp/issue-notes/7.md
- .github/actions-tmp/issue-notes/8.md
- .github/actions-tmp/issue-notes/9.md
- .github/actions-tmp/package-lock.json
- .github/actions-tmp/package.json
- .github/actions-tmp/src/main.js
- .github/check-large-files.toml
- .github/workflows/call-check-large-files.yml
- .github/workflows/call-daily-project-summary.yml
- .github/workflows/call-issue-note.yml
- .github/workflows/call-translate-readme.yml
- .github/workflows/deploy.yml
- .gitignore
- LICENSE
- README.ja.md
- README.md
- generated-docs/project-overview-generated-prompt.md
- index.html
- issue-notes/22.md
- issue-notes/23.md
- issue-notes/24.md
- issue-notes/25.md
- issue-notes/26.md
- issue-notes/27.md
- issue-notes/30.md
- issue-notes/45.md
- issue-notes/51.md
- issue-notes/56.md
- issue-notes/62.md
- issue-notes/64.md
- issue-notes/65.md
- issue-notes/66.md
- issue-notes/67.md
- issue-notes/68.md
- issue-notes/72.md
- issue-notes/74.md
- package-lock.json
- package.json
- src/audio.ts
- src/config.ts
- src/intonation.test.ts
- src/intonation.ts
- src/main.ts
- src/playback.test.ts
- src/playback.ts
- src/state.ts
- src/status.ts
- src/styleManager.test.ts
- src/styleManager.ts
- src/textLists.test.ts
- src/textLists.ts
- src/uiControls.ts
- src/visualization.ts
- tsconfig.json
- vite.config.ts

## 現在のオープンIssues
## [Issue #76](../issue-notes/76.md): 大きなファイルの検出: 3個のファイルが500行を超えています
以下のファイルが500行を超えています。リファクタリングを検討してください。

## 検出されたファイル

| ファイル | 行数 | 超過行数 |
|---------|------|----------|
| `src/intonation.ts` | 880 | +380 |
| `src/visualization.ts` | 864 | +364 |
| `index.html` | 671 | +171 |

## テスト実施のお願い

- リファクタリング前後にテストを実行し、それぞれのテスト失敗件数を報告してください
- リファクタリング前後のどちらかでテストがredの場合、ま...
ラベル: refactoring, code-quality, automated
--- issue-notes/76.md の内容 ---

```markdown

```

## [Issue #75](../issue-notes/75.md): Create issue when Deploy to GitHub Pages workflow fails
Adds automation to open or update an issue when the “Deploy to GitHub Pages” workflow fails.

## Changes
- Added `.github/workflows/create-issue-on-actions-failure.yml` listening to `workflow_run` of Deploy to GitHub Pages, gated to failures.
- Ensures `ci-failure` label exists, searches for an exis...
ラベル: 
--- issue-notes/75.md の内容 ---

```markdown

```

## [Issue #74](../issue-notes/74.md): GitHub Actionsでビルドが落ちたら、issueを起票するようにする。cat2151の他のリポジトリのワークフローを参考にする
[issue-notes/74.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/74.md)

...
ラベル: 
--- issue-notes/74.md の内容 ---

```markdown
# issue GitHub Actionsでビルドが落ちたら、issueを起票するようにする。cat2151の他のリポジトリのワークフローを参考にする #74
[issues #74](https://github.com/cat2151/voicevox-playground/issues/74)

# 落ちたビルドのURL
- https://github.com/cat2151/voicevox-playground/actions/runs/21991496344/job/63539577377


```

## [Issue #72](../issue-notes/72.md): イントネーション編集で、CTRL + 下や、下0.5x を押したとき、minが縮まないことがある
[issue-notes/72.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/72.md)

...
ラベル: good first issue
--- issue-notes/72.md の内容 ---

```markdown
# issue イントネーション編集で、CTRL + 下や、下0.5x を押したとき、minが縮まないことがある #72
[issues #72](https://github.com/cat2151/voicevox-playground/issues/72)

# 事例
- -0.0から縮まない
- 現在編集中のイントネーションのminが5あっても、5に到達せず、-0.0のまま
- 仮説
    - もしかして「-0.0という、最初に生成したときのイントネーション初期min」よりも大きくできない、という制約になっている？
    - もしそうなら、userの意図と違う。
    - CTRL + 下や、下0.5x を押したときのminの制約は、「現在編集中のイントネーションのminより大きくはできない」である。
        - この事例のケースだと、5まで到達してよい。-0.0でstopしてしまうのはuserの意図と違う。
- max側も同様である

```

## [Issue #68](../issue-notes/68.md): styleプルダウン、区切り文字、の右に「ランダムstyle」チェックボックスをつける
[issue-notes/68.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/68.md)

...
ラベル: good first issue
--- issue-notes/68.md の内容 ---

```markdown
# issue styleプルダウン、区切り文字、の右に「ランダムstyle」チェックボックスをつける #68
[issues #68](https://github.com/cat2151/voicevox-playground/issues/68)

- デフォルトoff。
- onにした場合、
    - styleプルダウンがランダムで決定される。
    - ループ再生ごとにランダムで変更される（なのでcache再生はされない）

```

## [Issue #67](../issue-notes/67.md): playボタンがstopボタンになっているとき、演奏stopができない
[issue-notes/67.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/67.md)

...
ラベル: good first issue
--- issue-notes/67.md の内容 ---

```markdown
# issue playボタンがstopボタンになっているとき、演奏stopができない #67
[issues #67](https://github.com/cat2151/voicevox-playground/issues/67)

- Tone.jsによるplayは、stopできるはず
- stopできない原因を調査せよ
- stopボタンにconsole.logをつけ、そもそもstop操作を受け付けているか？をデバッグできるようにせよ
- あらゆる局面でstopができるようなアーキテクチャにせよ
    - 例えばイントネーション編集中は、素早くstopして新たなイントネーション生成をするべきだろう
    - 「playが終了するまでstop操作をまったく受け付けない、つまりstopができない」のではUXが悪い

```

## [Issue #66](../issue-notes/66.md): playボタンのplayマークがダサい
[issue-notes/66.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/66.md)

...
ラベル: good first issue
--- issue-notes/66.md の内容 ---

```markdown
# issue playボタンのplayマークがダサい #66
[issues #66](https://github.com/cat2151/voicevox-playground/issues/66)

- emojiをやめてSVGにせよ
- ダウンロードボタンのフロッピーディスクemojiもダサいので外すべし

```

## [Issue #64](../issue-notes/64.md): キーボードa-zの機能がエンバグしているので修正する
[issue-notes/64.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/64.md)

...
ラベル: good first issue
--- issue-notes/64.md の内容 ---

```markdown
# issue キーボードa-zの機能がエンバグしているので修正する #64
[issues #64](https://github.com/cat2151/voicevox-playground/issues/64)

- a-zは、対応したモーラにfocusするだけでなくaならup、Aならdownすること
- 変化量は、最初にレスポンスで得たイントネーションminとmaxの間を10分割した1段階、で変化させること
    - ctrlを押しながらの場合、変化量を1/2すること
    - maxをoverしたら、同じ1段階ぶんだけmaxを増やす。minも同様。
- これにより、キーボードで思考の速さでイントネーション調整できるUXの可能性を開く、ことを目指す

```

## [Issue #51](../issue-notes/51.md): お気に入り管理欄が折りたたみできない。デフォルトで折りたたみして、「お気に入り管理」ボタンを押したら折りたたみ解除とせよ
[issue-notes/51.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/51.md)

...
ラベル: good first issue
--- issue-notes/51.md の内容 ---

```markdown
# issue お気に入り管理欄が折りたたみできない。デフォルトで折りたたみして、「お気に入り管理」ボタンを押したら折りたたみ解除とせよ #51
[issues #51](https://github.com/cat2151/voicevox-playground/issues/51)



```

## ドキュメントで言及されているファイルの内容
### .github/actions-tmp/issue-notes/2.md
```md
{% raw %}
# issue GitHub Actions「関数コールグラフhtmlビジュアライズ生成」を共通ワークフロー化する #2
[issues #2](https://github.com/cat2151/github-actions/issues/2)


# prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
このymlファイルを、以下の2つのファイルに分割してください。
1. 共通ワークフロー       cat2151/github-actions/.github/workflows/callgraph_enhanced.yml
2. 呼び出し元ワークフロー cat2151/github-actions/.github/workflows/call-callgraph_enhanced.yml
まずplanしてください
```

# 結果
- indent
    - linter？がindentのエラーを出しているがyml内容は見た感じOK
    - テキストエディタとagentの相性問題と判断する
    - 別のテキストエディタでsaveしなおし、テキストエディタをreload
    - indentのエラーは解消した
- LLMレビュー
    - agent以外の複数のLLMにレビューさせる
    - prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
以下の2つのファイルをレビューしてください。最優先で、エラーが発生するかどうかだけレビューしてください。エラー以外の改善事項のチェックをするかわりに、エラー発生有無チェックに最大限注力してください。

--- 共通ワークフロー

# GitHub Actions Reusable Workflow for Call Graph Generation
name: Generate Call Graph

# TODO Windowsネイティブでのtestをしていた名残が残っているので、今後整理していく。今はWSL act でtestしており、Windowsネイティブ環境依存問題が解決した
#  ChatGPTにレビューさせるとそこそこ有用そうな提案が得られたので、今後それをやる予定
#  agentに自己チェックさせる手も、セカンドオピニオンとして選択肢に入れておく

on:
  workflow_call:

jobs:
  check-commits:
    runs-on: ubuntu-latest
    outputs:
      should-run: ${{ steps.check.outputs.should-run }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 50 # 過去のコミットを取得

      - name: Check for user commits in last 24 hours
        id: check
        run: |
          node .github/scripts/callgraph_enhanced/check-commits.cjs

  generate-callgraph:
    needs: check-commits
    if: needs.check-commits.outputs.should-run == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      security-events: write
      actions: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set Git identity
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Remove old CodeQL packages cache
        run: rm -rf ~/.codeql/packages

      - name: Check Node.js version
        run: |
          node .github/scripts/callgraph_enhanced/check-node-version.cjs

      - name: Install CodeQL CLI
        run: |
          wget https://github.com/github/codeql-cli-binaries/releases/download/v2.22.1/codeql-linux64.zip
          unzip codeql-linux64.zip
          sudo mv codeql /opt/codeql
          echo "/opt/codeql" >> $GITHUB_PATH

      - name: Install CodeQL query packs
        run: |
          /opt/codeql/codeql pack install .github/codeql-queries

      - name: Check CodeQL exists
        run: |
          node .github/scripts/callgraph_enhanced/check-codeql-exists.cjs

      - name: Verify CodeQL Configuration
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs verify-config

      - name: Remove existing CodeQL DB (if any)
        run: |
          rm -rf codeql-db

      - name: Perform CodeQL Analysis
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs analyze

      - name: Check CodeQL Analysis Results
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs check-results

      - name: Debug CodeQL execution
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs debug

      - name: Wait for CodeQL results
        run: |
          node -e "setTimeout(()=>{}, 10000)"

      - name: Find and process CodeQL results
        run: |
          node .github/scripts/callgraph_enhanced/find-process-results.cjs

      - name: Generate HTML graph
        run: |
          node .github/scripts/callgraph_enhanced/generate-html-graph.cjs

      - name: Copy files to generated-docs and commit results
        run: |
          node .github/scripts/callgraph_enhanced/copy-commit-results.cjs

--- 呼び出し元
# 呼び出し元ワークフロー: call-callgraph_enhanced.yml
name: Call Call Graph Enhanced

on:
  schedule:
    # 毎日午前5時(JST) = UTC 20:00前日
    - cron: '0 20 * * *'
  workflow_dispatch:

jobs:
  call-callgraph-enhanced:
    # uses: cat2151/github-actions/.github/workflows/callgraph_enhanced.yml
    uses: ./.github/workflows/callgraph_enhanced.yml # ローカルでのテスト用
```

# レビュー結果OKと判断する
- レビュー結果を人力でレビューした形になった

# test
- #4 同様にローカル WSL + act でtestする
- エラー。userのtest設計ミス。
  - scriptの挙動 : src/ がある前提
  - 今回の共通ワークフローのリポジトリ : src/ がない
  - 今回testで実現したいこと
    - 仮のソースでよいので、関数コールグラフを生成させる
  - 対策
    - src/ にダミーを配置する
- test green
  - ただしcommit pushはしてないので、html内容が0件NG、といったケースの検知はできない
  - もしそうなったら別issueとしよう

# test green

# commit用に、yml 呼び出し元 uses をlocal用から本番用に書き換える

# closeとする
- もしhtml内容が0件NG、などになったら、別issueとするつもり

{% endraw %}
```

### .github/actions-tmp/issue-notes/4.md
```md
{% raw %}
# issue GitHub Actions「project概要生成」を共通ワークフロー化する #4
[issues #4](https://github.com/cat2151/github-actions/issues/4)

# prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
このymlファイルを、以下の2つのファイルに分割してください。
1. 共通ワークフロー       cat2151/github-actions/.github/workflows/daily-project-summary.yml
2. 呼び出し元ワークフロー cat2151/github-actions/.github/workflows/call-daily-project-summary.yml
まずplanしてください
```

# 結果、あちこちハルシネーションのあるymlが生成された
- agentの挙動があからさまにハルシネーション
    - インデントが修正できない、「失敗した」という
    - 構文誤りを認識できない
- 人力で修正した

# このagentによるセルフレビューが信頼できないため、別のLLMによるセカンドオピニオンを試す
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
以下の2つのファイルをレビューしてください。最優先で、エラーが発生するかどうかだけレビューてください。エラー以外の改善事項のチェックをするかわりに、エラー発生有無チェックに最大限注力してください。

--- 呼び出し元

name: Call Daily Project Summary

on:
  schedule:
    # 日本時間 07:00 (UTC 22:00 前日)
    - cron: '0 22 * * *'
  workflow_dispatch:

jobs:
  call-daily-project-summary:
    uses: cat2151/github-actions/.github/workflows/daily-project-summary.yml
    secrets:
      GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

--- 共通ワークフロー
name: Daily Project Summary
on:
  workflow_call:

jobs:
  generate-summary:
    runs-on: ubuntu-latest

    permissions:
      contents: write
      issues: read
      pull-requests: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0  # 履歴を取得するため

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          # 一時的なディレクトリで依存関係をインストール
          mkdir -p /tmp/summary-deps
          cd /tmp/summary-deps
          npm init -y
          npm install @google/generative-ai @octokit/rest
          # generated-docsディレクトリを作成
          mkdir -p $GITHUB_WORKSPACE/generated-docs

      - name: Generate project summary
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          NODE_PATH: /tmp/summary-deps/node_modules
        run: |
          node .github/scripts/generate-project-summary.cjs

      - name: Check for generated summaries
        id: check_summaries
        run: |
          if [ -f "generated-docs/project-overview.md" ] && [ -f "generated-docs/development-status.md" ]; then
            echo "summaries_generated=true" >> $GITHUB_OUTPUT
          else
            echo "summaries_generated=false" >> $GITHUB_OUTPUT
          fi

      - name: Commit and push summaries
        if: steps.check_summaries.outputs.summaries_generated == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          # package.jsonの変更のみリセット（generated-docsは保持）
          git restore package.json 2>/dev/null || true
          # サマリーファイルのみを追加
          git add generated-docs/project-overview.md
          git add generated-docs/development-status.md
          git commit -m "Update project summaries (overview & development status)"
          git push

      - name: Summary generation result
        run: |
          if [ "${{ steps.check_summaries.outputs.summaries_generated }}" == "true" ]; then
            echo "✅ Project summaries updated successfully"
            echo "📊 Generated: project-overview.md & development-status.md"
          else
            echo "ℹ️ No summaries generated (likely no user commits in the last 24 hours)"
          fi
```

# 上記promptで、2つのLLMにレビューさせ、合格した

# 細部を、先行する2つのymlを参照に手直しした

# ローカルtestをしてからcommitできるとよい。方法を検討する
- ローカルtestのメリット
    - 素早く修正のサイクルをまわせる
    - ムダにgit historyを汚さない
        - これまでの事例：「実装したつもり」「エラー。修正したつもり」「エラー。修正したつもり」...（以降エラー多数）
- 方法
    - ※検討、WSL + act を環境構築済みである。test可能であると判断する
    - 呼び出し元のURLをコメントアウトし、相対パス記述にする
    - ※備考、テスト成功すると結果がcommit pushされる。それでよしとする
- 結果
    - OK
    - secretsを簡略化できるか試した、できなかった、現状のsecrets記述が今わかっている範囲でベストと判断する
    - OK

# test green

# commit用に、yml 呼び出し元 uses をlocal用から本番用に書き換える

# closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/7.md
```md
{% raw %}
# issue issue note生成できるかのtest用 #7
[issues #7](https://github.com/cat2151/github-actions/issues/7)

- 生成できた
- closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/8.md
```md
{% raw %}
# issue 関数コールグラフhtmlビジュアライズ生成の対象ソースファイルを、呼び出し元ymlで指定できるようにする #8
[issues #8](https://github.com/cat2151/github-actions/issues/8)

# これまでの課題
- 以下が決め打ちになっていた
```
  const allowedFiles = [
    'src/main.js',
    'src/mml2json.js',
    'src/play.js'
  ];
```

# 対策
- 呼び出し元ymlで指定できるようにする

# agent
- agentにやらせることができれば楽なので、初手agentを試した
- 失敗
    - ハルシネーションしてscriptを大量破壊した
- 分析
    - 修正対象scriptはagentが生成したもの
    - 低品質な生成結果でありソースが巨大
    - ハルシネーションで破壊されやすいソース
    - AIの生成したソースは、必ずしもAIフレンドリーではない

# 人力リファクタリング
- 低品質コードを、最低限agentが扱えて、ハルシネーションによる大量破壊を防止できる内容、にする
- 手短にやる
    - そもそもビジュアライズは、agentに雑に指示してやらせたもので、
    - 今後別のビジュアライザを選ぶ可能性も高い
    - 今ここで手間をかけすぎてコンコルド効果（サンクコストバイアス）を増やすのは、project群をトータルで俯瞰して見たとき、損
- 対象
    - allowedFiles のあるソース
        - callgraph-utils.cjs
            - たかだか300行未満のソースである
            - この程度でハルシネーションされるのは予想外
            - やむなし、リファクタリングでソース分割を進める

# agentに修正させる
## prompt
```
allowedFilesを引数で受け取るようにしたいです。
ないならエラー。
最終的に呼び出し元すべてに波及して修正したいです。

呼び出し元をたどってエントリポイントも見つけて、
エントリポイントにおいては、
引数で受け取ったjsonファイル名 allowedFiles.js から
jsonファイル allowedFiles.jsonの内容をreadして
変数 allowedFilesに格納、
後続処理に引き渡す、としたいです。

まずplanしてください。
planにおいては、修正対象のソースファイル名と関数名を、呼び出し元を遡ってすべて特定し、listしてください。
```

# 修正が順調にできた
- コマンドライン引数から受け取る作りになっていなかったので、そこだけ指示して修正させた
- yml側は人力で修正した

# 他のリポジトリから呼び出した場合にバグらないよう修正する
- 気付いた
    - 共通ワークフローとして他のリポジトリから使った場合はバグるはず。
        - ymlから、共通ワークフロー側リポジトリのcheckoutが漏れているので。
- 他のyml同様に修正する
- あわせて全体にymlをリファクタリングし、修正しやすくし、今後のyml読み書きの学びにしやすくする

# local WSL + act : test green

# closeとする
- もし生成されたhtmlがNGの場合は、別issueとするつもり

{% endraw %}
```

### index.html
```html
{% raw %}
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VOICEVOX Playground</title>
    <style>
      :root {
        --bg-color: #ffffff;
        --text-color: #0f172a;
        --panel-bg: #f7f7f7;
        --border-color: #e0e0e0;
        --accent-color: #4caf50;
        --highlight-color: #ff9800;
        --muted-text: #4b5563;
        --status-info-bg: #e3f2fd;
        --status-info-text: #1976d2;
        --status-error-bg: #ffebee;
        --status-error-text: #c62828;
        --status-success-bg: #e8f5e9;
        --status-success-text: #2e7d32;
        --canvas-grid: rgba(0, 0, 0, 0.06);
        --spectrogram-low: #0f172a;
        --spectrogram-high: #7ee0a3;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --bg-color: #0b1221;
          --text-color: #e5e7eb;
          --panel-bg: #0f172a;
          --border-color: #1f2937;
          --accent-color: #7df2b8;
          --highlight-color: #fbbf24;
          --muted-text: #9ca3af;
          --status-info-bg: #102035;
          --status-info-text: #9bdcff;
          --status-error-bg: #2b1111;
          --status-error-text: #fca5a5;
          --status-success-bg: #0f2018;
          --status-success-text: #a7f3d0;
          --canvas-grid: rgba(255, 255, 255, 0.06);
          --spectrogram-low: #0b1221;
          --spectrogram-high: #a7f3d0;
        }
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--bg-color);
        color: var(--text-color);
        max-width: 800px;
        margin: 0 auto;
        padding: 16px;
        line-height: 1.6;
      }
      h1 {
        color: var(--text-color);
        border-bottom: 2px solid var(--accent-color);
        padding-bottom: 10px;
      }
      .container {
        background: var(--panel-bg);
        padding: 20px;
        border-radius: 8px;
        margin: 12px 0;
        border: 1px solid var(--border-color);
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: var(--muted-text);
      }
      textarea {
        width: 100%;
        min-height: 100px;
        padding: 10px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        font-size: 16px;
        font-family: inherit;
        box-sizing: border-box;
        resize: vertical;
      }
      textarea:focus {
        outline: none;
        border-color: var(--accent-color);
      }
      select {
        width: 100%;
        padding: 10px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        font-size: 16px;
        font-family: inherit;
        box-sizing: border-box;
        background: var(--panel-bg);
        color: var(--text-color);
      }
      select:focus {
        outline: none;
        border-color: var(--accent-color);
      }
      input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        font-size: 16px;
        font-family: inherit;
        box-sizing: border-box;
        background: var(--panel-bg);
        color: var(--text-color);
      }
      input[type="text"]::placeholder {
        color: var(--muted-text);
      }
      input[type="text"]:focus {
        outline: none;
        border-color: var(--accent-color);
      }
      .text-input {
        min-height: 144px;
        height: 100%;
      }
      button {
        background-color: var(--accent-color);
        color: #0b1a10;
        border: none;
        padding: 12px 24px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.3s;
      }
      button:hover {
        filter: brightness(0.95);
      }
      button:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
      .secondary-button {
        background: transparent;
        color: var(--text-color);
        border: 1px solid var(--border-color);
        margin-right: 8px;
      }
      .controls {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .style-row {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 10px;
      }
      .style-row select,
      .style-row input[type="text"] {
        flex: 1;
        min-width: 0;
      }
      .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        align-items: stretch;
      }
      .input-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .input-visualizer {
        height: 100%;
      }
      @media (max-width: 720px) {
        .input-row {
          grid-template-columns: 1fr;
        }
      }
      .status {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        min-height: 24px;
        visibility: hidden;
      }
      .status.info {
        background-color: var(--status-info-bg);
        color: var(--status-info-text);
        border: 1px solid var(--border-color);
      }
      .status.error {
        background-color: var(--status-error-bg);
        color: var(--status-error-text);
        border: 1px solid var(--border-color);
      }
      .status.success {
        background-color: var(--status-success-bg);
        color: var(--status-success-text);
        border: 1px solid var(--border-color);
      }
      .helper-text {
        margin: 0 0 6px;
        color: var(--muted-text);
        font-size: 13px;
      }
      .code-block {
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        overflow-x: auto;
      }
      .info {
        margin-top: 10px;
      }
      .visualizer-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        background-image: linear-gradient(
            to right,
            transparent 0,
            transparent calc(10px - 1px),
            var(--canvas-grid) calc(10px - 1px),
            var(--canvas-grid) 10px
          ),
          linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(10px - 1px),
            var(--canvas-grid) calc(10px - 1px),
            var(--canvas-grid) 10px
          );
        background-size: 10px 10px;
      }
      .visualizer__title {
        font-weight: bold;
        margin-bottom: 6px;
        color: var(--muted-text);
      }
      .visualizer__frame {
        position: relative;
      }
      .visualizer__action {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 6px 10px;
        margin: 0;
        font-size: 13px;
        border: 1px solid var(--border-color);
        background: var(--panel-bg);
        color: var(--text-color);
        border-radius: 6px;
      }
      .playback-progress {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--accent-color);
        pointer-events: none;
        opacity: 0;
        transform: translateX(-50%);
        transition: opacity 0.15s ease;
        border-radius: 999px;
        z-index: 2;
      }
      .playback-progress.is-active {
        opacity: 1;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      canvas {
        width: 100%;
        height: 144px;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 6px;
      }
      #spectrogram {
        background: linear-gradient(
          to top,
          var(--spectrogram-low),
          var(--spectrogram-high)
        );
      }
      .loop-control {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        color: var(--muted-text);
        padding-left: 4px;
      }
      .favorites-panel {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .favorites-section__title {
        font-weight: 600;
        color: var(--muted-text);
        margin-bottom: 6px;
      }
      .text-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .text-list__item {
        display: flex;
        gap: 8px;
        align-items: stretch;
      }
      .text-list__text {
        flex: 1;
        text-align: left;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 10px;
        color: var(--text-color);
        cursor: pointer;
        font-size: 14px;
        line-height: 1.4;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .text-list__text:hover {
        border-color: var(--accent-color);
      }
      .text-list__action {
        min-width: 40px;
        padding: 0 10px;
        font-weight: 700;
      }
      .text-list__action--add {
        background: #e8f5e9;
        color: #16a34a;
        border: 1px solid #16a34a;
      }
      .text-list__action--remove {
        background: #ffebee;
        color: #dc2626;
        border: 1px solid #dc2626;
      }
      #usagePanel[hidden] {
        display: none;
      }
      .repo-link {
        position: fixed;
        left: 12px;
        bottom: 12px;
        color: var(--muted-text);
        text-decoration: none;
        opacity: 1;
        font-size: 13px;
        transition: opacity 0.2s ease;
      }
      .repo-link:hover,
      .repo-link:focus-visible {
        opacity: 1;
        text-decoration: underline;
      }
      .intonation-area {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .intonation-canvas-wrapper {
        display: grid;
        grid-template-columns: 88px 1fr;
        column-gap: 12px;
        align-items: stretch;
        touch-action: none;
        overscroll-behavior: contain;
      }
      .intonation-side {
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        gap: 10px;
        align-content: stretch;
      }
      .intonation-canvas-area {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .intonation-range-value {
        position: relative;
        padding: 4px 6px;
        font-size: 13px;
        color: var(--muted-text);
        background: var(--panel-bg);
        border-radius: 4px;
        pointer-events: none;
        z-index: 1;
      }
      .intonation-range-value--max {
        align-self: flex-start;
      }
      .intonation-range-value--min {
        align-self: flex-end;
      }
      .intonation-controls {
        position: relative;
        left: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }
      .intonation-controls--top {
      }
      .intonation-controls--bottom {
      }
      .intonation-controls__button {
        padding: 4px 6px;
        font-size: 13px;
        margin-top: 0;
        width: 100%;
      }
      .intonation-labels {
        position: relative;
        min-height: 24px;
        font-weight: 600;
        color: var(--muted-text);
      }
      .intonation-label {
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 14px;
      }
      .intonation-label__key {
        margin-right: 6px;
        color: var(--muted-text);
        opacity: 0.6;
        font-weight: 700;
      }
      #intonationCanvas {
        width: 100%;
        height: 200px;
        touch-action: none;
      }
      .text-list__pill {
        display: inline-block;
        padding: 2px 6px;
        margin-right: 6px;
        border-radius: 999px;
        background: var(--border-color);
        color: var(--muted-text);
        font-size: 12px;
        vertical-align: middle;
      }
      .modal {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.35);
        z-index: 50;
      }
      .modal[hidden] {
        display: none;
      }
      .modal__content {
        background: var(--panel-bg);
        color: var(--text-color);
        padding: 16px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        min-width: 280px;
        max-width: 420px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      }
      .modal__title {
        font-weight: 700;
        margin-bottom: 8px;
      }
      .modal__body {
        margin: 0 0 12px;
        color: var(--muted-text);
      }
      .modal__actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    </style>
  </head>
  <body>
    <h1 class="sr-only">VOICEVOX Playground</h1>
    <div class="controls">
      <button id="usageToggleButton" class="secondary-button" aria-expanded="false" aria-controls="usagePanel">ℹ️ 利用方法</button>
    </div>
    
    <div class="container info" id="usagePanel" hidden>
      <h1 aria-hidden="true">🎙️ VOICEVOX Playground</h1>
      <p>GitHub Pages 版（<code>https://cat2151.github.io/voicevox-playground/</code>）からアクセスする際は、VOICEVOXエンジンを以下のコマンドで起動してCORSを許可してください。</p>
      <div class="code-block">
        <code>&lt;your VOICEVOX directory&gt;/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io</code>
      </div>
      <p>ローカル開発サーバー（<code>http://localhost:5173</code>）も許可する場合は、上記コマンドに <code>http://localhost:5173</code> を追加してください。</p>
      <div class="code-block">
        <code>&lt;your VOICEVOX directory&gt;/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io http://localhost:5173</code>
      </div>
      <p>話者やボイスをテキスト内で切り替えるときは、区切り文字欄に開始と終端を指定します（例: <code>[]</code> または <code>[ ]</code>）。空欄のままなら切り替えません。</p>
      <p>マーカーの中身は次の順で解釈します。</p>
      <ul>
        <li><code>[ずんだもん]</code> → 話者名に一致したらその話者の「ノーマル」を選択</li>
        <li><code>[ヒソヒソ]</code> → 現在の話者に同名のボイスがあればそちらへ切り替え</li>
        <li><code>[37]</code> → 数値はIDとして扱い、例では四国めたん ヒソヒソ</li>
      </ul>
      <p>開始/終端の組み合わせはスペース区切りで2つ書くか、<code>[]</code>のように1組をそのまま入力できます。</p>
    </div>

    <div class="container">
      <div class="style-row">
        <select id="styleSelect" aria-label="話者・ボイス選択"></select>
        <select id="speakerStyleSelect" aria-label="現在のキャラのスタイル選択"></select>
        <input
          id="delimiterInput"
          type="text"
          aria-label="切替区切り文字"
          placeholder="空欄のままなら切り替えなし"
        />
      </div>

      <div class="input-row">
        <textarea id="text" class="text-input" aria-label="テキスト入力">ずんだもんなのだ</textarea>
        <div class="visualizer__frame input-visualizer">
          <canvas id="realtimeWaveform" width="760" height="144" aria-label="リアルタイム波形"></canvas>
        </div>
      </div>
      
      <div class="controls">
        <button id="playButton" aria-label="Play" title="Play"><span aria-hidden="true">▶️</span></button>
        <button id="exportButton" disabled>💾 ダウンロード (Export WAV)</button>
        <label for="loopCheckbox" class="loop-control">
          <input type="checkbox" id="loopCheckbox" checked />
          ループ再生
        </label>
      </div>
      
      <div id="status" class="status" role="status" aria-live="polite"></div>
    </div>

    <div class="container">
      <div class="controls">
        <button
          id="favoritesToggleButton"
          class="secondary-button"
          aria-expanded="false"
          aria-controls="favoritesPanel"
        >★ お気に入り管理</button>
      </div>
      <div id="favoritesPanel" class="favorites-panel" hidden>
        <div class="favorites-section">
          <div class="favorites-section__title">イントネーション付きお気に入り</div>
          <ul id="intonationFavoritesList" class="text-list" aria-label="イントネーション付きお気に入り"></ul>
        </div>
        <div class="favorites-section">
          <div class="favorites-section__title">現在のお気に入り</div>
          <ul id="favoritesList" class="text-list" aria-label="現在のお気に入りのテキスト"></ul>
        </div>
        <div class="favorites-section">
          <div class="favorites-section__title">再生履歴</div>
          <ul id="historyList" class="text-list" aria-label="再生履歴のテキスト"></ul>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="intonation-area">
        <div class="controls">
          <button
            id="intonationKeyboardToggle"
            class="secondary-button"
            aria-pressed="false"
            aria-label="キーボード操作を有効/無効にする"
          >キーボード操作: OFF</button>
          <button
            id="intonationResetButton"
            class="secondary-button"
            type="button"
            aria-label="取得したイントネーションにリセットする"
          >リセット</button>
          <button
            id="intonationFavoriteButton"
            class="secondary-button"
            type="button"
          >お気に入りに登録</button>
        </div>
        <div class="intonation-canvas-wrapper">
          <div class="intonation-side">
            <div class="intonation-controls intonation-controls--top">
              <button id="intonationExpandTop" class="secondary-button intonation-controls__button" aria-label="上方向の幅を2倍">2x</button>
              <button id="intonationShrinkTop" class="secondary-button intonation-controls__button" aria-label="上方向の幅を1/2">0.5x</button>
            </div>
            <div class="intonation-range-value intonation-range-value--max" id="intonationMaxValue" aria-hidden="true"></div>
            <div class="intonation-range-value intonation-range-value--min" id="intonationMinValue" aria-hidden="true"></div>
            <div class="intonation-controls intonation-controls--bottom">
              <button id="intonationShrinkBottom" class="secondary-button intonation-controls__button" aria-label="下方向の幅を1/2">0.5x</button>
              <button id="intonationExpandBottom" class="secondary-button intonation-controls__button" aria-label="下方向の幅を2倍">2x</button>
            </div>
          </div>
          <div class="intonation-canvas-area">
            <canvas id="intonationCanvas" width="760" height="180" aria-label="イントネーションの折れ線グラフ" tabindex="0"></canvas>
          </div>
        </div>
        <div id="intonationLabels" class="intonation-labels" aria-hidden="true"></div>
      </div>
    </div>

    <div class="container">
      <div class="visualizer-grid">
        <div class="visualizer__frame">
          <canvas id="renderedWaveform" width="760" height="144" aria-label="レンダリング後の波形"></canvas>
          <div id="renderedWaveformProgress" class="playback-progress" aria-hidden="true"></div>
        </div>
        <div class="visualizer__frame">
          <canvas id="spectrogram" width="760" height="144" aria-label="スペクトログラム"></canvas>
          <div id="spectrogramProgress" class="playback-progress" aria-hidden="true"></div>
          <button id="spectrogramScaleToggle" class="visualizer__action" type="button">対数にする</button>
        </div>
      </div>
    </div>

    <div id="playConfirmDialog" class="modal" hidden>
      <div class="modal__content" role="dialog" aria-modal="true" aria-labelledby="playConfirmTitle">
        <div id="playConfirmTitle" class="modal__title">イントネーションを初期化してplayしますか？</div>
        <p class="modal__body">編集したイントネーションは元に戻ります。</p>
        <div class="modal__actions">
          <button id="playConfirmReset" type="button">イントネーションを初期化してplay</button>
          <button id="playConfirmCancel" type="button" class="secondary-button">playしない</button>
        </div>
      </div>
    </div>

    <a class="repo-link" href="https://github.com/cat2151/voicevox-playground" target="_blank" rel="noopener noreferrer" aria-label="GitHub: cat2151/voicevox-playground（新しいタブで開きます）">GitHub: cat2151/voicevox-playground</a>

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

{% endraw %}
```

### issue-notes/51.md
```md
{% raw %}
# issue お気に入り管理欄が折りたたみできない。デフォルトで折りたたみして、「お気に入り管理」ボタンを押したら折りたたみ解除とせよ #51
[issues #51](https://github.com/cat2151/voicevox-playground/issues/51)



{% endraw %}
```

### issue-notes/64.md
```md
{% raw %}
# issue キーボードa-zの機能がエンバグしているので修正する #64
[issues #64](https://github.com/cat2151/voicevox-playground/issues/64)

- a-zは、対応したモーラにfocusするだけでなくaならup、Aならdownすること
- 変化量は、最初にレスポンスで得たイントネーションminとmaxの間を10分割した1段階、で変化させること
    - ctrlを押しながらの場合、変化量を1/2すること
    - maxをoverしたら、同じ1段階ぶんだけmaxを増やす。minも同様。
- これにより、キーボードで思考の速さでイントネーション調整できるUXの可能性を開く、ことを目指す

{% endraw %}
```

### issue-notes/66.md
```md
{% raw %}
# issue playボタンのplayマークがダサい #66
[issues #66](https://github.com/cat2151/voicevox-playground/issues/66)

- emojiをやめてSVGにせよ
- ダウンロードボタンのフロッピーディスクemojiもダサいので外すべし

{% endraw %}
```

### issue-notes/67.md
```md
{% raw %}
# issue playボタンがstopボタンになっているとき、演奏stopができない #67
[issues #67](https://github.com/cat2151/voicevox-playground/issues/67)

- Tone.jsによるplayは、stopできるはず
- stopできない原因を調査せよ
- stopボタンにconsole.logをつけ、そもそもstop操作を受け付けているか？をデバッグできるようにせよ
- あらゆる局面でstopができるようなアーキテクチャにせよ
    - 例えばイントネーション編集中は、素早くstopして新たなイントネーション生成をするべきだろう
    - 「playが終了するまでstop操作をまったく受け付けない、つまりstopができない」のではUXが悪い

{% endraw %}
```

### issue-notes/68.md
```md
{% raw %}
# issue styleプルダウン、区切り文字、の右に「ランダムstyle」チェックボックスをつける #68
[issues #68](https://github.com/cat2151/voicevox-playground/issues/68)

- デフォルトoff。
- onにした場合、
    - styleプルダウンがランダムで決定される。
    - ループ再生ごとにランダムで変更される（なのでcache再生はされない）

{% endraw %}
```

### issue-notes/72.md
```md
{% raw %}
# issue イントネーション編集で、CTRL + 下や、下0.5x を押したとき、minが縮まないことがある #72
[issues #72](https://github.com/cat2151/voicevox-playground/issues/72)

# 事例
- -0.0から縮まない
- 現在編集中のイントネーションのminが5あっても、5に到達せず、-0.0のまま
- 仮説
    - もしかして「-0.0という、最初に生成したときのイントネーション初期min」よりも大きくできない、という制約になっている？
    - もしそうなら、userの意図と違う。
    - CTRL + 下や、下0.5x を押したときのminの制約は、「現在編集中のイントネーションのminより大きくはできない」である。
        - この事例のケースだと、5まで到達してよい。-0.0でstopしてしまうのはuserの意図と違う。
- max側も同様である

{% endraw %}
```

### issue-notes/74.md
```md
{% raw %}
# issue GitHub Actionsでビルドが落ちたら、issueを起票するようにする。cat2151の他のリポジトリのワークフローを参考にする #74
[issues #74](https://github.com/cat2151/voicevox-playground/issues/74)

# 落ちたビルドのURL
- https://github.com/cat2151/voicevox-playground/actions/runs/21991496344/job/63539577377


{% endraw %}
```

### src/intonation.ts
```ts
{% raw %}
import * as Tone from 'tone';
import {
  AudioQuery,
  INTONATION_DEBOUNCE_MS,
  INTONATION_FAVORITES_STORAGE_KEY,
  IntonationChartRange,
  IntonationFavorite,
  IntonationPoint,
  MONOKAI_COLORS,
  TEXT_LIST_LIMIT,
  ZUNDAMON_SPEAKER_ID,
} from './config';
import { getAudioQuery, synthesize } from './audio';
import { showStatus, scheduleHideStatus, getColorVariable } from './status';
import { initializeVisualizationCanvases, drawRenderedWaveform, playAudio } from './visualization';
import { appState } from './state';
import { updateExportButtonState } from './uiControls';

let intonationCanvas: HTMLCanvasElement | null = null;
let intonationTimingEl: HTMLElement | null = null;
let intonationLabelsEl: HTMLElement | null = null;
let intonationMaxValueEl: HTMLElement | null = null;
let intonationMinValueEl: HTMLElement | null = null;
let intonationFavoritesListEl: HTMLUListElement | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let intonationInitialQuery: AudioQuery | null = null;
let intonationInitialPitchRange: { min: number; max: number } | null = null;
let intonationDisplayRange: { min: number; max: number } | null = null;
let intonationRangeExtra = 0;
let intonationPoints: IntonationPoint[] = [];
let intonationPointPositions: Array<{ x: number; y: number }> = [];
let intonationSelectedIndex: number | null = null;
let intonationDebounceTimer: number | null = null;
let intonationDragIndex: number | null = null;
let intonationActivePointerId: number | null = null;
let intonationPlaybackPending = false;
let intonationChartRange: IntonationChartRange | null = null;
let intonationTopScale = 1;
let intonationBottomScale = 1;
let intonationStepSize = 1;
let intonationKeyboardEnabled = false;
let currentIntonationStyleId = ZUNDAMON_SPEAKER_ID;
let currentIntonationQuery: AudioQuery | null = null;
let intonationDirty = false;
let intonationFavorites: IntonationFavorite[] = [];
let onStyleChange: ((styleId: number) => void) | null = null;
let wheelHandlerAttached = false;
let scrollLocked = false;
let previousBodyOverflow: string | null = null;

function isValidAudioQueryShape(query: unknown): query is AudioQuery {
  return (
    query !== null &&
    typeof query === 'object' &&
    Array.isArray((query as { accent_phrases?: unknown }).accent_phrases)
  );
}

function cloneAudioQuery(query: AudioQuery): AudioQuery {
  return JSON.parse(JSON.stringify(query)) as AudioQuery;
}

function dedupeIntonationFavorites(list: IntonationFavorite[]) {
  const seen = new Set<string>();
  const result: IntonationFavorite[] = [];
  for (const item of list) {
    if (!item || !item.text || !item.query || typeof item.styleId !== 'number') continue;
    const key = `${item.styleId}::${item.text.trim()}`;
    if (!item.text.trim() || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= TEXT_LIST_LIMIT) break;
  }
  return result;
}

function loadIntonationFavorites() {
  try {
    const raw = localStorage.getItem(INTONATION_FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return dedupeIntonationFavorites(
        parsed.map((item) => {
          if (!item || typeof item !== 'object') return null;
          const { text, styleId, query } = item as Partial<IntonationFavorite>;
          if (typeof text !== 'string' || typeof styleId !== 'number' || !isValidAudioQueryShape(query)) return null;
          return { text: text.trim(), styleId, query } as IntonationFavorite;
        }).filter((item): item is IntonationFavorite => item !== null)
      );
    }
  } catch (error) {
    console.warn('Failed to load intonation favorites:', error);
  }
  return [];
}

function persistIntonationFavorites() {
  try {
    localStorage.setItem(INTONATION_FAVORITES_STORAGE_KEY, JSON.stringify(intonationFavorites));
  } catch (error) {
    console.warn('Failed to save intonation favorites:', error);
  }
}

function updateIntonationTiming(message: string) {
  if (intonationTimingEl) {
    intonationTimingEl.textContent = message;
  }
}

function disableLoopOnIntonationEdit() {
  if (loopCheckboxEl && loopCheckboxEl.checked) {
    loopCheckboxEl.checked = false;
  }
}

function getPitchRange(points: IntonationPoint[]): { min: number; max: number } {
  if (points.length === 0) {
    return { min: 0, max: 0 };
  }
  let min = points[0].pitch;
  let max = points[0].pitch;
  for (let i = 1; i < points.length; i += 1) {
    const pitch = points[i].pitch;
    if (pitch < min) min = pitch;
    if (pitch > max) max = pitch;
  }
  return { min, max };
}

function calculateBasePadding(span: number) {
  return span === 0 ? 0.1 : span * 0.1;
}

function getBaseDisplayRange(): { min: number; max: number } | null {
  if (!intonationInitialPitchRange) return null;
  const span = Math.max(intonationInitialPitchRange.max - intonationInitialPitchRange.min, 0);
  const basePadding = calculateBasePadding(span);
  const topPadding = basePadding * intonationTopScale;
  const bottomPadding = basePadding * intonationBottomScale;
  return {
    min: intonationInitialPitchRange.min - bottomPadding,
    max: intonationInitialPitchRange.max + topPadding,
  };
}

function calculateDisplayRange(extra: number): { min: number; max: number } | null {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return null;
  let min = baseRange.min - extra;
  let max = baseRange.max + extra;
  if (min >= max) {
    const center = (min + max) / 2;
    min = center - 0.0001;
    max = center + 0.0001;
  }
  return { min, max };
}

function getMinimumAllowedExtra() {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return 0;
  const dataRange = getPitchRange(intonationPoints);
  const minExtraByMin = baseRange.min - dataRange.min;
  const minExtraByMax = dataRange.max - baseRange.max;
  return Math.max(minExtraByMin, minExtraByMax);
}

function applyRangeExtra(desiredExtra: number) {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return;
  const minimumExtra = getMinimumAllowedExtra();
  intonationRangeExtra = Math.max(desiredExtra, minimumExtra);
  const range = calculateDisplayRange(intonationRangeExtra);
  if (range) {
    intonationDisplayRange = range;
    if (intonationChartRange) {
      intonationChartRange.min = range.min;
      intonationChartRange.max = range.max;
    }
  }
}

function refreshDisplayRange() {
  applyRangeExtra(intonationRangeExtra);
}

function clampPitchToDisplayRange(pitch: number) {
  if (!intonationDisplayRange) return pitch;
  return Math.min(Math.max(pitch, intonationDisplayRange.min), intonationDisplayRange.max);
}

export function calculateStepSize(range: { min: number; max: number }) {
  const span = Math.max(range.max - range.min, 0);
  const step = span / 10;
  return step > 0 ? step : 0.1;
}

function handleIntonationWheel(event: WheelEvent) {
  if (intonationDragIndex !== null) {
    event.preventDefault();
  }
}

function updateInitialRangeFromPoints(points: IntonationPoint[]) {
  const range = getPitchRange(points);
  intonationInitialPitchRange = range;
  intonationStepSize = calculateStepSize(range);
  intonationRangeExtra = 0;
  refreshDisplayRange();
}

export function resetIntonationState() {
  intonationInitialQuery = null;
  intonationInitialPitchRange = null;
  intonationDisplayRange = null;
  intonationRangeExtra = 0;
  intonationStepSize = 1;
  currentIntonationQuery = null;
  intonationPoints = [];
  intonationPointPositions = [];
  intonationSelectedIndex = null;
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationDirty = false;
  if (intonationCanvas) {
    const ctx = intonationCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, intonationCanvas.width, intonationCanvas.height);
    }
  }
  if (intonationLabelsEl) {
    intonationLabelsEl.textContent = '';
  }
  updateIntonationTiming('イントネーション未取得');
}

export function setStyleChangeHandler(handler: (styleId: number) => void) {
  onStyleChange = handler;
}

export function initializeIntonationElements(options: {
  canvas: HTMLCanvasElement | null;
  timingEl: HTMLElement | null;
  labelsEl: HTMLElement | null;
  maxValueEl: HTMLElement | null;
  minValueEl: HTMLElement | null;
  favoritesListEl: HTMLUListElement | null;
  loopCheckbox: HTMLInputElement | null;
}) {
  intonationCanvas = options.canvas;
  intonationTimingEl = options.timingEl;
  intonationLabelsEl = options.labelsEl;
  intonationMaxValueEl = options.maxValueEl;
  intonationMinValueEl = options.minValueEl;
  intonationFavoritesListEl = options.favoritesListEl;
  loopCheckboxEl = options.loopCheckbox;
  intonationFavorites = loadIntonationFavorites();
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  if (!wheelHandlerAttached) {
    window.addEventListener('wheel', handleIntonationWheel, { passive: false });
    wheelHandlerAttached = true;
  }
}

export function isIntonationDirty() {
  return intonationDirty;
}

export function setIntonationKeyboardEnabled(enabled: boolean) {
  intonationKeyboardEnabled = enabled;
}

export function getIntonationKeyboardEnabled() {
  return intonationKeyboardEnabled;
}

export function initializeIntonationCanvas() {
  if (!intonationCanvas) return;
  const ctx = intonationCanvas.getContext('2d');
  if (!ctx) return;

  const rect = intonationCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(1, Math.floor(rect.width));
  const displayHeight = Math.max(1, Math.floor(rect.height));
  const width = Math.max(1, Math.floor(displayWidth * dpr));
  const height = Math.max(1, Math.floor(displayHeight * dpr));

  if (intonationCanvas.width !== width || intonationCanvas.height !== height) {
    intonationCanvas.width = width;
    intonationCanvas.height = height;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const margin = 32;
  const innerHeight = Math.max(1, displayHeight - margin * 2);
  intonationChartRange = {
    min: 0,
    max: 10,
    margin,
    height: displayHeight,
    innerHeight,
    width: displayWidth,
  };
}

export function buildIntonationPointsFromQuery(query: AudioQuery) {
  const points: IntonationPoint[] = [];
  let phraseIndex = 0;
  for (const phrase of query.accent_phrases) {
    let moraIndex = 0;
    for (const mora of phrase.moras) {
      points.push({
        phraseIndex,
        moraIndex,
        label: mora.text || '・',
        pitch: mora.pitch,
      });
      moraIndex += 1;
    }
    if (phrase.pause_mora) {
      points.push({
        phraseIndex,
        moraIndex,
        label: phrase.pause_mora.text || '・',
        pitch: phrase.pause_mora.pitch,
      });
    }
    phraseIndex += 1;
  }
  return points;
}

function renderIntonationLabels(points: IntonationPoint[]) {
  const labelsEl = intonationLabelsEl;
  if (!labelsEl) return;
  labelsEl.textContent = '';
  const width = intonationChartRange?.width ?? 1;
  labelsEl.style.width = `${width}px`;
  labelsEl.style.marginLeft = 'auto';
  points.forEach((point, index) => {
    const pos = intonationPointPositions[index];
    const span = document.createElement('span');
    span.classList.add('intonation-label');
    if (pos) {
      const clamped = Math.min(1, Math.max(0, pos.x / Math.max(width, 1)));
      span.style.left = `${clamped * 100}%`;
    }
    const keySpan = document.createElement('span');
    keySpan.classList.add('intonation-label__key');
    keySpan.textContent = String.fromCharCode('a'.charCodeAt(0) + (index % 26));
    span.appendChild(keySpan);

    const textSpan = document.createElement('span');
    textSpan.textContent = point.label;
    span.appendChild(textSpan);
    labelsEl.appendChild(span);
  });
}

export function drawIntonationChart(points: IntonationPoint[]) {
  if (!intonationCanvas || !intonationChartRange) return;
  const ctx = intonationCanvas.getContext('2d');
  if (!ctx) return;

  const { width, height, margin, innerHeight } = intonationChartRange;
  ctx.clearRect(0, 0, width, height);

  if (points.length === 0) {
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('再生後に表示されます', width / 2, height / 2);
    return;
  }

  if (!intonationInitialPitchRange) {
    updateInitialRangeFromPoints(points);
  }
  if (!intonationDisplayRange) {
    refreshDisplayRange();
  }
  const rangeMin = intonationDisplayRange?.min ?? 0;
  const rangeMax = intonationDisplayRange?.max ?? 10;
  const rangeSpan = Math.max(rangeMax - rangeMin, 0.0001);

  if (intonationChartRange) {
    intonationChartRange.min = rangeMin;
    intonationChartRange.max = rangeMax;
  }
  if (intonationMaxValueEl) intonationMaxValueEl.textContent = `${rangeMax.toFixed(1)}`;
  if (intonationMinValueEl) intonationMinValueEl.textContent = `${rangeMin.toFixed(1)}`;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);

  const pointSpacing = Math.max(1, (width - margin * 2) / Math.max(points.length - 1, 1));
  intonationPointPositions = points.map((point, index) => {
    const x = margin + index * pointSpacing;
    const normalized = (clampPitchToDisplayRange(point.pitch) - rangeMin) / rangeSpan;
    const y = height - margin - normalized * innerHeight;
    return { x, y };
  });

  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.25;
  intonationPointPositions.forEach((pos, index) => {
    const color = MONOKAI_COLORS[index % MONOKAI_COLORS.length];
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, pos.y);
    ctx.lineTo(width, pos.y);
    ctx.stroke();
  });
  ctx.restore();

  ctx.strokeStyle = getColorVariable('--accent-color', '#4CAF50');
  ctx.lineWidth = 2;
  ctx.beginPath();
  intonationPointPositions.forEach((pos, index) => {
    if (index === 0) {
      ctx.moveTo(pos.x, pos.y);
    } else {
      ctx.lineTo(pos.x, pos.y);
    }
  });
  ctx.stroke();

  intonationPointPositions.forEach((pos, index) => {
    const color = MONOKAI_COLORS[index % MONOKAI_COLORS.length];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (intonationSelectedIndex === index) {
      ctx.strokeStyle = getColorVariable('--highlight-color', '#ff9800');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  renderIntonationLabels(points);
}

export function adjustIntonationScale(direction: 'top' | 'bottom', factor: number) {
  if (direction === 'top') {
    intonationTopScale = Math.max(0.05, intonationTopScale * factor);
  } else {
    intonationBottomScale = Math.max(0.05, intonationBottomScale * factor);
  }
  refreshDisplayRange();
  drawIntonationChart(intonationPoints);
}

function pitchFromY(y: number) {
  if (!intonationChartRange) return 0;
  const { min, max, margin, innerHeight } = intonationChartRange;
  const clampedY = Math.max(margin, Math.min(margin + innerHeight, y));
  const normalized = 1 - (clampedY - margin) / innerHeight;
  return min + normalized * (max - min);
}

function findNearestIntonationPoint(x: number) {
  if (!intonationPointPositions.length) return -1;
  let closestIndex = 0;
  let closestDistance = Infinity;
  intonationPointPositions.forEach((pos, index) => {
    const distance = Math.abs(pos.x - x);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  return closestIndex;
}

function applyPitchToQuery(pointIndex: number, pitch: number) {
  if (!currentIntonationQuery) return;
  if (pointIndex < 0 || pointIndex >= intonationPoints.length) return;
  const target = intonationPoints[pointIndex];
  const phrase = currentIntonationQuery.accent_phrases[target.phraseIndex];
  if (!phrase) return;
  if (target.moraIndex < phrase.moras.length) {
    phrase.moras[target.moraIndex].pitch = pitch;
  } else if (phrase.pause_mora) {
    phrase.pause_mora.pitch = pitch;
  }
}

function scheduleIntonationPlayback() {
  if (intonationDebounceTimer !== null) {
    window.clearTimeout(intonationDebounceTimer);
  }
  intonationDebounceTimer = window.setTimeout(() => {
    intonationDebounceTimer = null;
    if (appState.isProcessing) {
      scheduleIntonationPlayback();
      return;
    }
    void playUpdatedIntonation();
  }, INTONATION_DEBOUNCE_MS);
}

async function replayCachedIntonationAudio() {
  if (!appState.lastSynthesizedBuffer || appState.isProcessing) return false;
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;
  try {
    appState.isProcessing = true;
    if (playButton) playButton.disabled = true;
    updateExportButtonState(exportButton);
    initializeVisualizationCanvases({ preserveSpectrogram: true });
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(appState.lastSynthesizedBuffer.slice(0));
    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }
    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas, { resetSpectrogram: false });
    return true;
  } catch (error) {
    console.error('Intonation cache playback error:', error);
    showStatus('キャッシュの再生に失敗しました', 'error');
    return false;
  } finally {
    appState.isProcessing = false;
    if (playButton) playButton.disabled = false;
    updateExportButtonState(exportButton);
  }
}

export async function playUpdatedIntonation() {
  if (!currentIntonationQuery) return;
  if (appState.isProcessing) return;

  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;

  appState.isProcessing = true;
  if (playButton) playButton.disabled = true;
  updateExportButtonState(exportButton);
  initializeVisualizationCanvases();

  try {
    showStatus('イントネーションを適用中...', 'info');
    const synthesisStart = performance.now();
    const audioBuffer = await synthesize(currentIntonationQuery, currentIntonationStyleId);
    const synthesisElapsed = performance.now() - synthesisStart;
    updateIntonationTiming(`イントネーション反映: ${Math.round(synthesisElapsed)} ms`);

    appState.lastSynthesizedBuffer = audioBuffer;
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));

    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }

    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas);

    showStatus('更新したイントネーションで再生しました', 'success');
    scheduleHideStatus(2500);
  } catch (error) {
    console.error('Intonation playback error:', error);
    showStatus(
      `イントネーション適用中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
  } finally {
    appState.isProcessing = false;
    if (playButton) playButton.disabled = false;
    updateExportButtonState(exportButton);
  }
}

export async function fetchAndRenderIntonation(text: string, styleId: number) {
  if (!intonationCanvas) return;
  const start = performance.now();
  try {
    const query = await getAudioQuery(text, styleId);
    const elapsed = performance.now() - start;
    intonationInitialQuery = cloneAudioQuery(query);
    currentIntonationQuery = cloneAudioQuery(query);
    currentIntonationStyleId = styleId;
    intonationPoints = buildIntonationPointsFromQuery(query);
    intonationTopScale = 1;
    intonationBottomScale = 1;
    intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
    updateInitialRangeFromPoints(intonationPoints);
    drawIntonationChart(intonationPoints);
    intonationDirty = false;
    updateIntonationTiming(`イントネーション取得: ${Math.round(elapsed)} ms`);
  } catch (error) {
    console.error('Failed to fetch intonation:', error);
    updateIntonationTiming('イントネーションの取得に失敗しました');
    showStatus('イントネーションの取得に失敗しました', 'error');
  }
}

export function resetIntonationToInitial() {
  if (!intonationInitialQuery) return;
  currentIntonationQuery = cloneAudioQuery(intonationInitialQuery);
  intonationPoints = buildIntonationPointsFromQuery(currentIntonationQuery);
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
  intonationDirty = false;
  intonationPlaybackPending = false;
  if (intonationDebounceTimer !== null) {
    window.clearTimeout(intonationDebounceTimer);
    intonationDebounceTimer = null;
  }
  updateInitialRangeFromPoints(intonationPoints);
  drawIntonationChart(intonationPoints);
}

export function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
  if (event.button !== 0) return;
  if (!intonationCanvas || intonationPointPositions.length === 0) return;
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const targetIndex = findNearestIntonationPoint(x);
  if (targetIndex !== -1) {
    intonationDragIndex = targetIndex;
    intonationSelectedIndex = targetIndex;
    disableLoopOnIntonationEdit();
    intonationCanvas.focus();
    if (!scrollLocked) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      scrollLocked = true;
    }
    if ('pointerId' in event) {
      intonationActivePointerId = event.pointerId;
      intonationCanvas.setPointerCapture(event.pointerId);
    }
    handleIntonationPointerMove(event);
    event.preventDefault();
  }
}

export function handleIntonationPointerMove(event: MouseEvent | PointerEvent) {
  if (intonationDragIndex === null || !intonationCanvas || intonationPointPositions.length === 0) {
    return;
  }
  event.preventDefault();
  if ('pointerId' in event && intonationActivePointerId !== null && event.pointerId !== intonationActivePointerId) {
    return;
  }
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const targetIndex = findNearestIntonationPoint(x);
  if (targetIndex === -1) return;
  intonationDragIndex = targetIndex;
  const y = event.clientY - rect.top;
  refreshDisplayRange();
  const newPitch = clampPitchToDisplayRange(pitchFromY(y));
  intonationPoints[targetIndex].pitch = newPitch;
  intonationSelectedIndex = targetIndex;
  applyPitchToQuery(targetIndex, newPitch);
  disableLoopOnIntonationEdit();
  intonationDirty = true;
  drawIntonationChart(intonationPoints);
  intonationPlaybackPending = true;
}

export function handleIntonationPointerUp() {
  if (intonationDragIndex !== null) {
    intonationDragIndex = null;
  }
  if (scrollLocked) {
    document.body.style.overflow = previousBodyOverflow ?? '';
    scrollLocked = false;
    previousBodyOverflow = null;
  }
  if (intonationActivePointerId !== null && intonationCanvas) {
    intonationCanvas.releasePointerCapture(intonationActivePointerId);
    intonationActivePointerId = null;
  }
  if (intonationPlaybackPending) {
    intonationPlaybackPending = false;
    scheduleIntonationPlayback();
  }
}

export function handleIntonationKeyDown(event: KeyboardEvent) {
  if (!intonationCanvas || intonationPointPositions.length === 0 || !intonationKeyboardEnabled) {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    void replayCachedIntonationAudio();
    return;
  }
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    intonationSelectedIndex = null;
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'Tab') {
    if (intonationSelectedIndex !== null) {
      intonationSelectedIndex = null;
      drawIntonationChart(intonationPoints);
    }
    return;
  }
  const letterIndex =
    event.key.length === 1 ? event.key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) : -1;
  if (letterIndex >= 0 && letterIndex < 26) {
    const targetIndex = intonationPoints.findIndex((_, idx) => idx % 26 === letterIndex);
    if (targetIndex !== -1) {
      intonationSelectedIndex = targetIndex;
      drawIntonationChart(intonationPoints);
      event.preventDefault();
    }
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    intonationSelectedIndex = Math.max(0, (intonationSelectedIndex ?? 0) - 1);
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    intonationSelectedIndex = Math.min(intonationPoints.length - 1, (intonationSelectedIndex ?? 0) + 1);
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    if (intonationSelectedIndex === null) {
      intonationSelectedIndex = 0;
    }
    if (!intonationInitialPitchRange) {
      updateInitialRangeFromPoints(intonationPoints);
    }
    refreshDisplayRange();
    const step = intonationStepSize * (event.shiftKey && !event.ctrlKey ? 0.5 : 1);
    if (event.ctrlKey) {
      const rangeDelta = event.key === 'ArrowUp' ? step : -step;
      applyRangeExtra(intonationRangeExtra + rangeDelta);
      drawIntonationChart(intonationPoints);
      return;
    }
    const targetIndex = intonationSelectedIndex ?? 0;
    const adjustment = event.key === 'ArrowUp' ? step : -step;
    const newPitch = clampPitchToDisplayRange(intonationPoints[targetIndex].pitch + adjustment);
    intonationPoints[targetIndex].pitch = newPitch;
    applyPitchToQuery(targetIndex, newPitch);
    disableLoopOnIntonationEdit();
    intonationDirty = true;
    drawIntonationChart(intonationPoints);
    scheduleIntonationPlayback();
  }
}

function renderIntonationFavoritesList() {
  const listEl = intonationFavoritesListEl;
  if (!listEl) return;
  listEl.textContent = '';
  intonationFavorites.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'text-list__item';

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'text-list__text';

    const pill = document.createElement('span');
    pill.className = 'text-list__pill';
    pill.textContent = 'イントネーション付き';
    playButton.appendChild(pill);

    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    playButton.appendChild(textSpan);

    playButton.addEventListener('click', () => applyIntonationFavorite(item));

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'text-list__action text-list__action--remove';
    removeButton.textContent = '－';
    removeButton.setAttribute('aria-label', 'イントネーション付きお気に入りから削除する');
    removeButton.addEventListener('click', () => removeIntonationFavorite(index));

    listItem.appendChild(playButton);
    listItem.appendChild(removeButton);
    listEl.appendChild(listItem);
  });
}

function removeIntonationFavorite(index: number) {
  if (index < 0 || index >= intonationFavorites.length) return;
  intonationFavorites = [...intonationFavorites.slice(0, index), ...intonationFavorites.slice(index + 1)];
  persistIntonationFavorites();
  renderIntonationFavoritesList();
}

export function applyIntonationFavorite(item: IntonationFavorite) {
  if (!isValidAudioQueryShape(item.query)) {
    showStatus('保存したイントネーションデータが破損しています。削除しました。', 'error');
    const idx = intonationFavorites.findIndex(
      (fav) => fav.text === item.text && fav.styleId === item.styleId
    );
    if (idx !== -1) {
      removeIntonationFavorite(idx);
    }
    return;
  }
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  if (textArea) {
    textArea.value = item.text;
  }
  if (styleSelect) {
    styleSelect.value = String(item.styleId);
  }
  onStyleChange?.(item.styleId);
  currentIntonationStyleId = item.styleId;
  intonationInitialQuery = cloneAudioQuery(item.query);
  currentIntonationQuery = cloneAudioQuery(item.query);
  intonationPoints = buildIntonationPointsFromQuery(currentIntonationQuery);
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
  intonationDirty = false;
  updateInitialRangeFromPoints(intonationPoints);
  drawIntonationChart(intonationPoints);
  void playUpdatedIntonation();
}

export function saveCurrentIntonationFavorite(selectedStyleId: number) {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  if (!textArea) return;
  const text = textArea.value.trim();
  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }
  if (!currentIntonationQuery) {
    showStatus('イントネーション取得後に登録してください', 'error');
    return;
  }
  const entry: IntonationFavorite = {
    text,
    styleId: selectedStyleId,
    query: cloneAudioQuery(currentIntonationQuery),
  };
  intonationFavorites = dedupeIntonationFavorites([entry, ...intonationFavorites]);
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  showStatus('イントネーション付きのお気に入りを保存しました', 'success');
  scheduleHideStatus(2000);
}

export function refreshIntonationChart() {
  refreshDisplayRange();
  drawIntonationChart(intonationPoints);
}

{% endraw %}
```

### src/visualization.ts
```ts
{% raw %}
import * as Tone from 'tone';
import {
  FrequencyScale,
  MIN_LOG_FREQUENCY,
  MIN_TICK_SPACING_PX,
  SPECTROGRAM_MAX_COLUMNS_PER_FRAME,
  WAVEFORM_TARGET_RATIO,
} from './config';
import { getColorVariable, invalidateColorVariableCache } from './status';

let spectrogramScale: FrequencyScale = 'linear';
let spectrogramNeedsReset = false;
let lastSpectrogramScale: FrequencyScale = 'linear';
let realtimePreviousSegment: Float32Array | null = null;
let realtimeSegmentBuffer: Float32Array | null = null;
let fftMagnitudeBuffer: Float32Array | null = null;
let fftHpsBuffer: Float32Array | null = null;
let activePlaybackStopper: (() => void) | null = null;
const SPECTROGRAM_COLOR_STOPS = [
  { stop: 0, color: [0, 0, 0] }, // black
  { stop: 0.25, color: [0, 64, 192] }, // blue
  { stop: 0.5, color: [210, 40, 40] }, // red
  { stop: 0.75, color: [255, 165, 0] }, // orange
  { stop: 1, color: [255, 255, 255] }, // white
];

export function getSpectrogramScale() {
  return spectrogramScale;
}

export function setSpectrogramScale(scale: FrequencyScale) {
  spectrogramScale = scale;
  spectrogramNeedsReset = true;
}

export function requestSpectrogramReset() {
  spectrogramNeedsReset = true;
}

export function isPlaybackActive() {
  return activePlaybackStopper !== null;
}

export function stopActivePlayback() {
  activePlaybackStopper?.();
}

function prepareCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(1, Math.floor(rect.width));
  const displayHeight = Math.max(1, Math.floor(rect.height));
  const width = Math.max(1, Math.floor(displayWidth * dpr));
  const height = Math.max(1, Math.floor(displayHeight * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  return { ctx, width: displayWidth, height: displayHeight, dpr };
}

function fftRadix2(real: Float32Array, imag: Float32Array) {
  const n = real.length;
  if (n <= 1) return;

  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) {
      j ^= bit;
    }
    j ^= bit;
    if (i < j) {
      const tempReal = real[i];
      real[i] = real[j];
      real[j] = tempReal;
      const tempImag = imag[i];
      imag[i] = imag[j];
      imag[j] = tempImag;
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const angle = (-2 * Math.PI) / len;
    const wlenReal = Math.cos(angle);
    const wlenImag = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let wReal = 1;
      let wImag = 0;
      for (let j = 0; j < len / 2; j++) {
        const uReal = real[i + j];
        const uImag = imag[i + j];
        const vReal = real[i + j + len / 2] * wReal - imag[i + j + len / 2] * wImag;
        const vImag = real[i + j + len / 2] * wImag + imag[i + j + len / 2] * wReal;
        real[i + j] = uReal + vReal;
        imag[i + j] = uImag + vImag;
        real[i + j + len / 2] = uReal - vReal;
        imag[i + j + len / 2] = uImag - vImag;

        const nextWReal = wReal * wlenReal - wImag * wlenImag;
        wImag = wReal * wlenImag + wImag * wlenReal;
        wReal = nextWReal;
      }
    }
  }
}

const hannWindowCache = new Map<number, Float32Array>();
function getHannWindow(size: number) {
  const cached = hannWindowCache.get(size);
  if (cached) {
    return cached;
  }
  const window = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  hannWindowCache.set(size, window);
  return window;
}

function lerpColor(a: number[], b: number[], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function mapIntensityToSpectrogramColor(intensity: number) {
  const clamped = Math.max(0, Math.min(1, intensity));
  for (let i = 0; i < SPECTROGRAM_COLOR_STOPS.length - 1; i++) {
    const current = SPECTROGRAM_COLOR_STOPS[i];
    const next = SPECTROGRAM_COLOR_STOPS[i + 1];
    if (clamped >= current.stop && clamped <= next.stop) {
      const localT = (clamped - current.stop) / Math.max(next.stop - current.stop, 1e-6);
      const [r, g, b] = lerpColor(current.color, next.color, localT);
      return `rgb(${r},${g},${b})`;
    }
  }
  const [r, g, b] = SPECTROGRAM_COLOR_STOPS[SPECTROGRAM_COLOR_STOPS.length - 1].color;
  return `rgb(${r},${g},${b})`;
}

function estimateFrequencySeries(
  channelData: Float32Array,
  sampleRate: number,
  maxPoints: number
): Array<{ time: number; freq: number }> {
  const windowSize = 2048;
  const targetPoints = Math.max(1, Math.min(maxPoints, Math.floor(channelData.length / windowSize)));
  const hopSize = Math.max(
    windowSize / 2,
    Math.floor((channelData.length - windowSize) / Math.max(targetPoints - 1, 1))
  );
  if (channelData.length < windowSize || sampleRate <= 0) {
    return [];
  }
  const window = getHannWindow(windowSize);
  const fftSize = 1 << Math.ceil(Math.log2(windowSize));
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  const frequencies: Array<{ time: number; freq: number }> = [];

  for (let offset = 0; offset + windowSize <= channelData.length; offset += hopSize) {
    real.fill(0);
    imag.fill(0);
    for (let i = 0; i < windowSize; i++) {
      real[i] = channelData[offset + i] * window[i];
    }
    fftRadix2(real, imag);

    let maxMag = 0;
    let maxIndex = 0;
    for (let i = 0; i < fftSize / 2; i++) {
      const mag = real[i] * real[i] + imag[i] * imag[i];
      if (mag > maxMag) {
        maxMag = mag;
        maxIndex = i;
      }
    }

    const freq = (maxIndex * sampleRate) / fftSize;
    frequencies.push({ time: offset / sampleRate, freq });
  }

  const grouped: Array<{ time: number; freq: number }> = [];
  const columns = Math.max(1, Math.min(frequencies.length, SPECTROGRAM_MAX_COLUMNS_PER_FRAME));
  const groupSize = Math.max(1, Math.floor(frequencies.length / columns));

  for (let i = 0; i < frequencies.length; i += groupSize) {
    const group = frequencies.slice(i, i + groupSize);
    if (group.length === 0) continue;
    const avgFreq = group.reduce((sum, item) => sum + item.freq, 0) / group.length;
    const avgTime = group.reduce((sum, item) => sum + item.time, 0) / group.length;
    grouped.push({ time: avgTime, freq: avgFreq });
  }

  return grouped;
}

export function drawRenderedWaveform(buffer: AudioBuffer, canvas: HTMLCanvasElement) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const channelData = buffer.getChannelData(0);
  const totalSamples = channelData.length;
  let maxAbs = 0;
  for (let i = 0; i < totalSamples; i++) {
    const abs = Math.abs(channelData[i]);
    if (abs > maxAbs) {
      maxAbs = abs;
    }
  }
  const samplesPerPixel = Math.max(1, Math.floor(totalSamples / width));
  const baseHalfHeight = (height * WAVEFORM_TARGET_RATIO) / 2;
  const amplitudeScale = baseHalfHeight / Math.max(maxAbs, 1e-4);
  const centerY = height / 2;

  ctx.save();
  ctx.strokeStyle = getColorVariable('--grid-color', 'rgba(0,0,0,0.08)');
  ctx.fillStyle = getColorVariable('--axis-label', '#666666');
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const labelMetrics = ctx.measureText('-00 dB');
  const labelHeight = (labelMetrics.actualBoundingBoxAscent ?? 0) + (labelMetrics.actualBoundingBoxDescent ?? 0);
  const minLabelGap = Math.max(11, Math.ceil(labelHeight || 0)) + 2;
  let lastLabelY: number | null = null;
  for (let db = 0; db >= -60; db -= 6) {
    const amplitudeRatio = 10 ** (db / 20);
    const offset = amplitudeRatio * baseHalfHeight;
    if (offset > height) break;
    const positions = [centerY - offset, centerY + offset];
    const label = `${db} dB`;
    for (const y of positions) {
      if (y < 0 || y > height) continue;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      if (lastLabelY === null || Math.abs(y - lastLabelY) >= minLabelGap) {
        ctx.fillText(label, 6, y);
        lastLabelY = y;
      }
    }
  }
  ctx.restore();

  ctx.strokeStyle = getColorVariable('--primary-color', '#4CAF50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const start = x * samplesPerPixel;
    const end = Math.min(start + samplesPerPixel, totalSamples);
    let min = Infinity;
    let max = -Infinity;
    for (let i = start; i < end; i++) {
      const value = channelData[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    const yMin = centerY - min * amplitudeScale;
    const yMax = centerY - max * amplitudeScale;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();

  const frequencies = estimateFrequencySeries(channelData, buffer.sampleRate, width / 6);
  if (frequencies.length > 0) {
    const highlightColor = getColorVariable('--highlight-color', '#ff9800');
    ctx.strokeStyle = highlightColor;
    ctx.fillStyle = highlightColor;
    ctx.beginPath();
    frequencies.forEach((freq, index) => {
      const x = (freq.time / buffer.duration) * width;
      const y = height - (Math.log10(freq.freq + 1) / Math.log10(buffer.sampleRate / 2 + 1)) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.fillRect(x - 1, y - 1, 2, 2);
    });
    ctx.stroke();
  }

  ctx.strokeStyle = getColorVariable('--grid-color', 'rgba(0,0,0,0.1)');
  ctx.beginPath();
  const maxDuration = buffer.duration;
  const step = 0.5;
  const maxTicks = Math.max(1, Math.ceil(maxDuration / step));
  for (let i = 0; i <= maxTicks; i++) {
    const x = (i * step * width) / maxDuration;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  ctx.stroke();
}

function drawRealtimeWaveform(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  sampleRate: number,
  currentEstimatedFrequency: number | null
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || values.length === 0) return;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const channelData = values;
  const windowSize = Math.max(1, Math.min(channelData.length, 2048));
  const start = Math.max(0, channelData.length - windowSize);
  const windowed = channelData.slice(start, start + windowSize);
  const window = getHannWindow(windowSize);

  const fftSize = 1 << Math.ceil(Math.log2(windowSize));
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  for (let i = 0; i < windowSize; i++) {
    real[i] = windowed[i] * window[i];
  }
  fftRadix2(real, imag);

  let maxMag = 0;
  let maxIndex = 0;
  for (let i = 0; i < fftSize / 2; i++) {
    const mag = real[i] * real[i] + imag[i] * imag[i];
    if (mag > maxMag) {
      maxMag = mag;
      maxIndex = i;
    }
  }

  const freq = (maxIndex * sampleRate) / fftSize;
  const targetFreq = currentEstimatedFrequency ?? freq;
  const cycles = Math.max(1, Math.min(4, Math.floor(sampleRate / Math.max(targetFreq, 1))));
  const targetSamples = Math.floor(cycles * (sampleRate / Math.max(targetFreq, 1)));
  const segmentLength = Math.max(1, Math.min(targetSamples, windowSize));

  const segment = extractAlignedRealtimeSegment(windowed, segmentLength);
  let segmentMaxAbs = 0;
  for (let i = 0; i < segment.length; i++) {
    const abs = Math.abs(segment[i]);
    if (abs > segmentMaxAbs) {
      segmentMaxAbs = abs;
    }
  }
  const samplesPerPixel = Math.max(1, segment.length / width);
  const baseHalfHeight = (height * WAVEFORM_TARGET_RATIO) / 2;
  const amplitudeScale = baseHalfHeight / Math.max(segmentMaxAbs, 1e-4);

  ctx.strokeStyle = getColorVariable('--primary-color', '#4CAF50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const startIndex = Math.floor(x * samplesPerPixel);
    const endIndex = Math.min(Math.floor((x + 1) * samplesPerPixel), segment.length);
    let min = Infinity;
    let max = -Infinity;
    for (let i = startIndex; i < endIndex; i++) {
      const value = segment[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    const yMin = height / 2 - min * amplitudeScale;
    const yMax = height / 2 - max * amplitudeScale;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();
}

function determineSpectrogramCeiling(values: Float32Array, previousCeiling: number) {
  if (values.length === 0) {
    return 1;
  }

  let peak = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
    }
  }

  const threshold = peak - 40;
  let highestIndexAboveThreshold = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] >= threshold) {
      highestIndexAboveThreshold = i;
      break;
    }
  }

  const rawCeiling = Math.max(highestIndexAboveThreshold, previousCeiling * 0.98);
  const clampedCeiling = Math.max(1, Math.min(values.length - 1, Math.floor(rawCeiling)));
  return clampedCeiling;
}

function estimateFundamentalFrequency(values: Float32Array, sampleRate: number) {
  const magnitude = values.map((v) => 10 ** (v / 20));
  const downSampled: number[] = [];
  const maxIndex = values.length / 2;
  for (let i = 1; i < maxIndex; i++) {
    downSampled.push(magnitude[i]);
  }

  const maxLag = Math.min(1000, downSampled.length - 1);
  fftMagnitudeBuffer = fftMagnitudeBuffer && fftMagnitudeBuffer.length === maxLag
    ? fftMagnitudeBuffer
    : new Float32Array(maxLag);
  fftHpsBuffer = fftHpsBuffer && fftHpsBuffer.length === maxLag
    ? fftHpsBuffer
    : new Float32Array(maxLag);
  fftMagnitudeBuffer.fill(0);
  fftHpsBuffer.fill(0);

  for (let lag = 1; lag < maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < downSampled.length - lag; i++) {
      sum += Math.abs(downSampled[i]) * Math.abs(downSampled[i + lag]);
    }
    fftMagnitudeBuffer[lag] = sum;
  }

  for (let harmonic = 1; harmonic <= 4; harmonic++) {
    for (let i = 1; i < maxLag; i++) {
      const index = Math.floor(i / harmonic);
      if (index < fftMagnitudeBuffer.length) {
        fftHpsBuffer[i] += fftMagnitudeBuffer[index];
      }
    }
  }

  let bestLag = 1;
  let bestValue = fftHpsBuffer[1];
  for (let i = 2; i < maxLag; i++) {
    if (fftHpsBuffer[i] > bestValue) {
      bestValue = fftHpsBuffer[i];
      bestLag = i;
    }
  }

  return sampleRate / bestLag;
}

function computeSegmentStats(buffer: Float32Array, offset: number, length: number) {
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < length; i++) {
    const value = buffer[offset + i];
    sum += value;
    sumSq += value * value;
  }
  const mean = sum / length;
  const variance = sumSq / length - mean * mean;
  const stdDev = Math.sqrt(Math.max(variance, 0));
  return { mean, stdDev };
}

function computeSegmentCorrelation(
  buffer: Float32Array,
  offsetA: number,
  offsetB: number,
  length: number
) {
  const statsA = computeSegmentStats(buffer, offsetA, length);
  const statsB = computeSegmentStats(buffer, offsetB, length);
  let numerator = 0;
  for (let i = 0; i < length; i++) {
    const a = buffer[offsetA + i] - statsA.mean;
    const b = buffer[offsetB + i] - statsB.mean;
    numerator += a * b;
  }
  const denominator = length * statsA.stdDev * statsB.stdDev;
  return denominator === 0 ? 0 : numerator / denominator;
}

function extractAlignedRealtimeSegment(values: Float32Array, targetLength: number) {
  const length = Math.min(targetLength, values.length);
  if (!realtimeSegmentBuffer || realtimeSegmentBuffer.length !== length) {
    realtimeSegmentBuffer = new Float32Array(length);
  }

  if (!realtimePreviousSegment || realtimePreviousSegment.length < length) {
    realtimePreviousSegment = new Float32Array(length);
    realtimePreviousSegment.set(values.slice(values.length - length));
    return realtimePreviousSegment;
  }

  const searchRange = Math.min(values.length - length, Math.max(1, Math.floor(length * 0.5)));
  let bestOffset = values.length - length;
  let bestCorrelation = -Infinity;
  for (let offset = values.length - length - searchRange; offset <= values.length - length + searchRange; offset++) {
    const correlation = computeSegmentCorrelation(values, offset, values.length - length, length);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  realtimeSegmentBuffer.set(values.slice(bestOffset, bestOffset + length));
  realtimePreviousSegment.set(realtimeSegmentBuffer);
  return realtimeSegmentBuffer;
}

function drawSpectrogram(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  progress: number,
  ceilingIndex: number,
  previousX: number,
  sampleRate: number,
  scale: FrequencyScale,
  reset?: boolean
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return previousX;

  const drawableWidth = width - 40;
  const drawableHeight = height;
  const leftMargin = 40;
  const minLogFreq = MIN_LOG_FREQUENCY;
  const maxFreq = Math.max(sampleRate / 2, 1);
  const cappedTargetX = Math.min(drawableWidth, Math.max(0, Math.floor(progress * drawableWidth)));
  const targetX = cappedTargetX;
  const drawRange = reset
    ? { start: 0, end: targetX }
    : targetX > previousX
      ? { start: Math.max(previousX + 1, 0), end: targetX }
      : null;
  if (reset) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  }

  const MIN_DB = -100;
  const MAX_DB = 0;
  ctx.save();
  ctx.globalAlpha = 1;
  if (drawRange) {
    for (let x = drawRange.start; x <= drawRange.end; x++) {
      const columnX = leftMargin + x;
      for (let bin = 0; bin < values.length; bin++) {
        const magnitudeDb = values[bin];
        const clampedDb = Math.max(MIN_DB, Math.min(MAX_DB, magnitudeDb));
        const intensity = (clampedDb - MIN_DB) / (MAX_DB - MIN_DB);
        if (intensity <= 0) continue;

        const freq = (bin / ceilingIndex) * maxFreq;
        const normalized = scale === 'log'
          ? (freq <= 0
              ? 0
              : (Math.log10(Math.max(freq, minLogFreq)) - Math.log10(minLogFreq)) /
                Math.max(Math.log10(maxFreq) - Math.log10(minLogFreq), 1))
          : freq / maxFreq;

        const nextBin = bin + 1;
        const nextFreq = nextBin > ceilingIndex ? maxFreq : (nextBin / ceilingIndex) * maxFreq;
        const nextNormalized = scale === 'log'
          ? (nextFreq <= 0
              ? 0
              : (Math.log10(Math.max(nextFreq, minLogFreq)) - Math.log10(minLogFreq)) /
                Math.max(Math.log10(maxFreq) - Math.log10(minLogFreq), 1))
          : nextFreq / maxFreq;

        const yTop = drawableHeight - Math.min(normalized * drawableHeight, drawableHeight);
        const yBottom = drawableHeight - Math.min(nextNormalized * drawableHeight, drawableHeight);
        const rectY = Math.min(yTop, yBottom);
        const rectHeight = Math.max(1, Math.abs(yBottom - yTop));

        ctx.fillStyle = mapIntensityToSpectrogramColor(intensity);
        ctx.fillRect(columnX, rectY, 1, rectHeight);
      }
    }
  }
  ctx.restore();

  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftMargin, 0);
  ctx.lineTo(leftMargin, drawableHeight);
  ctx.lineTo(width, drawableHeight);
  ctx.stroke();

  if (reset || targetX <= previousX) {
    ctx.strokeStyle = getColorVariable('--grid-color', 'rgba(0,0,0,0.05)');
    ctx.beginPath();
    const tickSpacing = Math.max(MIN_TICK_SPACING_PX, width / 10);
    for (let x = leftMargin; x <= width; x += tickSpacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, drawableHeight);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(leftMargin, 0);
  ctx.lineTo(leftMargin, drawableHeight);
  ctx.lineTo(width, drawableHeight);
  ctx.stroke();

  ctx.strokeStyle = getColorVariable('--canvas-grid', 'rgba(0,0,0,0.06)');
  ctx.fillStyle = getColorVariable('--axis-label', '#666666');
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const labelMetrics = ctx.measureText('0000Hz');
  const calculatedHeight = (labelMetrics.actualBoundingBoxAscent ?? 0) + (labelMetrics.actualBoundingBoxDescent ?? 0);
  const labelHeight = Math.max(11, Math.ceil(calculatedHeight || 0));
  const minLabelGap = labelHeight + 2;
  let lastLabelY: number | null = null;
  const logMax = Math.log10(Math.max(maxFreq, minLogFreq));
  const logMin = Math.log10(Math.max(minLogFreq, 1));
  const ticks: number[] = [];
  for (let freq = 0; freq <= maxFreq; freq += 500) {
    ticks.push(freq);
  }
  if (ticks.length === 0 || ticks[ticks.length - 1] !== maxFreq) {
    ticks.push(maxFreq);
  }
  for (const freq of ticks) {
    const normalized = scale === 'log'
      ? (freq <= 0 ? 0 : (Math.log10(Math.max(freq, minLogFreq)) - logMin) / Math.max(logMax - logMin, 1))
      : freq / maxFreq;
    const y = drawableHeight - Math.min(normalized * drawableHeight, drawableHeight);
    ctx.beginPath();
    ctx.moveTo(leftMargin - 4, y);
    ctx.lineTo(leftMargin + 6, y);
    ctx.stroke();
    const shouldDrawLabel = lastLabelY === null
      || Math.abs(y - lastLabelY) >= minLabelGap
      || freq === 0
      || freq === maxFreq;
    if (shouldDrawLabel) {
      ctx.fillText(`${Math.round(freq)}Hz`, leftMargin - 6, y);
      lastLabelY = y;
    }
  }

  return cappedTargetX;
}

export function initializeVisualizationCanvases(options?: { preserveSpectrogram?: boolean }) {
  const preserveSpectrogram = options?.preserveSpectrogram ?? false;
  invalidateColorVariableCache();
  ['renderedWaveform', 'realtimeWaveform', 'spectrogram'].forEach((id) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;

    const { ctx, width, height } = prepareCanvas(canvas);
    if (!ctx) return;

    if (id === 'spectrogram' && preserveSpectrogram) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');

    if (id === 'spectrogram') {
      drawSpectrogram(
        new Float32Array([0, 0]),
        canvas,
        0,
        1,
        -1,
        Tone.getContext().sampleRate ?? 48000,
        spectrogramScale,
        true
      );
      spectrogramNeedsReset = false;
      lastSpectrogramScale = spectrogramScale;
    } else {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
  });
}

export async function playAudio(
  decodedBuffer: AudioBuffer,
  realtimeCanvas?: HTMLCanvasElement | null,
  spectrogramCanvas?: HTMLCanvasElement | null,
  options?: { resetSpectrogram?: boolean }
): Promise<{ stopped: boolean }> {
  await Tone.start();

  const player = new Tone.Player(decodedBuffer);
  const waveformAnalyser = realtimeCanvas ? new Tone.Analyser('waveform', 4096) : null;
  const fftAnalyser = spectrogramCanvas ? new Tone.Analyser('fft', 1024) : null;
  const renderedProgress = document.getElementById('renderedWaveformProgress') as HTMLDivElement | null;
  const spectrogramProgress = document.getElementById('spectrogramProgress') as HTMLDivElement | null;
  const updateProgressLines = (ratio: number) => {
    const clamped = Math.min(Math.max(ratio, 0), 1) * 100;
    [renderedProgress, spectrogramProgress].forEach((el) => {
      if (el) {
        el.style.left = `${clamped}%`;
        el.classList.add('is-active');
      }
    });
  };
  const clearProgressLines = () => {
    [renderedProgress, spectrogramProgress].forEach((el) => {
      if (el) {
        el.classList.remove('is-active');
      }
    });
  };

  if (waveformAnalyser) {
    player.connect(waveformAnalyser);
  }

  if (fftAnalyser) {
    player.connect(fftAnalyser);
  }

  player.toDestination();
  player.start();

  let animationId: number | null = null;
  let spectrogramX = -1;
  let spectrogramCeiling = fftAnalyser ? fftAnalyser.size : 0;
  const playbackDurationMs = Math.max(decodedBuffer.duration * 1000, 1);
  const sampleRate = Math.max(decodedBuffer.sampleRate, 1);
  const shouldResetSpectrogram = options?.resetSpectrogram ?? true;
  spectrogramNeedsReset = shouldResetSpectrogram;
  const startTime = performance.now();
  realtimePreviousSegment = null;
  let currentEstimatedFrequency: number | null = null;
  updateProgressLines(0);

  const render = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / playbackDurationMs, 1);

    if (fftAnalyser && spectrogramCanvas) {
      const values = fftAnalyser.getValue() as Float32Array;
      currentEstimatedFrequency = estimateFundamentalFrequency(values, sampleRate);
      const needsReset = spectrogramNeedsReset || lastSpectrogramScale !== spectrogramScale;
      const shouldDrawSpectrogram = shouldResetSpectrogram || needsReset;
      if (shouldDrawSpectrogram) {
        spectrogramCeiling = determineSpectrogramCeiling(
          values,
          spectrogramCeiling || values.length - 1
        );
        spectrogramX = drawSpectrogram(
          values,
          spectrogramCanvas,
          progress,
          spectrogramCeiling,
          spectrogramX,
          sampleRate,
          spectrogramScale,
          needsReset
        );
        if (needsReset) {
          spectrogramNeedsReset = false;
          lastSpectrogramScale = spectrogramScale;
        }
      }
    }

    if (waveformAnalyser && realtimeCanvas) {
      const values = waveformAnalyser.getValue() as Float32Array;
      drawRealtimeWaveform(values, realtimeCanvas, sampleRate, currentEstimatedFrequency);
    }

    updateProgressLines(progress);
    animationId = requestAnimationFrame(render);
  };

  if (waveformAnalyser || fftAnalyser) {
    render();
  }

  return new Promise<{ stopped: boolean }>((resolve) => {
    let resolved = false;
    let stoppedByUser = false;

    const cleanup = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      clearProgressLines();
      waveformAnalyser?.dispose();
      fftAnalyser?.dispose();
      player.dispose();
    };

    const finalize = () => {
      cleanup();
      if (activePlaybackStopper === stopPlayback) {
        activePlaybackStopper = null;
      }
    };

    const stopPlayback = () => {
      if (resolved) return;
      resolved = true;
      stoppedByUser = true;
      if (player.state === 'started') {
        player.stop();
      }
      finalize();
      resolve({ stopped: stoppedByUser });
    };

    const previousStopper = activePlaybackStopper;
    activePlaybackStopper = stopPlayback;
    if (previousStopper && previousStopper !== stopPlayback) {
      previousStopper();
    }

    player.onstop = () => {
      if (!resolved) {
        resolved = true;
        finalize();
        resolve({ stopped: stoppedByUser });
      }
    };

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (player.state === 'started') {
          player.stop();
        }
        finalize();
        resolve({ stopped: stoppedByUser });
      }
    }, decodedBuffer.duration * 1000 + 100);
  });
}

{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
f03cb6d Add build URL to issue notes
b48b21d Add issue note for #74 [auto]
fbc9c18 Merge pull request #73 from cat2151/codex/fix-dark-mode-visibility
30ed456 test: organize populate speaker style test
7b806cf feat: add speaker style selector
0c5d1ac Initial plan
5b9e108 Merge pull request #71 from cat2151/codex/fix-spectrogram-display-bug
d8c32c2 Expand issue notes for issue #72
4c7cdaa Add issue note for #72 [auto]
3d1437c fix: keep spectrogram columns stable near playback end

### 変更されたファイル:
index.html
issue-notes/44.md
issue-notes/69.md
issue-notes/72.md
issue-notes/74.md
src/main.ts
src/playback.test.ts
src/playback.ts
src/styleManager.test.ts
src/styleManager.ts
src/visualization.ts


---
Generated at: 2026-02-14 07:06:07 JST
