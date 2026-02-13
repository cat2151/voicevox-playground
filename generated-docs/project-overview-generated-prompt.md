Last updated: 2026-02-14


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
    "jsdom": "^28.0.0",
    "typescript": "^5.9.3",
    "vite": "^7.3.1",
    "vitest": "^4.0.18"
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
  📖 22.md
  📖 23.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 27.md
  📖 30.md
  📖 45.md
  📖 51.md
  📖 56.md
  📖 62.md
  📖 64.md
  📖 65.md
  📖 66.md
  📖 67.md
  📖 68.md
  📖 72.md
  📖 74.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 main.ts
  📘 playback.test.ts
  📘 playback.ts
  📘 state.ts
  📘 status.ts
  📘 styleManager.test.ts
  📘 styleManager.ts
  📘 textLists.test.ts
  📘 textLists.ts
  📘 uiControls.ts
  📘 visualization.ts
📊 tsconfig.json
📘 vite.config.ts

## ファイル詳細分析
**index.html** (672行, 20502バイト)
  - 関数: なし
  - インポート: なし

**src/audio.ts** (125行, 4172バイト)
  - 関数: getAudioQuery, synthesize, combineAudioBuffers, encodeAudioBufferToWav, writeString, clamp, if, catch, for
  - インポート: ./config

**src/config.ts** (82行, 2014バイト)
  - 関数: なし
  - インポート: なし

**src/intonation.test.ts** (17行, 600バイト)
  - 関数: なし
  - インポート: vitest, ./intonation

**src/intonation.ts** (881行, 30118バイト)
  - 関数: isValidAudioQueryShape, cloneAudioQuery, dedupeIntonationFavorites, loadIntonationFavorites, persistIntonationFavorites, updateIntonationTiming, disableLoopOnIntonationEdit, getPitchRange, calculateBasePadding, getBaseDisplayRange, calculateDisplayRange, getMinimumAllowedExtra, applyRangeExtra, refreshDisplayRange, clampPitchToDisplayRange, calculateStepSize, handleIntonationWheel, updateInitialRangeFromPoints, resetIntonationState, setStyleChangeHandler, initializeIntonationElements, isIntonationDirty, setIntonationKeyboardEnabled, getIntonationKeyboardEnabled, initializeIntonationCanvas, buildIntonationPointsFromQuery, renderIntonationLabels, drawIntonationChart, adjustIntonationScale, pitchFromY, findNearestIntonationPoint, applyPitchToQuery, scheduleIntonationPlayback, replayCachedIntonationAudio, playUpdatedIntonation, fetchAndRenderIntonation, resetIntonationToInitial, handleIntonationPointerDown, handleIntonationPointerMove, handleIntonationPointerUp, handleIntonationKeyDown, renderIntonationFavoritesList, removeIntonationFavorite, applyIntonationFavorite, saveCurrentIntonationFavorite, refreshIntonationChart, for, catch, if
  - インポート: tone, ./audio, ./status

**src/main.ts** (292行, 10801バイト)
  - 関数: applyStyleSelection, saveDelimiter, scheduleSaveDelimiter, updateSpectrogramScaleLabel, updateIntonationKeyboardToggle, if, catch
  - インポート: ./config, ./textLists, ./state

**src/playback.test.ts** (32行, 962バイト)
  - 関数: なし
  - インポート: vitest, ./playback

**src/playback.ts** (326行, 10331バイト)
  - 関数: setLoopCheckboxElement, setPlayButtonAppearance, isPlayRequestPending, stopPlaybackAndResetLoop, getAudioCacheKey, setTextAndPlay, downloadLastAudio, scheduleAutoPlay, confirmResetIntonationBeforePlay, handlePlayButtonClick, handlePlay, triggerPlay, cleanup, handleReset, handleCancel, if, for, catch
  - インポート: tone, ./config, ./textLists

**src/state.ts** (6行, 156バイト)
  - 関数: なし
  - インポート: なし

**src/status.ts** (63行, 1896バイト)
  - 関数: showStatus, hideStatus, scheduleHideStatus, invalidateColorVariableCache, getColorVariable, if
  - インポート: なし

**src/styleManager.test.ts** (117行, 3745バイト)
  - 関数: なし
  - インポート: vitest, jsdom, ./config

**src/styleManager.ts** (210行, 6482バイト)
  - 関数: getSelectedStyleId, setSelectedStyleId, getStyleLabel, getStyleById, getSpeakerStylesByStyleId, resolveStyleMarker, parseDelimiterConfig, addSegment, buildTextSegments, populateStyleSelect, populateSpeakerStyleSelect, fetchVoiceStyles, if, while, catch
  - インポート: なし

**src/textLists.test.ts** (66行, 2492バイト)
  - 関数: なし
  - インポート: vitest, ./config, ./textLists

**src/textLists.ts** (136行, 4254バイト)
  - 関数: loadStoredList, persistList, persistLists, dedupeAndLimit, renderList, renderTextLists, moveToFavorites, moveToHistory, addToHistory, initializeTextLists, catch, for, if
  - インポート: ./config

**src/uiControls.ts** (8行, 234バイト)
  - 関数: updateExportButtonState, if
  - インポート: ./state

