Last updated: 2026-02-20

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
- .github/workflows/create-issue-on-actions-failure.yml
- .github/workflows/deploy.yml
- .gitignore
- AGENTS.md
- LICENSE
- README.ja.md
- README.md
- biome.json
- generated-docs/project-overview-generated-prompt.md
- index.html
- issue-notes/100.md
- issue-notes/110.md
- issue-notes/111.md
- issue-notes/113.md
- issue-notes/115.md
- issue-notes/116.md
- issue-notes/117.md
- issue-notes/118.md
- issue-notes/119.md
- issue-notes/120.md
- issue-notes/121.md
- issue-notes/122.md
- issue-notes/123.md
- issue-notes/22.md
- issue-notes/23.md
- issue-notes/24.md
- issue-notes/25.md
- issue-notes/26.md
- issue-notes/27.md
- issue-notes/30.md
- issue-notes/45.md
- issue-notes/56.md
- issue-notes/62.md
- issue-notes/64.md
- issue-notes/65.md
- issue-notes/66.md
- issue-notes/67.md
- issue-notes/68.md
- issue-notes/72.md
- issue-notes/74.md
- issue-notes/79.md
- issue-notes/80.md
- issue-notes/89.md
- issue-notes/92.md
- issue-notes/97.md
- issue-notes/99.md
- package-lock.json
- package.json
- src/audio.ts
- src/config.ts
- src/intonation.test.ts
- src/intonation.ts
- src/intonationDisplay.ts
- src/intonationPlayback.ts
- src/intonationState.ts
- src/intonationUtils.ts
- src/main.ts
- src/playback.test.ts
- src/playback.ts
- src/state.ts
- src/status.ts
- src/styleManager.test.ts
- src/styleManager.ts
- src/styles/base.css
- src/styles/intonation.css
- src/styles.css
- src/textLists.test.ts
- src/textLists.ts
- src/uiControls.ts
- src/visualization/canvas.ts
- src/visualization/fft.ts
- src/visualization/fftMaxFreq.ts
- src/visualization/fftOverlay.test.ts
- src/visualization/fftOverlay.ts
- src/visualization/fftUtils.ts
- src/visualization/spectrogram.ts
- src/visualization/timeAxis.ts
- src/visualization/waveform.ts
- src/visualization.test.ts
- src/visualization.ts
- src/vite-env.d.ts
- tsconfig.json
- vite.config.ts

## 現在のオープンIssues
## [Issue #123](../issue-notes/123.md): イントネーション編集で、モーラのポイント表示と、モーラ名称表示を結ぶ、縦線を表示する
[issue-notes/123.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/123.md)

...
ラベル: 
--- issue-notes/123.md の内容 ---

```markdown
# issue イントネーション編集で、モーラのポイント表示と、モーラ名称表示を結ぶ、縦線を表示する #123
[issues #123](https://github.com/cat2151/voicevox-playground/issues/123)

- あわせて、マウスポインタが「編集可能なモーラ領域上にhoverしている場合」、
  - それに紐付くモーラ名を一時的に明るく目立たせる
  - ※マウスポインタが今どのモーラに紐ついているか？の判定関数を共用する想定

```

## [Issue #122](../issue-notes/122.md): 「エラーが発生しました: Failed to fetch」が、知らない人にはわかりづらい
[issue-notes/122.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/122.md)

...
ラベル: 
--- issue-notes/122.md の内容 ---

```markdown
# issue 「エラーが発生しました: Failed to fetch」が、知らない人にはわかりづらい #122
[issues #122](https://github.com/cat2151/voicevox-playground/issues/122)

- 案
    - その前にstyleの取得に失敗し「未取得」となった時点で、
    - 「ローカルVOICEVOXサーバーを起動してください」をダイアログ表示する
    - 一方で、styleの取得に成功したら、既存のstatus表示欄に、「ローカルサーバーとの通信成功。音声合成の準備ができました」を表示する

```

## [Issue #121](../issue-notes/121.md): イントネーション付きお気に入りのexportとimportをできるようにする
[issue-notes/121.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/121.md)

...
ラベル: 
--- issue-notes/121.md の内容 ---

```markdown
# issue イントネーション付きお気に入りのexportとimportをできるようにする #121
[issues #121](https://github.com/cat2151/voicevox-playground/issues/121)

- 「イントネーション付きお気に入り」の見出しの右に、exportボタンとimportボタンをつける
- exportもimportも、「イントネーション付きお気に入り」のlocal storageに保存される内容そのもの（複数まるごと）、とする
- ひとまず複数まるごとでUX検証とする

```

## [Issue #120](../issue-notes/120.md): キーボード操作モードonのとき、textarea編集時に意図しないa-zやplayができてしまい混乱する
[issue-notes/120.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/120.md)

...
ラベル: 
--- issue-notes/120.md の内容 ---

```markdown
# issue キーボード操作モードonのとき、textarea編集時に意図しないa-zやplayができてしまい混乱する #120
[issues #120](https://github.com/cat2151/voicevox-playground/issues/120)

- 対策
    - textarea編集時は、キーボード操作モードonであっても、キーボード操作onモード特有のキー（a-zやspaceとenter）を素通りさせる
    - かわりに、キーボード操作モードon/offに関わらず、どの状況であっても、SHIFT+ENTERとCTRL+ENTERを、playキーとする

```

## [Issue #119](../issue-notes/119.md): キャラ&styleプルダウンを選んだら、自動再生する
[issue-notes/119.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/119.md)

...
ラベル: 
--- issue-notes/119.md の内容 ---

```markdown
# issue キャラ&styleプルダウンを選んだら、自動再生する #119
[issues #119](https://github.com/cat2151/voicevox-playground/issues/119)

# 自動再生を追加する対象
- キャラ&styleプルダウン
- styleプルダウン
- ランダムstyleチェックボックス

# あわせて、以下も行う
- お気に入り再生をクリックしたとき、もしloop再生中だったなら、loop再生をやめ、stopして、お気に入り再生を鳴らす
  - 今は、loop再生中だと、お気に入り再生をクリックしても何も起きないのでuserが混乱する

```

## [Issue #118](../issue-notes/118.md): VOICEVOX Nemo も再生できるようにする
[issue-notes/118.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/118.md)

...
ラベル: 
--- issue-notes/118.md の内容 ---

