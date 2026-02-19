Last updated: 2026-02-20

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
- 誰でも簡単にVOICEVOXクライアントアプリを開発できることを実証し、手軽な利用を可能にします。
- VOICEVOXサーバー起動済みであれば、Webページを開くだけで音声再生が可能な体験を提供します。

## 技術スタック
- フロントエンド: **Vite** (高速な開発サーバーとビルドツールを提供し、モダンなWebアプリケーション開発を支援), **TypeScript** (JavaScriptに静的型付けを追加し、大規模なWebアプリケーション開発における堅牢性と保守性を向上させます)
- 音楽・オーディオ: **Tone.js v15** (Web Audio APIを抽象化し、高度な音声処理と再生を容易にするJavaScriptフレームワーク), **VOICEVOX API** (VOICEVOXローカルサーバーと連携し、音声合成機能を提供します)
- 開発ツール: **Vite** (開発サーバー、ビルドツール), **TypeScript** (型チェック), **JSDOM** (Node.js環境でブラウザのDOM環境をシミュレートし、主にテスト実行に使用されます)
- テスト: **Vitest** (Viteプロジェクトに最適化された高速で機能豊富な単体テストフレームワーク)
- ビルドツール: **Vite** (Webアプリケーションのビルドプロセスを管理し、最適化されたバンドルを生成します)
- 言語機能: **TypeScript** (JavaScriptのスーパーセットとして、強力な型システムとESNextの機能を提供し、コードの品質と生産性を向上させます)
- 自動化・CI/CD: (プロジェクト情報には直接の記述がありませんが、GitHub Actionsによる自動翻訳が言及されており、継続的インテグレーションの一環として使用されている可能性があります)
- 開発標準: **Biome.js** (コードフォーマッターとリンターを統合し、コードの整形、バグの検出、一貫性の確保を通じて開発標準を維持します)

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
    📘 fftOverlay.test.ts
    📘 fftOverlay.ts
    📘 fftUtils.ts
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
- **index.html**: WebアプリケーションのエントリーポイントとなるHTMLファイルです。UIの基本的な構造を定義し、JavaScriptのエントリスクリプトを読み込みます。
- **src/audio.ts**: VOICEVOX APIと連携し、音声クエリの取得、音声合成、オーディオバッファの結合・エンコードといった音声データ処理のロジックを提供します。
- **src/config.ts**: VOICEVOXサーバーのURLや各種設定値、定数など、アプリケーション全体の構成情報を定義します。
- **src/intonation.test.ts**: `src/intonation.ts`で定義されたイントネーション（アクセント）編集機能に関するテストコードが含まれています。
- **src/intonation.ts**: VOICEVOXのイントネーション編集機能の中核を担います。アクセント句のピッチ調整、お気に入りイントネーションの管理、UI表示の更新ロジックなどを実装しています。
- **src/intonationDisplay.ts**: イントネーション編集チャートの描画とユーザーインタラクション（マウス操作、ホイール操作）処理を担当します。ピッチレンジの計算や表示範囲の調整も行います。
- **src/intonationPlayback.ts**: イントネーション編集後の音声再生を管理します。変更されたイントネーションを適用した音声のフェッチと再生、再生ステータスの表示などを行います。
- **src/intonationState.ts**: イントネーション編集の状態（現在のピッチポイント、タイミング情報など）を管理し、その更新ロジックを提供します。
- **src/intonationUtils.ts**: イントネーション関連の共通ユーティリティ関数（AudioQueryの形状検証、クローンなど）を提供します。
- **src/main.ts**: アプリケーションの初期化処理、主要なイベントリスナーの登録、スタイル選択の適用、スペクトログラムスケールの更新など、全体の調整を行うメインスクリプトです。
- **src/playback.test.ts**: `src/playback.ts`で定義された音声再生機能に関するテストコードが含まれています。
- **src/playback.ts**: 音声再生機能の制御（再生/停止、ループ、自動再生）、音声のダウンロード、再生状態の管理、再生前処理のロジックを実装しています。
- **src/state.ts**: アプリケーションのグローバルな状態を管理するためのシンプルなモジュールです。
- **src/status.ts**: ユーザーへのステータスメッセージの表示/非表示、表示のスケジュール管理、CSSカスタム変数のカラーキャッシュ管理などを行います。
- **src/styleManager.test.ts**: `src/styleManager.ts`で定義されたスタイル管理機能に関するテストコードが含まれています。
- **src/styleManager.ts**: VOICEVOXの利用可能なスタイル（話者、スタイル）情報の取得、選択、UIへの反映、テキストのセグメント化ロジックなどを管理します。
- **src/styles/base.css**: アプリケーション全体の基本的なレイアウト、フォント、カラーパレットなどを定義するベーススタイルシートです。
- **src/styles/intonation.css**: イントネーション編集チャートや関連UI要素のスタイリングを定義するスタイルシートです。
- **src/styles.css**: アプリケーション全体の主要なスタイルをインポート・定義するエントリスタイルシートです。
- **src/textLists.test.ts**: `src/textLists.ts`で定義されたテキストリスト機能に関するテストコードが含まれています。
- **src/textLists.ts**: ユーザーが入力したテキストの履歴やお気に入りリストを管理し、ローカルストレージへの永続化、UIへの描画、リスト操作ロジックを提供します。
- **src/uiControls.ts**: エクスポートボタンなど、特定のUIコントロールの状態（有効/無効）を更新する機能を提供します。
- **src/visualization/canvas.ts**: HTML `&lt;canvas&gt;` 要素の準備と基本的な設定を行うユーティリティ関数を提供します。
- **src/visualization/fft.ts**: 高速フーリエ変換（FFT）アルゴリズムの実装と、ハニング窓関数の生成機能を提供します。
- **src/visualization/fftMaxFreq.ts**: FFTデータから特定の閾値以上の最大周波数成分を検出する機能を提供します。
- **src/visualization/fftOverlay.test.ts**: `src/visualization/fftOverlay.ts`で定義されたFFTオーバーレイ表示機能に関するテストコードが含まれています。
- **src/visualization/fftOverlay.ts**: リアルタイムFFTデータをCanvasに描画し、ピーク周波数や最大周波数ビンなどの情報を視覚的に表示します。
- **src/visualization/fftUtils.ts**: FFTデータと表示を関連付けるユーティリティ関数（X座標から周波数、周波数からビン番号、FFT値からY座標変換など）を提供します。
- **src/visualization/spectrogram.ts**: 音声データのスペクトログラム（時間-周波数-強度グラフ）を生成し、Canvasに描画するロジックを実装しています。色マッピングや強度計算も行います。
- **src/visualization/timeAxis.ts**: 可視化チャートの時間軸（タイムライン）の目盛りとラベルを生成・描画する機能を提供します。
- **src/visualization/waveform.ts**: 音声の波形を描画する機能、リアルタイム波形の抽出と表示、音声セグメントの統計計算などを提供します。
- **src/visualization.test.ts**: `src/visualization.ts`で定義された音声可視化機能全般に関するテストコードが含まれています。
- **src/visualization.ts**: 音声可視化機能（波形、スペクトログラム、FFT）を統括します。Canvasの初期化、再生中のリアルタイム更新、プログレスバーの管理、再生の開始/停止ロジックを含みます。

