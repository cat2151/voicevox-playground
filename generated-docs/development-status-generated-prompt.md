Last updated: 2026-03-08

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
- issue-notes/142.md
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
- src/intonation/display.ts
- src/intonation/handlers.test.ts
- src/intonation/handlers.ts
- src/intonation/playback.test.ts
- src/intonation/playback.ts
- src/intonation/state.ts
- src/intonation/utils.ts
- src/intonation.test.ts
- src/intonation.ts
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
## [Issue #149](../issue-notes/149.md): 大きなファイルの検出: 1個のファイルが500行を超えています
以下のファイルが500行を超えています。リファクタリングを検討してください。

## 検出されたファイル

| ファイル | 行数 | 超過行数 |
|---------|------|----------|
| `src/playback.test.ts` | 520 | +20 |

## テスト実施のお願い

- リファクタリング前後にテストを実行し、それぞれのテスト失敗件数を報告してください
- リファクタリング前後のどちらかでテストがredの場合、まず別issueでtest greenにしてからリファクタリングしてください

## 推奨事項

1. 単一責任の原則に従い、ファイルを分...
ラベル: refactoring, code-quality, automated
--- issue-notes/149.md の内容 ---

```markdown

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

### issue-notes/97.md
```md
{% raw %}
# issue スペクトログラム左のHzの桁数が3桁しかないので5桁にする。あわせてHzの右の不要な白い線を消す #97
[issues #97](https://github.com/cat2151/voicevox-playground/issues/97)



{% endraw %}
```

### src/intonation/playback.test.ts
```ts
{% raw %}
/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playUpdatedIntonation } from "./playback";
import { intonationState } from "./state";
import { appState } from "../state";
import type { AudioQuery } from "../config";

const dummyAudioBuffer = {
	length: 1,
	numberOfChannels: 1,
	sampleRate: 48000,
	duration: 0.01,
	getChannelData: () => new Float32Array(1),
} as unknown as AudioBuffer;

vi.mock("tone", () => ({
	getContext: () => ({
		rawContext: {
			decodeAudioData: vi.fn(async () => dummyAudioBuffer),
		},
	}),
}));

vi.mock("../audio", () => ({
	getAudioQuery: vi.fn(),
	synthesize: vi.fn(async () => new ArrayBuffer(8)),
}));

vi.mock("../visualization", () => ({
	drawRenderedWaveform: vi.fn(),
	initializeVisualizationCanvases: vi.fn(),
	playAudio: vi.fn(async () => ({ stopped: false })),
}));

vi.mock("../status", () => ({
	showStatus: vi.fn(),
	scheduleHideStatus: vi.fn(),
}));

vi.mock("../uiControls", () => ({
	updateExportButtonState: vi.fn(),
}));

vi.mock("../styleManager", () => ({
	getApiBaseForStyleId: vi.fn(() => "http://localhost:50021"),
}));

const stubQuery: AudioQuery = { accent_phrases: [] } as unknown as AudioQuery;

beforeEach(() => {
	document.body.innerHTML = `
    <button id="playButton"></button>
    <button id="exportButton"></button>
    <canvas id="renderedWaveform"></canvas>
    <canvas id="realtimeWaveform"></canvas>
    <canvas id="spectrogram"></canvas>
  `;
	intonationState.currentIntonationQuery = stubQuery;
	intonationState.currentIntonationStyleId = 1;
	intonationState.intonationDirty = true;
	intonationState.synthesisCache.clear();
	appState.isProcessing = false;
	appState.lastSynthesizedBuffer = null;
});

afterEach(() => {
	vi.clearAllMocks();
	intonationState.synthesisCache.clear();
	intonationState.currentIntonationQuery = null;
	intonationState.intonationDirty = false;
	appState.isProcessing = false;
	appState.lastSynthesizedBuffer = null;
});

