Last updated: 2026-03-02

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
- .github/actions-tmp/issue-notes/46.md
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
- issue-notes/127.md
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
## [Issue #136](../issue-notes/136.md): 大きなファイルの検出: 1個のファイルが500行を超えています
以下のファイルが500行を超えています。リファクタリングを検討してください。

## 検出されたファイル

| ファイル | 行数 | 超過行数 |
|---------|------|----------|
| `src/main.ts` | 502 | +2 |

## テスト実施のお願い

- リファクタリング前後にテストを実行し、それぞれのテスト失敗件数を報告してください
- リファクタリング前後のどちらかでテストがredの場合、まず別issueでtest greenにしてからリファクタリングしてください

## 推奨事項

1. ファイルを機能ごとに分割する
2. 共通ロジックを別モ...
ラベル: refactoring, code-quality, automated
--- issue-notes/136.md の内容 ---

```markdown

```

## [Issue #135](../issue-notes/135.md): Fix: play button preserves active intonation instead of silently resetting it
- [x] Understand the issue: pressing play button resets intonation without warning after editing or applying favorites
- [x] Add `currentIntonationText` tracking to `intonationState`
- [x] Set `currentIntonationText` in `fetchAndRenderIntonation()` and `applyIntonationFavorite()`; clear in reset fun...
ラベル: 
--- issue-notes/135.md の内容 ---

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

