Last updated: 2026-03-10


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


依存関係:
{
  "dependencies": {
    "tone": "^15.1.22"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.3.15",
    "@types/jsdom": "^27.0.0",
    "jsdom": "^27.0.0",
    "typescript": "^5.9.3",
    "vite": "^7.3.1",
    "vitest": "^4.0.18"
  }
}

## ファイル階層ツリー
📄 .gitignore
📖 AGENTS.md
📄 LICENSE
📖 README.ja.md
📖 README.md
📊 biome.json
📁 generated-docs/
🌐 index.html
📁 issue-notes/
  📖 100.md
  📖 110.md
  📖 111.md
  📖 113.md
  📖 115.md
  📖 116.md
  📖 117.md
  📖 118.md
  📖 119.md
  📖 120.md
  📖 121.md
  📖 122.md
  📖 123.md
  📖 138.md
  📖 140.md
  📖 159.md
  📖 22.md
  📖 23.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 27.md
  📖 30.md
  📖 45.md
  📖 56.md
  📖 62.md
  📖 64.md
  📖 65.md
  📖 66.md
  📖 67.md
  📖 68.md
  📖 72.md
  📖 74.md
  📖 79.md
  📖 80.md
  📖 89.md
  📖 92.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📁 intonation/
    📘 display.ts
    📘 favorites.ts
    📘 handlers.test.ts
    📘 handlers.ts
    📘 playback.test.ts
    📘 playback.ts
    📘 setup.ts
    📘 state.ts
    📘 utils.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 main.ts
  📁 playback/
    📘 audioCache.ts
    📘 confirmDialog.ts
  📘 playback.test.ts
  📘 playback.truncation.test.ts
  📘 playback.ts
  📘 settings.test.ts
  📘 settings.ts
  📘 settingsPanel.test.ts
  📘 settingsPanel.ts
  📘 state.ts
  📘 status.ts
  📘 styleManager.test.ts
  📘 styleManager.ts
  📁 styles/
    🎨 base.css
    🎨 intonation.css
  🎨 styles.css
  📘 textLists.test.ts
  📘 textLists.ts
  📘 uiControls.ts
  📁 visualization/
    📘 canvas.ts
    📘 fft.ts
    📘 fftMaxFreq.ts
    📘 fftOverlay.test.ts
    📘 fftOverlay.ts
    📘 fftUtils.ts
    📘 spectrogram.ts
    📘 spectrogramCache.ts
    📘 timeAxis.ts
    📘 waveform.ts
  📘 visualization.test.ts
  📘 visualization.ts
  📘 vite-env.d.ts
📊 tsconfig.json
📘 vite.config.ts

## ファイル詳細分析
**index.html** (207行, 9664バイト)
  - 関数: なし
  - インポート: なし

**src/audio.ts** (152行, 4117バイト)
  - 関数: getAudioQuery, synthesize, combineAudioBuffers, encodeAudioBufferToWav, writeString, clamp, if, catch, for
  - インポート: ./config

**src/config.ts** (93行, 2103バイト)
  - 関数: なし
  - インポート: なし

**src/intonation/display.ts** (435行, 12612バイト)
  - 関数: getPitchRange, calculateBasePadding, getBaseDisplayRange, calculateDisplayRange, clampRangeExtra, applyRangeExtra, refreshDisplayRange, clampPitchToDisplayRange, calculateStepSize, calculateLetterKeyAdjustment, handleIntonationWheel, ensureWheelHandler, updateInitialRangeFromPoints, initializeIntonationCanvas, buildIntonationPointsFromQuery, renderIntonationLabels, updateHoveredLabel, drawIntonationChart, adjustIntonationScale, pitchFromY, findNearestIntonationPoint, refreshIntonationChart, if, for
  - インポート: ../config, ../status, ./state

**src/intonation/favorites.ts** (268行, 8013バイト)
  - 関数: dedupeIntonationFavorites, parseIntonationFavoritesArray, loadIntonationFavorites, persistIntonationFavorites, renderIntonationFavoritesList, removeIntonationFavorite, applyIntonationFavorite, exportIntonationFavorites, importIntonationFavorites, saveCurrentIntonationFavorite, for, catch, if
  - インポート: ../status, ./state, ./utils

**src/intonation/handlers.test.ts** (193行, 6201バイト)
  - 関数: makeKeyEvent, enableKeyboard
  - インポート: vitest, ./handlers, ./state