describe("playUpdatedIntonation cache behavior", () => {
	it("calls synthesize on cache miss and stores result in synthesisCache", async () => {
		const { synthesize } = await import("../audio");

		await playUpdatedIntonation();

		expect(vi.mocked(synthesize)).toHaveBeenCalledTimes(1);
		expect(intonationState.synthesisCache.size).toBe(1);
	});

	it("skips synthesize on cache hit and reuses the cached buffer", async () => {
		const { synthesize } = await import("../audio");

		await playUpdatedIntonation();
		vi.mocked(synthesize).mockClear();

		intonationState.intonationDirty = true;
		await playUpdatedIntonation();

		expect(vi.mocked(synthesize)).not.toHaveBeenCalled();
		expect(intonationState.synthesisCache.size).toBe(1);
	});

	it("sets intonationDirty to false after successful synthesis", async () => {
		await playUpdatedIntonation();

		expect(intonationState.intonationDirty).toBe(false);
	});

	it("populates appState.lastSynthesizedBuffer after synthesis", async () => {
		await playUpdatedIntonation();

		expect(appState.lastSynthesizedBuffer).not.toBeNull();
	});

	it("caches different buffers for different queries", async () => {
		const { synthesize } = await import("../audio");

		await playUpdatedIntonation();

		const query2 = {
			accent_phrases: [{ moras: [] }],
		} as unknown as AudioQuery;
		intonationState.currentIntonationQuery = query2;
		intonationState.intonationDirty = true;
		await playUpdatedIntonation();

		expect(vi.mocked(synthesize)).toHaveBeenCalledTimes(2);
		expect(intonationState.synthesisCache.size).toBe(2);
	});
});

{% endraw %}
```

### src/playback.test.ts
```ts
{% raw %}
/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	getAudioCacheKey,
	handlePlay,
	handlePlayButtonClick,
	isPlayRequestPending,
	setLoopCheckboxElement,
	setPlayButtonAppearance,
	setTextAndPlay,
} from "./playback";
import { stopActivePlayback } from "./visualization";
import { TEXT_MAX_LENGTH } from "./config";

const dummyAudioBuffer = {
	length: 1,
	numberOfChannels: 1,
	sampleRate: 48000,
	duration: 0.01,
	getChannelData: () => new Float32Array(1),
} as unknown as AudioBuffer;

vi.mock("tone", () => ({
	getContext: () => ({
		rawContext: {
			decodeAudioData: vi.fn(async () => dummyAudioBuffer),
		},
	}),
}));

vi.mock("./status", () => ({
	showStatus: vi.fn(),
	scheduleHideStatus: vi.fn(),
}));

vi.mock("./textLists", () => ({
	addToHistory: vi.fn(),
}));

vi.mock("./intonation", () => ({
	fetchAndRenderIntonation: vi.fn(),
	hasActiveIntonationQuery: vi.fn(() => false),
	isIntonationActive: vi.fn(() => false),
	isIntonationDirty: vi.fn(() => false),
	playUpdatedIntonation: vi.fn(async () => {}),
	replayCachedIntonationAudio: vi.fn(async () => true),
	resetIntonationState: vi.fn(),
}));

vi.mock("./uiControls", () => ({
	updateExportButtonState: vi.fn(),
}));

vi.mock("./styleManager", () => ({
	buildTextSegments: vi.fn(() => [{ text: "hello", styleId: 1 }]),
	getSelectedStyleId: vi.fn(() => 1),
	getApiBaseForStyleId: vi.fn(() => "http://localhost:50021"),
	parseDelimiterConfig: vi.fn(() => ({})),
	setSelectedStyleId: vi.fn(),
}));

vi.mock("./audio", () => ({
	combineAudioBuffers: vi.fn(() => dummyAudioBuffer),
	encodeAudioBufferToWav: vi.fn(() => new ArrayBuffer(4)),
	getAudioQuery: vi.fn(async () => ({})),
	synthesize: vi.fn(async () => new ArrayBuffer(8)),
}));

