Last updated: 2026-02-16

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
- 様々なキャラクターの音声を選択し、任意のテキストを読み上げることが可能です。
- さらに、生成された音声のイントネーションを詳細に編集する機能を提供します。

## 技術スタック
- フロントエンド: **TypeScript** (型安全なJavaScriptのスーパーセット), **Vite** (高速な開発サーバーとバンドラー)
- 音楽・オーディオ: **Tone.js v15** (Web Audio APIをラップした高機能な音楽フレームワーク), **VOICEVOX API** (音声合成エンジンとの連携インターフェース)
- 開発ツール: **TypeScript** (開発言語), **Vite** (開発サーバー), **vitest** (ユニットテストフレームワーク), **jsdom** (Node.jsでDOM環境をシミュレート), **@types/jsdom** (jsdomのTypeScript型定義), **@biomejs/biome** (コードフォーマッター・リンター)
- テスト: **vitest** (高速なテストランナー), **jsdom** (ブラウザ環境のシミュレーション), **@types/jsdom** (jsdomの型定義)
- ビルドツール: **Vite** (開発サーバー、ビルドツール)
- 言語機能: **TypeScript** (静的型付けによる堅牢な開発)
- 自動化・CI/CD: **GitHub Actions** (README翻訳の自動化に使用)
- 開発標準: **@biomejs/biome** (コードの整形、Linting)

## ファイル階層ツリー
```
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
  📖 107.md
  📖 108.md
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
  📖 97.md
  📖 99.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 intonationDisplay.ts
  📘 intonationPlayback.ts
  📘 intonationState.ts
  📘 intonationUtils.ts
  📘 main.ts
  📘 playback.test.ts
  📘 playback.ts
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
    📘 fftOverlay.ts
    📘 spectrogram.ts
    📘 timeAxis.ts
    📘 waveform.ts
  📘 visualization.test.ts
  📘 visualization.ts
  📘 vite-env.d.ts
📊 tsconfig.json
📘 vite.config.ts
```