**src/visualization.ts** (865行, 28032バイト)
  - 関数: getSpectrogramScale, setSpectrogramScale, requestSpectrogramReset, isPlaybackActive, stopActivePlayback, prepareCanvas, fftRadix2, getHannWindow, lerpColor, mapIntensityToSpectrogramColor, estimateFrequencySeries, drawRenderedWaveform, drawRealtimeWaveform, determineSpectrogramCeiling, estimateFundamentalFrequency, computeSegmentStats, computeSegmentCorrelation, extractAlignedRealtimeSegment, drawSpectrogram, initializeVisualizationCanvases, playAudio, updateProgressLines, clearProgressLines, render, cleanup, finalize, stopPlayback, if, for
  - インポート: tone, ./status

**vite.config.ts** (9行, 137バイト)
  - 関数: なし
  - インポート: vite

## 関数呼び出し階層
- if (src/audio.ts)
  - getAudioQuery (src/audio.ts)
    - synthesize ()
      - combineAudioBuffers ()
      - encodeAudioBufferToWav ()
      - writeString ()
      - clamp ()
  - isValidAudioQueryShape (src/intonation.ts)
    - cloneAudioQuery ()
      - dedupeIntonationFavorites ()
      - loadIntonationFavorites ()
      - persistIntonationFavorites ()
      - updateIntonationTiming ()
      - disableLoopOnIntonationEdit ()
      - getPitchRange ()
      - calculateBasePadding ()
      - getBaseDisplayRange ()
      - calculateDisplayRange ()
      - getMinimumAllowedExtra ()
      - applyRangeExtra ()
      - refreshDisplayRange ()
      - clampPitchToDisplayRange ()
      - calculateStepSize ()
      - handleIntonationWheel ()
      - updateInitialRangeFromPoints ()
      - resetIntonationState ()
      - setStyleChangeHandler ()
      - initializeIntonationElements ()
      - isIntonationDirty ()
      - setIntonationKeyboardEnabled ()
      - getIntonationKeyboardEnabled ()
      - initializeIntonationCanvas ()
      - buildIntonationPointsFromQuery ()
      - renderIntonationLabels ()
      - drawIntonationChart ()
      - adjustIntonationScale ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - applyPitchToQuery ()
      - scheduleIntonationPlayback ()
      - replayCachedIntonationAudio ()
      - playUpdatedIntonation ()
      - fetchAndRenderIntonation ()
      - resetIntonationToInitial ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationKeyDown ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - saveCurrentIntonationFavorite ()
      - refreshIntonationChart ()
      - showStatus ()
      - scheduleHideStatus ()
      - getColorVariable ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - applyStyleSelection (src/main.ts)
    - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
      - setLoopCheckboxElement ()
      - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - handlePlay ()
      - getSelectedStyleId ()
      - setSelectedStyleId ()
      - populateStyleSelect ()
      - populateSpeakerStyleSelect ()
      - fetchVoiceStyles ()
      - initializeTextLists ()
      - getSpectrogramScale ()
      - setSpectrogramScale ()
      - requestSpectrogramReset ()
      - isPlaybackActive ()
  - stopPlaybackAndResetLoop ()
    - getAudioCacheKey ()
      - setTextAndPlay ()
      - downloadLastAudio ()
      - scheduleAutoPlay ()
      - confirmResetIntonationBeforePlay ()
      - handlePlayButtonClick ()
      - cleanup ()
      - handleCancel ()
      - parseDelimiterConfig ()
      - buildTextSegments ()
      - addToHistory ()
      - stopActivePlayback ()
  - hideStatus ()
    - invalidateColorVariableCache ()
  - getStyleLabel ()
    - getStyleById ()
      - getSpeakerStylesByStyleId ()
      - resolveStyleMarker ()
      - addSegment ()
  - loadStoredList (src/textLists.ts)
    - persistList ()
      - persistLists ()
      - dedupeAndLimit ()
      - renderList ()
      - renderTextLists ()
      - moveToFavorites ()
      - moveToHistory ()
  - prepareCanvas ()
    - fftRadix2 ()
      - getHannWindow ()
      - lerpColor ()
      - mapIntensityToSpectrogramColor ()
      - estimateFrequencySeries ()
      - drawRealtimeWaveform ()
      - determineSpectrogramCeiling ()
      - estimateFundamentalFrequency ()
      - computeSegmentStats ()
      - computeSegmentCorrelation ()
      - extractAlignedRealtimeSegment ()
      - drawSpectrogram ()
      - updateProgressLines ()
      - clearProgressLines ()
      - render ()
      - finalize ()
- catch (src/audio.ts)
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)
- stopPlayback (src/visualization.ts)


## プロジェクト構造（ファイル一覧）
README.ja.md
README.md
index.html
issue-notes/22.md
issue-notes/23.md
issue-notes/24.md
issue-notes/25.md
issue-notes/26.md
issue-notes/27.md
issue-notes/30.md
issue-notes/45.md
issue-notes/51.md
issue-notes/56.md
issue-notes/62.md
issue-notes/64.md
issue-notes/65.md
issue-notes/66.md
issue-notes/67.md
issue-notes/68.md
issue-notes/72.md
issue-notes/74.md
package-lock.json
package.json
src/audio.ts
src/config.ts
src/intonation.test.ts
src/intonation.ts
src/main.ts
src/playback.test.ts
src/playback.ts
tsconfig.json

上記の情報を基に、プロンプトで指定された形式でプロジェクト概要を生成してください。
特に以下の点を重視してください：
- 技術スタックは各カテゴリごとに整理して説明
- ファイル階層ツリーは提供された構造をそのまま使用
- ファイルの説明は各ファイルの実際の内容と機能に基づく
- 関数の説明は実際に検出された関数の役割に基づく
- 関数呼び出し階層は実際の呼び出し関係に基づく


---
Generated at: 2026-02-14 07:06:07 JST