vi.mock("./visualization", () => {
	let active = false;
	let resolvePlayback: ((result: { stopped: boolean }) => void) | null = null;
	const stopActivePlayback = vi.fn(() => {
		active = false;
		resolvePlayback?.({ stopped: true });
		resolvePlayback = null;
	});
	const playAudio = vi.fn(async () => {
		active = true;
		return new Promise<{ stopped: boolean }>((resolve) => {
			resolvePlayback = resolve;
		});
	});
	return {
		drawRenderedWaveform: vi.fn(),
		initializeVisualizationCanvases: vi.fn(),
		isPlaybackActive: vi.fn(() => active),
		playAudio,
		stopActivePlayback,
	};
});

afterEach(() => {
	document.body.innerHTML = "";
	vi.clearAllMocks();
});

describe("getAudioCacheKey", () => {
	it("combines style id and text", () => {
		expect(getAudioCacheKey("hello", 42)).toBe("42::hello");
	});
});

describe("setPlayButtonAppearance", () => {
	it("sets play and stop button states", () => {
		const button = document.createElement("button");
		button.id = "playButton";
		document.body.appendChild(button);

		setPlayButtonAppearance("play");
		expect(button.getAttribute("aria-label")).toBe("Play");
		expect(button.title).toBe("Play");
		expect(button.dataset.icon).toBe("play");
		expect(button.querySelector("svg.icon--play")).not.toBeNull();

		setPlayButtonAppearance("stop");
		expect(button.getAttribute("aria-label")).toBe("Stop");
		expect(button.title).toBe("Stop");
		expect(button.dataset.icon).toBe("stop");
		expect(button.querySelector("svg.icon--stop")).not.toBeNull();
	});
});

describe("handlePlayButtonClick", () => {
	it("stops playback even when a play request is pending", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const playPromise = handlePlay();
		expect(isPlayRequestPending()).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 0));
		handlePlayButtonClick();

		expect(stopActivePlayback).toHaveBeenCalledTimes(1);

		await playPromise;
	});
});

describe("setTextAndPlay", () => {
	it("stops active playback before scheduling auto-play", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" checked />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const loopCheckbox = document.getElementById(
			"loopCheckbox",
		) as HTMLInputElement;
		setLoopCheckboxElement(loopCheckbox);

		try {
			vi.useFakeTimers();
			const playPromise = handlePlay();
			await vi.runAllTimersAsync();

			setTextAndPlay("new text");

			expect(stopActivePlayback).toHaveBeenCalled();
			expect(loopCheckbox.checked).toBe(false);

			vi.clearAllTimers();
			await playPromise;
		} finally {
			vi.useRealTimers();
			setLoopCheckboxElement(null);
		}
	});
});