## ファイル詳細説明
- **`.gitignore`**: Gitによるバージョン管理から除外するファイルやディレクトリを指定します。
- **`AGENTS.md`**: プロジェクトに関するエージェントや関係者についての情報が含まれる可能性があります。
- **`LICENSE`**: プロジェクトのライセンス情報が記載されています。
- **`README.ja.md`**: プロジェクトの日本語版説明書です。概要、機能、使い方などが記述されています。
- **`README.md`**: プロジェクトの英語版説明書です。日本語版から自動生成されます。
- **`biome.json`**: Biome.jsの設定ファイルで、コードのフォーマットやリントのルールを定義します。
- **`index.html`**: WebアプリケーションのエントリポイントとなるHTMLファイルです。UIの基本構造を定義します。
- **`issue-notes/`**: 開発中のイシューに関するメモや詳細情報が格納されているディレクトリです。（来訪者向けのため個別のファイル説明は省略します。）
- **`package-lock.json`**: `package.json`に記述された依存関係の正確なバージョンと依存ツリーを記録し、ビルドの一貫性を保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、スクリプト、依存関係など）を定義するファイルです。
- **`src/audio.ts`**: VOICEVOX APIを介して音声クエリの取得、音声データの合成、WAV形式へのエンコードなど、音声処理に関する主要な機能を提供します。
- **`src/config.ts`**: アプリケーション全体で使用される設定値（例：VOICEVOXサーバーのURLなど）を定義します。
- **`src/intonation.test.ts`**: `src/intonation.ts`の機能に関する単体テストを記述します。
- **`src/intonation.ts`**: イントネーション編集UIの初期化、イベントハンドリング、ピッチの適用、お気に入り管理など、イントネーション関連の主要なロジックを管理します。
- **`src/intonationDisplay.ts`**: イントネーションの視覚表示（チャートの描画、ピッチレンジの計算、スケール調整など）に関するロジックを担当します。
- **`src/intonationPlayback.ts`**: イントネーション編集後の音声再生スケジューリング、キャッシュされた音声の再生、VOICEVOXからの音声取得とレンダリングを行います。
- **`src/intonationState.ts`**: イントネーション編集の状態管理、特にタイミング情報の更新に関する機能を提供します。
- **`src/intonationUtils.ts`**: イントネーション関連のユーティリティ関数（例：AudioQueryの構造検証、クローンなど）を定義します。
- **`src/main.ts`**: アプリケーションのメインエントリポイントで、初期化処理、スタイル選択の適用、テキスト読み上げのトリガーなど、UIとロジックの連携を調整します。
- **`src/playback.test.ts`**: `src/playback.ts`の音声再生機能に関する単体テストを記述します。
- **`src/playback.ts`**: 音声の再生、一時停止、ダウンロード、自動再生スケジューリング、再生ボタンの状態管理など、全体の再生制御を担います。
- **`src/state.ts`**: アプリケーションのグローバルな状態を管理するための定義を提供します。
- **`src/status.ts`**: アプリケーションのステータス表示（メッセージの表示/非表示、色の管理など）を制御します。
- **`src/styleManager.test.ts`**: `src/styleManager.ts`のスタイル管理機能に関する単体テストを記述します。
- **`src/styleManager.ts`**: VOICEVOXの音声スタイル（話者、スタイルID）の取得、選択、表示、区切り文字設定の解析などを管理します。
- **`src/styles/base.css`**: アプリケーション全体の基本的なCSSスタイルを定義します。
- **`src/styles/intonation.css`**: イントネーション編集UIに特化したCSSスタイルを定義します。
- **`src/styles.css`**: スタイルシートのメインインデックス（`base.css`と`intonation.css`をインポート）。
- **`src/textLists.test.ts`**: `src/textLists.ts`のテキストリスト管理機能に関する単体テストを記述します。
- **`src/textLists.ts`**: ユーザーが入力したテキストの履歴やお気に入りリストを管理し、永続化する機能を提供します。
- **`src/uiControls.ts`**: エクスポートボタンの状態更新など、特定のUI要素の制御に関する機能を提供します。
- **`src/visualization/canvas.ts`**: HTML Canvas要素の準備と基本的な描画ユーティリティを提供します。
- **`src/visualization/fft.ts`**: 高速フーリエ変換 (FFT) アルゴリズムの実装と関連ユーティリティを提供します。
- **`src/visualization/fftMaxFreq.ts`**: FFTの結果から最大周波数を検出するロジックを提供します。
- **`src/visualization/fftOverlay.ts`**: リアルタイムFFTスペクトラムをキャンバスに描画する機能を提供します。
- **`src/visualization/spectrogram.ts`**: 音声のスペクトログラム表示（色マッピング、周波数推定、描画など）に関する複雑な処理を扱います。
- **`src/visualization/timeAxis.ts`**: 音声波形の時間軸のラベル表示やティックの描画に関する機能を提供します。
- **`src/visualization/waveform.ts`**: 音声波形（レンダリング済みおよびリアルタイム）の描画、統計計算、相関分析などの機能を提供します。
- **`src/visualization.test.ts`**: `src/visualization.ts`の視覚化機能に関する単体テストを記述します。
- **`src/visualization.ts`**: 音声の視覚化全体を調整し、スペクトログラムのスケーリング、再生中の進行状況表示、クリーンアップなどを管理します。
- **`src/vite-env.d.ts`**: Vite環境の型定義ファイルです。
- **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルです。
- **`vite.config.ts`**: Viteのビルド設定ファイルです。