**src/intonation/handlers.ts** (268行, 8346バイト)
  - 関数: disableLoopOnIntonationEdit, applyPitchToQuery, applyPitchEdit, handleIntonationPointerDown, handleIntonationPointerMove, handleIntonationPointerUp, handleIntonationMouseMove, handleIntonationMouseLeave, handleIntonationKeyDown, if
  - インポート: ./state

**src/intonation/playback.test.ts** (126行, 3569バイト)
  - 関数: なし
  - インポート: vitest, ./playback, ./state

**src/intonation/playback.ts** (236行, 7364バイト)
  - 関数: scheduleIntonationPlayback, replayCachedIntonationAudio, showPlaybackStatus, buildSynthesisCacheKey, playUpdatedIntonation, fetchAndRenderIntonation, resetIntonationToInitial, if, catch
  - インポート: tone, ../config, ../audio

**src/intonation/setup.ts** (185行, 6083バイト)
  - 関数: initializeIntonationElements, setupIntonationCanvasEvents, initializeIntonationControls, updateIntonationKeyboardToggle, if
  - インポート: ./state, ./playback, ../styleManager

**src/intonation/state.ts** (131行, 4217バイト)
  - 関数: updateIntonationTiming, getIntonationKeyboardEnabled, setIntonationKeyboardEnabled, resetIntonationState, if
  - インポート: なし

**src/intonation/utils.ts** (14行, 388バイト)
  - 関数: isValidAudioQueryShape, cloneAudioQuery
  - インポート: ../config

**src/intonation.test.ts** (395行, 12794バイト)
  - 関数: if
  - インポート: vitest, ./intonation/state, ./intonation/playback

**src/intonation.ts** (80行, 1922バイト)
  - 関数: setStyleChangeHandler, setHandlePlayHandler, isIntonationDirty, isIntonationActive, hasActiveIntonationQuery
  - インポート: ./intonation/state

**src/main.ts** (49行, 1518バイト)
  - 関数: なし
  - インポート: ./settings, ./settingsPanel, ./textLists

**src/playback/audioCache.ts** (26行, 646バイト)
  - 関数: clearAudioCache, getAudioCacheKey, getCachedAudio, setCachedAudio, if
  - インポート: ../config

**src/playback/confirmDialog.ts** (51行, 1643バイト)
  - 関数: confirmResetIntonationBeforePlay, cleanup, handleReset, handleCancel, if
  - インポート: なし

**src/playback.test.ts** (409行, 12589バイト)
  - 関数: なし
  - インポート: vitest, ./visualization

**src/playback.truncation.test.ts** (198行, 5892バイト)
  - 関数: makeDOM
  - インポート: vitest, ./playback, ./config

**src/playback.ts** (489行, 12758バイト)
  - 関数: setLoopCheckboxElement, setPlayButtonAppearance, isPlayRequestPending, stopPlaybackAndResetLoop, setTextAndPlay, downloadLastAudio, scheduleAutoPlay, handlePlayButtonClick, handlePlay, clearRealtimeWaveformCanvas, initializePlaybackControls, triggerPlay, if, for, catch
  - インポート: tone, ./config, ./textLists

**src/settings.test.ts** (227行, 5948バイト)
  - 関数: なし
  - インポート: vitest

**src/settings.ts** (96行, 2721バイト)
  - 関数: loadSettings, saveSettings, resetSettings, getVoicevoxApiBase, getVoicevoxNemoApiBase, getFrequencyTopPercent, getCurrentSettings, setVoicevoxPort, setVoicevoxNemoPort, setFrequencyTopPercent, if, catch
  - インポート: なし

**src/settingsPanel.test.ts** (315行, 8232バイト)
  - 関数: makeInput, makeButton, makePanel, fireChange
  - インポート: vitest, ./settingsPanel, ./playback

**src/settingsPanel.ts** (127行, 3700バイト)
  - 関数: initializeSettingsPanelFromDOM, initializeSettingsPanel, applySettingsToInputs, refreshStylesAfterPortChange, if
  - インポート: ./playback, ./styleManager

**src/state.ts** (6行, 153バイト)
  - 関数: なし
  - インポート: なし

**src/status.ts** (72行, 1856バイト)
  - 関数: showStatus, hideStatus, scheduleHideStatus, invalidateColorVariableCache, getColorVariable, if
  - インポート: なし

