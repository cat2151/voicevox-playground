Last updated: 2026-02-17

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
- issue-notes/107.md
- issue-notes/110.md
- issue-notes/111.md
- issue-notes/112.md
- issue-notes/113.md
- issue-notes/115.md
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

## [Issue #110](../issue-notes/110.md): 画面の右上に「設定」ボタンを配置し、折りたたみで設定が開くようにし、port番号「50021」と、周波数推定対象上位%「2」、を設定可能にしlocal storage保存と復帰できるようにする
[issue-notes/110.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/110.md)

...
ラベル: 
--- issue-notes/110.md の内容 ---

```markdown
# issue 画面の右上に「設定」ボタンを配置し、折りたたみで設定が開くようにし、port番号「50021」と、周波数推定対象上位%「2」、を設定可能にする #110
[issues #110](https://github.com/cat2151/voicevox-playground/issues/110)



```

## [Issue #99](../issue-notes/99.md): イントネーションのモーラの左のa-zガイド表示は、長文で重なって見づらいので、a-zガイドはモーラの下に表示にすべし
[issue-notes/99.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/99.md)

...
ラベル: 
--- issue-notes/99.md の内容 ---

```markdown
# issue イントネーションのモーラの左のa-zガイド表示は、長文で重なって見づらいので、a-zガイドはモーラの下に表示にすべし #99
[issues #99](https://github.com/cat2151/voicevox-playground/issues/99)



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
### .github/actions-tmp/issue-notes/10.md
```md
{% raw %}
# issue callgraph を他projectから使いやすくする #10
[issues #10](https://github.com/cat2151/github-actions/issues/10)

# ブレインストーミング
- 洗い出し
    - 他projectから使う場合の問題を洗い出す、今見えている範囲で、手早く、このnoteに可視化する
    - 洗い出したものは、一部は別issueに切り分ける
- close条件
    - [x] まずは4つそれぞれを個別のdirに切り分けてtest greenとなること、とするつもり
        - 別issueに切り分けるつもり
- 切り分け
    - 別dirに切り分ける
        - [x] 課題、`codeql-queries/` が `.github/` 配下にある。対策、`.github_automation/callgraph/codeql-queries/` とする
        - [x] 課題、scriptも、`.github/`配下にある。対策、移動する
        - 方法、agentを試し、ハルシネーションで時間が取られるなら人力に切り替える
- test
    - local WSL + act でtestする
- 名前
    - [x] 課題、名前 enhanced が不要。対策、名前から enhanced を削除してymlなどもそれぞれ同期して修正すべし
- docs
    - [x] call導入手順を書く

# 状況
- 実際に他project tonejs-mml-to-json リポジトリにて使うことができている
    - その際に発生した運用ミスは、
        - call導入手順のメンテを行ったので、改善された、と判断する

# closeとする

{% endraw %}
```

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

### issue-notes/110.md
```md
{% raw %}
# issue 画面の右上に「設定」ボタンを配置し、折りたたみで設定が開くようにし、port番号「50021」と、周波数推定対象上位%「2」、を設定可能にする #110
[issues #110](https://github.com/cat2151/voicevox-playground/issues/110)



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

### issue-notes/97.md
```md
{% raw %}
# issue スペクトログラム左のHzの桁数が3桁しかないので5桁にする。あわせてHzの右の不要な白い線を消す #97
[issues #97](https://github.com/cat2151/voicevox-playground/issues/97)



{% endraw %}
```

### issue-notes/99.md
```md
{% raw %}
# issue イントネーションのモーラの左のa-zガイド表示は、長文で重なって見づらいので、a-zガイドはモーラの下に表示にすべし #99
[issues #99](https://github.com/cat2151/voicevox-playground/issues/99)



{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
3212605 Update issue notes with GPT-5 mini observations
744b1c8 Auto-translate README.ja.md to README.md [auto]
7c10a4e Update README.ja.md with platform and project goals
06f39e3 fix #107
46457c6 #107 イントネーションのキーボード操作onのspace/enterで再生したときも、通常同様に再生完了したときリアルタイム波形欄だけclear
b02e3c3 ハルシネーション対策でリファクタリング、関数分割
7b3dfb8 ハルシネーション対策でリファクタリング。ハルシネーションでagentが実装していた誤った周波数推定のデッドコードを削除
683a90d ハルシネーション対策でリファクタリング
3e521b5 fix #112 cacheはbufferでなくpixelとし、切り替えごとに1秒かかっていたのを0.1s未満で切り替えできるようパフォーマンス改善
be6cc9f fix #112

### 変更されたファイル:
README.ja.md
README.md
issue-notes/111.md
src/intonation.ts
src/intonationPlayback.ts
src/visualization.test.ts
src/visualization.ts
src/visualization/spectrogram.ts


---
Generated at: 2026-02-17 07:03:12 JST
