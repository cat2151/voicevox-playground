Last updated: 2026-02-12


# プロジェクト概要生成プロンプト（来訪者向け）

## 生成するもの：
- projectを3行で要約する
- プロジェクトで使用されている技術スタックをカテゴリ別に整理して説明する
- プロジェクト全体のファイル階層ツリー（ディレクトリ構造を図解）
- プロジェクト全体のファイルそれぞれの説明
- プロジェクト全体の関数それぞれの説明
- プロジェクト全体の関数の呼び出し階層ツリー

## 生成しないもの：
- Issues情報（開発者向け情報のため）
- 次の一手候補（開発者向け情報のため）
- ハルシネーションしそうなもの（例、存在しない機能や計画を勝手に妄想する等）

## 出力フォーマット：
以下のMarkdown形式で出力してください：

```markdown
# Project Overview

## プロジェクト概要
[以下の形式で3行でプロジェクトを要約]
- [1行目の説明]
- [2行目の説明]
- [3行目の説明]

## 技術スタック
[使用している技術をカテゴリ別に整理して説明]
- フロントエンド: [フロントエンド技術とその説明]
- 音楽・オーディオ: [音楽・オーディオ関連技術とその説明]
- 開発ツール: [開発支援ツールとその説明]
- テスト: [テスト関連技術とその説明]
- ビルドツール: [ビルド・パース関連技術とその説明]
- 言語機能: [言語仕様・機能とその説明]
- 自動化・CI/CD: [自動化・継続的統合関連技術とその説明]
- 開発標準: [コード品質・統一ルール関連技術とその説明]

## ファイル階層ツリー
```
[プロジェクトのディレクトリ構造をツリー形式で表現]
```

## ファイル詳細説明
[各ファイルの役割と機能を詳細に説明]

## 関数詳細説明
[各関数の役割、引数、戻り値、機能を詳細に説明]

## 関数呼び出し階層ツリー
```
[関数間の呼び出し関係をツリー形式で表現]
```
```


以下のプロジェクト情報を参考にして要約を生成してください：

## プロジェクト情報
名前: voicevox-playground
説明: # voicevox-playground

**VOICEVOX ローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/voicevox-playground"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※このドキュメントは大部分がAI生成です。issueをagentに投げて生成させました。一部は人力で書いています。

## 機能

- VOICEVOXローカルHTTPサーバー（ポート50021）にリクエストを送信
- ずんだもんの音声で任意のテキストを読み上げ
- Tone.js v15を使用した音声再生
- GitHub Pagesにデプロイ

## 前提条件

VOICEVOXのローカルサーバーが起動していることが必要です。

1. [VOICEVOX](https://voicevox.hiroshiba.jp/)をダウンロードしてインストール
2. VOICEVOXエンジンを起動（ポート50021でHTTPサーバーが起動します）。GitHub Pages版（`https://cat2151.github.io/voicevox-playground/`）からアクセスする場合は、CORSを許可した状態で以下のコマンドを使用してください。

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io
   ```

   ローカル開発サーバー（`npm run dev` が提供する `http://localhost:5173`）からも利用する場合は、上記に続けて `http://localhost:5173` も追加してください。

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io http://localhost:5173
   ```

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

## デプロイ

GitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

1. リポジトリの Settings > Pages で、Source を "GitHub Actions" に設定
2. mainブランチにプッシュすると自動的にデプロイされます

## 使い方

1. VOICEVOXを起動
2. ブラウザでアプリケーションを開く
3. テキストエリアに読み上げたいテキストを入力
4. 「再生」ボタンをクリック

## 技術スタック

- TypeScript
- Vite
- Tone.js v15
- VOICEVOX API

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています

*Let VOICEVOX handle the talking.*


依存関係:
{
  "dependencies": {
    "tone": "^15.1.22"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vite": "^7.3.1"
  }
}

## ファイル階層ツリー
📄 .gitignore
📄 LICENSE
📖 README.ja.md
📖 README.md
📁 generated-docs/
🌐 index.html
📁 issue-notes/
  📖 18.md
  📖 22.md
  📖 23.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 27.md
  📖 30.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 main.ts
📊 tsconfig.json
📘 vite.config.ts

## ファイル詳細分析
**index.html** (402行, 12495バイト)
  - 関数: なし
  - インポート: なし

**src/main.ts** (1458行, 48638バイト)
  - 関数: showStatus, hideStatus, invalidateColorVariableCache, getColorVariable, prepareCanvas, fftRadix2, getHannWindow, estimateFrequencySeries, drawRenderedWaveform, drawRealtimeWaveform, determineSpectrogramCeiling, drawSpectrogram, initializeVisualizationCanvases, updateIntonationTiming, initializeIntonationCanvas, buildIntonationPointsFromQuery, renderIntonationLabels, drawIntonationChart, adjustIntonationScale, pitchFromY, findNearestIntonationPoint, applyPitchToQuery, scheduleIntonationPlayback, playUpdatedIntonation, fetchAndRenderIntonation, handleIntonationPointerDown, handleIntonationPointerMove, handleIntonationPointerUp, handleIntonationKeyDown, updateExportButtonState, downloadLastAudio, scheduleAutoPlay, getAudioQuery, synthesize, playAudio, handlePlay, drawTick, yToBin, triggerPlay, render, cleanup, updateSpectrogramScaleLabel, updateIntonationKeyboardToggle, if, for, catch
  - インポート: tone

**vite.config.ts** (9行, 137バイト)
  - 関数: なし
  - インポート: vite

## 関数呼び出し階層
- triggerPlay (src/main.ts)
  - showStatus (src/main.ts)
    - hideStatus ()
      - invalidateColorVariableCache ()
      - getColorVariable ()
      - prepareCanvas ()
      - fftRadix2 ()
      - getHannWindow ()
      - estimateFrequencySeries ()
      - drawRenderedWaveform ()
      - drawRealtimeWaveform ()
      - determineSpectrogramCeiling ()
      - drawSpectrogram ()
      - initializeVisualizationCanvases ()
      - updateIntonationTiming ()
      - initializeIntonationCanvas ()
      - buildIntonationPointsFromQuery ()
      - renderIntonationLabels ()
      - drawIntonationChart ()
      - adjustIntonationScale ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - applyPitchToQuery ()
      - scheduleIntonationPlayback ()
      - playUpdatedIntonation ()
      - fetchAndRenderIntonation ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationKeyDown ()
      - updateExportButtonState ()
      - downloadLastAudio ()
      - scheduleAutoPlay ()
      - getAudioQuery ()
      - synthesize ()
      - playAudio ()
      - handlePlay ()
      - drawTick ()
      - yToBin ()
      - render ()
      - cleanup ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
- if (src/main.ts)
- for (src/main.ts)
- catch (src/main.ts)


## プロジェクト構造（ファイル一覧）
README.ja.md
README.md
index.html
issue-notes/18.md
issue-notes/22.md
issue-notes/23.md
issue-notes/24.md
issue-notes/25.md
issue-notes/26.md
issue-notes/27.md
issue-notes/30.md
package-lock.json
package.json
src/main.ts
tsconfig.json
vite.config.ts

上記の情報を基に、プロンプトで指定された形式でプロジェクト概要を生成してください。
特に以下の点を重視してください：
- 技術スタックは各カテゴリごとに整理して説明
- ファイル階層ツリーは提供された構造をそのまま使用
- ファイルの説明は各ファイルの実際の内容と機能に基づく
- 関数の説明は実際に検出された関数の役割に基づく
- 関数呼び出し階層は実際の呼び出し関係に基づく


---
Generated at: 2026-02-12 07:05:14 JST