**src/styleManager.test.ts** (263行, 7060バイト)
  - 関数: なし
  - インポート: vitest, jsdom

**src/styleManager.ts** (386行, 10158バイト)
  - 関数: getSelectedStyleId, setSelectedStyleId, selectRandomStyleId, getStyleLabel, getStyleById, getApiBaseForStyleId, getSpeakerStylesByStyleId, resolveStyleMarker, parseDelimiterConfig, addSegment, buildTextSegments, populateStyleSelect, populateSpeakerStyleSelect, fetchVoiceStyles, applyStyleSelection, initializeStyleControls, if, while, for
  - インポート: ./settings, ./status

**src/styles/base.css** (492行, 9359バイト)
  - 関数: なし
  - インポート: なし

**src/styles/intonation.css** (138行, 2508バイト)
  - 関数: なし
  - インポート: なし

**src/styles.css** (3行, 64バイト)
  - 関数: なし
  - インポート: なし

**src/textLists.test.ts** (91行, 2505バイト)
  - 関数: なし
  - インポート: vitest, ./textLists

**src/textLists.ts** (152行, 4361バイト)
  - 関数: loadStoredList, persistList, persistLists, dedupeAndLimit, renderList, renderTextLists, moveToFavorites, moveToHistory, addToHistory, initializeTextLists, catch, for, if
  - インポート: なし

**src/uiControls.ts** (77行, 2227バイト)
  - 関数: updateExportButtonState, initializePanelToggles, initializeDelimiterInput, saveDelimiter, if, catch
  - インポート: ./config, ./state

**src/visualization/canvas.ts** (22行, 687バイト)
  - 関数: prepareCanvas, if
  - インポート: なし

**src/visualization/fft.ts** (62行, 1581バイト)
  - 関数: getHannWindow, fftRadix2, if, for
  - インポート: なし

**src/visualization/fftMaxFreq.ts** (69行, 1897バイト)
  - 関数: getMaxFreqByThreshold, fftRadix2, for, if
  - インポート: なし

**src/visualization/fftOverlay.test.ts** (65行, 1757バイト)
  - 関数: for
  - インポート: vitest, ./fftOverlay

**src/visualization/fftOverlay.ts** (266行, 6274バイト)
  - 関数: drawRealtimeFFT, getTopFreqInfo, findPeakPosition, drawPeakLine, drawFFTLine, drawTopBinLine, drawPeakLabel, if, for
  - インポート: ./canvas, ../status, ../settings

**src/visualization/fftUtils.ts** (49行, 965バイト)
  - 関数: xToFreq, freqToBinF, getInterpolatedValue, fftValueToY
  - インポート: なし

**src/visualization/spectrogram.ts** (383行, 10525バイト)
  - 関数: lerpColor, mapIntensityToSpectrogramColor, determineSpectrogramCeiling, analyzeSpectrogramFrames, drawSpectrogram, drawSpectrogramColumn, drawOfflineSpectrogram, computeAudioContentHash, buildSpectrogramSignature, processChunk, for, if
  - インポート: ../config, ../status, ./canvas

**src/visualization/spectrogramCache.ts** (194行, 5673バイト)
  - 関数: getSpectrogramScale, setSpectrogramScale, requestSpectrogramReset, createSpectrogramImageCache, analyzeAndCacheSpectrogram, handleSpectrogramInitialization, resetSpectrogramCaches, if
  - インポート: ../config, ../status, ./canvas

**src/visualization/timeAxis.ts** (79行, 2033バイト)
  - 関数: formatTimeLabel, buildTimeTicks, drawTimeTicks, if, for
  - インポート: ../status

**src/visualization/waveform.ts** (233行, 6858バイト)
  - 関数: computeSegmentStats, computeSegmentCorrelation, extractAlignedRealtimeSegment, drawRenderedWaveform, drawRealtimeWaveformBackground, drawRealtimeWaveformOnly, for, if
  - インポート: ../config, ../status, ./canvas

**src/visualization.test.ts** (70行, 2068バイト)
  - 関数: constructor
  - インポート: vitest