```markdown
# issue VOICEVOX Nemo も再生できるようにする #118
[issues #118](https://github.com/cat2151/voicevox-playground/issues/118)

- VOICEVOX Nemo-engine ローカルサーバー port 50121 からもspeakers取得を試みて、
    - 取得できたなら、それもキャラ&styleプルダウンに含める

- user向け備忘
    - nemo
        - 仕組み
            - local nemo engineは、voicevox engineと別サーバである。デフォ port 50121 で動作する
        - もし今すぐnemoだけでいいので鳴らしたいなら
            - dir
                - 当該nemoのdirは、voicevoxアプリの設定のengine管理を見るとわかる
            - run
                - nemoもvoicevox-engine同様、runがあるので、それを`--port 50021`にすれば鳴らせる

```

## [Issue #117](../issue-notes/117.md): イントネーション編集後や、イントネーション付きお気に入りを再生したあと、playボタンを押すと、警告なしにイントネーションが初期化されてしまう
[issue-notes/117.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/117.md)

...
ラベル: 
--- issue-notes/117.md の内容 ---

```markdown
# issue イントネーション編集後や、イントネーション付きお気に入りを再生したあと、playボタンを押すと、警告なしにイントネーションが初期化されてしまう #117
[issues #117](https://github.com/cat2151/voicevox-playground/issues/117)

- userがほしいのは、その状況であれば、イントネーションを維持したまま再生、である


```

## [Issue #116](../issue-notes/116.md): demoの利用方法欄に、ローカルPCにVOICEVOXをinstallしてください、を書く
[issue-notes/116.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/116.md)

...
ラベル: 
--- issue-notes/116.md の内容 ---

```markdown
# issue demoの利用方法欄に、ローカルPCにVOICEVOXをinstallしてください、を書く #116
[issues #116](https://github.com/cat2151/voicevox-playground/issues/116)

- 書く内容については、README.ja.mdを参考にすること

```

## [Issue #115](../issue-notes/115.md): （保留中）スペクトログラムについて、リニア表示たと、上半分が真っ暗で、メインの部分が狭くなってしまっている
[issue-notes/115.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/115.md)

...
ラベル: 
--- issue-notes/115.md の内容 ---

```markdown
# issue スペクトログラムについて、上半分のほぼ真っ暗な部分は表示しないよう、定数で指定したスレッショルドから上の周波数を、解析はするが表示対象外、とする #115
[issues #115](https://github.com/cat2151/voicevox-playground/issues/115)

# LLMにそのまま投げてみた
- 結果
  - 真っ暗な部分を明るくされてしまって、とても見づらくなった
- userのほしいもの
  - 真っ暗な部分は見えなくてよい

# ループ再生offにして、キーボード操作でspaceでcache playさせてみた
- 上半分が青くなった
- 混乱
- 後回しにする


```

## [Issue #113](../issue-notes/113.md): （保留中）生成した波形全体表示欄に、推定周波数をオレンジ色の折れ線グラフとして描画する
[issue-notes/113.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/113.md)

...
ラベル: 
--- issue-notes/113.md の内容 ---

```markdown
# issue 生成した波形全体表示欄に、推定周波数をオレンジ色の折れ線グラフとして描画する。推定周波数はリアルタイムFFTで表示していたものを全frameぶん保存しておく #113
[issues #113](https://github.com/cat2151/voicevox-playground/issues/113)

# 補足
- 推定周波数はリアルタイムFFTで表示していたものを全frameぶん保存しておく

# LLMに投げてみた
- 失敗。バグった
  - 再生のたびに消去されてリアルタイム描画されなおした
  - 複数回、ほしい挙動を指示しても、改善されなかった
  - ハルシネーションである、と断定する
- ほしい挙動
  - 最初の描画の前に全frameのFFTがでているはず
  - それを元に推定周波数を出すのは軽い計算量で出せるはず
  - それを初手で1回描画するだけ。リアルタイム描画は禁止
  - cache時も1回描画するだけ。リアルタイム描画は禁止
- どうする？
  - 保留
  - Codex 5.1以上か、Opus 4.6以上が使えるようになったときに試す

```

## ドキュメントで言及されているファイルの内容
### .github/actions-tmp/README.ja.md
```md
{% raw %}
# GitHub Actions 共通ワークフロー集

このリポジトリは、**複数プロジェクトで使い回せるGitHub Actions共通ワークフロー集**です

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
</p>

# 3行で説明
- 🚀 プロジェクトごとのGitHub Actions管理をもっと楽に
- 🔗 共通化されたワークフローで、どのプロジェクトからも呼ぶだけでOK
- ✅ メンテは一括、プロジェクト開発に集中できます

## Quick Links
| 項目 | リンク |
|------|--------|
| 📖 プロジェクト概要 | [generated-docs/project-overview.md](generated-docs/project-overview.md) |
| 📖 コールグラフ | [generated-docs/callgraph.html](https://cat2151.github.io/github-actions/generated-docs/callgraph.html) |
| 📊 開発状況 | [generated-docs/development-status.md](generated-docs/development-status.md) |

# notes
- まだ共通化の作業中です
- まだワークフロー内容を改善中です

※README.md は README.ja.md を元にGeminiの翻訳でGitHub Actionsで自動生成しています

{% endraw %}
```

### README.ja.md
```md
{% raw %}
# voicevox-playground

**VOICEVOX ローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://cat2151.github.io/voicevox-playground/"><img src="https://img.shields.io/badge/Demo-brightgreen" alt="Demo"></a>
  <a href="https://deepwiki.com/cat2151/voicevox-playground"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

## 機能

- ずんだもんの音声で任意のテキストを読み上げ
    - ほかのキャラの音声も選べます

## 対象プラットフォーム

- ブラウザとVOICEVOXが使える環境なら動きます

## サーバー

使うには、VOICEVOXのローカルサーバーを起動してください。

1. [VOICEVOX](https://voicevox.hiroshiba.jp/)をダウンロードしてインストール
2. VOICEVOXエンジンを起動（ポート50021でHTTPサーバーが起動します）。[GitHub Pages版](https://cat2151.github.io/voicevox-playground) からアクセスする場合は、CORSを許可した状態で以下のコマンドを使用してください。

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io
   ```

   開発するとき、ローカル開発サーバー（`npm run dev` が提供する `http://localhost:5173`）からも利用する場合は、上記に続けて `http://localhost:5173` も追加してください。

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io http://localhost:5173
   ```

## 使い方

1. VOICEVOXを起動（前述）
2. ブラウザで [アプリケーション](https://cat2151.github.io/voicevox-playground) を開く
3. テキストエリアに読み上げたいテキストを入力
4. 音声が再生されます
5. イントネーションを編集できます

## 仕組み
- webpageをGitHub Pagesにデプロイ
- webpageから
  - VOICEVOXローカルHTTPサーバー（ポート50021）にリクエストを送信し、レスポンスで音声データを取得
  - Tone.js v15を使用して音声再生

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 技術スタック

- TypeScript
- Vite
- Tone.js v15
- VOICEVOX API

## projectが目指すこと

- webpageからVOICEVOXが動かせる！誰でも自分だけのVOICEVOXクライアントアプリを楽にバイブコーディングできる！を実証すること
- （VOICEVOXサーバーが起動済みなら）「webpageを開いてクリックするだけですぐ音が鳴る」を実現すること

## projectが目指さないこと（スコープ外）

- 究極のVOICEVOXクライアントアプリ
- 自分以外の利用者の要望を受け付けて実現

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています

{% endraw %}
```

