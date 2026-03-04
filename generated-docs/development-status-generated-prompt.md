Last updated: 2026-03-05

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
- .github/actions-tmp/.github/workflows/call-check-large-files.yml
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
- .github/actions-tmp/.github_automation/check-large-files/check-large-files.toml.default
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
- .github/actions-tmp/issue-notes/44.md
- .github/actions-tmp/issue-notes/52.md
- .github/actions-tmp/issue-notes/7.md
- .github/actions-tmp/issue-notes/8.md
- .github/actions-tmp/issue-notes/9.md
- .github/actions-tmp/package-lock.json
- .github/actions-tmp/package.json
- .github/actions-tmp/src/main.js
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
- issue-notes/138.md
- issue-notes/140.md
- issue-notes/141.md
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
- package-lock.json
- package.json
- src/audio.ts
- src/config.ts
- src/intonation.test.ts
- src/intonation.ts
- src/intonationDisplay.ts
- src/intonationHandlers.ts
- src/intonationPlayback.ts
- src/intonationState.ts
- src/intonationUtils.ts
- src/main.ts
- src/playback.test.ts
- src/playback.ts
- src/settings.test.ts
- src/settings.ts
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
- src/visualization/spectrogramCache.ts
- src/visualization/timeAxis.ts
- src/visualization/waveform.ts
- src/visualization.test.ts
- src/visualization.ts
- src/vite-env.d.ts
- tsconfig.json
- vite.config.ts

## 現在のオープンIssues
## [Issue #141](../issue-notes/141.md): ソースコード構成を改善し、ドメイン単位でフォルダ化する。経緯はissue 140も参照のこと
[issue-notes/141.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/141.md)

...
ラベル: 
--- issue-notes/141.md の内容 ---

```markdown
# issue ソースコード構成を改善し、ドメイン単位でフォルダ化する。経緯はissue 140も参照のこと #141
[issues #141](https://github.com/cat2151/voicevox-playground/issues/141)



```

## [Issue #140](../issue-notes/140.md): デフォルトでplayボタンを押すと、つまりループ再生すると、再生ごとにムダな待ち時間がある
[issue-notes/140.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/140.md)

...
ラベル: 
--- issue-notes/140.md の内容 ---

```markdown
# issue デフォルトでplayボタンを押すと、つまりループ再生すると、再生ごとにムダな待ち時間がある #140
[issues #140](https://github.com/cat2151/voicevox-playground/issues/140)

- 事象
    - ループ再生onのとき、playボタンを押すと、
    - 「イントネーションを適用中…」という文言だけが表示されて、
    - おそらく「デフォルトのイントネーションのままなのに」「ムダにイントネーション適用処理がされて」しまっている
- 対策
    - userがほしい挙動は、この条件であれば、「textarea、style、イントネーション情報、すべてが、前回のwav再生時と同じであれば、あらゆる音声合成処理は不要で、cacheされているwavデータを再生すべし」「cacheから再生します、のような既存のメッセージが表示されるべき」
- 背後にあると予想される問題
    - 仕様変更で既存機能が破壊されている、リグレッションが発生している
    - これは、agentがアプリの全体像を掴みそこねている、というアラートである、と判断する
    - ソースコードの構成を、agentのハルシネーションのリスクを下げるよう、リファクタリングを検討すべし
    - それは別issueに切り分けて実施すべし
        - issue : ソースコード構成を改善し、ドメイン単位でフォルダ化する

```

## [Issue #139](../issue-notes/139.md): Disable intonation editing when multiple voice styles are active via delimiter
- [x] Understand the issue: when using style-change delimiters in the text, intonation editing is misleading because only the first segment's style is used when re-synthesizing
- [x] Modify `src/playback.ts` to detect multiple styles in segments (`hasMultipleStyles`) and:
  - Skip intonation playbac...
ラベル: 
--- issue-notes/139.md の内容 ---

```markdown

```