**src/visualization.ts** (395行, 10666バイト)
  - 関数: isPlaybackActive, stopActivePlayback, initializeVisualizationCanvases, clearWaveformCanvas, playAudio, setProgressPosition, updateProgressLines, clearProgressLines, drawRealtimeVisuals, handleSpectrogramDraw, cleanupPlayback, requestSpectrogramDraw, render, finalize, stopPlayback, initializeSpectrogramScaleToggle, updateLabel, if
  - インポート: tone, ./config, ./status

**src/vite-env.d.ts** (2行, 38バイト)
  - 関数: なし
  - インポート: なし

**vite.config.ts** (9行, 136バイト)
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
  - getPitchRange (src/intonation/display.ts)
    - calculateBasePadding ()
      - getBaseDisplayRange ()
      - calculateDisplayRange ()
      - clampRangeExtra ()
      - applyRangeExtra ()
      - refreshDisplayRange ()
      - clampPitchToDisplayRange ()
      - calculateStepSize ()
      - calculateLetterKeyAdjustment ()
      - handleIntonationWheel ()
      - ensureWheelHandler ()
      - updateInitialRangeFromPoints ()
      - initializeIntonationCanvas ()
      - buildIntonationPointsFromQuery ()
      - renderIntonationLabels ()
      - updateHoveredLabel ()
      - drawIntonationChart ()
      - adjustIntonationScale ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - refreshIntonationChart ()
      - getColorVariable ()
  - dedupeIntonationFavorites (src/intonation/favorites.ts)
    - parseIntonationFavoritesArray ()
      - loadIntonationFavorites ()
      - persistIntonationFavorites ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - exportIntonationFavorites ()
      - importIntonationFavorites ()
      - saveCurrentIntonationFavorite ()
      - playUpdatedIntonation ()
      - isValidAudioQueryShape ()
      - cloneAudioQuery ()
      - showStatus ()
      - scheduleHideStatus ()
      - stopActivePlayback ()
  - disableLoopOnIntonationEdit (src/intonation/handlers.ts)
    - applyPitchToQuery ()
      - applyPitchEdit ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationMouseMove ()
      - handleIntonationMouseLeave ()
      - handleIntonationKeyDown ()
      - scheduleIntonationPlayback ()
      - replayCachedIntonationAudio ()
      - showPlaybackStatus ()
  - buildSynthesisCacheKey ()
    - fetchAndRenderIntonation ()
      - resetIntonationToInitial ()
      - updateIntonationTiming ()
      - getApiBaseForStyleId ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - initializeIntonationElements (src/intonation/setup.ts)
    - setupIntonationCanvasEvents ()
      - initializeIntonationControls ()
      - updateIntonationKeyboardToggle ()
      - getIntonationKeyboardEnabled ()
      - setIntonationKeyboardEnabled ()
      - getSelectedStyleId ()
  - resetIntonationState ()
  - setHandlePlayHandler ()
    - setStyleChangeHandler (src/intonation.ts)
      - isIntonationDirty ()
      - isIntonationActive ()
      - hasActiveIntonationQuery ()
  - clearAudioCache (src/playback/audioCache.ts)
    - getAudioCacheKey ()
      - getCachedAudio ()
      - setCachedAudio ()
  - confirmResetIntonationBeforePlay (src/playback/confirmDialog.ts)
    - cleanup ()
      - handleCancel ()
  - setLoopCheckboxElement (src/playback.ts)
    - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - stopPlaybackAndResetLoop ()
      - setTextAndPlay ()
      - downloadLastAudio ()
      - scheduleAutoPlay ()
      - handlePlayButtonClick ()
      - handlePlay ()
      - clearRealtimeWaveformCanvas ()
      - initializePlaybackControls ()
      - setSelectedStyleId ()
      - selectRandomStyleId ()
      - parseDelimiterConfig ()
      - buildTextSegments ()
      - populateSpeakerStyleSelect ()
      - addToHistory ()
      - isPlaybackActive ()
  - loadSettings (src/settings.ts)
    - saveSettings ()
      - resetSettings ()
      - getVoicevoxApiBase ()
      - getVoicevoxNemoApiBase ()
      - getFrequencyTopPercent ()
      - getCurrentSettings ()
      - setVoicevoxPort ()
      - setVoicevoxNemoPort ()
      - setFrequencyTopPercent ()
  - initializeSettingsPanelFromDOM (src/settingsPanel.ts)
    - initializeSettingsPanel ()
      - applySettingsToInputs ()
      - refreshStylesAfterPortChange ()
      - fetchVoiceStyles ()
  - hideStatus ()
    - invalidateColorVariableCache ()
  - getStyleLabel ()
    - getStyleById ()
      - getSpeakerStylesByStyleId ()
      - resolveStyleMarker ()
      - addSegment ()
      - populateStyleSelect ()
      - applyStyleSelection ()
      - initializeStyleControls ()
  - loadStoredList (src/textLists.ts)
    - persistList ()
      - persistLists ()
      - dedupeAndLimit ()
      - renderList ()
      - renderTextLists ()
      - moveToFavorites ()
      - moveToHistory ()
      - initializeTextLists ()
  - initializePanelToggles ()
    - initializeDelimiterInput ()
  - prepareCanvas (src/visualization/canvas.ts)
  - getHannWindow (src/visualization/fft.ts)
    - fftRadix2 ()
      - getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)
  - drawRealtimeFFT ()
    - getTopFreqInfo ()
      - findPeakPosition ()
      - drawPeakLine ()
      - drawFFTLine ()
      - drawTopBinLine ()
      - drawPeakLabel ()
      - xToFreq ()
      - freqToBinF ()
      - getInterpolatedValue ()
      - fftValueToY ()
  - lerpColor (src/visualization/spectrogram.ts)
    - mapIntensityToSpectrogramColor ()
      - determineSpectrogramCeiling ()
      - analyzeSpectrogramFrames ()
      - drawSpectrogram ()
      - drawSpectrogramColumn ()
      - drawOfflineSpectrogram ()
      - computeAudioContentHash ()
      - buildSpectrogramSignature ()
      - processChunk ()
      - drawTimeTicks ()
  - catch (src/audio.ts)
  - getSpectrogramScale (src/visualization/spectrogramCache.ts)
    - setSpectrogramScale ()
      - requestSpectrogramReset ()
      - createSpectrogramImageCache ()
      - analyzeAndCacheSpectrogram ()
      - handleSpectrogramInitialization ()
      - resetSpectrogramCaches ()
      - requestSpectrogramDraw ()
  - formatTimeLabel (src/visualization/timeAxis.ts)
    - buildTimeTicks ()
  - computeSegmentStats (src/visualization/waveform.ts)
    - computeSegmentCorrelation ()
      - extractAlignedRealtimeSegment ()
      - drawRealtimeWaveformBackground ()
      - drawRealtimeWaveformOnly ()
  - clearWaveformCanvas ()
    - setProgressPosition ()
      - updateProgressLines ()
      - clearProgressLines ()
      - drawRealtimeVisuals ()
      - handleSpectrogramDraw ()
      - cleanupPlayback ()
      - render ()
      - finalize ()
      - stopPlayback ()
      - initializeSpectrogramScaleToggle ()
      - updateLabel ()