## 関数詳細説明
- **`getAudioQuery()` (src/audio.ts)**: VOICEVOXサーバーから音声合成のためのクエリ情報を取得します。
- **`synthesize()` (src/audio.ts)**: 音声クエリとスタイルIDに基づいて、VOICEVOXサーバーで音声を合成します。
- **`combineAudioBuffers()` (src/audio.ts)**: 複数のAudioBufferを結合して一つの連続した音声データを作成します。
- **`encodeAudioBufferToWav()` (src/audio.ts)**: AudioBufferの内容をWAV形式のバイナリデータにエンコードします。
- **`writeString()` (src/audio.ts)**: （おそらく内部ヘルパー関数）文字列をバッファに書き込みます。
- **`clamp()` (src/audio.ts)**: 数値を指定された最小値と最大値の範囲に制限します。
- **`dedupeIntonationFavorites()` (src/intonation.ts)**: イントネーションのお気に入りリストから重複エントリを削除します。
- **`loadIntonationFavorites()` (src/intonation.ts)**: ローカルストレージからイントネーションのお気に入りリストを読み込みます。
- **`persistIntonationFavorites()` (src/intonation.ts)**: イントネーションのお気に入りリストをローカルストレージに保存します。
- **`disableLoopOnIntonationEdit()` (src/intonation.ts)**: イントネーション編集中にループ再生を無効化します。
- **`resetIntonationState()` (src/intonation.ts)**: イントネーションの状態を初期値にリセットします。
- **`setStyleChangeHandler()` (src/intonation.ts)**: スタイル変更時のハンドラーを設定します。
- **`initializeIntonationElements()` (src/intonation.ts)**: イントネーション編集に関連するDOM要素を初期化します。
- **`isIntonationDirty()` (src/intonation.ts)**: 現在のイントネーションが保存されているものと異なるか（変更があるか）を判定します。
- **`setIntonationKeyboardEnabled()` (src/intonation.ts)**: イントネーション編集のキーボード操作を有効/無効にします。
- **`getIntonationKeyboardEnabled()` (src/intonation.ts)**: イントネーション編集のキーボード操作が有効かどうかを取得します。
- **`applyPitchToQuery()` (src/intonation.ts)**: 編集されたピッチ情報を音声クエリに適用します。
- **`applyPitchEdit()` (src/intonation.ts)**: イントネーションチャート上で行われたピッチ編集を適用し、状態を更新します。
- **`handleIntonationPointerDown()` (src/intonation.ts)**: イントネーションチャートでのポインタ押下イベントを処理します。
- **`handleIntonationPointerMove()` (src/intonation.ts)**: イントネーションチャートでのポインタ移動イベントを処理します。
- **`handleIntonationPointerUp()` (src/intonation.ts)**: イントネーションチャートでのポインタ離上イベントを処理します。
- **`handleIntonationKeyDown()` (src/intonation.ts)**: イントネーションチャートでのキーボード押下イベントを処理します。
- **`renderIntonationFavoritesList()` (src/intonation.ts)**: お気に入りイントネーションリストをUIに描画します。
- **`removeIntonationFavorite()` (src/intonation.ts)**: お気に入りリストから指定されたイントネーションを削除します。
- **`applyIntonationFavorite()` (src/intonation.ts)**: お気に入りリストからイントネーションを選択し、現在の状態に適用します。
- **`saveCurrentIntonationFavorite()` (src/intonation.ts)**: 現在のイントネーションの状態をお気に入りとして保存します。
- **`refreshIntonationChart()` (src/intonation.ts)**: イントネーションチャートの表示を更新します。
- **`getPitchRange()` (src/intonationDisplay.ts)**: ピッチの表示範囲を取得します。
- **`calculateBasePadding()` (src/intonationDisplay.ts)**: イントネーション表示の基本パディングを計算します。
- **`getBaseDisplayRange()` (src/intonationDisplay.ts)**: イントネーションの基準表示範囲を計算します。
- **`calculateDisplayRange()` (src/intonationDisplay.ts)**: イントネーションの表示範囲を計算します。
- **`clampRangeExtra()` (src/intonationDisplay.ts)**: 表示範囲の追加値をクランプします。
- **`applyRangeExtra()` (src/intonationDisplay.ts)**: 表示範囲に調整を適用します。
- **`refreshDisplayRange()` (src/intonationDisplay.ts)**: 表示範囲を更新します。
- **`clampPitchToDisplayRange()` (src/intonationDisplay.ts)**: ピッチ値を表示範囲にクランプします。
- **`calculateStepSize()` (src/intonationDisplay.ts)**: イントネーション編集のステップサイズを計算します。
- **`calculateLetterKeyAdjustment()` (src/intonationDisplay.ts)**: キーボード操作によるピッチ調整量を計算します。
- **`handleIntonationWheel()` (src/intonationDisplay.ts)**: イントネーションチャートでのホイールイベントを処理します。
- **`ensureWheelHandler()` (src/intonationDisplay.ts)**: ホイールイベントハンドラーが適切に設定されていることを確認します。
- **`updateInitialRangeFromPoints()` (src/intonationDisplay.ts)**: ポイントから初期表示範囲を更新します。
- **`initializeIntonationCanvas()` (src/intonationDisplay.ts)**: イントネーション表示用のキャンバスを初期化します。
- **`buildIntonationPointsFromQuery()` (src/intonationDisplay.ts)**: 音声クエリからイントネーション表示用のポイントを構築します。
- **`renderIntonationLabels()` (src/intonationDisplay.ts)**: イントネーションチャートのラベルを描画します。
- **`drawIntonationChart()` (src/intonationDisplay.ts)**: イントネーションチャート全体を描画します。
- **`adjustIntonationScale()` (src/intonationDisplay.ts)**: イントネーションのスケールを調整します。
- **`pitchFromY()` (src/intonationDisplay.ts)**: Y座標からピッチ値を計算します。
- **`findNearestIntonationPoint()` (src/intonationDisplay.ts)**: 指定座標に最も近いイントネーションポイントを見つけます。
- **`scheduleIntonationPlayback()` (src/intonationPlayback.ts)**: イントネーション編集後の音声再生をスケジュールします。
- **`replayCachedIntonationAudio()` (src/intonationPlayback.ts)**: キャッシュされたイントネーション音声を再生します。
- **`playUpdatedIntonation()` (src/intonationPlayback.ts)**: 更新されたイントネーションで音声を再生します。
- **`fetchAndRenderIntonation()` (src/intonationPlayback.ts)**: VOICEVOXからイントネーションデータを取得し、UIにレンダリングします。
- **`resetIntonationToInitial()` (src/intonationPlayback.ts)**: イントネーション表示を初期状態にリセットします。
- **`updateIntonationTiming()` (src/intonationState.ts)**: イントネーションのタイミング情報を更新します。
- **`isValidAudioQueryShape()` (src/intonationUtils.ts)**: AudioQueryオブジェクトの構造が有効であるかを検証します。
- **`cloneAudioQuery()` (src/intonationUtils.ts)**: AudioQueryオブジェクトをディープクローンします。
- **`applyStyleSelection()` (src/main.ts)**: 選択されたスタイルをアプリケーションに適用します。
- **`applyRandomStyleSelection()` (src/main.ts)**: ランダムなスタイルを適用します。
- **`saveDelimiter()` (src/main.ts)**: 区切り文字設定を保存します。
- **`scheduleSaveDelimiter()` (src/main.ts)**: 区切り文字設定の保存をスケジュールします。
- **`updateSpectrogramScaleLabel()` (src/main.ts)**: スペクトログラムのスケール表示を更新します。
- **`updateIntonationKeyboardToggle()` (src/main.ts)**: イントネーションキーボードのトグル状態を更新します。
- **`setLoopCheckboxElement()` (src/playback.ts)**: ループ再生チェックボックス要素を設定します。
- **`setPlayButtonAppearance()` (src/playback.ts)**: 再生ボタンの見た目を更新します。
- **`isPlayRequestPending()` (src/playback.ts)**: 再生リクエストが保留中かどうかを判定します。
- **`stopPlaybackAndResetLoop()` (src/playback.ts)**: 再生を停止し、ループ状態をリセットします。
- **`getAudioCacheKey()` (src/playback.ts)**: 音声キャッシュのためのキーを生成します。
- **`setTextAndPlay()` (src/playback.ts)**: 指定されたテキストで音声を合成し、再生を開始します。
- **`downloadLastAudio()` (src/playback.ts)**: 最後に再生された音声をダウンロードします。
- **`scheduleAutoPlay()` (src/playback.ts)**: 自動再生をスケジュールします。
- **`confirmResetIntonationBeforePlay()` (src/playback.ts)**: 再生前にイントネーションのリセットが必要かを確認します。
- **`handlePlayButtonClick()` (src/playback.ts)**: 再生ボタンクリックイベントを処理します。
- **`handlePlay()` (src/playback.ts)**: 音声再生を開始するための主要な処理を実行します。
- **`clearRealtimeWaveformCanvas()` (src/playback.ts)**: リアルタイム波形表示キャンバスをクリアします。
- **`triggerPlay()` (src/playback.ts)**: 音声再生をトリガーします。
- **`cleanup()` (src/playback.ts)**: 再生後のクリーンアップ処理を実行します。
- **`handleReset()` (src/playback.ts)**: リセットボタンクリックイベントを処理します。
- **`handleCancel()` (src/playback.ts)**: キャンセルボタンクリックイベントを処理します。
- **`showStatus()` (src/status.ts)**: ステータスメッセージを表示します。
- **`hideStatus()` (src/status.ts)**: ステータスメッセージを非表示にします。
- **`scheduleHideStatus()` (src/status.ts)**: 指定時間後にステータスメッセージを非表示にするようスケジュールします。
- **`invalidateColorVariableCache()` (src/status.ts)**: 色変数のキャッシュを無効化します。
- **`getColorVariable()` (src/status.ts)**: CSSカスタムプロパティから色変数の値を取得します。
- **`getSelectedStyleId()` (src/styleManager.ts)**: 現在選択されているスタイルIDを取得します。
- **`setSelectedStyleId()` (src/styleManager.ts)**: スタイルIDを設定します。
- **`selectRandomStyleId()` (src/styleManager.ts)**: ランダムなスタイルIDを選択します。
- **`getStyleLabel()` (src/styleManager.ts)**: スタイルIDに対応するラベルを取得します。
- **`getStyleById()` (src/styleManager.ts)**: スタイルIDに基づいてスタイル情報を取得します。
- **`getSpeakerStylesByStyleId()` (src/styleManager.ts)**: 指定されたスタイルIDに属する話者スタイルを取得します。
- **`resolveStyleMarker()` (src/styleManager.ts)**: スタイルマーカーを解決します。
- **`parseDelimiterConfig()` (src/styleManager.ts)**: 区切り文字設定を解析します。
- **`addSegment()` (src/styleManager.ts)**: テキストセグメントを追加します。
- **`buildTextSegments()` (src/styleManager.ts)**: テキスト入力から音声合成用のセグメントを構築します。
- **`populateStyleSelect()` (src/styleManager.ts)**: スタイル選択ドロップダウンをVOICEVOXのスタイルで埋めます。
- **`populateSpeakerStyleSelect()` (src/styleManager.ts)**: 話者スタイル選択ドロップダウンを埋めます。
- **`fetchVoiceStyles()` (src/styleManager.ts)**: VOICEVOXサーバーから利用可能な音声スタイル（話者、スタイル）のリストを取得します。
- **`loadStoredList()` (src/textLists.ts)**: ローカルストレージから保存されたテキストリストを読み込みます。
- **`persistList()` (src/textLists.ts)**: 指定されたテキストリストをローカルストレージに保存します。
- **`persistLists()` (src/textLists.ts)**: 全てのテキストリスト（履歴、お気に入りなど）をローカルストレージに保存します。
- **`dedupeAndLimit()` (src/textLists.ts)**: リスト内の重複エントリを削除し、指定された制限数に調整します。
- **`renderList()` (src/textLists.ts)**: 指定されたリストをUIに描画します。
- **`renderTextLists()` (src/textLists.ts)**: 履歴とお気に入り両方のテキストリストをUIに描画します。
- **`moveToFavorites()` (src/textLists.ts)**: テキストを履歴からお気に入りリストに移動します。
- **`moveToHistory()` (src/textLists.ts)**: テキストをお気に入りから履歴リストに移動します。
- **`addToHistory()` (src/textLists.ts)**: 指定されたテキストを履歴リストに追加します。
- **`initializeTextLists()` (src/textLists.ts)**: テキストリスト機能を初期化します。
- **`updateExportButtonState()` (src/uiControls.ts)**: エクスポートボタンの有効/無効状態を更新します。
- **`prepareCanvas()` (src/visualization/canvas.ts)**: 指定されたCanvas要素を初期化し、描画コンテキストを取得します。
- **`getHannWindow()` (src/visualization/fft.ts)**: ハニング窓関数を生成します。
- **`fftRadix2()` (src/visualization/fft.ts)**: ラディックス2の高速フーリエ変換 (FFT) を実行します。
- **`getMaxFreqByThreshold()` (src/visualization/fftMaxFreq.ts)**: 指定されたしきい値に基づいてFFT結果から最大周波数を取得します。
- **`drawRealtimeFFT()` (src/visualization/fftOverlay.ts)**: リアルタイムのFFTスペクトラムをキャンバスに描画します。
- **`lerpColor()` (src/visualization/spectrogram.ts)**: 2つの色間で線形補間を実行します。
- **`mapIntensityToSpectrogramColor()` (src/visualization/spectrogram.ts)**: 音声強度をスペクトログラムの色にマッピングします。
- **`determineSpectrogramCeiling()` (src/visualization/spectrogram.ts)**: スペクトログラムの表示上限周波数を決定します。
- **`estimateFundamentalFrequency()` (src/visualization/spectrogram.ts)**: 音声から基本周波数（ピッチ）を推定します。
- **`analyzeSpectrogramFrames()` (src/visualization/spectrogram.ts)**: スペクトログラムのフレームごとに音声を分析します。
- **`drawSpectrogram()` (src/visualization/spectrogram.ts)**: スペクトログラムをキャンバスに描画します。
- **`drawOfflineSpectrogram()` (src/visualization/spectrogram.ts)**: オフライン（事前に計算済み）のスペクトログラムを描画します。
- **`computeAudioContentHash()` (src/visualization/spectrogram.ts)**: 音声コンテンツのハッシュを計算します。
- **`buildSpectrogramSignature()` (src/visualization/spectrogram.ts)**: スペクトログラムのシグネチャを構築します。
- **`processChunk()` (src/visualization/spectrogram.ts)**: 音声データをチャンクごとに処理します。
- **`formatTimeLabel()` (src/visualization/timeAxis.ts)**: 時間ラベルを整形します。
- **`buildTimeTicks()` (src/visualization/timeAxis.ts)**: 時間軸の目盛りを構築します。
- **`drawTimeTicks()` (src/visualization/timeAxis.ts)**: 時間軸の目盛りをキャンバスに描画します。
- **`computeSegmentStats()` (src/visualization/waveform.ts)**: 音声セグメントの統計情報を計算します。
- **`computeSegmentCorrelation()` (src/visualization/waveform.ts)**: 音声セグメント間の相関を計算します。
- **`extractAlignedRealtimeSegment()` (src/visualization/waveform.ts)**: 位置合わせされたリアルタイム音声セグメントを抽出します。
- **`drawRenderedWaveform()` (src/visualization/waveform.ts)**: レンダリングされた音声波形をキャンバスに描画します。
- **`drawRealtimeWaveformBackground()` (src/visualization/waveform.ts)**: リアルタイム波形の背景を描画します。
- **`drawRealtimeWaveformOnly()` (src/visualization/waveform.ts)**: リアルタイム波形のみをキャンバスに描画します。
- **`getSpectrogramScale()` (src/visualization.ts)**: スペクトログラムの現在のスケールを取得します。
- **`setSpectrogramScale()` (src/visualization.ts)**: スペクトログラムのスケールを設定します。
- **`requestSpectrogramReset()` (src/visualization.ts)**: スペクトログラムのリセットを要求します。
- **`isPlaybackActive()` (src/visualization.ts)**: 音声再生がアクティブかどうかを判定します。
- **`stopActivePlayback()` (src/visualization.ts)**: アクティブな音声再生を停止します。
- **`initializeVisualizationCanvases()` (src/visualization.ts)**: 視覚化用の全てのキャンバスを初期化します。
- **`playAudio()` (src/visualization.ts)**: 音声再生を開始します。
- **`setProgressPosition()` (src/visualization.ts)**: 再生進行バーの位置を設定します。
- **`updateProgressLines()` (src/visualization.ts)**: 再生進行を示すラインを更新します。
- **`clearProgressLines()` (src/visualization.ts)**: 再生進行ラインをクリアします。
- **`requestSpectrogramDraw()` (src/visualization.ts)**: スペクトログラムの描画を要求します。
- **`render()` (src/visualization.ts)**: 視覚化要素をレンダリングします。
- **`cleanup()` (src/visualization.ts)**: 視覚化関連のクリーンアップ処理を実行します。
- **`finalize()` (src/visualization.ts)**: 視覚化の最終処理を実行します。
- **`stopPlayback()` (src/visualization.ts)**: 視覚化を伴う再生を停止します。