### .github/actions-tmp/issue-notes/13.md
```md
{% raw %}
# issue issue-note を他projectから使いやすくする #13
[issues #13](https://github.com/cat2151/github-actions/issues/13)

- docs
    - call導入手順を書く

{% endraw %}
```

### .github/actions-tmp/issue-notes/15.md
```md
{% raw %}
# issue project_summary scripts cjs を分解し、できるだけ1ファイル200行未満にし、agentによるメンテをしやすくする #15
[issues #15](https://github.com/cat2151/github-actions/issues/15)

# 状況
- agentに、最初の小さな一歩のAgent実行プロンプトを実行させた
- 結果、以下を得た：
    - project_summary_cjs_analysis.md
- どうする？
    - 次の一手をagentに生成させてみる（翌日の日次バッチで自動生成させる）
- 結果
    - 生成させたpromptをレビューした
    - promptを修正した
    - agentに投げた
    - 結果、GitUtils.cjsを切り出しできた
    - それをリファクタリングミスがないかチェックさせた
    - agentによるチェック結果は合格だった
- どうする？
    - 次の一手をagentに生成させてみる（翌日の日次バッチで自動生成させる）
- 結果
    - 生成させたpromptをレビューした
        - promptの対象ファイルから project_summary_cjs_analysis.md が漏れていることがわかったので修正した
    - promptを修正した
    - agentに投げた
    - 結果、FileSystemUtils.cjsを切り出しできた
    - それをリファクタリングミスがないかチェックさせた
    - agentによるチェック結果は合格だった
- どうする？
    - 次の一手をagentに生成させてみる（翌日の日次バッチで自動生成させる）
- 結果
    - 生成させたpromptをレビューした
    - 今回は低品質、NG、と判断した
    - 判断基準は、project_summary_cjs_analysis.md と乖離してしまっている点。今回はハルシネーションを含んだplanである、と判断した
    - 人力でpromptを書き、planさせ、plan結果をレビューし、agentに投げた
    - 結果、CodeAnalyzer.cjsとProjectAnalyzer.cjsを切り出しできた
- どうする？
    - 次の一手をagentに生成させてみる（翌日の日次バッチで自動生成させる）
    - 備考、課題、Geminiに生成させているdocumentは2つある。かなり位置づけが違うものである。
        - projectのソースファイル分析。
        - projectのissues分析。
        - この2つについて、class, cjs, yml まで分割をするかを、あとで検討する。
        - おそらく、class分割どまりとし、ソースファイル分析結果をissues分析の参考資料としてGeminiのcontextに与える改善をする、がよい、と想定しておく。
- 課題、エラーで落ちた。昨日は落ちてない。
    - 原因、昨日のagentのリファクタリング時に、ハルシネーションで、
        - codeが破壊されていた
        - run メソッドが削除されていた
        - 一つ前のrevisionにはrun メソッドがあった
        - ほかにもcode破壊があったのかは不明、調査省略、明日の日次バッチをtestと調査として利用するつもり
- どうする？
    - 単純に一つ前のrevisionからrun メソッドを復活させ、明日の日次バッチをtestと調査として利用する
- 再発防止策は？
    - ノーアイデア。昨日それなりにagentにチェックをさせたはずだが根本的な大きなミスが発生していた。
    - 構文チェックは通っていたが、問題を検知できなかった。
    - チェックが機能していない、あるいは機能として不足している。
    - 分析。変更量が大きかったぶんミスのリスクが増えていた。
    - 対策案。もっと小さく一歩ずつ変更させる。
    - 対策案。リファクタリング時、いきなりメソッド削除をさせない。
        - まず全cjsの全メソッドのlistをさせる。
        - のち、削除対象の重複メソッドのlistをさせる。
        - そして削除planをさせる。
        - のち、削除させる。
        - さらに削除後のメソッドlistをさせる。
        - そして削除しすぎていないかを削除前後のlist比較でチェックさせる。
        - これでrunまで削除してしまうのを防止できるかもしれない。
        - これは人力からみると、おかしな話である。人力なら1つずつ移動をするだけであり、ミスのしようがない。
        - LLMの典型的なハルシネーション問題の一つである、と認識する
- 結果は？
    - test green
    - run メソッドの人力復活は成功した
    - 日次バッチで生成した次の一手のpromptを投げた
    - リファクタリング成功した。ProjectSummaryGenerator を切り出した
- どうする？
    - 次の一手をagentに生成させてみる（agentに投げるpromptを、翌日の日次バッチで自動生成させる）
- 結果
    - 先に、2つのdocument生成を、1つずつ生成できるよう疎結合にリファクタリング、をしたほうがよさそう
    - agentにそれを投げた
    - 成功した、と判断する
    - 課題、`BaseSummaryGenerator.cjs` は、baseの機能と、`ProjectOverviewGenerator.cjs`専用の機能とが混ざっている。
        - baseに集約すべきは、`ProjectSummaryCoordinator.cjs`と`ProjectOverviewGenerator.cjs`とが必ずどちらも使う機能、である、と考える。
        - 対策、明日以降それをagentに投げる
    - `project_summary_cjs_analysis.md` は削除とする。役目が完了した、と判断する。リファクタリング前のソース構造の分析documentであり、今は存在しているとわかりづらくなる。シンプル優先のため削除とする。
- どうする？
    - 次の一手をagentに生成させてみる（agentに投げるpromptを、翌日の日次バッチで自動生成させる）
- 結果
    - test green
    - `BaseSummaryGenerator.cjs` を切り出したのは成功した、と判断する
    - `BaseSummaryGenerator.cjs` を2分割するため、agentにplanさせた
    - レビューした
    - agentに2分割させた
    - レビューした。OKと判断する
- どうする？
    - 次の一手をagentに生成させてみる（agentに投げるpromptを、翌日の日次バッチで自動生成させる）
- 結果
    - test green
    - `BaseSummaryGenerator.cjs` を2分割は成功した、と判断する
    - issue track機能構造をリファクタリングし、以下にする
        - development status generator : baseを継承する
        - issue tracker : 汎用関数群
    - agentに実施させた
    - レビューした。OKと判断する
- どうする？
    - 次の一手をagentに生成させてみる（agentに投げるpromptを、翌日の日次バッチで自動生成させる）
- 結果
    - test green
    - DevelopmentStatusGeneratorとissue trackerのリファクタリングは成功した、と判断する
    - ProjectOverview生成機能のリファクタリングをする
    - agentに実施させた
    - レビューした。OKと判断する
- どうする？
    - 次の一手をagentに生成させてみる（agentに投げるpromptを、翌日の日次バッチで自動生成させる）
- 結果
    - test green
    - ProjectOverview生成機能のリファクタリングは成功した、と判断する
    - 課題、overviewと、developmentStatusとが混在し、dirが読みづらい。
    - 対策、shared/、overview/、development/、の3つのdirに切り分ける
    - agentに分析、planさせ、レビューし、planさせ、実施させた
    - レビューした。OKと判断する
- どうする？
    - 次の一手をagentに生成させてみる（agentに投げるpromptを、翌日の日次バッチで自動生成させる）
- 結果
    - test green
    - shared/、overview/、development/、の3つのdirに切り分けるリファクタリングは成功した、と判断する
    - agentに、agentがメンテしやすいか？の観点からレビューさせた
    - 詳細は割愛
        - `> 最優先で取り組むべきは 設定管理の一元化 と エラーハンドリングの統一 です。これにより、Agentにとって予測可能で理解しやすいコードベースになります。`
        - それは別issueで、設定変更をマストでやるので、OKと判断する
- これでagentによるメンテは十分しやすくなった、と判断する
- closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/16.md
```md
{% raw %}
# issue issue-note / project-summary / translate / callgraph をtonejs-mml-to-jsonから呼び出す #16
[issues #16](https://github.com/cat2151/github-actions/issues/16)

# これまでの課題
- issue-note / project-summary / translate / callgraph は、github-actions リポジトリ上ではtest greenである。
- だが他のリポジトリにおいて動作するか？が可視化不足である。

# 対策
- issue-note / project-summary / translate / callgraph をtonejs-mml-to-jsonから呼び出す
- 詳しく
    - まず、現状、tonejs-mml-to-json でその4つのworkflowがどうなっているか、このmdに可視化する
    - 例えば、既に呼び出している、呼び出していない、tonejs-mml-to-jsonにある古いworkflowを呼び出している

# 調査結果
- まず、現状、tonejs-mml-to-json でその4つのworkflowがどうなっているか、このmdに可視化する
    - 結果：
        - issue-note
            - tonejs-mml-to-jsonにある古いworkflowを呼び出している
        - project-summary
            - tonejs-mml-to-jsonにある古いworkflowを呼び出している
        - translate
            - tonejs-mml-to-jsonにある古いworkflowを呼び出している
        - callgraph
            - tonejs-mml-to-jsonにある古いworkflowを呼び出している

# どうする？
- issue-note
    - github-actions リポジトリにある、call-issue-note.yml をcpして使うようにする、まず単純cpして動くかを確認する
- project-summary
    - github-actions リポジトリにある、call-daily-project-summary.yml をcpして使うようにする、まず単純cpして動くかを確認する
- translate
    - github-actions リポジトリにある、call-translate-readme.yml をcpして使うようにする、まず単純cpして動くかを確認する
- callgraph
    - github-actions リポジトリにある、call-callgraph.yml をcpして使うようにする、まず単純cpして動くかを確認する

# 状況
- issue-note
    - tonejs-mml-to-jsonリポジトリにて、test green
    - issue-noteについては当issueのタスクは完了した、と判断する
- project-summary
    - tonejs-mml-to-jsonリポジトリにて、test green
    - project-summaryについては当issueのタスクは完了した、と判断する

# 状況
- translate
    - github-actions リポジトリにある、call-translate-readme.yml をcpして使うようにする、まず単純cpして動くかを確認する
        - 状況
            - 単純cpした
            - ソース机上レビューした。OK
            - トリガーはREADME.ja.mdのcommit
            - testは省略とする
            - もし今後README.ja.mdのcommit時にうまく動作しないとしても、そのとき対処すればOK、と判断する
    - translateについては当issueのタスクは完了した、と判断する

# どうする？
- callgraph
    - github-actions リポジトリにある、call-callgraph.yml をcpして使うようにする、まず単純cpして動くかを確認する

# 結果
- callgraph
    - tonejs-mml-to-jsonリポジトリにて、test red
    - logをみても情報不足なため、まずloggerを修正する
    - 結果、わかった、運用ミス、対象srcの指定の考慮漏れ
    - どうする？
        - 対象srcを指定する。tonejs-mml-to-jsonリポジトリにて進める
    - 結果
        - test green
    - callgraphについては当issueのタスクは完了した、と判断する

# 状況
- github-actions以外のリポジトリとして、
    - tonejs-mml-to-jsonリポジトリにおいて、
        - issue-note / project-summary / translate / callgraph がtest greenとなった。
        - closeできる、と判断する。

# closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/17.md
```md
{% raw %}
# issue development-status が生成したmdに誤りがある。issue-note へのlinkがURL誤りで、404となってしまう #17
[issues #17](https://github.com/cat2151/github-actions/issues/17)

# 事例
- 生成したmdのURL：
    - https://github.com/cat2151/github-actions/blob/main/generated-docs/development-status.md
- そのmdをGitHub上でdecodeして閲覧したときのURL、404である：
    - https://github.com/cat2151/github-actions/blob/main/generated-docs/issue-notes/16.md
- そのmdに実際に含まれるURL：
    - issue-notes/16.md
- あるべきURL：
    - https://github.com/cat2151/github-actions/blob/main/issue-notes/16.md
- あるべきURLがmdにどう含まれているべきか：
    - ../issue-notes/16.md

# どうする？
- 案
    - promptを修正する
    - promptの場所は：
        - .github_automation/project_summary/scripts/development/DevelopmentStatusGenerator.cjs
    - 備考、cjs内にpromptがハードコーディングされており、promptをメンテしづらいので別途対処する : [issues #18](https://github.com/cat2151/github-actions/issues/18)

# 結果
- agentにpromptを投げた
    - ※promptは、development-statusで生成したもの
- レビューした
    - agentがフルパスで実装した、ことがわかった
- userが分析し、 ../ のほうが適切と判断した
    - ※「事例」コーナーを、あわせて修正した
- そのように指示してagentに修正させた
- testする

# 結果
- test green
- closeする

{% endraw %}
```

### .github/actions-tmp/issue-notes/18.md
```md
{% raw %}
# issue DevelopmentStatusGenerator.cjs 内に、Geminiに与えるpromptがハードコーディングされてしまっている #18
[issues #18](https://github.com/cat2151/github-actions/issues/18)

# 何が困るの？
- project把握しづらい。どこにpromptが書いてあるのか、把握しづらい。
- prompts/ にほかのpromptがあるため、方針がブレていると、読みづらい。
- 備忘、いくらテンプレートリテラルとプレースホルダーで密結合しているからとはいえ、ハードコーディングはNG。
    - それらはreplaceを使う等で楽に切り出しできるので。

# 問題のcjsの場所は？
- ファイルパス : .github_automation/project_summary/scripts/development/DevelopmentStatusGenerator.cjs
- 関数 : generateDevelopmentStatus

# 結果
- Geminiに生成させたpromptを、agentに投げて、リファクタリングさせてみた
- ハルシネーションした。使い物にならなかった
- 人力でやる

# 結果
- test green

# closeとする


{% endraw %}
```

### .github/actions-tmp/issue-notes/19.md
```md
{% raw %}
# issue project-summary の development-status 生成時、issue-notes/ 配下のmdファイルの内容を参照させる #19
[issues #19](https://github.com/cat2151/github-actions/issues/19)

# 何が困るの？
- issue解決に向けての次の一手の内容が実態に即していないことが多い。

# 対策案
- issue-notes/ 配下のmdファイルの内容を参照させる

# 備考
- さらにmd内に書かれているfileも、project内をcjsに検索させて添付させると、よりGeminiの生成品質が向上する可能性がある。
    - [issues #20](https://github.com/cat2151/github-actions/issues/20)
- さらにproject overviewでGeminiがまとめたmdも、Geminiに与えると、よりGeminiの生成品質が向上する可能性がある。
    - [issues #21](https://github.com/cat2151/github-actions/issues/21)
- さらに、Geminiに与えたpromptをfileにしてcommit pushしておくと、デバッグに役立つ可能性がある。
    - [issues #22](https://github.com/cat2151/github-actions/issues/22)

# close条件
- issues #22 がcloseされること。
- commitされたpromptを確認し、issue-notes/ 配下のmdファイルがpromptに添付されていること、が確認できること。

# 状況
- 課題、実装したがtestができていない
- 対策、issues #22 が実装されれば、testができる
- 対策、issues #22 のcloseを待つ

# 状況
- issues #22 がcloseされた
- testできるようになった
- commitされたpromptを確認した。issue-notes/ 配下のmdファイルがpromptに添付されていること、が確認できた

# closeする

{% endraw %}
```

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

### .github/actions-tmp/issue-notes/20.md
```md
{% raw %}
# issue project-summary の development-status 生成時、issue-notes/ 配下のmdにファイル名が書いてあれば、そのファイル内容もpromptに添付、を試す #20
[issues #20](https://github.com/cat2151/github-actions/issues/20)

# 何が困るの？
- Geminiに次の一手を生成させるとき、cjsの内容も添付したほうが、生成品質が改善できる可能性がある。

# 案
## outputのimage
- promptが言及するfilename、について、そのfileの内容もすべてpromptに含める。
    - 軸は、projectのfilename一覧である。
        - 一覧それぞれのfilenameについて、promptで言及されているものをfile内容埋め込み、とする。
- 方向性
    - シンプルで明確なルール、曖昧さのないルールで、メンテを楽にすることを優先する
    - 余分なファイルが出てしまうが割り切ってOKとし、欠落リスクを減らせることを優先する
- 備考
    - 曖昧でメンテが必要な「documentからのfilename抽出」をやめ、
        - かわりに、逆に、「今のprojectにあるfileすべてのうち、promptで言及されているもの」を軸とする
## 実現方法の案
- project全体について、filenameと、filepath配列（複数ありうる）、のmapを取得する。そういう関数Aをまず実装する。
    - filepathは、agentが扱えるよう、github上のworkの絶対pathではなく、projectRootからの相対パス表記とする。
- そして、そのfilenameにmatchするfilepath配列について、filepathとファイル内容を記したmarkdown文字列を返却、という関数Bを実装する。
- さらに、Geminiにわたすpromptについて、前述の関数Aのfilenameそれぞれについて、prompt内を検索し、filenameが存在する場合は、そのfilenameについて、関数Bを用いてmarkdown文字列を取得する。そうして得られたmarkdown文字列群を返却する、という関数Cを実装する。
- さらに、promptの末尾に書いてあるプレースホルダー「`${file_contents}`」を、関数Cの結果で置き換える、という関数Dを実装する。
- 実際には、Geminiにわたすpromptのプレースホルダー展開は、2回にわたる必要がある。1回目でissues-note内容をpromptに埋め込む。2回目でそのpromptに対して関数Dを適用する。
## 備忘
- 上記は、agentにplanさせてレビューし、context不足と感じたら上記をメンテ、というサイクルで書いた。

# どうする？
- 上記をagentに投げる。documentやtestについてのplanもしてくるかもしれないがそこは時間の都合で省略して実施させるつもり。
- 投げた、実装させた、レビューして人力リファクタリングした
- testする

# 結果
- バグ
    - この20.mdにあるプレースホルダーが置換されてしまっている
    - issue-notesで言及されていないfileまで添付されてしまっている
- 分析
    - この20.mdにあるプレースホルダーが置換されてしまっている
        - 原因
            - 20.mdにあるプレースホルダーまで置換対象としてしまっていたため。
            - prompt全体のプレースホルダーを置換対象としてしまっていたため。
            - issue-notesを埋め込んだあとでの、プレースホルダー処理だったので、
                - 20.md が置換対象となってしまったため。
        - 対策案
            - プレースホルダーはすべて、「行頭と行末で囲まれている」ときだけ置換対象とする。
                - つまり文中やcode中のプレースホルダーは置換対象外とする。
            - さらに、2つ以上プレースホルダーが出たら想定外なので早期エラー終了させ、検知させる。
    - issue-notesで言及されていないfileまで添付されてしまっている
        - 原因
            - promptに、既にprojectの全file listが書き込まれたあとなので、
                - issue-noteで言及されていなくても、
                - promptの全file listを対象に検索してしまっている
        - 対策案の候補
            - プレースホルダー置換の順番を変更し、全file listは最後に置換する
            - file添付の対象を変更し、promptでなく、issue-notesとする
                - これが範囲が絞られているので安全である、と考える
        - 備忘
            - 全fileの対象は、リモートリポジトリ側のfileなので、secretsの心配はないし、実際に検索して確認済み

# どうする？
- agent半分、人力が半分（agentがハルシネーションでソース破壊したので、関数切り分けしたり、リファクタリングしたり）。
- で実装した。
- testする

# 結果
- test green

# closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/21.md
```md
{% raw %}
# issue project-summary の development-status 生成時、project-overviewが生成済みのproject-overview.mdもpromptに添付、を試す #21
[issues #21](https://github.com/cat2151/github-actions/issues/21)

# 何が困るの？
- project-overview.mdがpromptに添付されていたほうが、Geminiの生成品質が改善できる可能性がある。
    - メリットは、ファイル一覧、関数一覧、をGeminiにわたせること

# 検討事項
- 課題、その一覧に付記されている「ファイルや関数の要約」は、Geminiが「ファイル名や関数名を元に生成しただけ」で、「ファイル内容や関数内容を参照せずに生成した」可能性が高い
    - 対策、project-overview.mdに依存しない。
        - 方法、新規関数をagentに実装させる
            - 新規関数で、ファイル一覧と関数一覧を生成する
        - 根拠、そのほうが、シンプルに目的を達成できる可能性が高そう。
        - 根拠、project-overview.mdだと、不具合として.github 配下のymlがlistに含まれておらず、ymlに関するissue、に関する生成、をするとき不具合の可能性がありそう。そういった、別機能の不具合に影響されがち。
- 課題、早期に実施したほうが毎日好影響が出る可能性がある
    - 対策、上記検討事項の対処は後回しにして、先に実装してみる
    - agentに投げる
- 課題、ProjectSummaryCoordinator をみたところ、並列処理されている
    - なので、project-overview.mdを参照したいときに、まだ生成されていない、という可能性が高い
    - 対策、前述の、新規関数で、ファイル一覧と関数一覧を生成させる

# agentに投げるための整理
- 編集対象ファイル
    - prompt
        - .github_automation/project_summary/prompts/development-status-prompt.md
        - 編集内容
            - projectのファイル一覧を埋め込む用の、プレースホルダーを追加する
    - source
        - .github_automation/project_summary/scripts/development/DevelopmentStatusGenerator.cjs
        - 編集内容
            - projectのファイル一覧を生成する関数、を実装し、
            - それを前述のプレースホルダーに埋め込む

# agentに投げて実装させた

# test結果
- 以下が不要
    - .git/
    - node_modules/

# どうする？
- agentに上記を変更させた
- testする

# 結果
- test greenとなった

# まとめ
- issueのtitleからは仕様変更した。
    - projectのfile一覧をpromptに含める、とした。
    - そのほうがpromptとして、よい生成結果が期待できる、と判断した。
- test greenとなった

# closeとする

{% endraw %}
```

### .github/actions-tmp/issue-notes/22.md
```md
{% raw %}
# issue project-summary の development-status 生成時、Geminiに与えたprompt、もcommit push、を試す #22
[issues #22](https://github.com/cat2151/github-actions/issues/22)

# 何が困るの？
- 生成された development-status.md の妥当性がわかりづらいし、バグった場合の原因調査がしづらい

# 対策案
- Geminiに与えたpromptをfileにしてcommit pushしておくと、デバッグに役立つ可能性がある。

# 方法案
- Geminiに与えるprompt を生成時、それをfileにsaveし、commit push対象にする。
- ひとまずgenerated-docs/ に保存する。落ち着いたら移動先を検討する。
    - generated-docs/ 配下のまま、も有力な候補である。
        - なぜなら、cjsによってgenerateされたdocなので。

# 日次バッチでpromptを生成させ、agentに投げた
- レビューした
- 修正させた

# 結果
- エラー。pathのミス。呼び出し元側に保存したいのに、共通ワークフロー側に保存となってしまった。
- 対策、ymlで引数を指定するようにした。
- testする。

# 結果
- test green。呼び出し元側にcommitされていることを確認した。
- 20Kbytesである
    - Geminiにわたすサイズとしても許容範囲内と判断する
        - token数から概算して100Kbytes～1Mbytes程度を想定

# closeとする

{% endraw %}
```

### issue-notes/22.md
```md
{% raw %}
# issue スペクトログラムの左に表示されるHz文字列が重なりすぎて見えないので、表示時にy座標と文字列の縦幅を参照し、間引いて表示する #22
[issues #22](https://github.com/cat2151/voicevox-playground/issues/22)

- 合わせて、レイアウト改善。
    - 「音声を再生中」欄が、loop再生ごとに欄そのものがトルツメされたり増えたりして、以降のエリアが激しく上下して見づらいので、そこはトルツメでなく空を表示とする



{% endraw %}
```

### .github/actions-tmp/issue-notes/23.md
```md
{% raw %}
# issue issue 17が再発してしまっている #23
[issues #23](https://github.com/cat2151/github-actions/issues/23)

# 症状は？
- issue 17と同じ

# どうする？
- development-status-generated-prompt.md を確認する
- 結果
    - >Issue番号を記載する際は、必ず [Issue #番号](issue-notes/番号.md) の形式でMarkdownリンクとして記載してください。
    - 仮説、これが残っており、ほかの ../ 指定と競合し、どちらかがランダムで選ばれていた
    - 対策、ここを ../ 指定にする

# 結果
- test green

# closeとする

{% endraw %}
```

### issue-notes/23.md
```md
{% raw %}
# issue リアルタイム波形表示欄は、別途表示しているFFT推定周波数の4周期ぶんを表示するよう、自動で横幅の拡大縮小する #23
[issues #23](https://github.com/cat2151/voicevox-playground/issues/23)

- あわせて表示位相をframe間で揃えて表示する
- 位相の見た目が揃っていればよい
- 直近のcat2151のいくつかのリポジトリを参考にして、「前frameで表示した4周期」を保存し、それと現frameを指定offsetから4周期切り取ったセグメントと相関をとり（offsetは指定sample数でスライド、後述）、最も類似度の高いセグメントoffsetを得て、そのセグメントを表示する
- セグメント探索（相関）の計算コストが高いため、
    - 相関の探索範囲は4周期にしぼること
    - 相関の探索ループごとのsampleスライド数がムダに大きくならないようにすること
    - 表示pixel数から換算して、1pixelが何sampleかを得て、そのsample数を、スライド量とすること。そうすれば見た目に影響しない範囲で、探索ループ数を削減できる考え

{% endraw %}
```

### .github/actions-tmp/issue-notes/3.md
```md
{% raw %}
# issue GitHub Actions「issue note生成」を共通ワークフロー化する #3
[issues #3](https://github.com/cat2151/github-actions/issues/3)

- 前提
  - userは、translateのworkflowを共通ワークフロー化し、動くようにしたので、共通ワークフロー化の知識がある
  - よって、今回は、promptでplanさせ、そのplanをuserがレビューし、planの改善を指示できるので、ハルシネーションのリスクを下げることができる

- prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
このymlはまだ共通ワークフロー化されず、
呼び出し元からコピーされたままの状態です。
このymlファイル名のまま、
中身を共通ワークフロー化してください。
呼び出し元ymlは別途書きますので気にしないでください。
まずplanしてください
```

- plan 生成結果
```
共通ワークフロー化のためのplanは以下の通りです。

1. 目的
現在の issue-note.yml を「共通ワークフロー」として再設計し、他リポジトリや他ワークフローから workflow_call で呼び出せるようにする。
2. 主な変更点
on: トリガーを workflow_call に変更（直接イベントで起動しない）。
必要な入力（inputs）やシークレット（secrets）を workflow_call セクションで定義。
github.event.issue などのイベント依存部分を、inputs経由で受け取る形に修正。
既存の処理（issueノート生成、コミット、issue body更新）はそのまま活かすが、パラメータ化する。
3. 具体的な修正内容
on: issues: → on: workflow_call: に変更。
inputs で必要な値（例: issue_title, issue_number, issue_body, issue_url など）を受け取る。
スクリプト内の ${{ github.event.issue.xxx }} を ${{ inputs.xxx }} に置換。
github-script ステップも同様にinputsを参照。
必要に応じて secrets も workflow_call で受け取れるようにする。
4. ファイル名・配置
ファイル名はそのまま issue-note.yml。
配置場所は workflows でOK（共通ワークフローとしてもこの場所で良い）。
5. 呼び出し元への影響
呼び出し元ワークフローで uses: <repo>/.github/workflows/issue-note.yml@main のように参照し、inputsを渡す形になる。
このplanで進めます。次に、実際の共通ワークフロー化のためのyml修正案を作成しますか？
```

- userがplanレビューし、OKを出した
- agentに生成結果ymlをレビューさせた、OKとなった
  - userはこのレビューは認知負荷が高いのでskipとする（単純な細かい間違い探し作業になるので、それはagentに任せた）
-  エラー。呼び出し元ymlのエラーがあり修正。共通ワークフローのエラー指摘があり、共通ワークフロー側の修正が必要となった
```
原因の分析：

呼び出し元（tonejs-mml-to-jsonのissue-note.yml）は、reusable workflow（cat2151/github-actions/.github/workflows/issue-note.yml@main）をusesで呼び出し、inputsをwithで渡しています。
共通ワークフロー（reusable workflow）は inputs を workflow_call で受け取り、各ステップで ${{ inputs.xxx }} で参照しています。
しかし、エラーが発生したのは actions/github-script@v7 の script 内です。
エラーの本質的な原因：

actions/github-script の script: で ${{ inputs.issue_number }} のような式を直接 JavaScript テンプレートリテラル内で使っていますが、これはサポートされていません。
script: の中は JavaScript であり、YAMLの ${{ ... }} は展開されません（または意図通りに展開されません）。
そのため、inputs 変数は script 内の JavaScript で未定義となり、ReferenceError になります。
正しい書き方：

actions/github-script の script: でワークフローの inputs を使いたい場合は、with: で input を environment 変数や script の引数として渡し、JavaScript で process.env から取得するか、github-script の input 機能を使う必要があります。
例（修正版）：

このように、inputs の値を env で渡し、script 内では process.env で参照してください。

まとめ：

actions/github-script の script 内で ${{ inputs.xxx }} を直接使うと ReferenceError になる
env: で値を渡し、process.env で参照するのが正しい
修正が必要です。修正版のワークフローが必要な場合はお知らせください。
```

- test green
- closeとする

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

### .github/actions-tmp/issue-notes/9.md
```md
{% raw %}
# issue 関数コールグラフhtmlビジュアライズが0件なので、原因を可視化する #9
[issues #9](https://github.com/cat2151/github-actions/issues/9)

# agentに修正させたり、人力で修正したりした
- agentがハルシネーションし、いろいろ根の深いバグにつながる、エラー隠蔽などを仕込んでいたため、検知が遅れた
- 詳しくはcommit logを参照のこと
- WSL + actの環境を少し変更、act起動時のコマンドライン引数を変更し、generated-docsをmountする（ほかはデフォルト挙動であるcpだけにする）ことで、デバッグ情報をコンテナ外に出力できるようにし、デバッグを効率化した

# test green

# closeとする

{% endraw %}
```

### issue-notes/113.md
```md
{% raw %}
# issue 生成した波形全体表示欄に、推定周波数をオレンジ色の折れ線グラフとして描画する。推定周波数はリアルタイムFFTで表示していたものを全frameぶん保存しておく #113
[issues #113](https://github.com/cat2151/voicevox-playground/issues/113)

# 補足
- 推定周波数はリアルタイムFFTで表示していたものを全frameぶん保存しておく

# LLMに投げてみた
- 失敗。バグった
  - 再生のたびに消去されてリアルタイム描画されなおした
  - 複数回、ほしい挙動を指示しても、改善されなかった
  - ハルシネーションである、と断定する
- ほしい挙動
  - 最初の描画の前に全frameのFFTがでているはず
  - それを元に推定周波数を出すのは軽い計算量で出せるはず
  - それを初手で1回描画するだけ。リアルタイム描画は禁止
  - cache時も1回描画するだけ。リアルタイム描画は禁止
- どうする？
  - 保留
  - Codex 5.1以上か、Opus 4.6以上が使えるようになったときに試す

{% endraw %}
```

### issue-notes/115.md
```md
{% raw %}
# issue スペクトログラムについて、上半分のほぼ真っ暗な部分は表示しないよう、定数で指定したスレッショルドから上の周波数を、解析はするが表示対象外、とする #115
[issues #115](https://github.com/cat2151/voicevox-playground/issues/115)

# LLMにそのまま投げてみた
- 結果
  - 真っ暗な部分を明るくされてしまって、とても見づらくなった
- userのほしいもの
  - 真っ暗な部分は見えなくてよい

# ループ再生offにして、キーボード操作でspaceでcache playさせてみた
- 上半分が青くなった
- 混乱
- 後回しにする


{% endraw %}
```

### issue-notes/116.md
```md
{% raw %}
# issue demoの利用方法欄に、ローカルPCにVOICEVOXをinstallしてください、を書く #116
[issues #116](https://github.com/cat2151/voicevox-playground/issues/116)

- 書く内容については、README.ja.mdを参考にすること

{% endraw %}
```

### issue-notes/117.md
```md
{% raw %}
# issue イントネーション編集後や、イントネーション付きお気に入りを再生したあと、playボタンを押すと、警告なしにイントネーションが初期化されてしまう #117
[issues #117](https://github.com/cat2151/voicevox-playground/issues/117)

- userがほしいのは、その状況であれば、イントネーションを維持したまま再生、である


{% endraw %}
```

### issue-notes/118.md
```md
{% raw %}
# issue VOICEVOX Nemo も再生できるようにする #118
[issues #118](https://github.com/cat2151/voicevox-playground/issues/118)

- VOICEVOX Nemo-engine ローカルサーバー port 50121 からもspeakers取得を試みて、
    - 取得できたなら、それもキャラ&styleプルダウンに含める

- user向け備忘
    - nemo
        - 仕組み
            - local nemo engineは、voicevox engineと別サーバである。デフォ port 50121 で動作する
        - もし今すぐnemoだけでいいので鳴らしたいなら
            - dir
                - 当該nemoのdirは、voicevoxアプリの設定のengine管理を見るとわかる
            - run
                - nemoもvoicevox-engine同様、runがあるので、それを`--port 50021`にすれば鳴らせる

{% endraw %}
```

### issue-notes/119.md
```md
{% raw %}
# issue キャラ&styleプルダウンを選んだら、自動再生する #119
[issues #119](https://github.com/cat2151/voicevox-playground/issues/119)

# 自動再生を追加する対象
- キャラ&styleプルダウン
- styleプルダウン
- ランダムstyleチェックボックス

# あわせて、以下も行う
- お気に入り再生をクリックしたとき、もしloop再生中だったなら、loop再生をやめ、stopして、お気に入り再生を鳴らす
  - 今は、loop再生中だと、お気に入り再生をクリックしても何も起きないのでuserが混乱する

{% endraw %}
```

### issue-notes/120.md
```md
{% raw %}
# issue キーボード操作モードonのとき、textarea編集時に意図しないa-zやplayができてしまい混乱する #120
[issues #120](https://github.com/cat2151/voicevox-playground/issues/120)

- 対策
    - textarea編集時は、キーボード操作モードonであっても、キーボード操作onモード特有のキー（a-zやspaceとenter）を素通りさせる
    - かわりに、キーボード操作モードon/offに関わらず、どの状況であっても、SHIFT+ENTERとCTRL+ENTERを、playキーとする

{% endraw %}
```

### issue-notes/121.md
```md
{% raw %}
# issue イントネーション付きお気に入りのexportとimportをできるようにする #121
[issues #121](https://github.com/cat2151/voicevox-playground/issues/121)

- 「イントネーション付きお気に入り」の見出しの右に、exportボタンとimportボタンをつける
- exportもimportも、「イントネーション付きお気に入り」のlocal storageに保存される内容そのもの（複数まるごと）、とする
- ひとまず複数まるごとでUX検証とする

{% endraw %}
```

### issue-notes/122.md
```md
{% raw %}
# issue 「エラーが発生しました: Failed to fetch」が、知らない人にはわかりづらい #122
[issues #122](https://github.com/cat2151/voicevox-playground/issues/122)

- 案
    - その前にstyleの取得に失敗し「未取得」となった時点で、
    - 「ローカルVOICEVOXサーバーを起動してください」をダイアログ表示する
    - 一方で、styleの取得に成功したら、既存のstatus表示欄に、「ローカルサーバーとの通信成功。音声合成の準備ができました」を表示する

{% endraw %}
```

### issue-notes/123.md
```md
{% raw %}
# issue イントネーション編集で、モーラのポイント表示と、モーラ名称表示を結ぶ、縦線を表示する #123
[issues #123](https://github.com/cat2151/voicevox-playground/issues/123)

- あわせて、マウスポインタが「編集可能なモーラ領域上にhoverしている場合」、
  - それに紐付くモーラ名を一時的に明るく目立たせる
  - ※マウスポインタが今どのモーラに紐ついているか？の判定関数を共用する想定

{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
21278fd Update issue notes for issue #123
91c03d7 Add issue note for #123 [auto]
c85d15a Update project summaries (overview & development status) [auto]
2178044 Update issue notes for error handling suggestions
033055b Add issue note for #122 [auto]
a927642 Add export and import buttons for favorites
73fb38f Add issue note for #121 [auto]
6116c0f Clarify keyboard operation mode behavior in issue #120
0856767 Add issue note for #120 [auto]
ded1343 Update issue notes for auto-play feature #119

### 変更されたファイル:
generated-docs/development-status-generated-prompt.md
generated-docs/development-status.md
generated-docs/project-overview-generated-prompt.md
generated-docs/project-overview.md
issue-notes/121.md
issue-notes/122.md
issue-notes/123.md


---
Generated at: 2026-02-20 07:04:37 JST