## 関数詳細説明
- `getAudioQuery(text: string, speaker: number)` (src/audio.ts): VOICEVOX APIから指定されたテキストと話者スタイルに基づいた音声クエリを取得します。
- `synthesize(query: AudioQuery, speaker: number)` (src/audio.ts): 取得した音声クエリと話者スタイルを用いて、VOICEVOX APIで音声合成を行い、WAV形式の音声データ（ArrayBuffer）を返します。
- `combineAudioBuffers(buffers: AudioBuffer[])` (src/audio.ts): 複数のAudioBufferを結合し、一つのAudioBufferとして返します。
- `encodeAudioBufferToWav(audioBuffer: AudioBuffer)` (src/audio.ts): AudioBufferをWAV形式のBlobデータにエンコードします。
- `writeString(view: DataView, offset: number, s: string)` (src/audio.ts): DataViewに文字列を書き込み、次の書き込みオフセットを返します。
- `clamp(value: number, min: number, max: number)` (src/audio.ts): 指定された値を最小値と最大値の間にクランプ（制限）します。
- `dedupeIntonationFavorites(favorites: IntonationFavorite[])` (src/intonation.ts): イントネーションのお気に入りリストから重複エントリを削除します。
- `loadIntonationFavorites()` (src/intonation.ts): ローカルストレージからイントネーションのお気に入りリストを読み込みます。
- `persistIntonationFavorites(favorites: IntonationFavorite[])` (src/intonation.ts): イントネーションのお気に入りリストをローカルストレージに保存します。
- `disableLoopOnIntonationEdit()` (src/intonation.ts): イントネーション編集中にループ再生を無効にします。
- `resetIntonationState()` (src/intonation.ts): イントネーション関連の状態を初期化します。
- `setStyleChangeHandler(handler: Function)` (src/intonation.ts): スタイル変更時のハンドラを設定します。
- `initializeIntonationElements()` (src/intonation.ts): イントネーション編集用のUI要素を初期化します。
- `isIntonationDirty()` (src/intonation.ts): 現在のイントネーションが編集されているかどうかを判定します。
- `setIntonationKeyboardEnabled(enabled: boolean)` (src/intonation.ts): イントネーション編集時のキーボード操作の有効/無効を設定します。
- `getIntonationKeyboardEnabled()` (src/intonation.ts): イントネーション編集時のキーボード操作が有効かどうかを返します。
- `applyPitchToQuery(query: AudioQuery, pitchPoints: PitchPoint[])` (src/intonation.ts): 音声クエリにピッチ情報を適用します。
- `applyPitchEdit(editData: PitchEditData)` (src/intonation.ts): ピッチ編集データを適用し、イントネーション表示を更新します。
- `handleIntonationPointerDown(event: PointerEvent)` (src/intonation.ts): イントネーションチャート上でのポインター押下イベントを処理します。
- `handleIntonationPointerMove(event: PointerEvent)` (src/intonation.ts): イントネーションチャート上でのポインター移動イベントを処理します。
- `handleIntonationPointerUp(event: PointerEvent)` (src/intonation.ts): イントネーションチャート上でのポインター離上イベントを処理します。
- `handleIntonationKeyDown(event: KeyboardEvent)` (src/intonation.ts): イントネーションチャート上でのキーボード押下イベントを処理します。
- `renderIntonationFavoritesList()` (src/intonation.ts): お気に入りイントネーションリストをUIに描画します。
- `removeIntonationFavorite(id: string)` (src/intonation.ts): 指定されたIDのお気に入りイントネーションを削除します。
- `applyIntonationFavorite(id: string)` (src/intonation.ts): 指定されたIDのお気に入りイントネーションを現在のテキストに適用します。
- `saveCurrentIntonationFavorite(name: string)` (src/intonation.ts): 現在のイントネーション状態をお気に入りとして保存します。
- `refreshIntonationChart()` (src/intonation.ts): イントネーションチャートの表示を更新します。
- `getPitchRange(points: IntonationPoint[])` (src/intonationDisplay.ts): イントネーションポイントのピッチ範囲を計算します。
- `calculateBasePadding(range: { min: number, max: number })` (src/intonationDisplay.ts): イントネーションチャートのベースパディングを計算します。
- `getBaseDisplayRange(range: { min: number, max: number }, padding: number)` (src/intonationDisplay.ts): イントネーションチャートの基本表示範囲を計算します。
- `calculateDisplayRange(baseRange: { min: number, max: number }, extra: number)` (src/intonationDisplay.ts): 基本表示範囲に指定されたエクストラを適用して表示範囲を計算します。
- `clampRangeExtra(extra: number)` (src/intonationDisplay.ts): 表示範囲のエクストラ値をクランプします。
- `applyRangeExtra(range: { min: number, max: number }, extra: number)` (src/intonationDisplay.ts): 表示範囲にエクストラ値を適用します。
- `refreshDisplayRange()` (src/intonationDisplay.ts): イントネーション表示の範囲を更新します。
- `clampPitchToDisplayRange(pitch: number)` (src/intonationDisplay.ts): ピッチ値を表示範囲内にクランプします。
- `calculateStepSize(range: { min: number, max: number })` (src/intonationDisplay.ts): イントネーションチャートのステップサイズを計算します。
- `calculateLetterKeyAdjustment(letter: string)` (src/intonationDisplay.ts): 特定の文字キー入力によるピッチ調整量を計算します。
- `handleIntonationWheel(event: WheelEvent)` (src/intonationDisplay.ts): イントネーションチャート上でのホイールイベントを処理します。
- `ensureWheelHandler()` (src/intonationDisplay.ts): ホイールイベントハンドラが登録されていることを確認します。
- `updateInitialRangeFromPoints(points: IntonationPoint[])` (src/intonationDisplay.ts): イントネーションポイントから初期表示範囲を更新します。
- `initializeIntonationCanvas(canvas: HTMLCanvasElement)` (src/intonationDisplay.ts): イントネーション表示用のCanvas要素を初期化します。
- `buildIntonationPointsFromQuery(audioQuery: AudioQuery)` (src/intonationDisplay.ts): 音声クエリからイントネーション表示用のポイントを構築します。
- `renderIntonationLabels(ctx: CanvasRenderingContext2D, displayRange: { min: number, max: number }, step: number)` (src/intonationDisplay.ts): イントネーションチャートのラベルを描画します。
- `drawIntonationChart(ctx: CanvasRenderingContext2D, points: IntonationPoint[], displayRange: { min: number, max: number })` (src/intonationDisplay.ts): イントネーションチャート本体を描画します。
- `adjustIntonationScale(scaleFactor: number, clientY: number)` (src/intonationDisplay.ts): イントネーションの表示スケールを調整します。
- `pitchFromY(y: number, displayRange: { min: number, max: number })` (src/intonationDisplay.ts): CanvasのY座標からピッチ値を計算します。
- `findNearestIntonationPoint(x: number, y: number, points: IntonationPoint[], tolerance: number)` (src/intonationDisplay.ts): 指定座標に最も近いイントネーションポイントを検索します。
- `scheduleIntonationPlayback(audioQuery: AudioQuery)` (src/intonationPlayback.ts): イントネーション編集後の音声再生をスケジュールします。
- `replayCachedIntonationAudio()` (src/intonationPlayback.ts): キャッシュされたイントネーション音声を再生します。
- `showPlaybackStatus(message: string)` (src/intonationPlayback.ts): 再生ステータスをUIに表示します。
- `playUpdatedIntonation(audioQuery: AudioQuery)` (src/intonationPlayback.ts): 更新されたイントネーションで音声を再生します。
- `fetchAndRenderIntonation(text: string, speaker: number)` (src/intonationPlayback.ts): テキストと話者スタイルに基づいてイントネーションをフェッチし、描画します。
- `resetIntonationToInitial()` (src/intonationPlayback.ts): イントネーション表示を初期状態にリセットします。
- `updateIntonationTiming(offset: number, duration: number)` (src/intonationState.ts): イントネーションのタイミング情報を更新します。
- `isValidAudioQueryShape(query: any)` (src/intonationUtils.ts): オブジェクトが有効なAudioQueryの形状であるかを検証します。
- `cloneAudioQuery(query: AudioQuery)` (src/intonationUtils.ts): AudioQueryオブジェクトをディープクローンします。
- `applyStyleSelection(styleId: string)` (src/main.ts): 指定されたスタイルIDを適用し、UIを更新します。
- `applyRandomStyleSelection()` (src/main.ts): ランダムなスタイルを選択して適用します。
- `saveDelimiter()` (src/main.ts): 区切り文字設定をローカルストレージに保存します。
- `scheduleSaveDelimiter()` (src/main.ts): 区切り文字設定の保存をスケジュールします。
- `updateSpectrogramScaleLabel(scale: number)` (src/main.ts): スペクトログラムのスケールラベルを更新します。
- `updateIntonationKeyboardToggle(enabled: boolean)` (src/main.ts): イントネーションキーボードトグルの状態を更新します。
- `setLoopCheckboxElement(element: HTMLInputElement)` (src/playback.ts): ループチェックボックス要素を設定します。
- `setPlayButtonAppearance(playing: boolean)` (src/playback.ts): 再生ボタンの外観を更新します。
- `isPlayRequestPending()` (src/playback.ts): 再生リクエストが保留中かどうかを判定します。
- `stopPlaybackAndResetLoop()` (src/playback.ts): 再生を停止し、ループ設定をリセットします。
- `getAudioCacheKey(text: string, styleId: string)` (src/playback.ts): 音声キャッシュのキーを生成します。
- `setTextAndPlay(text: string, styleId: string, charaId: number)` (src/playback.ts): テキストとスタイルを設定し、再生を開始します。
- `downloadLastAudio()` (src/playback.ts): 最後に再生された音声をダウンロードします。
- `scheduleAutoPlay(text: string, styleId: string, charaId: number)` (src/playback.ts): 自動再生をスケジュールします。
- `confirmResetIntonationBeforePlay()` (src/playback.ts): 再生前にイントネーションリセットの確認を行います。
- `handlePlayButtonClick()` (src/playback.ts): 再生ボタンクリックイベントを処理します。
- `handlePlay(text: string, styleId: string, charaId: number)` (src/playback.ts): 音声再生の主要なロジックを処理します。
- `clearRealtimeWaveformCanvas()` (src/playback.ts): リアルタイム波形表示キャンバスをクリアします。
- `triggerPlay(text: string, styleId: string, charaId: number)` (src/playback.ts): 音声再生をトリガーします。
- `cleanup()` (src/playback.ts): 再生関連のリソースをクリーンアップします。
- `handleReset()` (src/playback.ts): リセットイベントを処理します。
- `handleCancel()` (src/playback.ts): キャンセルイベントを処理します。
- `showStatus(message: string)` (src/status.ts): ステータスメッセージをUIに表示します。
- `hideStatus()` (src/status.ts): ステータスメッセージを非表示にします。
- `scheduleHideStatus()` (src/status.ts): ステータスメッセージの非表示をスケジュールします。
- `invalidateColorVariableCache()` (src/status.ts): カラー変数キャッシュを無効化します。
- `getColorVariable(name: string)` (src/status.ts): CSSカスタム変数から色を取得します。
- `getSelectedStyleId()` (src/styleManager.ts): 現在選択されているスタイルIDを返します。
- `setSelectedStyleId(styleId: string)` (src/styleManager.ts): スタイルIDを設定し、UIを更新します。
- `selectRandomStyleId()` (src/styleManager.ts): ランダムなスタイルIDを選択します。
- `getStyleLabel(style: any)` (src/styleManager.ts): スタイルオブジェクトから表示ラベルを生成します。
- `getStyleById(styleId: string)` (src/styleManager.ts): 指定されたIDのスタイルオブジェクトを返します。
- `getSpeakerStylesByStyleId(styleId: string)` (src/styleManager.ts): 指定されたスタイルIDに属する話者スタイルリストを返します。
- `resolveStyleMarker(styleId: string)` (src/styleManager.ts): スタイルIDからマーカー（絵文字など）を解決します。
- `parseDelimiterConfig(text: string)` (src/styleManager.ts): テキストから区切り文字設定をパースします。
- `addSegment(segment: string, type: string)` (src/styleManager.ts): テキストセグメントを追加します。
- `buildTextSegments(text: string, delimiter: string)` (src/styleManager.ts): テキストを区切り文字でセグメントに分割します。
- `populateStyleSelect(styles: any[], currentStyleId: string)` (src/styleManager.ts): スタイル選択UIを話者情報で埋めます。
- `populateSpeakerStyleSelect(speakerId: number, currentStyleId: string)` (src/styleManager.ts): 話者スタイル選択UIを埋めます。
- `fetchVoiceStyles()` (src/styleManager.ts): VOICEVOX APIから利用可能なボイススタイルをフェッチします。
- `loadStoredList(key: string)` (src/textLists.ts): ローカルストレージから指定キーのリストを読み込みます。
- `persistList(key: string, list: string[])` (src/textLists.ts): 指定キーのリストをローカルストレージに保存します。
- `persistLists()` (src/textLists.ts): 全てのテキストリストをローカルストレージに保存します。
- `dedupeAndLimit(list: string[], limit: number)` (src/textLists.ts): リストから重複を削除し、指定された制限数にカットします。
- `renderList(containerId: string, list: string[], itemClickHandler: (item: string) => void)` (src/textLists.ts): 指定コンテナにリストを描画します。
- `renderTextLists()` (src/textLists.ts): 履歴とお気に入りテキストリストをUIに描画します。
- `moveToFavorites(text: string)` (src/textLists.ts): テキストを履歴からお気に入りに移動します。
- `moveToHistory(text: string)` (src/textLists.ts): テキストをお気に入りから履歴に移動します。
- `addToHistory(text: string)` (src/textLists.ts): テキストを履歴に追加します。
- `initializeTextLists()` (src/textLists.ts): テキストリスト機能を初期化します。
- `updateExportButtonState()` (src/uiControls.ts): エクスポートボタンの状態を更新します。
- `prepareCanvas(canvas: HTMLCanvasElement)` (src/visualization/canvas.ts): Canvas要素を準備し、2Dコンテキストを返します。
- `getHannWindow(length: number)` (src/visualization/fft.ts): 指定された長さのハニング窓関数を生成します。
- `fftRadix2(re: Float32Array, im: Float32Array)` (src/visualization/fft.ts): ラディックス2FFTアルゴリズムを実行します。
- `getMaxFreqByThreshold(fftData: Float32Array, sampleRate: number, threshold: number)` (src/visualization/fftMaxFreq.ts): FFTデータから閾値以上の最大周波数と振幅を検出します。
- `drawRealtimeFFT(ctx: CanvasRenderingContext2D, analyzer: AnalyserNode, width: number, height: number, sampleRate: number)` (src/visualization/fftOverlay.ts): リアルタイムFFTをCanvasに描画します。
- `getTopFreqInfo(fft: Float32Array, sampleRate: number, width: number, height: number, canvasHeight: number)` (src/visualization/fftOverlay.ts): FFTデータからピーク周波数などのトップ情報を取得します。
- `findPeakPosition(data: Float32Array, binSize: number)` (src/visualization/fftOverlay.ts): データ配列内のピーク位置を検索します。
- `drawPeakLine(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string)` (src/visualization/fftOverlay.ts): ピークラインをCanvasに描画します。
- `drawFFTLine(ctx: CanvasRenderingContext2D, fft: Float32Array, width: number, height: number, canvasHeight: number)` (src/visualization/fftOverlay.ts): FFTラインをCanvasに描画します。
- `drawTopBinLine(ctx: CanvasRenderingContext2D, freq: number, sampleRate: number, width: number, height: number, canvasHeight: number)` (src/visualization/fftOverlay.ts): トップビン周波数ラインをCanvasに描画します。
- `drawPeakLabel(ctx: CanvasRenderingContext2D, freq: number, y: number, db: number, width: number, color: string)` (src/visualization/fftOverlay.ts): ピーク周波数とデシベルのラベルをCanvasに描画します。
- `xToFreq(x: number, width: number, sampleRate: number)` (src/visualization/fftUtils.ts): CanvasのX座標から周波数に変換します。
- `freqToBinF(freq: number, sampleRate: number, fftSize: number)` (src/visualization/fftUtils.ts): 周波数からFFTビン番号に変換します。
- `getInterpolatedValue(data: Float32Array, index: number)` (src/visualization/fftUtils.ts): 配列の指定インデックスの値を線形補間して取得します。
- `fftValueToY(value: number, height: number, canvasHeight: number)` (src/visualization/fftUtils.ts): FFT値をCanvasのY座標に変換します。
- `lerpColor(a: number[], b: number[], amount: number)` (src/visualization/spectrogram.ts): 2つの色の間で線形補間を行います。
- `mapIntensityToSpectrogramColor(intensity: number)` (src/visualization/spectrogram.ts): 強度値をスペクトログラムの色にマッピングします。
- `determineSpectrogramCeiling(buffer: AudioBuffer)` (src/visualization/spectrogram.ts): スペクトログラムの天井（最大強度）を決定します。
- `analyzeSpectrogramFrames(audioBuffer: AudioBuffer, fftSize: number, hopLength: number)` (src/visualization/spectrogram.ts): 音声バッファを分析し、スペクトログラムフレームを生成します。
- `drawSpectrogram(ctx: CanvasRenderingContext2D, spectrogramData: Float32Array[], width: number, height: number, duration: number, audioSampleRate: number, fftSize: number, hopLength: number, maxIntensity: number, spectrogramScale: number)` (src/visualization/spectrogram.ts): スペクトログラムをCanvasに描画します。
- `drawSpectrogramColumn(ctx: CanvasRenderingContext2D, columnData: Float32Array, x: number, columnWidth: number, height: number, maxIntensity: number, spectrogramScale: number)` (src/visualization/spectrogram.ts): スペクトログラムの単一の列を描画します。
- `drawOfflineSpectrogram(ctx: CanvasRenderingContext2D, audioBuffer: AudioBuffer, width: number, height: number, duration: number, sampleRate: number, maxIntensity: number, spectrogramScale: number, cachedImage?: HTMLImageElement)` (src/visualization/spectrogram.ts): オフラインの音声バッファからスペクトログラムを描画します。
- `computeAudioContentHash(audioBuffer: AudioBuffer)` (src/visualization/spectrogram.ts): AudioBufferのコンテンツハッシュを計算します。
- `buildSpectrogramSignature(audioBuffer: AudioBuffer)` (src/visualization/spectrogram.ts): スペクトログラムの署名（ハッシュ）を構築します。
- `processChunk(channelData: Float32Array)` (src/visualization/spectrogram.ts): オーディオチャンクを処理します。
- `formatTimeLabel(seconds: number)` (src/visualization/timeAxis.ts): 秒数をフォーマットされた時間ラベルに変換します。
- `buildTimeTicks(duration: number, width: number)` (src/visualization/timeAxis.ts): 時間軸の目盛り位置を計算します。
- `drawTimeTicks(ctx: CanvasRenderingContext2D, duration: number, width: number, height: number)` (src/visualization/timeAxis.ts): 時間軸の目盛りとラベルをCanvasに描画します。
- `computeSegmentStats(buffer: AudioBuffer, start: number, end: number)` (src/visualization/waveform.ts): 音声バッファの指定セグメントの統計情報を計算します。
- `computeSegmentCorrelation(buffer1: AudioBuffer, start1: number, end1: number, buffer2: AudioBuffer, start2: number, end2: number)` (src/visualization/waveform.ts): 2つの音声セグメント間の相関を計算します。
- `extractAlignedRealtimeSegment(audioBuffer: AudioBuffer, currentTime: number, segmentDuration: number, sampleRate: number)` (src/visualization/waveform.ts): リアルタイム再生位置に合わせた音声セグメントを抽出します。
- `drawRenderedWaveform(ctx: CanvasRenderingContext2D, audioBuffer: AudioBuffer, width: number, height: number)` (src/visualization/waveform.ts): レンダリングされた（合成済みの）波形をCanvasに描画します。
- `drawRealtimeWaveformBackground(ctx: CanvasRenderingContext2D, width: number, height: number)` (src/visualization/waveform.ts): リアルタイム波形表示の背景を描画します。
- `drawRealtimeWaveformOnly(ctx: CanvasRenderingContext2D, audioBuffer: AudioBuffer, offset: number, width: number, height: number)` (src/visualization/waveform.ts): リアルタイム波形の一部のみをCanvasに描画します。
- `getSpectrogramScale()` (src/visualization.ts): 現在のスペクトログラムスケールを取得します。
- `setSpectrogramScale(scale: number)` (src/visualization.ts): スペクトログラムスケールを設定します。
- `requestSpectrogramReset()` (src/visualization.ts): スペクトログラムのリセットを要求します。
- `isPlaybackActive()` (src/visualization.ts): 現在再生がアクティブかどうかを判定します。
- `stopActivePlayback()` (src/visualization.ts): アクティブな再生を停止します。
- `initializeVisualizationCanvases(waveformCanvas: HTMLCanvasElement, spectrogramCanvas: HTMLCanvasElement, fftCanvas: HTMLCanvasElement)` (src/visualization.ts): 可視化用のCanvas要素を初期化します。
- `clearWaveformCanvas()` (src/visualization.ts): 波形表示Canvasをクリアします。
- `createSpectrogramImageCache(audioBuffer: AudioBuffer, spectrogramScale: number)` (src/visualization.ts): スペクトログラムの画像キャッシュを生成します。
- `analyzeAndCacheSpectrogram(audioBuffer: AudioBuffer, spectrogramScale: number)` (src/visualization.ts): スペクトログラムを分析し、キャッシュします。
- `handleSpectrogramInitialization(audioBuffer: AudioBuffer)` (src/visualization.ts): スペクトログラムの初期化処理をハンドルします。
- `playAudio(audioBuffer: AudioBuffer, text: string, speaker: number)` (src/visualization.ts): AudioBufferを再生します。
- `setProgressPosition(position: number)` (src/visualization.ts): 再生プログレスバーの位置を設定します。
- `updateProgressLines(duration: number, currentTime: number, width: number)` (src/visualization.ts): プログレスラインを更新します。
- `clearProgressLines()` (src/visualization.ts): プログレスラインをクリアします。
- `drawRealtimeVisuals(audioBuffer: AudioBuffer, currentTime: number)` (src/visualization.ts): リアルタイムの可視化要素を描画します。
- `handleSpectrogramDraw()` (src/visualization.ts): スペクトログラムの描画をハンドルします。
- `cleanupPlayback()` (src/visualization.ts): 再生終了後のクリーンアップ処理を行います。
- `requestSpectrogramDraw()` (src/visualization.ts): スペクトログラムの描画を要求します。
- `render()` (src/visualization.ts): 描画ループを開始します。
- `finalize()` (src/visualization.ts): 最終処理を行います。
- `stopPlayback()` (src/visualization.ts): 再生を停止します。

## 関数呼び出し階層ツリー
```
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
    - showPlaybackStatus ()
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
    - isPlaybackActive ()
- stopPlaybackAndResetLoop ()
  - getAudioCacheKey ()
    - setTextAndPlay ()
    - downloadLastAudio ()
    - scheduleAutoPlay ()
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
- formatTimeLabel (src/visualization/timeAxis.ts)
  - buildTimeTicks ()
- computeSegmentStats (src/visualization/waveform.ts)
  - computeSegmentCorrelation ()
    - extractAlignedRealtimeSegment ()
    - drawRealtimeWaveformBackground ()
    - drawRealtimeWaveformOnly ()
- requestSpectrogramReset ()
  - clearWaveformCanvas ()
    - createSpectrogramImageCache ()
    - analyzeAndCacheSpectrogram ()
    - handleSpectrogramInitialization ()
    - setProgressPosition ()
    - updateProgressLines ()
    - clearProgressLines ()
    - drawRealtimeVisuals ()
    - handleSpectrogramDraw ()
    - cleanupPlayback ()
    - requestSpectrogramDraw ()
    - render ()
    - finalize ()
    - stopPlayback ()
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)

---
Generated at: 2026-02-20 07:05:47 JST