## [Issue #138](../issue-notes/138.md): セリフtextarea内で区切り文字を使ってstyleを変更している場合、イントネーションを変更したときの挙動がわかりづらくてuserが混乱した
[issue-notes/138.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/138.md)

...
ラベル: 
--- issue-notes/138.md の内容 ---

```markdown
# issue セリフtextarea内で区切り文字を使ってstyleを変更している場合、イントネーションを変更したときの挙動がわかりづらくてuserが混乱した #138
[issues #138](https://github.com/cat2151/voicevox-playground/issues/138)

# これまでの課題
## 挙動
- セリフtextarea内で区切り文字を使ってstyleを変更している場合、
- イントネーション編集エリアでイントネーションを変更すると、
- styleが、textarea先頭のstyleで固定される。つまり、区切り文字を使って変更したstyle、が無効化される
## 問題
- これはuserが混乱する

# 対策
- セリフ内でstyleを変更したときは、イントネーション編集不可にする
    - メリットは最もシンプル
        - かつuser混乱を防止できる

# 不採用にした案（参考）
- セリフ内でstyleを変更したときは、style変更前までのイントネーションのみ編集できる
    - メリットはシンプル
    - 不採用の理由：ニーズとアウトカムに対して開発コストが大きく、オーバーエンジニアリングである、と判断する
- style変更による分割も、イントネーション編集欄で可視化して、複数のイントネーションをそれぞれ編集できる
    - 不採用の理由：ニーズとアウトカムに対して開発コストが大きく、オーバーエンジニアリングである、と判断する

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

## [Issue #111](../issue-notes/111.md): （保留中）リアルタイムFFT表示は、リニアと対数をボタンで選べるようにする。ボタンの見た目はスペクトログラムのものを参考にせよ
[issue-notes/111.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/111.md)

...
ラベル: 
--- issue-notes/111.md の内容 ---

```markdown
# issue リアルタイムFFT表示は、リニアと対数を、スペクトログラムと同様に選べてlocal storage保存と起動時復帰できるようにする #111
[issues #111](https://github.com/cat2151/voicevox-playground/issues/111)

# GPT-5 mini に投げてみた
- ハルシネーションで同じ回答を連発
- さらに続けたところ、コード破壊（既存機能を削除）
- どうする？
  - 待ち。Opus4.6以上かCodex 5.1以上が使えるようになるまで待ち

```

## [Issue #97](../issue-notes/97.md): スペクトログラム左のHzの桁数が3桁しかないので5桁にする。あわせてHzの右の不要な白い線を消す
[issue-notes/97.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/97.md)

...
ラベル: 
--- issue-notes/97.md の内容 ---

```markdown
# issue スペクトログラム左のHzの桁数が3桁しかないので5桁にする。あわせてHzの右の不要な白い線を消す #97
[issues #97](https://github.com/cat2151/voicevox-playground/issues/97)



```

## ドキュメントで言及されているファイルの内容
### .github/actions-tmp/issue-notes/11.md
```md
{% raw %}
# issue translate を他projectから使いやすくする #11
[issues #11](https://github.com/cat2151/github-actions/issues/11)

# ブレインストーミング
- 課題、個別dirへの移動が必要。
    - scripts
- 課題、promptをハードコーディングでなく、promptsに切り出す。
    - さらに、呼び出し元ymlから任意のpromptsを指定できるようにする。
- 済、課題、README以外のtranslateも可能にするか検討する
    - 対策、シンプル優先でREADME決め打ちにする
        - 理由、README以外の用途となると、複数ファイルをどうGemini APIにわたすか？等、仕様が爆発的にふくらんでいくリスクがある
        - README以外の用途が明確でないうちは、README決め打ちにするほうがよい
- docs
    - call導入手順を書く

# 状況
- 上記のうち、別dirへの切り分け等は実施済みのはず
- どうする？
    - それをここに可視化する。

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

### .github/actions-tmp/issue-notes/38.md
```md
{% raw %}
# issue PR 36 と PR 37 を取り込んだあと、存在しないissueでワークフローがエラー終了してしまった #38
[issues #38](https://github.com/cat2151/github-actions/issues/38)

# URL

- https://github.com/cat2151/wavlpf/actions/runs/21907996164/job/63253441830

# 実現したいこと

- issueが存在しないのは想定したことであるから、エラー終了にはしない。可用性を維持する。
  - それはそれとして、想定しないできごとが発生した場合は、fail fastする
    - 今回は「想定したできごとなので、fail fastしない」

{% endraw %}
```

### .github/actions-tmp/issue-notes/40.md
```md
{% raw %}
# issue 巨大コードの検知のワークフローの対象に、テストコードも含むようにする #40
[issues #40](https://github.com/cat2151/github-actions/issues/40)

- あわせて、issueのプロンプトに以下を含むようにせよ
    - リファクタリングするときは、事前と事後にtestし、エラー件数（test red件数）を事前と事後で報告してください
    - リファクタリング前後でtest redがあった場合は、userに「まず別issueでtest greenにしてからリファクタリングしてください」を報告してください

- あわせて、cat2151の直近の20のリポジトリを調査し、それらのリポジトリでのワークフロー設定tomlの変更の要否と、このワークフロー適用漏れのリポジトリの有無を、報告せよ

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

### issue-notes/111.md
```md
{% raw %}
# issue リアルタイムFFT表示は、リニアと対数を、スペクトログラムと同様に選べてlocal storage保存と起動時復帰できるようにする #111
[issues #111](https://github.com/cat2151/voicevox-playground/issues/111)

# GPT-5 mini に投げてみた
- ハルシネーションで同じ回答を連発
- さらに続けたところ、コード破壊（既存機能を削除）
- どうする？
  - 待ち。Opus4.6以上かCodex 5.1以上が使えるようになるまで待ち

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

### issue-notes/138.md
```md
{% raw %}
# issue セリフtextarea内で区切り文字を使ってstyleを変更している場合、イントネーションを変更したときの挙動がわかりづらくてuserが混乱した #138
[issues #138](https://github.com/cat2151/voicevox-playground/issues/138)

# これまでの課題
## 挙動
- セリフtextarea内で区切り文字を使ってstyleを変更している場合、
- イントネーション編集エリアでイントネーションを変更すると、
- styleが、textarea先頭のstyleで固定される。つまり、区切り文字を使って変更したstyle、が無効化される
## 問題
- これはuserが混乱する

# 対策
- セリフ内でstyleを変更したときは、イントネーション編集不可にする
    - メリットは最もシンプル
        - かつuser混乱を防止できる

# 不採用にした案（参考）
- セリフ内でstyleを変更したときは、style変更前までのイントネーションのみ編集できる
    - メリットはシンプル
    - 不採用の理由：ニーズとアウトカムに対して開発コストが大きく、オーバーエンジニアリングである、と判断する
- style変更による分割も、イントネーション編集欄で可視化して、複数のイントネーションをそれぞれ編集できる
    - 不採用の理由：ニーズとアウトカムに対して開発コストが大きく、オーバーエンジニアリングである、と判断する

{% endraw %}
```

### issue-notes/140.md
```md
{% raw %}
# issue デフォルトでplayボタンを押すと、つまりループ再生すると、再生ごとにムダな待ち時間がある #140
[issues #140](https://github.com/cat2151/voicevox-playground/issues/140)

- 事象
    - ループ再生onのとき、playボタンを押すと、
    - 「イントネーションを適用中…」という文言だけが表示されて、
    - おそらく「デフォルトのイントネーションのままなのに」「ムダにイントネーション適用処理がされて」しまっている
- 対策
    - userがほしい挙動は、この条件であれば、「textarea、style、イントネーション情報、すべてが、前回のwav再生時と同じであれば、あらゆる音声合成処理は不要で、cacheされているwavデータを再生すべし」「cacheから再生します、のような既存のメッセージが表示されるべき」
- 背後にあると予想される問題
    - 仕様変更で既存機能が破壊されている、リグレッションが発生している
    - これは、agentがアプリの全体像を掴みそこねている、というアラートである、と判断する
    - ソースコードの構成を、agentのハルシネーションのリスクを下げるよう、リファクタリングを検討すべし
    - それは別issueに切り分けて実施すべし
        - issue : ソースコード構成を改善し、ドメイン単位でフォルダ化する

{% endraw %}
```

### issue-notes/141.md
```md
{% raw %}
# issue ソースコード構成を改善し、ドメイン単位でフォルダ化する。経緯はissue 140も参照のこと #141
[issues #141](https://github.com/cat2151/voicevox-playground/issues/141)



{% endraw %}
```

### issue-notes/97.md
```md
{% raw %}
# issue スペクトログラム左のHzの桁数が3桁しかないので5桁にする。あわせてHzの右の不要な白い線を消す #97
[issues #97](https://github.com/cat2151/voicevox-playground/issues/97)



{% endraw %}
```

### src/playback.ts
```ts
{% raw %}
import * as Tone from "tone";
import { AUDIO_CACHE_LIMIT, AUTO_PLAY_DEBOUNCE_MS } from "./config";
import { addToHistory } from "./textLists";
import {
	fetchAndRenderIntonation,
	hasActiveIntonationQuery,
	isIntonationActive,
	playUpdatedIntonation,
	resetIntonationState,
} from "./intonation";
import { appState } from "./state";
import { updateExportButtonState } from "./uiControls";
import { showStatus, scheduleHideStatus, getColorVariable } from "./status";
import {
	combineAudioBuffers,
	encodeAudioBufferToWav,
	getAudioQuery,
	synthesize,
} from "./audio";
import {
	buildTextSegments,
	getSelectedStyleId,
	getApiBaseForStyleId,
	parseDelimiterConfig,
	populateSpeakerStyleSelect,
	selectRandomStyleId,
	setSelectedStyleId,
} from "./styleManager";
import {
	drawRenderedWaveform,
	initializeVisualizationCanvases,
	isPlaybackActive,
	playAudio,
	stopActivePlayback,
} from "./visualization";

const audioCache = new Map<string, ArrayBuffer>();

export function clearAudioCache(): void {
	audioCache.clear();
}
const PLAY_ICON_SVG =
	'<svg class="icon icon--play" aria-hidden="true" viewBox="0 0 24 24" focusable="false" preserveAspectRatio="xMidYMid meet"><polygon points="3,2 22,12 3,22"/></svg>';
const STOP_ICON_SVG =
	'<svg class="icon icon--stop" aria-hidden="true" viewBox="0 0 24 24" focusable="false" preserveAspectRatio="xMidYMid meet"><rect x="3" y="3" width="18" height="18" rx="2.5"></rect></svg>';
let autoPlayTimer: number | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let playRequestPending = false;
let stopInProgress = false;

export function setLoopCheckboxElement(element: HTMLInputElement | null) {
	loopCheckboxEl = element;
}

export function setPlayButtonAppearance(mode: "play" | "stop") {
	const playButton = document.getElementById(
		"playButton",
	) as HTMLButtonElement | null;
	if (!playButton) return;
	if (mode === "play") {
		playButton.innerHTML = PLAY_ICON_SVG;
		playButton.dataset.icon = "play";
		playButton.setAttribute("aria-label", "Play");
		playButton.title = "Play";
	} else {
		playButton.innerHTML = STOP_ICON_SVG;
		playButton.dataset.icon = "stop";
		playButton.setAttribute("aria-label", "Stop");
		playButton.title = "Stop";
	}
}

export function isPlayRequestPending() {
	return playRequestPending;
}

function stopPlaybackAndResetLoop() {
	stopInProgress = true;
	stopActivePlayback();
	if (loopCheckboxEl) {
		loopCheckboxEl.checked = false;
	}
	setPlayButtonAppearance("play");
	setTimeout(() => {
		stopInProgress = false;
	}, 0);
}

export function getAudioCacheKey(text: string, styleId: number) {
	return `${styleId}::${text}`;
}

export function setTextAndPlay(text: string) {
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	if (!textArea) return;
	textArea.value = text;
	if (autoPlayTimer !== null) {
		window.clearTimeout(autoPlayTimer);
		autoPlayTimer = null;
	}
	if (isPlaybackActive()) {
		stopPlaybackAndResetLoop();
	}
	scheduleAutoPlay();
}

export function downloadLastAudio() {
	if (!appState.lastSynthesizedBuffer) return;

	const blob = new Blob([appState.lastSynthesizedBuffer], {
		type: "audio/wav",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "voicevox-output.wav";
	document.body.appendChild(link);
	link.click();
	window.setTimeout(() => {
		URL.revokeObjectURL(url);
		link.remove();
	}, 0);
}

export function scheduleAutoPlay() {
	if (autoPlayTimer !== null) {
		window.clearTimeout(autoPlayTimer);
	}

	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	if (!textArea) return;
	const text = textArea.value.trim();
	if (!text) {
		autoPlayTimer = null;
		return;
	}

	const triggerPlay = () => {
		autoPlayTimer = null;
		if (appState.isProcessing) {
			autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
			return;
		}
		void handlePlay();
	};

	autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
}

async function confirmResetIntonationBeforePlay() {
	const dialog = document.getElementById("playConfirmDialog");
	const resetButton = document.getElementById("playConfirmReset");
	const cancelButton = document.getElementById("playConfirmCancel");
	if (!dialog || !resetButton || !cancelButton) {
		return window.confirm(
			"イントネーションの編集内容が破棄されます。再生してよろしいですか？",
		);
	}
	const previousActiveElement = document.activeElement as HTMLElement | null;
	dialog.removeAttribute("hidden");
	let settled = false;
	(resetButton as HTMLElement).focus();
	return new Promise<boolean>((resolve) => {
		let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
		const cleanup = () => {
			if (settled) return;
			settled = true;
			dialog.setAttribute("hidden", "true");
			if (keydownHandler) {
				dialog.removeEventListener("keydown", keydownHandler);
			}
			resetButton.removeEventListener("click", handleReset);
			cancelButton.removeEventListener("click", handleCancel);
			if (
				previousActiveElement &&
				typeof previousActiveElement.focus === "function"
			) {
				previousActiveElement.focus();
			}
		};
		const handleReset = () => {
			cleanup();
			resolve(true);
		};
		const handleCancel = () => {
			cleanup();
			resolve(false);
		};
		keydownHandler = (event: KeyboardEvent) => {
			if (event.key === "Escape" || event.key === "Esc") {
				event.preventDefault();
				handleCancel();
			}
		};
		dialog.addEventListener("keydown", keydownHandler);
		resetButton.addEventListener("click", handleReset, { once: true });
		cancelButton.addEventListener("click", handleCancel, { once: true });
	});
}

export function handlePlayButtonClick() {
	if (stopInProgress) {
		return;
	}
	if (isPlaybackActive()) {
		if (import.meta.env.DEV) {
			console.debug("Stop button clicked");
		}
		stopPlaybackAndResetLoop();
		return;
	}
	if (playRequestPending || appState.isProcessing) {
		return;
	}
	void handlePlay();
}

export async function handlePlay() {
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	const playButton = document.getElementById(
		"playButton",
	) as HTMLButtonElement | null;
	const exportButton = document.getElementById(
		"exportButton",
	) as HTMLButtonElement | null;
	const renderedCanvas = document.getElementById(
		"renderedWaveform",
	) as HTMLCanvasElement | null;
	const realtimeCanvas = document.getElementById(
		"realtimeWaveform",
	) as HTMLCanvasElement | null;
	const spectrogramCanvas = document.getElementById(
		"spectrogram",
	) as HTMLCanvasElement | null;
	const loopCheckbox = document.getElementById(
		"loopCheckbox",
	) as HTMLInputElement | null;
	const styleSelect = document.getElementById(
		"styleSelect",
	) as HTMLSelectElement | null;
	const speakerStyleSelect = document.getElementById(
		"speakerStyleSelect",
	) as HTMLSelectElement | null;
	const delimiterInput = document.getElementById(
		"delimiterInput",
	) as HTMLInputElement | null;
	const randomStyleCheckbox = document.getElementById(
		"randomStyleCheckbox",
	) as HTMLInputElement | null;

	if (!textArea || !playButton) {
		console.error("Required UI elements not found");
		return;
	}

	const text = textArea.value.trim();

	if (!text) {
		showStatus("テキストを入力してください", "error");
		return;
	}

	const randomStyleEnabled = randomStyleCheckbox?.checked ?? false;

	if (randomStyleEnabled) {
		const randomStyleId = selectRandomStyleId();
		if (styleSelect) {
			styleSelect.value = String(randomStyleId);
		}
		populateSpeakerStyleSelect(speakerStyleSelect, randomStyleId);
	} else if (styleSelect && styleSelect.value) {
		const parsed = Number(styleSelect.value);
		if (!Number.isNaN(parsed)) {
			setSelectedStyleId(parsed);
		}
	}

	const delimiter = parseDelimiterConfig(delimiterInput?.value ?? "");
	const segments = buildTextSegments(text, delimiter, getSelectedStyleId());
	if (segments.length === 0) {
		showStatus("テキストを入力してください", "error");
		return;
	}

	if (appState.isProcessing || playRequestPending) {
		return;
	}

	playRequestPending = true;

	const spokenText = segments.map((segment) => segment.text).join("");
	const intonationStyleId = segments[0]?.styleId ?? getSelectedStyleId();

	if (hasActiveIntonationQuery(spokenText, intonationStyleId)) {
		try {
			setPlayButtonAppearance("stop");
			playButton.disabled = false;
			updateExportButtonState(exportButton);
			await playUpdatedIntonation();
		} finally {
			setPlayButtonAppearance("play");
			playRequestPending = false;
		}
		if (loopCheckbox?.checked) {
			setTimeout(() => {
				if (loopCheckbox?.checked) {
					void handlePlay();
				}
			}, 0);
		}
		return;
	}

	if (isIntonationActive()) {
		const shouldReset = await confirmResetIntonationBeforePlay();
		if (!shouldReset) {
			playRequestPending = false;
			return;
		}
		resetIntonationState();
	}

	appState.isProcessing = true;
	playButton.disabled = true;
	updateExportButtonState(exportButton);

	try {
		const audioContext = Tone.getContext().rawContext as BaseAudioContext;
		const decodedBuffers: AudioBuffer[] = [];
		const bypassCache = randomStyleEnabled;
		let usedCache = false;
		let allSegmentsCached = !bypassCache;
		const currentSignature = segments
			.map((segment) => getAudioCacheKey(segment.text, segment.styleId))
			.join("|");
		for (const segment of segments) {
			const cacheKey = getAudioCacheKey(segment.text, segment.styleId);
			let audioBuffer = bypassCache ? null : (audioCache.get(cacheKey) ?? null);
			if (audioBuffer) {
				usedCache = true;
			} else {
				allSegmentsCached = false;
				showStatus("音声クエリを作成中...", "info");
				const apiBase = getApiBaseForStyleId(segment.styleId);
				const audioQuery = await getAudioQuery(
					segment.text,
					segment.styleId,
					apiBase,
				);
				showStatus("音声を生成中...", "info");
				audioBuffer = await synthesize(audioQuery, segment.styleId, apiBase);
				if (!bypassCache) {
					if (audioCache.size >= AUDIO_CACHE_LIMIT) {
						const oldest = audioCache.keys().next().value;
						if (oldest !== undefined) {
							audioCache.delete(oldest);
						}
					}
					audioCache.set(cacheKey, audioBuffer);
				}
			}
			const decodedBuffer = await audioContext.decodeAudioData(
				audioBuffer.slice(0),
			);
			decodedBuffers.push(decodedBuffer);
		}

		const combinedBuffer = combineAudioBuffers(decodedBuffers, audioContext);
		if (!combinedBuffer) {
			throw new Error("音声の結合に失敗しました。");
		}

		appState.lastSynthesizedBuffer = encodeAudioBufferToWav(combinedBuffer);

		const shouldPreserveSpectrogram =
			!bypassCache &&
			allSegmentsCached &&
			appState.lastSpectrogramSignature === currentSignature;
		initializeVisualizationCanvases({
			preserveSpectrogram: shouldPreserveSpectrogram,
		});
		if (renderedCanvas) {
			drawRenderedWaveform(combinedBuffer, renderedCanvas);
		}

		if (!usedCache) {
			showStatus("音声を再生中...", "info");
		} else {
			showStatus("音声を再生中（キャッシュ）...", "info");
		}
		setPlayButtonAppearance("stop");
		playButton.disabled = false;
		const playbackResult = await playAudio(
			combinedBuffer,
			realtimeCanvas,
			spectrogramCanvas,
			{
				resetSpectrogram: !shouldPreserveSpectrogram,
			},
		);
		if (playbackResult.stopped) {
			showStatus("再生を停止しました", "info");
			scheduleHideStatus(1500);
			clearRealtimeWaveformCanvas(realtimeCanvas);
			return;
		}
		appState.lastSpectrogramSignature = currentSignature;
		const spokenText = segments.map((segment) => segment.text).join("");
		const intonationStyleId = segments[0]?.styleId ?? getSelectedStyleId();
		await fetchAndRenderIntonation(spokenText, intonationStyleId);
		addToHistory(text);

		showStatus("再生完了！", "success");
		clearRealtimeWaveformCanvas(realtimeCanvas);
		scheduleHideStatus(3000);

		if (loopCheckbox?.checked) {
			setTimeout(() => {
				if (loopCheckbox.checked) {
					void handlePlay();
				}
			}, 0);
		}
	} catch (error) {
		console.error("Error:", error);
		showStatus(
			`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
			"error",
		);
	} finally {
		setPlayButtonAppearance("play");
		playButton.disabled = false;
		playRequestPending = false;
		appState.isProcessing = false;
		updateExportButtonState(exportButton);
	}
}

function clearRealtimeWaveformCanvas(canvas: HTMLCanvasElement | null) {
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColorVariable("--bg-color", "#ffffff");
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = getColorVariable("--border-color", "#e0e0e0");
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();
}

{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
0f8b5bc Add issue note for #141 [auto]
0d8f393 Document issue #140 with detailed analysis and solutions
35c4208 Add issue note for #140 [auto]
3fd9b31 Update project summaries (overview & development status) [auto]
33810c3 Update issue notes for confusion with intonation changes
4182788 Add issue note for #138 [auto]
3ee5d59 Merge pull request #137 from cat2151/copilot/refactor-large-file-in-src
8a6f14f refactor: extract intonation canvas event setup from main.ts into intonation.ts
02301e5 Initial plan
9e4a729 Merge pull request #135 from cat2151/copilot/fix-intonation-reset-issue

### 変更されたファイル:
generated-docs/development-status-generated-prompt.md
generated-docs/development-status.md
generated-docs/project-overview-generated-prompt.md
generated-docs/project-overview.md
issue-notes/127.md
issue-notes/138.md
issue-notes/140.md
issue-notes/141.md
issue-notes/99.md
src/intonation.ts
src/main.ts


---
Generated at: 2026-03-05 07:04:19 JST
