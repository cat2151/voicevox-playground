Last updated: 2026-03-08

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
- 複数の音声スタイル（キャラクター）でテキスト読み上げ、イントネーション調整、音声の波形・周波数可視化が可能です。
- WebページからVOICEVOXを手軽に操作できることを実証し、カスタムクライアント開発を容易にすることを目指します。

## 技術スタック
- フロントエンド: TypeScript (型安全なJavaScriptのスーパーセット)、Vite (高速な開発サーバーとビルドツール)
- 音楽・オーディオ: Tone.js v15 (Web Audio APIを抽象化した音楽・オーディオフレームワーク)、VOICEVOX API (VOICEVOXエンジンと連携し、音声合成機能を提供)
- 開発ツール: Vitest (高速なユニットテストフレームワーク)、JSDOM (Node.js環境でDOMをエミュレート)、@biomejs/biome (コードフォーマッタ、リンタ)
- テスト: Vitest (ユニットテスト実行環境)、JSDOM (ブラウザDOMのシミュレーション環境)
- ビルドツール: Vite (アプリケーションのビルドとバンドルを処理)
- 言語機能: TypeScript (静的型付けによるコード品質向上と開発効率化)
- 自動化・CI/CD: (GitHub Actionsを利用したREADMEの自動翻訳など、間接的にCI/CDの要素を使用)
- 開発標準: @biomejs/biome (コードのスタイルと品質を自動的に統一)

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
  📖 141.md
  📖 142.md
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
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📁 intonation/
    📘 display.ts
    📘 handlers.test.ts
    📘 handlers.ts
    📘 playback.test.ts
    📘 playback.ts
    📘 state.ts
    📘 utils.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 main.ts
  📘 playback.test.ts
  📘 playback.ts
  📘 settings.test.ts
  📘 settings.ts
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
```

## ファイル詳細説明
- **index.html**: アプリケーションのエントリーポイントとなるHTMLファイルです。ユーザーインターフェースの骨格を定義し、各種JavaScriptやCSSファイルを読み込みます。
- **.gitignore**: Gitのバージョン管理から除外するファイルやディレクトリを指定する設定ファイルです。
- **AGENTS.md**: AIエージェントに関する情報やガイドラインを記述するMarkdownファイルです。
- **LICENSE**: プロジェクトのライセンス情報が記述されています。
- **README.ja.md**: プロジェクトの日本語版説明書です。機能、使い方、開発方法などが記載されています。
- **README.md**: プロジェクトの英語版説明書です。日本語版の自動翻訳によって生成されます。
- **biome.json**: Biome（コードフォーマッタ兼リンタ）の設定ファイルです。コードスタイルと品質を統一するために使用されます。
- **generated-docs/**: 自動生成されたドキュメントが格納されるディレクトリです。
- **issue-notes/**: 開発中の課題や設計上のメモが格納されたディレクトリです。
- **package-lock.json**: `npm install`コマンド実行時に生成されるファイルで、プロジェクトの依存関係ツリーの正確なバージョンを記録します。
- **package.json**: プロジェクトのメタデータ（名前、バージョン、スクリプト、依存関係など）を定義するファイルです。
- **tsconfig.json**: TypeScriptコンパイラの設定ファイルです。TypeScriptコードのコンパイル方法を定義します。
- **vite.config.ts**: Viteのビルド設定ファイルです。開発サーバーの挙動やビルドプロセスをカスタマイズします。
- **src/audio.ts**: VOICEVOX APIとの連携を担当し、音声クエリの取得、音声合成、オーディオバッファの結合・エンコードなど、音声処理全般を扱います。
- **src/config.ts**: アプリケーション全体で使用される定数や設定値を管理するファイルです。VOICEVOXサーバーのポート番号などが含まれます。
- **src/intonation/display.ts**: イントネーション調整UIの描画ロジックと、ユーザー操作（ホイール操作など）による表示範囲の更新ロジックを管理します。ピッチの表示範囲計算、描画、ポイントの検出を行います。
- **src/intonation/handlers.test.ts**: イントネーション編集に関するUIイベントハンドラ（キーボード、ポインターなど）のテストコードが含まれています。
- **src/intonation/handlers.ts**: イントネーション編集UIにおけるユーザー操作（ポインター操作、キーボード操作など）を処理するイベントハンドラ群を定義します。ピッチ変更の適用ロジックも含まれます。
- **src/intonation/playback.test.ts**: イントネーション編集後の音声再生機能に関するテストコードです。
- **src/intonation/playback.ts**: イントネーション編集後の音声再生、キャッシュ管理、および状態表示ロジックを扱います。VOICEVOX APIからの音声データ取得も担当します。
- **src/intonation/state.ts**: イントネーション編集に関連するアプリケーションの状態（タイミング、アクティブなポイントなど）を管理します。
- **src/intonation/utils.ts**: イントネーション関連で共通的に使用されるユーティリティ関数（AudioQueryの形状チェック、クローンなど）を提供します。
- **src/intonation.test.ts**: イントネーション関連の主要機能（状態管理、再生など）のテストコードです。
- **src/intonation.ts**: イントネーション編集機能全体の初期化、状態管理、お気に入り機能、UIイベント設定などを統括するファイルです。
- **src/main.ts**: アプリケーションのメインエントリポイントです。UI要素の初期化、設定の適用、イベントリスナーの設定など、全体的なセットアップを行います。
- **src/playback.test.ts**: 音声再生機能に関する詳細なテストコードです。
- **src/playback.ts**: 音声の再生、一時停止、ループ、ダウンロード、自動再生、状態表示など、主要な再生関連機能を管理します。Tone.jsを利用して音声を出力します。
- **src/settings.test.ts**: アプリケーションの設定管理機能のテストコードです。
- **src/settings.ts**: VOICEVOX APIのエンドポイント設定や、周波数表示に関する設定など、アプリケーションの永続的な設定を読み書きします。
- **src/state.ts**: アプリケーションのグローバル状態を定義・管理するファイルです。
- **src/status.ts**: アプリケーションのステータス表示（メッセージ表示、色変数の管理など）を扱います。
- **src/styleManager.test.ts**: 音声スタイル（キャラクター）の選択と管理機能のテストコードです。
- **src/styleManager.ts**: VOICEVOXの音声スタイル（話者、スタイルID）の取得、選択、表示、区切り文字設定のパースなどを管理するファイルです。
- **src/styles/base.css**: アプリケーションの基本的なレイアウトやUI要素のスタイルを定義するCSSファイルです。
- **src/styles/intonation.css**: イントネーション編集UIに特化したスタイルを定義するCSSファイルです。
- **src/styles.css**: 全体的なスタイルシートのインポートを管理するメインのCSSファイルです。
- **src/textLists.test.ts**: テキストリスト（履歴、お気に入りなど）管理機能のテストコードです。
- **src/textLists.ts**: ユーザーが入力したテキストの履歴やお気に入りリストを管理し、永続化・表示する機能を提供します。
- **src/uiControls.ts**: UI要素の状態更新（例: エクスポートボタンの有効/無効化）を制御するユーティリティ関数を提供します。
- **src/visualization/canvas.ts**: Canvas要素の準備や初期化に関するユーティリティ関数をまとめます。
- **src/visualization/fft.ts**: 高速フーリエ変換 (FFT) アルゴリズムの実装を提供します。
- **src/visualization/fftMaxFreq.ts**: FFT結果から最大周波数を検出するロジックを実装しています。
- **src/visualization/fftOverlay.test.ts**: FFTオーバーレイ描画機能のテストコードです。
- **src/visualization/fftOverlay.ts**: リアルタイムFFTの描画、ピーク検出、周波数表示など、FFT可視化の主要なロジックを管理します。
- **src/visualization/fftUtils.ts**: FFT関連の計算（周波数変換、補間など）に用いるユーティリティ関数を提供します。
- **src/visualization/spectrogram.ts**: スペクトログラムの分析、描画、色マッピングなど、スペクトログラム可視化の主要なロジックを管理します。
- **src/visualization/spectrogramCache.ts**: スペクトログラム画像のキャッシュ管理、分析、初期化処理を扱います。
- **src/visualization/timeAxis.ts**: 時間軸の描画、目盛り計算、ラベルフォーマットなど、時間軸表示に関するロジックを提供します。
- **src/visualization/waveform.ts**: 音声波形の描画、リアルタイム波形表示、セグメント相関計算などを担当します。
- **src/visualization.test.ts**: 音声可視化機能全般に関するテストコードです。
- **src/visualization.ts**: 音声波形、スペクトログラム、FFTなどの可視化機能全体を統括します。Tone.jsとの連携、再生中のリアルタイム更新も担当します。
- **src/vite-env.d.ts**: Vite環境向けのTypeScript型定義ファイルです。

## 関数詳細説明
- **getAudioQuery(src/audio.ts)**: 指定されたテキストと音声スタイルIDに基づいて、VOICEVOX APIから音声合成に必要なクエリ（イントネーションやアクセント情報）を取得します。
- **synthesize()**: 取得した音声クエリとスタイルIDを用いて、VOICEVOX APIに音声合成をリクエストし、音声データ（WAV形式など）を取得します。
- **combineAudioBuffers()**: 複数のAudioBuffer（音声データ）を単一のAudioBufferに結合します。
- **encodeAudioBufferToWav()**: Web Audio APIのAudioBufferオブジェクトをWAV形式のバイナリデータにエンコードします。
- **writeString()**: バイト配列に文字列を書き込むユーティリティ関数です。
- **clamp()**: 数値を指定された最小値と最大値の範囲内に制限（クランプ）します。
- **if()**: 条件に基づいてコードの実行パスを決定する一般的な条件分岐です。
- **catch()**: try-catchブロックで発生したエラーを捕捉し、処理を行うエラーハンドリングです。
- **for()**: 繰り返し処理を実行するループ構造です。
- **getPitchRange(src/intonation/display.ts)**: イントネーション表示のY軸におけるピッチ（音高）の表示範囲を計算し取得します。
- **calculateBasePadding()**: ピッチ表示のベースラインからのパディング（余白）を計算します。
- **getBaseDisplayRange()**: イントネーション表示の基本的なピッチ表示範囲を定義します。
- **calculateDisplayRange()**: ユーザー操作やデータに基づいて、ピッチ表示の動的な表示範囲を計算します。
- **clampRangeExtra()**: 表示範囲に適用される追加のマージン値を指定された限界内に制限します。
- **applyRangeExtra()**: 計算された追加のマージンを表示範囲に適用します。
- **refreshDisplayRange()**: イントネーション表示の範囲を更新し、UIに反映させます。
- **clampPitchToDisplayRange()**: あるピッチ値を、現在定義されている表示範囲内に制限します。
- **calculateStepSize()**: イントネーション編集時にピッチを調整する際のステップサイズ（増減量）を計算します。
- **calculateLetterKeyAdjustment()**: キーボード操作でイントネーションポイントを移動させる際の文字単位の調整量を計算します。
- **handleIntonationWheel()**: イントネーション編集UI上でのマウスホイール操作を処理し、表示範囲のズームやスクロールを行います。
- **ensureWheelHandler()**: イントネーションUIにホイールイベントハンドラが確実に設定されているかを確認します。
- **updateInitialRangeFromPoints()**: イントネーションポイントのデータから、表示範囲の初期値を計算し更新します。
- **initializeIntonationCanvas()**: イントネーション編集用のHTML Canvas要素を初期化し、描画準備を整えます。
- **buildIntonationPointsFromQuery()**: VOICEVOXのAudioQueryデータから、イントネーションチャート描画用のポイントデータを構築します。
- **renderIntonationLabels()**: イントネーションチャート上のピッチや文字に対応するラベルを描画します。
- **updateHoveredLabel()**: マウスがホバーしているイントネーションポイントに対応するラベルの表示を更新します。
- **drawIntonationChart()**: イントネーションのピッチカーブや関連する情報をキャンバスに描画します。
- **adjustIntonationScale()**: イントネーションチャートのスケール（表示倍率）を調整し、ズームイン/アウトなどを実現します。
- **pitchFromY()**: イントネーションチャートのY座標から対応するピッチ値（周波数）を計算します。
- **findNearestIntonationPoint()**: 指定された座標に最も近いイントネーションポイントを検索します。
- **makeKeyEvent(src/intonation/handlers.test.ts)**: テスト用にキーボードイベントオブジェクトを生成します。
- **enableKeyboard()**: キーボード操作によるイントネーション編集機能を有効にします。
- **disableLoopOnIntonationEdit(src/intonation/handlers.ts)**: イントネーションが編集されている間、音声のループ再生を一時的に無効にします。
- **applyPitchToQuery()**: UIで編集されたピッチ情報をAudioQueryデータに適用し、音声合成準備を更新します。
- **applyPitchEdit()**: ユーザーによるピッチ編集操作を処理し、ピッチ情報の更新ロジックを実行します。
- **handleIntonationPointerDown()**: イントネーションUI上でのポインター（マウスやタッチ）の「押し下げ」イベントを処理します。
- **handleIntonationPointerMove()**: イントネーションUI上でのポインターの「移動」イベントを処理します。
- **handleIntonationPointerUp()**: イントネーションUI上でのポインターの「離す」イベントを処理します。
- **handleIntonationMouseMove()**: イントネーションUI上でのマウスの「移動」イベントを処理します。
- **handleIntonationMouseLeave()**: イントネーションUIからマウスカーソルが「離れた」イベントを処理します。
- **handleIntonationKeyDown()**: イントネーションUIにフォーカスがある状態でキーボードの「キー押し下げ」イベントを処理します。
- **scheduleIntonationPlayback(src/intonation/playback.ts)**: イントネーションが更新された後、音声再生をスケジュールします。
- **replayCachedIntonationAudio()**: キャッシュされているイントネーション編集後の音声データを再再生します。
- **showPlaybackStatus()**: 音声再生の状態（再生中、停止中など）をUIに表示します。
- **buildSynthesisCacheKey()**: 音声合成リクエストのパラメータに基づいて、キャッシュキーを生成します。
- **playUpdatedIntonation()**: 更新されたイントネーション情報を用いて音声を合成し、再生します。
- **fetchAndRenderIntonation()**: イントネーションデータをVOICEVOX APIからフェッチし、チャートにレンダリングします。
- **resetIntonationToInitial()**: イントネーション編集を初期状態に戻します。
- **updateIntonationTiming(src/intonation/state.ts)**: イントネーションのタイミング情報（各音素の時間など）を更新します。
- **isValidAudioQueryShape(src/intonation/utils.ts)**: 指定されたオブジェクトがAudioQueryの期待される形状と一致するかどうかを検証します。
- **cloneAudioQuery()**: AudioQueryオブジェクトをディープクローンし、元のオブジェクトに影響を与えずに操作できるようにします。
- **dedupeIntonationFavorites(src/intonation.ts)**: イントネーションのお気に入りリストから重複するエントリを削除します。
- **loadIntonationFavorites()**: ブラウザのストレージからイントネーションのお気に入りリストを読み込みます。
- **persistIntonationFavorites()**: 現在のイントネーションのお気に入りリストをブラウザのストレージに保存（永続化）します。
- **resetIntonationState()**: イントネーション編集に関連するすべての状態を初期値にリセットします。
- **setStyleChangeHandler()**: 音声スタイルが変更された際に実行されるハンドラを設定します。
- **initializeIntonationElements()**: イントネーション編集UIに関連するHTML要素を初期化し、イベントリスナーを設定します。
- **isIntonationDirty()**: イントネーションが前回の保存状態から変更されているかどうかをチェックします。
- **isIntonationActive()**: イントネーション編集UIが現在アクティブ（表示され操作可能）かどうかをチェックします。
- **hasActiveIntonationQuery()**: 現在編集中のアクティブなイントネーションクエリデータが存在するかどうかをチェックします。
- **setIntonationKeyboardEnabled()**: キーボードショートカットによるイントネーション編集機能を有効または無効にします。
- **getIntonationKeyboardEnabled()**: キーボードショートカットによるイントネーション編集機能が現在有効かどうかを返します。
- **renderIntonationFavoritesList()**: イントネーションのお気に入りリストをUIに表示します。
- **removeIntonationFavorite()**: お気に入りリストから指定されたイントネーションエントリを削除します。
- **applyIntonationFavorite()**: お気に入りリストから選択されたイントネーション設定を現在のテキストに適用します。
- **saveCurrentIntonationFavorite()**: 現在のイントネーション設定を新しいお気に入りとして保存します。
- **refreshIntonationChart()**: イントネーションチャートの表示を更新し、最新のデータを反映させます。
- **setupIntonationCanvasEvents()**: イントネーション編集用のキャンバスにポインターやキーボードなどのイベントリスナーを設定します。
- **applySettingsToInputs(src/main.ts)**: アプリケーションの設定値を、対応するUI入力要素に適用し表示を更新します。
- **refreshStylesAfterPortChange()**: VOICEVOXサーバーのポート番号が変更された後に、関連するスタイルや設定をリフレッシュします。
- **applyStyleSelection()**: ユーザーが選択した音声スタイルをアプリケーション全体に適用します。
- **applyRandomStyleSelection()**: ランダムな音声スタイルを選択し、アプリケーションに適用します。
- **saveDelimiter()**: テキストの区切り文字設定を保存します。
- **scheduleSaveDelimiter()**: テキストの区切り文字設定の保存を遅延実行するようにスケジュールします。
- **updateSpectrogramScaleLabel()**: スペクトログラムの表示スケールを示すラベルを更新します。
- **updateIntonationKeyboardToggle()**: イントネーション編集におけるキーボード操作の有効/無効を切り替えるUI要素の状態を更新します。
- **makeDOM(src/playback.test.ts)**: テスト環境でDOM（文書オブジェクトモデル）構造をシミュレートして生成します。
- **clearAudioCache(src/playback.ts)**: アプリケーション内で一時的に保存されている音声データをクリアします。
- **setLoopCheckboxElement()**: 音声のループ再生を制御するチェックボックスUI要素を設定します。
- **setPlayButtonAppearance()**: 再生/停止ボタンの外観（アイコンやテキスト）を現在の再生状態に応じて更新します。
- **isPlayRequestPending()**: 現在、音声再生のリクエストが処理を待っている状態かどうかをチェックします。
- **stopPlaybackAndResetLoop()**: 現在再生中の音声を停止し、ループ再生設定をリセットします。
- **getAudioCacheKey()**: 再生する音声データの特性に基づいて、キャッシュに使用する一意のキーを生成します。
- **setTextAndPlay()**: 指定されたテキストを設定し、そのテキストを合成して再生します。
- **downloadLastAudio()**: 最後に再生された音声データをダウンロード可能なファイルとして提供します。
- **scheduleAutoPlay()**: 特定の条件が満たされたときに、音声の自動再生をスケジュールします。
- **confirmResetIntonationBeforePlay()**: 再生前にイントネーションが編集されている場合、リセットするかどうかをユーザーに確認します。
- **handlePlayButtonClick()**: 再生ボタンがクリックされた際のイベントを処理し、再生を開始または停止します。
- **handlePlay()**: 実際の音声再生処理を開始します。
- **clearRealtimeWaveformCanvas()**: リアルタイムで音声波形を表示するキャンバスをクリアします。
- **triggerPlay()**: 再生処理をトリガー（開始）します。
- **cleanup()**: アプリケーションや再生状態のリソースを解放するためのクリーンアップ処理を実行します。
- **handleReset()**: アプリケーションの状態や設定を初期値にリセットする操作を処理します。
- **handleCancel()**: 実行中の操作（例: 音声合成）をキャンセルする操作を処理します。
- **loadSettings(src/settings.ts)**: ブラウザのローカルストレージからアプリケーションの設定を読み込みます。
- **saveSettings()**: 現在のアプリケーション設定をブラウザのローカルストレージに保存します。
- **resetSettings()**: アプリケーション設定をデフォルト値にリセットします。
- **getVoicevoxApiBase()**: VOICEVOX APIのベースURL（エンドポイント）を取得します。
- **getVoicevoxNemoApiBase()**: VOICEVOX Nemo APIのベースURLを取得します。
- **getFrequencyTopPercent()**: スペクトログラム表示などで使用される、周波数の上位何パーセントを表示するかという設定値を取得します。
- **getCurrentSettings()**: 現在のアクティブなアプリケーション設定オブジェクト全体を取得します。
- **setVoicevoxPort()**: VOICEVOXサーバーのポート番号を設定します。
- **setVoicevoxNemoPort()**: VOICEVOX Nemoサーバーのポート番号を設定します。
- **setFrequencyTopPercent()**: 周波数上位パーセンテージの値を設定します。
- **showStatus(src/status.ts)**: アプリケーションのステータスメッセージをUIに表示します。
- **hideStatus()**: 現在表示されているステータスメッセージをUIから非表示にします。
- **scheduleHideStatus()**: 一定時間経過後にステータスメッセージを自動的に非表示にするようスケジュールします。
- **invalidateColorVariableCache()**: CSSカスタムプロパティから取得した色変数のキャッシュを無効化します。
- **getColorVariable()**: CSSカスタムプロパティ（CSS変数）から色の値を読み取ります。
- **getSelectedStyleId(src/styleManager.ts)**: 現在選択されている音声スタイル（キャラクター）のIDを取得します。
- **setSelectedStyleId()**: 指定されたIDの音声スタイルを選択状態に設定します。
- **selectRandomStyleId()**: ランダムに音声スタイルを選択します。
- **getStyleLabel()**: スタイルIDから、ユーザーに表示するためのスタイル名（ラベル）を取得します。
- **getStyleById()**: スタイルIDに基づいて、そのスタイルに関する詳細情報を取得します。
- **getApiBaseForStyleId()**: 特定のスタイルIDに対応するVOICEVOX APIのベースURLを取得します。
- **getSpeakerStylesByStyleId()**: 指定されたスタイルIDを持つスピーカーに関連する全てのスタイル情報を取得します。
- **resolveStyleMarker()**: テキスト内のスタイル指定マーカーを解析し、適切なスタイルIDに解決します。
- **parseDelimiterConfig()**: テキストの区切り文字設定を解析し、テキスト分割のための情報を生成します。
- **addSegment()**: 音声合成のためにテキストを小さなセグメントに分割する処理で、新しいセグメントを追加します。
- **buildTextSegments()**: 入力テキストを、音声スタイルや区切り文字に基づいて複数のセグメントに分割します。
- **populateStyleSelect()**: 音声スタイル選択用のドロップダウンメニューに利用可能なスタイルオプションを投入します。
- **populateSpeakerStyleSelect()**: スピーカーに紐づくスタイル選択用のドロップダウンメニューにオプションを投入します。
- **fetchVoiceStyles()**: VOICEVOX APIから利用可能な音声スタイル（話者、スタイルIDなど）のリストを取得します。
- **while()**: 条件が真である間、ブロック内のコードを繰り返し実行するループ構造です。
- **loadStoredList(src/textLists.ts)**: ブラウザのローカルストレージから、テキストの履歴やお気に入りなどのリストを読み込みます。
- **persistList()**: 指定されたリストをブラウザのローカルストレージに保存（永続化）します。
- **persistLists()**: 複数のテキストリスト（履歴、お気に入りなど）をまとめて永続化します。
- **dedupeAndLimit()**: リストから重複するエントリを削除し、指定されたアイテム数に制限します。
- **renderList()**: 指定されたリストのアイテムをUIに描画します。
- **renderTextLists()**: 履歴リストとお気に入りリストの両方をUIに描画します。
- **moveToFavorites()**: 履歴リストなどから選択されたテキストアイテムをお気に入りリストに移動します。
- **moveToHistory()**: 現在のテキストアイテムを履歴リストに移動または追加します。
- **addToHistory()**: 新しいテキストアイテムを履歴リストに追加します。
- **initializeTextLists()**: テキストリスト（履歴、お気に入り）機能を初期化し、UI要素を設定します。
- **updateExportButtonState(src/uiControls.ts)**: 音声エクスポートボタンの有効/無効状態を更新します。
- **prepareCanvas(src/visualization/canvas.ts)**: 指定されたHTML Canvas要素を初期化し、描画可能な状態に準備します。
- **getHannWindow(src/visualization/fft.ts)**: 音声分析に使用するハニング窓関数を生成します。
- **fftRadix2()**: 高速フーリエ変換（FFT）のRadix-2アルゴリズムを実行し、周波数スペクトルを計算します。
- **getMaxFreqByThreshold(src/visualization/fftMaxFreq.ts)**: 指定されたしきい値を超える周波数成分の中から、最大の周波数を検出します。
- **drawRealtimeFFT(src/visualization/fftOverlay.ts)**: リアルタイムで音声のFFTスペクトルをキャンバスに描画します。
- **getTopFreqInfo()**: FFT結果から、支配的な周波数に関する情報を（ピーク位置など）取得します。
- **findPeakPosition()**: FFTスペクトルの中から、周波数ピークの位置を検出します。
- **drawPeakLine()**: FFTチャート上に検出されたピークを示すラインを描画します。
- **drawFFTLine()**: FFTスペクトルデータに基づいて、周波数分布を示すラインを描画します。
- **drawTopBinLine()**: FFTチャート上に、特定の周波数ビン（例えば、トップ周波数ビン）を示すラインを描画します。
- **drawPeakLabel()**: FFTチャート上に、ピーク周波数や関連する情報を示すラベルを描画します。
- **xToFreq(src/visualization/fftUtils.ts)**: キャンバス上のX座標を対応する周波数値に変換します。
- **freqToBinF()**: 周波数値をFFTのビンインデックス（浮動小数点）に変換します。
- **getInterpolatedValue()**: データポイント間の値を線形補間などによって推定します。
- **fftValueToY()**: FFTの振幅値をキャンバス上のY座標に変換します。
- **lerpColor(src/visualization/spectrogram.ts)**: 2つの色間で線形補間を行い、中間の色を生成します。
- **mapIntensityToSpectrogramColor()**: 音声の強度（振幅）値をスペクトログラムの色にマッピングします。
- **determineSpectrogramCeiling()**: スペクトログラム描画における強度の最大値（天井値）を決定します。
- **analyzeSpectrogramFrames()**: 音声データをフレームごとに分析し、スペクトログラム生成に必要な情報を抽出します。
- **drawSpectrogram()**: 音声のスペクトログラム全体をキャンバスに描画します。
- **drawSpectrogramColumn()**: スペクトログラムの一つの時間軸における周波数分布（列）をキャンバスに描画します。
- **drawOfflineSpectrogram()**: リアルタイムではなく、事前に処理された音声データからスペクトログラムを描画します。
- **computeAudioContentHash()**: 音声コンテンツのハッシュ値を計算し、キャッシュキーとして利用します。
- **buildSpectrogramSignature()**: スペクトログラムのユニークな識別子（シグネチャ）を構築します。
- **processChunk()**: 音声データを小さなチャンク（塊）に分割し、それぞれのチャンクを処理します。
- **getSpectrogramScale(src/visualization/spectrogramCache.ts)**: スペクトログラム表示の現在のスケール（ズームレベル）を取得します。
- **setSpectrogramScale()**: スペクトログラム表示のスケールを設定します。
- **requestSpectrogramReset()**: スペクトログラム表示のリセットを要求し、再描画の準備をします。
- **createSpectrogramImageCache()**: スペクトログラム画像のキャッシュを初期化または作成します。
- **analyzeAndCacheSpectrogram()**: 音声データを分析し、生成されたスペクトログラムをキャッシュします。
- **handleSpectrogramInitialization()**: スペクトログラムの初期化プロセスを処理します。
- **resetSpectrogramCaches()**: すべてのスペクトログラム関連キャッシュをクリアし、リセットします。
- **formatTimeLabel(src/visualization/timeAxis.ts)**: 時間軸に表示するタイムラベルを整形します。
- **buildTimeTicks()**: 時間軸に表示する目盛りの位置とラベルを計算し、構築します。
- **drawTimeTicks()**: 時間軸の目盛りと対応するラベルをキャンバスに描画します。
- **computeSegmentStats(src/visualization/waveform.ts)**: 音声セグメントの統計情報（平均振幅など）を計算します。
- **computeSegmentCorrelation()**: 複数の音声セグメント間の相関関係を計算します。
- **extractAlignedRealtimeSegment()**: リアルタイム音声から、特定の位置にアラインされたセグメントを抽出します。
- **drawRenderedWaveform()**: レンダリング（事前に処理）された音声波形をキャンバスに描画します。
- **drawRealtimeWaveformBackground()**: リアルタイム波形表示キャンバスの背景を描画します。
- **drawRealtimeWaveformOnly()**: リアルタイムで入力される音声の波形データのみをキャンバスに描画します。
- **constructor(src/visualization.test.ts)**: オブジェクトのインスタンスを生成する際に呼び出される特殊な関数です（テストファイル内）。
- **isPlaybackActive(src/visualization.ts)**: 現在音声が再生中であるかどうかをチェックします。
- **stopActivePlayback()**: 現在アクティブな音声再生を停止します。
- **initializeVisualizationCanvases()**: 音声可視化用のすべてのCanvas要素を初期化します。
- **clearWaveformCanvas()**: 波形表示キャンバスの内容をクリアします。
- **playAudio()**: 音声データを受け取り、再生を開始します。
- **setProgressPosition()**: 再生プログレスバーの現在の位置を設定し、UIに反映させます。
- **updateProgressLines()**: 再生プログレスを示すライン（線）を更新します。
- **clearProgressLines()**: 再生プログレスを示すラインをキャンバスからクリアします。
- **drawRealtimeVisuals()**: リアルタイムで音声の波形やFFTなどの可視化要素を描画します。
- **handleSpectrogramDraw()**: スペクトログラムの描画処理を管理します。
- **cleanupPlayback()**: 再生終了時に、可視化関連のリソースをクリーンアップします。
- **requestSpectrogramDraw()**: スペクトログラムの描画を要求します。
- **render()**: 可視化要素のフレームを描画します。
- **finalize()**: 可視化プロセスの最終処理を実行します。
- **stopPlayback()**: 音声再生を完全に停止します。

## 関数呼び出し階層ツリー
```
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
      - getColorVariable ()
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
    - playUpdatedIntonation ()
      - fetchAndRenderIntonation ()
      - resetIntonationToInitial ()
      - updateIntonationTiming ()
      - cloneAudioQuery ()
      - showStatus ()
      - scheduleHideStatus ()
      - getApiBaseForStyleId ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - isValidAudioQueryShape (src/intonation/utils.ts)
  - dedupeIntonationFavorites (src/intonation.ts)
    - loadIntonationFavorites ()
      - persistIntonationFavorites ()
      - resetIntonationState ()
      - setStyleChangeHandler ()
      - initializeIntonationElements ()
      - isIntonationDirty ()
      - isIntonationActive ()
      - hasActiveIntonationQuery ()
      - setIntonationKeyboardEnabled ()
      - getIntonationKeyboardEnabled ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - saveCurrentIntonationFavorite ()
      - refreshIntonationChart ()
      - setupIntonationCanvasEvents ()
  - applySettingsToInputs (src/main.ts)
    - refreshStylesAfterPortChange ()
      - applyStyleSelection ()
      - applyRandomStyleSelection ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
      - clearAudioCache ()
      - setLoopCheckboxElement ()
      - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - scheduleAutoPlay ()
      - handlePlayButtonClick ()
      - handlePlay ()
      - loadSettings ()
      - resetSettings ()
      - getCurrentSettings ()
      - setVoicevoxPort ()
      - setVoicevoxNemoPort ()
      - setFrequencyTopPercent ()
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
      - confirmResetIntonationBeforePlay ()
      - clearRealtimeWaveformCanvas ()
      - cleanup ()
      - handleCancel ()
      - parseDelimiterConfig ()
      - buildTextSegments ()
      - addToHistory ()
      - stopActivePlayback ()
  - saveSettings ()
    - getVoicevoxApiBase ()
      - getVoicevoxNemoApiBase ()
      - getFrequencyTopPercent ()
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
  - catch (src/audio.ts)
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
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- makeDOM (src/playback.test.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)

---
Generated at: 2026-03-08 07:02:19 JST