- for (src/audio.ts)
- handleReset (src/playback/confirmDialog.ts)
- makeDOM (src/playback.truncation.test.ts)
- triggerPlay (src/playback.ts)
- while (src/styleManager.ts)
- saveDelimiter (src/uiControls.ts)


## プロジェクト構造（ファイル一覧）
AGENTS.md
README.ja.md
README.md
biome.json
index.html
issue-notes/100.md
issue-notes/110.md
issue-notes/111.md
issue-notes/113.md
issue-notes/115.md
issue-notes/116.md
issue-notes/117.md
issue-notes/118.md
issue-notes/119.md
issue-notes/120.md
issue-notes/121.md
issue-notes/122.md
issue-notes/123.md
issue-notes/138.md
issue-notes/140.md
issue-notes/159.md
issue-notes/22.md
issue-notes/23.md
issue-notes/24.md
issue-notes/25.md
issue-notes/26.md
issue-notes/27.md
issue-notes/30.md
issue-notes/45.md
issue-notes/56.md
package-lock.json

上記の情報を基に、プロンプトで指定された形式でプロジェクト概要を生成してください。
特に以下の点を重視してください：
- 技術スタックは各カテゴリごとに整理して説明
- ファイル階層ツリーは提供された構造をそのまま使用
- ファイルの説明は各ファイルの実際の内容と機能に基づく
- 関数の説明は実際に検出された関数の役割に基づく
- 関数呼び出し階層は実際の呼び出し関係に基づく


---
Generated at: 2026-03-10 07:03:46 JST