describe("handlePlay with active intonation", () => {
	it("calls replayCachedIntonationAudio instead of re-synthesizing when intonation is active and not dirty (loop playback)", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const {
			hasActiveIntonationQuery,
			isIntonationDirty,
			playUpdatedIntonation,
			replayCachedIntonationAudio,
		} = await import("./intonation");
		const { getAudioQuery } = await import("./audio");

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(true);
		vi.mocked(isIntonationDirty).mockReturnValue(false);

		await handlePlay();

		expect(replayCachedIntonationAudio).toHaveBeenCalledTimes(1);
		expect(playUpdatedIntonation).not.toHaveBeenCalled();
		expect(getAudioQuery).not.toHaveBeenCalled();

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(false);
		vi.mocked(isIntonationDirty).mockReturnValue(false);
	});

	it("calls playUpdatedIntonation when intonation is active and dirty", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const {
			hasActiveIntonationQuery,
			isIntonationDirty,
			playUpdatedIntonation,
			replayCachedIntonationAudio,
		} = await import("./intonation");
		const { getAudioQuery } = await import("./audio");

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(true);
		vi.mocked(isIntonationDirty).mockReturnValue(true);

		await handlePlay();

		expect(playUpdatedIntonation).toHaveBeenCalledTimes(1);
		expect(replayCachedIntonationAudio).not.toHaveBeenCalled();
		expect(getAudioQuery).not.toHaveBeenCalled();

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(false);
		vi.mocked(isIntonationDirty).mockReturnValue(false);
	});

	it("shows confirm dialog and resets intonation when intonation is active but text changed", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
      <div id="playConfirmDialog" hidden>
        <button id="playConfirmReset"></button>
        <button id="playConfirmCancel"></button>
      </div>
    `;

		const { isIntonationActive, resetIntonationState } = await import(
			"./intonation"
		);
		vi.mocked(isIntonationActive).mockReturnValue(true);

		const playPromise = handlePlay();

		await new Promise((resolve) => setTimeout(resolve, 0));
		const resetButton = document.getElementById(
			"playConfirmReset",
		) as HTMLButtonElement;
		resetButton.click();

		// Wait for synthesis to start then stop it so playPromise resolves
		await new Promise((resolve) => setTimeout(resolve, 0));
		handlePlayButtonClick();

		await playPromise;

		expect(resetIntonationState).toHaveBeenCalledTimes(1);

		vi.mocked(isIntonationActive).mockReturnValue(false);
	});

	it("cancels playback when user declines the intonation reset dialog", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
      <div id="playConfirmDialog" hidden>
        <button id="playConfirmReset"></button>
        <button id="playConfirmCancel"></button>
      </div>
    `;

		const { isIntonationActive, resetIntonationState } = await import(
			"./intonation"
		);
		const { getAudioQuery } = await import("./audio");
		vi.mocked(isIntonationActive).mockReturnValue(true);

		const playPromise = handlePlay();

		await new Promise((resolve) => setTimeout(resolve, 0));
		const cancelButton = document.getElementById(
			"playConfirmCancel",
		) as HTMLButtonElement;
		cancelButton.click();

		await playPromise;

		expect(resetIntonationState).not.toHaveBeenCalled();
		expect(getAudioQuery).not.toHaveBeenCalled();
	});
});

describe("handlePlay with multiple styles", () => {
	it("resets intonation state and skips intonation fetch when multiple styles are used", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello world</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const {
			isIntonationActive,
			fetchAndRenderIntonation,
			resetIntonationState,
		} = await import("./intonation");
		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");

		vi.mocked(isIntonationActive).mockReturnValue(false);
		vi.mocked(buildTextSegments).mockReturnValueOnce([
			{ text: "hello", styleId: 1 },
			{ text: " world", styleId: 2 },
		]);
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		expect(fetchAndRenderIntonation).not.toHaveBeenCalled();
		expect(resetIntonationState).not.toHaveBeenCalled();
	});

	it("silently resets active intonation without confirmation dialog when switching to multi-style", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello world</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const {
			isIntonationActive,
			fetchAndRenderIntonation,
			resetIntonationState,
		} = await import("./intonation");
		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");

		vi.mocked(isIntonationActive).mockReturnValue(true);
		vi.mocked(buildTextSegments).mockReturnValueOnce([
			{ text: "hello", styleId: 1 },
			{ text: " world", styleId: 2 },
		]);
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		const confirmSpy = vi.spyOn(window, "confirm");

		await handlePlay();

		expect(resetIntonationState).toHaveBeenCalled();
		expect(fetchAndRenderIntonation).not.toHaveBeenCalled();
		expect(confirmSpy).not.toHaveBeenCalled();

		confirmSpy.mockRestore();
		vi.mocked(isIntonationActive).mockReturnValue(false);
	});
});