## [Issue #117](../issue-notes/117.md): イントネーション編集後や、イントネーション付きお気に入りを再生したあと、playボタンを押すと、警告なしにイントネーションが初期化されてしまう
[issue-notes/117.md](https://github.com/cat2151/voicevox-playground/blob/main/issue-notes/117.md)

...
ラベル: 
--- issue-notes/117.md の内容 ---

```markdown
# issue イントネーション編集後や、イントネーション付きお気に入りを再生したあと、playボタンを押すと、警告なしにイントネーションが初期化されてしまう #117
[issues #117](https://github.com/cat2151/voicevox-playground/issues/117)

- userがほしいのは、その状況であれば、イントネーションを維持したまま再生、である

- 類似の不具合として、ループ再生チェックボックスonのまま、イントネーション付きお気に入りを再生したときも、イントネーションが初期化された状態で再生されてしまう

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

### .github/actions-tmp/issue-notes/35.md
```md
{% raw %}
# issue issue-notes作成時に、既存のnotesを調査して不要note削除を行うようにする。clean up #35
[issues #35](https://github.com/cat2151/github-actions/issues/35)

# 定義：
- 紐付くissueがある
    - issueがopen中である → 必要note。PRを進めるために必要。
    - issueがcloseされた
        - noteの中身が、先頭2行だけで、あとは空である → 不要note。closeされたが、空っぽのnoteである。
        - noteの中身が、上記以外である → 必要note。closeされて、issueの履歴としてナレッジとなるnoteである。
- 紐付くissueがない
    - noteの中身が、先頭2行だけで、あとは空である → 不要note。issueが削除されたし、空っぽのnoteである。
    - noteの中身が、上記以外である → 必要note。issueが削除されたが、issueの履歴としてナレッジとなるnoteである。

# なぜこのワークフローymlで実施するの？
- 利用者の利用コストを下げるため。
- もし別ワークフローymlだと、全てのリポジトリに新たにワークフローymlが追加となり、導入初期コストが高い。
- 別ワークフローにするメリットが小さい
- 位置づけとしては、issue-noteのメンテは、このワークフローで行う、として許容範囲内である、と考える

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

### issue-notes/117.md
```md
{% raw %}
# issue イントネーション編集後や、イントネーション付きお気に入りを再生したあと、playボタンを押すと、警告なしにイントネーションが初期化されてしまう #117
[issues #117](https://github.com/cat2151/voicevox-playground/issues/117)

- userがほしいのは、その状況であれば、イントネーションを維持したまま再生、である

- 類似の不具合として、ループ再生チェックボックスonのまま、イントネーション付きお気に入りを再生したときも、イントネーションが初期化された状態で再生されてしまう

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

### issue-notes/97.md
```md
{% raw %}
# issue スペクトログラム左のHzの桁数が3桁しかないので5桁にする。あわせてHzの右の不要な白い線を消す #97
[issues #97](https://github.com/cat2151/voicevox-playground/issues/97)



{% endraw %}
```

### src/main.ts
```ts
{% raw %}
import "./styles.css";
import {
	AUTO_PLAY_DEBOUNCE_MS,
	DELIMITER_STORAGE_KEY,
	FrequencyScale,
} from "./config";
import {
	getCurrentSettings,
	loadSettings,
	resetSettings,
	setFrequencyTopPercent,
	setVoicevoxNemoPort,
	setVoicevoxPort,
} from "./settings";
import { initializeTextLists } from "./textLists";
import {
	adjustIntonationScale,
	getIntonationKeyboardEnabled,
	handleIntonationKeyDown,
	handleIntonationMouseLeave,
	handleIntonationMouseMove,
	handleIntonationPointerDown,
	handleIntonationPointerMove,
	handleIntonationPointerUp,
	initializeIntonationCanvas,
	initializeIntonationElements,
	refreshIntonationChart,
	resetIntonationToInitial,
	saveCurrentIntonationFavorite,
	setIntonationKeyboardEnabled,
	setStyleChangeHandler,
} from "./intonation";
import { appState } from "./state";
import { updateExportButtonState } from "./uiControls";
import {
	clearAudioCache,
	downloadLastAudio,
	handlePlay,
	handlePlayButtonClick,
	isPlayRequestPending,
	scheduleAutoPlay,
	setLoopCheckboxElement,
	setPlayButtonAppearance,
	setTextAndPlay,
} from "./playback";
import {
	fetchVoiceStyles,
	getSelectedStyleId,
	populateStyleSelect,
	populateSpeakerStyleSelect,
	selectRandomStyleId,
	setSelectedStyleId,
} from "./styleManager";
import {
	getSpectrogramScale,
	initializeVisualizationCanvases,
	isPlaybackActive,
	setSpectrogramScale,
} from "./visualization";
import { showStatus, scheduleHideStatus } from "./status";

let delimiterSaveTimer: number | null = null;

document.addEventListener("DOMContentLoaded", () => {
	loadSettings();
	const playButton = document.getElementById(
		"playButton",
	) as HTMLButtonElement | null;
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	const exportButton = document.getElementById(
		"exportButton",
	) as HTMLButtonElement | null;
	const usageToggleButton = document.getElementById(
		"usageToggleButton",
	) as HTMLButtonElement | null;
	const usagePanel = document.getElementById("usagePanel");
	const spectrogramScaleToggle = document.getElementById(
		"spectrogramScaleToggle",
	) as HTMLButtonElement | null;
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
	const favoritesToggleButton = document.getElementById(
		"favoritesToggleButton",
	) as HTMLButtonElement | null;
	const favoritesPanel = document.getElementById("favoritesPanel");
	const favoritesListEl = document.getElementById(
		"favoritesList",
	) as HTMLUListElement | null;
	const historyListEl = document.getElementById(
		"historyList",
	) as HTMLUListElement | null;
	const intonationFavoritesListEl = document.getElementById(
		"intonationFavoritesList",
	) as HTMLUListElement | null;
	const intonationCanvas = document.getElementById(
		"intonationCanvas",
	) as HTMLCanvasElement | null;
	const intonationTimingEl = null;
	const intonationLabelsEl = document.getElementById("intonationLabels");
	const intonationMaxValueEl = document.getElementById("intonationMaxValue");
	const intonationMinValueEl = document.getElementById("intonationMinValue");
	const intonationExpandTop = document.getElementById(
		"intonationExpandTop",
	) as HTMLButtonElement | null;
	const intonationShrinkTop = document.getElementById(
		"intonationShrinkTop",
	) as HTMLButtonElement | null;
	const intonationShrinkBottom = document.getElementById(
		"intonationShrinkBottom",
	) as HTMLButtonElement | null;
	const intonationExpandBottom = document.getElementById(
		"intonationExpandBottom",
	) as HTMLButtonElement | null;
	const intonationKeyboardToggle = document.getElementById(
		"intonationKeyboardToggle",
	) as HTMLButtonElement | null;
	const intonationResetButton = document.getElementById(
		"intonationResetButton",
	) as HTMLButtonElement | null;
	const intonationFavoriteButton = document.getElementById(
		"intonationFavoriteButton",
	) as HTMLButtonElement | null;
	const loopCheckboxEl = document.getElementById(
		"loopCheckbox",
	) as HTMLInputElement | null;
	setLoopCheckboxElement(loopCheckboxEl);

	const settingsToggleButton = document.getElementById(
		"settingsToggleButton",
	) as HTMLButtonElement | null;
	const settingsPanel = document.getElementById("settingsPanel");
	const voicevoxPortInput = document.getElementById(
		"voicevoxPortInput",
	) as HTMLInputElement | null;
	const voicevoxNemoPortInput = document.getElementById(
		"voicevoxNemoPortInput",
	) as HTMLInputElement | null;
	const frequencyTopPercentInput = document.getElementById(
		"frequencyTopPercentInput",
	) as HTMLInputElement | null;
	const settingsResetButton = document.getElementById(
		"settingsResetButton",
	) as HTMLButtonElement | null;

	const applySettingsToInputs = () => {
		const s = getCurrentSettings();
		if (voicevoxPortInput) voicevoxPortInput.value = String(s.voicevoxPort);
		if (voicevoxNemoPortInput)
			voicevoxNemoPortInput.value = String(s.voicevoxNemoPort);
		if (frequencyTopPercentInput)
			frequencyTopPercentInput.value = String(s.frequencyTopPercent);
	};
	applySettingsToInputs();

	const refreshStylesAfterPortChange = () => {
		clearAudioCache();
		void fetchVoiceStyles(styleSelect ?? null, speakerStyleSelect ?? null);
	};

	if (settingsToggleButton && settingsPanel) {
		settingsToggleButton.addEventListener("click", () => {
			const isHidden = settingsPanel.hidden;
			settingsPanel.hidden = !isHidden;
			settingsToggleButton.setAttribute("aria-expanded", String(isHidden));
		});
	}

	if (voicevoxPortInput) {
		voicevoxPortInput.addEventListener("change", () => {
			const port = Number(voicevoxPortInput.value);
			if (Number.isInteger(port) && port >= 1 && port <= 65535) {
				setVoicevoxPort(port);
				refreshStylesAfterPortChange();
			} else {
				applySettingsToInputs();
			}
		});
	}

	if (voicevoxNemoPortInput) {
		voicevoxNemoPortInput.addEventListener("change", () => {
			const port = Number(voicevoxNemoPortInput.value);
			if (Number.isInteger(port) && port >= 1 && port <= 65535) {
				setVoicevoxNemoPort(port);
				refreshStylesAfterPortChange();
			} else {
				applySettingsToInputs();
			}
		});
	}

	if (frequencyTopPercentInput) {
		frequencyTopPercentInput.addEventListener("change", () => {
			const pct = Number(frequencyTopPercentInput.value);
			if (Number.isFinite(pct) && pct >= 0.1 && pct <= 100) {
				setFrequencyTopPercent(pct);
			} else {
				applySettingsToInputs();
			}
		});
	}

	if (settingsResetButton) {
		settingsResetButton.addEventListener("click", () => {
			resetSettings();
			applySettingsToInputs();
			refreshStylesAfterPortChange();
		});
	}

	const applyStyleSelection = (styleId: number) => {
		setSelectedStyleId(styleId);
		if (styleSelect) {
			styleSelect.value = String(styleId);
		}
		populateSpeakerStyleSelect(speakerStyleSelect, styleId);
	};
	const applyRandomStyleSelection = () => {
		const randomStyleId = selectRandomStyleId();
		applyStyleSelection(randomStyleId);
		return randomStyleId;
	};

	if (loopCheckboxEl) {
		loopCheckboxEl.addEventListener("change", () => {
			if (
				loopCheckboxEl.checked &&
				!appState.isProcessing &&
				!isPlaybackActive() &&
				!isPlayRequestPending()
			) {
				void handlePlay();
			}
		});
	}

	setStyleChangeHandler((styleId) => {
		applyStyleSelection(styleId);
	});

	if (playButton) {
		playButton.addEventListener("click", handlePlayButtonClick);
		setPlayButtonAppearance("play");
		playButton.focus();
	}

	if (textArea) {
		textArea.addEventListener("input", scheduleAutoPlay);
	}

	if (exportButton) {
		exportButton.addEventListener("click", downloadLastAudio);
		updateExportButtonState(exportButton);
	}

	if (styleSelect) {
		populateStyleSelect(styleSelect);
		styleSelect.addEventListener("change", () => {
			const parsed = Number(styleSelect.value);
			if (!Number.isNaN(parsed)) {
				applyStyleSelection(parsed);
				scheduleAutoPlay();
			}
		});
		applyStyleSelection(getSelectedStyleId());
	}

	if (randomStyleCheckbox) {
		randomStyleCheckbox.addEventListener("change", () => {
			if (randomStyleCheckbox.checked) {
				applyRandomStyleSelection();
			}
			scheduleAutoPlay();
		});
	}

	if (speakerStyleSelect) {
		speakerStyleSelect.addEventListener("change", () => {
			const parsed = Number(speakerStyleSelect.value);
			if (!Number.isNaN(parsed)) {
				applyStyleSelection(parsed);
				scheduleAutoPlay();
			}
		});
	}
	void fetchVoiceStyles(styleSelect ?? null, speakerStyleSelect ?? null).then(
		(success) => {
			if (success) {
				showStatus(
					"ローカルサーバーとの通信成功。音声合成の準備ができました",
					"success",
				);
				scheduleHideStatus(5000);
			} else {
				alert("ローカルVOICEVOXサーバーを起動してください");
			}
			if (randomStyleCheckbox?.checked) {
				applyRandomStyleSelection();
			}
		},
	);

	if (delimiterInput) {
		try {
			const savedDelimiter = localStorage.getItem(DELIMITER_STORAGE_KEY);
			if (savedDelimiter !== null) {
				delimiterInput.value = savedDelimiter;
			}
		} catch (error) {
			console.warn("Failed to restore delimiter config:", error);
		}

		const saveDelimiter = () => {
			try {
				localStorage.setItem(DELIMITER_STORAGE_KEY, delimiterInput.value);
			} catch (error) {
				console.warn("Failed to save delimiter config:", error);
			}
		};
		const scheduleSaveDelimiter = () => {
			if (delimiterSaveTimer !== null) {
				window.clearTimeout(delimiterSaveTimer);
			}
			delimiterSaveTimer = window.setTimeout(
				saveDelimiter,
				AUTO_PLAY_DEBOUNCE_MS,
			);
		};
		delimiterInput.addEventListener("input", scheduleSaveDelimiter);
	}

	if (usageToggleButton && usagePanel) {
		usageToggleButton.addEventListener("click", () => {
			const isHidden = usagePanel.hidden;
			usagePanel.hidden = !isHidden;
			usageToggleButton.setAttribute("aria-expanded", String(isHidden));
		});
	}

	if (favoritesToggleButton && favoritesPanel) {
		favoritesPanel.hidden = true;
		favoritesToggleButton.setAttribute("aria-expanded", "false");
		favoritesToggleButton.addEventListener("click", () => {
			const isHidden = favoritesPanel.hidden;
			favoritesPanel.hidden = !isHidden;
			favoritesToggleButton.setAttribute("aria-expanded", String(isHidden));
		});
	}

	initializeTextLists({
		favoritesList: favoritesListEl,
		historyList: historyListEl,
		onSelectText: setTextAndPlay,
	});

	initializeIntonationElements({
		canvas: intonationCanvas,
		timingEl: intonationTimingEl,
		labelsEl: intonationLabelsEl,
		maxValueEl: intonationMaxValueEl,
		minValueEl: intonationMinValueEl,
		favoritesListEl: intonationFavoritesListEl,
		loopCheckbox: loopCheckboxEl,
	});

	const updateSpectrogramScaleLabel = () => {
		if (spectrogramScaleToggle) {
			const scale = getSpectrogramScale();
			const isLogScale = scale === "log";
			const nextLabel = isLogScale ? "リニアにする" : "対数にする";
			spectrogramScaleToggle.textContent = nextLabel;
			spectrogramScaleToggle.setAttribute("aria-pressed", String(isLogScale));
			spectrogramScaleToggle.setAttribute(
				"aria-label",
				`スペクトログラムのスケールを${nextLabel}`,
			);
		}
	};

	if (spectrogramScaleToggle) {
		updateSpectrogramScaleLabel();
		spectrogramScaleToggle.addEventListener("click", () => {
			const nextScale: FrequencyScale =
				getSpectrogramScale() === "linear" ? "log" : "linear";
			setSpectrogramScale(nextScale);
			updateSpectrogramScaleLabel();
		});
	}

	const updateIntonationKeyboardToggle = () => {
		if (intonationKeyboardToggle) {
			const enabled = getIntonationKeyboardEnabled();
			intonationKeyboardToggle.textContent = enabled
				? "キーボード操作: ON"
				: "キーボード操作: OFF";
			intonationKeyboardToggle.setAttribute("aria-pressed", String(enabled));
			intonationKeyboardToggle.setAttribute(
				"aria-label",
				enabled ? "キーボード操作を無効にする" : "キーボード操作を有効にする",
			);
		}
	};

	if (intonationKeyboardToggle) {
		updateIntonationKeyboardToggle();
		intonationKeyboardToggle.addEventListener("click", () => {
			setIntonationKeyboardEnabled(!getIntonationKeyboardEnabled());
			updateIntonationKeyboardToggle();
			if (getIntonationKeyboardEnabled() && intonationCanvas) {
				intonationCanvas.focus();
			}
			refreshIntonationChart();
		});
	}

	if (intonationResetButton) {
		intonationResetButton.addEventListener("click", () => {
			resetIntonationToInitial();
			if (getIntonationKeyboardEnabled() && intonationCanvas) {
				intonationCanvas.focus();
			}
		});
	}

	if (intonationFavoriteButton) {
		intonationFavoriteButton.addEventListener("click", () =>
			saveCurrentIntonationFavorite(getSelectedStyleId()),
		);
	}

	if (intonationExpandTop) {
		intonationExpandTop.addEventListener("click", () =>
			adjustIntonationScale("top", 2),
		);
	}
	if (intonationShrinkTop) {
		intonationShrinkTop.addEventListener("click", () =>
			adjustIntonationScale("top", 0.5),
		);
	}
	if (intonationShrinkBottom) {
		intonationShrinkBottom.addEventListener("click", () =>
			adjustIntonationScale("bottom", 0.5),
		);
	}
	if (intonationExpandBottom) {
		intonationExpandBottom.addEventListener("click", () =>
			adjustIntonationScale("bottom", 2),
		);
	}

	if (intonationCanvas) {
		intonationCanvas.addEventListener(
			"pointerdown",
			handleIntonationPointerDown,
		);
		intonationCanvas.addEventListener(
			"pointermove",
			handleIntonationPointerMove,
		);
		intonationCanvas.addEventListener(
			"pointerleave",
			handleIntonationPointerUp,
		);
		intonationCanvas.addEventListener(
			"pointercancel",
			handleIntonationPointerUp,
		);
		intonationCanvas.addEventListener(
			"lostpointercapture",
			handleIntonationPointerUp,
		);
		intonationCanvas.addEventListener("mousemove", handleIntonationMouseMove);
		intonationCanvas.addEventListener("mouseleave", handleIntonationMouseLeave);
		intonationCanvas.addEventListener("focus", () => {
			refreshIntonationChart();
		});
		window.addEventListener("keydown", handleIntonationKeyDown);
	}
	window.addEventListener("mouseup", handleIntonationPointerUp);
	window.addEventListener("pointerup", handleIntonationPointerUp);

	initializeVisualizationCanvases();
	initializeIntonationCanvas();
	window.addEventListener("resize", () => {
		initializeVisualizationCanvases();
		initializeIntonationCanvas();
		refreshIntonationChart();
	});
});

{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
0bef236 Update issue notes for issue #117
ce04c3a Merge pull request #134 from cat2151/copilot/fix-a-z-guide-display
5fad59a fix: move a-z guide below mora text in intonation labels to prevent overlap
02c0d28 Initial plan
7bdd001 Merge pull request #133 from cat2151/copilot/refactor-large-files-detection
703a639 fix: address PR review comments in spectrogramCache.ts and visualization.ts
67ada71 refactor: split intonation.ts and visualization.ts below 500 lines
2b33a0b Initial plan
396e84f Merge pull request #131 from cat2151/copilot/add-settings-button-top-right
84ae4e3 fix: address PR review comments

### 変更されたファイル:
.github/check-large-files.toml
index.html
issue-notes/110.md
issue-notes/117.md
src/audio.ts
src/config.ts
src/intonation.ts
src/intonationDisplay.ts
src/intonationHandlers.ts
src/intonationPlayback.ts
src/main.ts
src/playback.test.ts
src/playback.ts
src/settings.test.ts
src/settings.ts
src/styleManager.test.ts
src/styleManager.ts
src/styles/base.css
src/styles/intonation.css
src/visualization.ts
src/visualization/fftOverlay.ts
src/visualization/spectrogramCache.ts


---
Generated at: 2026-03-02 07:01:33 JST