## 関数呼び出し階層ツリー
```
- if (src/audio.ts)
  - getAudioQuery (src/audio.ts)
    - synthesize ()
      - combineAudioBuffers ()
      - encodeAudioBufferToWav ()
      - writeString ()
      - clamp ()
  - dedupeIntonationFavorites (src/intonation.ts)
    - loadIntonationFavorites ()
      - persistIntonationFavorites ()
      - disableLoopOnIntonationEdit ()
      - resetIntonationState ()
      - setStyleChangeHandler ()
      - initializeIntonationElements ()
      - isIntonationDirty ()
      - setIntonationKeyboardEnabled ()
      - getIntonationKeyboardEnabled ()
      - applyPitchToQuery ()
      - applyPitchEdit ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationKeyDown ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - saveCurrentIntonationFavorite ()
      - refreshIntonationChart ()
      - getBaseDisplayRange ()
      - applyRangeExtra ()
      - refreshDisplayRange ()
      - clampPitchToDisplayRange ()
      - calculateLetterKeyAdjustment ()
      - ensureWheelHandler ()
      - updateInitialRangeFromPoints ()
      - buildIntonationPointsFromQuery ()
      - drawIntonationChart ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - scheduleIntonationPlayback ()
      - replayCachedIntonationAudio ()
      - playUpdatedIntonation ()
      - updateIntonationTiming ()
      - isValidAudioQueryShape ()
      - cloneAudioQuery ()
      - showStatus ()
      - scheduleHideStatus ()
  - getPitchRange (src/intonationDisplay.ts)
    - calculateBasePadding ()
      - calculateDisplayRange ()
      - clampRangeExtra ()
      - calculateStepSize ()
      - handleIntonationWheel ()
      - initializeIntonationCanvas ()
      - renderIntonationLabels ()
      - adjustIntonationScale ()
      - getColorVariable ()
  - fetchAndRenderIntonation ()
    - resetIntonationToInitial ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - applyStyleSelection (src/main.ts)
    - applyRandomStyleSelection ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
      - setLoopCheckboxElement ()
      - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - scheduleAutoPlay ()
      - handlePlay ()
      - getSelectedStyleId ()
      - setSelectedStyleId ()
      - selectRandomStyleId ()
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
      - confirmResetIntonationBeforePlay ()
      - handlePlayButtonClick ()
      - clearRealtimeWaveformCanvas ()
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
  - prepareCanvas (src/visualization/canvas.ts)
  - getHannWindow (src/visualization/fft.ts)
    - fftRadix2 ()
      - getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)
  - drawRealtimeFFT (src/visualization/fftOverlay.ts)
  - lerpColor (src/visualization/spectrogram.ts)
    - mapIntensityToSpectrogramColor ()
      - determineSpectrogramCeiling ()
      - estimateFundamentalFrequency ()
      - analyzeSpectrogramFrames ()
      - drawSpectrogram ()
      - drawOfflineSpectrogram ()
      - computeAudioContentHash ()
      - buildSpectrogramSignature ()
      - processChunk ()
      - drawTimeTicks ()
  - formatTimeLabel (src/visualization/timeAxis.ts)
    - buildTimeTicks ()
  - computeSegmentStats (src/visualization/waveform.ts)
    - computeSegmentCorrelation ()
      - extractAlignedRealtimeSegment ()
      - drawRealtimeWaveformBackground ()
      - drawRealtimeWaveformOnly ()
  - catch (src/audio.ts)
  - setProgressPosition ()
    - updateProgressLines ()
      - clearProgressLines ()
      - requestSpectrogramDraw ()
      - render ()
      - finalize ()
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)
- stopPlayback (src/visualization.ts)
```

---
Generated at: 2026-02-16 07:02:25 JST