describe("handlePlay text truncation", () => {
	const makeDOM = (text: string) => {
		document.body.innerHTML = `
      <textarea id="text">${text}</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;
	};

	it("passes text unchanged when within limit", async () => {
		const shortText = "あ".repeat(TEXT_MAX_LENGTH - 1);
		makeDOM(shortText);

		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		expect(vi.mocked(buildTextSegments)).toHaveBeenCalledWith(
			shortText,
			expect.anything(),
			expect.anything(),
		);

		const { showStatus } = await import("./status");
		const statusCalls = vi.mocked(showStatus).mock.calls;
		const completionCall = statusCalls.find(([msg]) =>
			(msg as string).includes("再生完了"),
		);
		expect(completionCall?.[0]).toBe("再生完了！");
	});

	it("truncates text to TEXT_MAX_LENGTH when over limit", async () => {
		const longText = "あ".repeat(TEXT_MAX_LENGTH + 100);
		makeDOM(longText);

		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		const expectedText = "あ".repeat(TEXT_MAX_LENGTH);
		expect(vi.mocked(buildTextSegments)).toHaveBeenCalledWith(
			expectedText,
			expect.anything(),
			expect.anything(),
		);
	});

	it("shows truncation notice in status when text is over limit", async () => {
		const longText = "あ".repeat(TEXT_MAX_LENGTH + 1);
		makeDOM(longText);

		const { playAudio } = await import("./visualization");
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		const { showStatus } = await import("./status");
		const statusCalls = vi
			.mocked(showStatus)
			.mock.calls.map(([msg]) => msg as string);
		expect(statusCalls.some((msg) => msg.includes("カット"))).toBe(true);
		const completionMsg = statusCalls.find((msg) => msg.includes("再生完了"));
		expect(completionMsg).toContain("カット");
	});

	it("shows truncation notice when playUpdatedIntonation path is taken with long text", async () => {
		const longText = "あ".repeat(TEXT_MAX_LENGTH + 1);
		document.body.innerHTML = `
      <textarea id="text">${longText}</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const {
			hasActiveIntonationQuery,
			isIntonationDirty,
			playUpdatedIntonation,
		} = await import("./intonation");
		const { showStatus } = await import("./status");
		vi.mocked(hasActiveIntonationQuery).mockReturnValue(true);
		vi.mocked(isIntonationDirty).mockReturnValue(true);

		await handlePlay();

		expect(playUpdatedIntonation).toHaveBeenCalledTimes(1);
		const statusCalls = vi
			.mocked(showStatus)
			.mock.calls.map(([msg]) => msg as string);
		expect(statusCalls.some((msg) => msg.includes("カット"))).toBe(true);

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(false);
		vi.mocked(isIntonationDirty).mockReturnValue(false);
	});
});

{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
047dbba Merge pull request #148 from cat2151/copilot/fix-ci-deploy-github-pages
d50951a Fix CI: add missing label property to IntonationPoint in handlers.test.ts
f05099e Initial plan
0c9bf16 Merge pull request #146 from cat2151/copilot/fix-keyboard-operation-issues
f6b30f4 Fix: early return when text input focused; fix Space+modifier bypass; add missing input focus tests
6dda768 Fix: skip keyboard-mode shortcuts when textarea/input focused; add Shift/Ctrl+Enter global play key
050520c Initial plan
22a4949 Merge pull request #145 from cat2151/copilot/fix-play-button-delay
3e91a16 test: add playback cache behavior tests for playUpdatedIntonation
05336c5 feat: replace single-buffer cache with Map<synthesisJSON, ArrayBuffer> in playUpdatedIntonation

### 変更されたファイル:
generated-docs/development-status-generated-prompt.md
generated-docs/development-status.md
generated-docs/project-overview-generated-prompt.md
generated-docs/project-overview.md
issue-notes/142.md
src/config.ts
src/intonation.test.ts
src/intonation.ts
src/intonation/display.ts
src/intonation/handlers.test.ts
src/intonation/handlers.ts
src/intonation/playback.test.ts
src/intonation/playback.ts
src/intonation/state.ts
src/intonation/utils.ts
src/main.ts
src/playback.test.ts
src/playback.ts


---
Generated at: 2026-03-08 07:01:15 JST
