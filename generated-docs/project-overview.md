Last updated: 2026-02-17

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
- ユーザーはウェブブラウザから任意のテキストを入力し、VOICEVOXの多様な音声スタイルで読み上げを生成・再生できます。
- VOICEVOXクライアントアプリの容易な開発を実証し、ウェブ上での手軽な音声再生機能の提供を目指します。

## 技術スタック
- フロントエンド: TypeScript (型安全なJavaScript開発を可能にし、堅牢なコードベースを構築), Vite (高速な開発サーバーとビルドツールを提供し、モダンなフロントエンド開発を支援), Tone.js v15 (Web Audio APIを抽象化し、ウェブブラウザ上での高度な音声処理と再生を実現します)
- 音楽・オーディオ: Tone.js v15 (ウェブオーディオの合成、再生、分析のための豊富な機能を提供し、音声のカスタマイズや視覚化に利用されます)
- 開発ツール: Vite (プロジェクトの高速な開発とビルドを行うモジュールバンドラー), jsdom (Node.js環境でDOMをエミュレートし、ブラウザ環境に依存しないテストを可能にします), Vitest (TypeScriptプロジェクト向けの軽量かつ高速な単体テストフレームワーク)
- テスト: Vitest (コードの品質と信頼性を確保するための単体テストを実行), jsdom (テスト実行時にDOM環境を提供し、ブラウザのAPIをシミュレート)
- ビルドツール: Vite (開発サーバーの起動、本番環境向けのコードのバンドルと最適化を行います)
- 言語機能: TypeScript (JavaScriptに静的型付けを追加し、開発効率と保守性を向上させます)
- 自動化・CI/CD: (このプロジェクトでは、主にGitHub ActionsによるREADME翻訳の自動化が行われています。コードベースのCI/CDに関する直接的な記述はありません。)
- 開発標準: Biome (コードのフォーマットとリンティングを自動化し、コードベース全体で一貫したスタイルと品質を維持します)

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
  📖 110.md
  📖 111.md
  📖 112.md
  📖 113.md
  📖 115.md
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
- **.gitignore**: Gitがバージョン管理の対象外とするファイルやディレクトリを指定します。
- **AGENTS.md**: このプロジェクトに貢献したAIエージェントに関する情報が記述されている可能性があります。
- **LICENSE**: このプロジェクトのライセンス情報が記述されています。
- **README.ja.md**: プロジェクトの概要、機能、使い方などを日本語で説明するメインのドキュメントです。
- **README.md**: プロジェクトの概要、機能、使い方などを英語で説明するメインのドキュメントです。
- **biome.json**: Biome (コードフォーマッター・リンター) の設定ファイルです。コードのスタイルと品質を統一します。
- **generated-docs/**: 自動生成されたドキュメントが格納されるディレクトリです。
- **index.html**: WebアプリケーションのエントリポイントとなるHTMLファイルです。ユーザーインターフェースの構造を定義します。
- **package-lock.json**: `package.json`で定義された依存関係の正確なバージョンと依存ツリーを記録し、ビルドの一貫性を保証します。
- **package.json**: プロジェクトのメタデータ（名前、バージョン、スクリプトなど）と、依存するnpmパッケージを定義します。
- **src/audio.ts**: VOICEVOXサーバーとの通信を担当し、音声クエリの取得、音声データの合成、オーディオバッファの操作など、音声処理の低レベルなロジックを提供します。
- **src/config.ts**: アプリケーション全体で使用される設定値や定数を管理します。VOICEVOXサーバーのURLなども含まれます。
- **src/intonation.test.ts**: `src/intonation.ts`で定義されたイントネーション関連機能のテストコードです。
- **src/intonation.ts**: イントネーションの編集、保存、読み込み、表示に関する主要なロジックを扱います。ユーザーが音声のピッチを視覚的に調整できるようにします。
- **src/intonationDisplay.ts**: イントネーションのグラフ表示に関するロジックを担当します。ピッチカーブの描画や表示範囲の計算などを行います。
- **src/intonationPlayback.ts**: 編集されたイントネーションに基づいて音声を再生するロジックを管理します。VOICEVOXからの音声取得とTone.jsによる再生を連携させます。
- **src/intonationState.ts**: イントネーション編集の状態を管理し、タイミング情報の更新などを行います。
- **src/intonationUtils.ts**: イントネーション関連のヘルパー関数やユーティリティを提供します。音声クエリの形状検証やクローン作成などです。
- **src/main.ts**: アプリケーションのメインエントリポイントであり、UI要素の初期化、イベントハンドラの設定、各種モジュールの連携などを担当します。
- **src/playback.test.ts**: `src/playback.ts`で定義された音声再生機能のテストコードです。
- **src/playback.ts**: 音声再生、停止、ループ再生、ダウンロードなど、VOICEVOXの音声再生機能に関するユーザー操作ロジックを管理します。
- **src/state.ts**: アプリケーションのグローバルな状態を管理するためのシンプルなモジュールです。
- **src/status.ts**: アプリケーションの状態メッセージ（エラー、成功など）をユーザーインターフェースに表示・非表示するロジックを管理します。
- **src/styleManager.test.ts**: `src/styleManager.ts`で定義されたスタイル管理機能のテストコードです。
- **src/styleManager.ts**: VOICEVOXの音声スタイル（キャラクター、話者スタイル）の取得、選択、管理に関するロジックを提供します。
- **src/styles/base.css**: アプリケーションの基本的なレイアウトや共通のUI要素に対するスタイル定義です。
- **src/styles/intonation.css**: イントネーション編集UIに特化したスタイル定義です。
- **src/styles.css**: 全体的なスタイルシートのインポートや、一部のグローバルスタイルを定義します。
- **src/textLists.test.ts**: `src/textLists.ts`で定義されたテキストリスト管理機能のテストコードです。
- **src/textLists.ts**: ユーザーが入力したテキストの履歴やお気に入りリストを管理し、永続化するロジックを提供します。
- **src/uiControls.ts**: UI要素（例: エクスポートボタン）の状態更新に関するヘルパー関数を提供します。
- **src/visualization/canvas.ts**: HTML `<canvas>`要素の準備と基本的な操作に関するユーティリティを提供します。
- **src/visualization/fft.ts**: 高速フーリエ変換 (FFT) の計算ロジックを提供し、音声の周波数スペクトル分析に使用されます。
- **src/visualization/fftMaxFreq.ts**: FFT結果から最大の周波数成分を特定するロジックを提供します。
- **src/visualization/fftOverlay.test.ts**: `src/visualization/fftOverlay.ts`のテストコードです。
- **src/visualization/fftOverlay.ts**: リアルタイムFFT（周波数分析）の視覚化を担当し、スペクトルデータに基づいてグラフを描画します。
- **src/visualization/fftUtils.ts**: FFTデータの変換や補間に関するユーティリティ関数を提供します。
- **src/visualization/spectrogram.ts**: スペクトログラムの生成と描画に関するロジックを管理します。音声の周波数成分の時間変化を視覚化します。
- **src/visualization/timeAxis.ts**: タイムライン表示のための時間軸の生成と描画に関するロジックを提供します。
- **src/visualization/waveform.ts**: 音声波形の描画に関するロジックを管理します。リアルタイム波形やレンダリングされた波形を表示します。
- **src/visualization.test.ts**: `src/visualization.ts`で定義された視覚化機能全般のテストコードです。
- **src/visualization.ts**: 音声の再生と同期した視覚化（波形、スペクトログラム、FFTなど）を統合的に管理する主要なモジュールです。
- **src/vite-env.d.ts**: Viteの環境変数に関する型定義ファイルです。
- **tsconfig.json**: TypeScriptコンパイラの設定ファイルです。コンパイルオプションなどを指定します。
- **vite.config.ts**: Viteビルドツールの設定ファイルです。プロジェクトのビルドや開発サーバーの動作を定義します。

## 関数詳細説明
- **getAudioQuery (src/audio.ts)**: VOICEVOXサーバーから音声合成に必要なクエリ（パラメーター）を取得します。
- **synthesize (src/audio.ts)**: 取得した音声クエリを元に、VOICEVOXサーバーで音声を合成し、音声データを取得します。
- **combineAudioBuffers (src/audio.ts)**: 複数のオーディオバッファを結合して一つのオーディオデータを作成します。
- **encodeAudioBufferToWav (src/audio.ts)**: オーディオバッファのデータをWAV形式にエンコードします。
- **writeString (src/audio.ts)**: 文字列をバイナリデータとして書き込むためのヘルパー関数です。
- **clamp (src/audio.ts)**: 数値を指定された最小値と最大値の範囲内に制限します。
- **dedupeIntonationFavorites (src/intonation.ts)**: 保存されたイントネーションのお気に入りリストから重複を削除します。
- **loadIntonationFavorites (src/intonation.ts)**: ローカルストレージからイントネーションのお気に入りリストを読み込みます。
- **persistIntonationFavorites (src/intonation.ts)**: 現在のイントネーションのお気に入りリストをローカルストレージに保存します。
- **disableLoopOnIntonationEdit (src/intonation.ts)**: イントネーション編集中にループ再生を無効にします。
- **resetIntonationState (src/intonation.ts)**: イントネーションの状態を初期値にリセットします。
- **setStyleChangeHandler (src/intonation.ts)**: スタイル変更時のハンドラを設定します。
- **initializeIntonationElements (src/intonation.ts)**: イントネーション編集に必要なHTML要素を初期化します。
- **isIntonationDirty (src/intonation.ts)**: 現在のイントネーションが初期状態から変更されているか（ダーティ状態か）を判定します。
- **setIntonationKeyboardEnabled (src/intonation.ts)**: イントネーション編集のキーボード操作の有効/無効を切り替えます。
- **getIntonationKeyboardEnabled (src/intonation.ts)**: イントネーション編集のキーボード操作が有効かどうかを取得します。
- **applyPitchToQuery (src/intonation.ts)**: 編集されたピッチ情報を音声クエリに適用します。
- **applyPitchEdit (src/intonation.ts)**: ユーザーによるピッチ編集を反映します。
- **handleIntonationPointerDown (src/intonation.ts)**: イントネーショングラフ上でのポインター（マウス/タッチ）押し下げイベントを処理します。
- **handleIntonationPointerMove (src/intonation.ts)**: イントネーショングラフ上でのポインター移動イベントを処理します。
- **handleIntonationPointerUp (src/intonation.ts)**: イントネーショングラフ上でのポインター解除イベントを処理します。
- **handleIntonationKeyDown (src/intonation.ts)**: イントネーション編集時のキーボード入力イベントを処理します。
- **renderIntonationFavoritesList (src/intonation.ts)**: イントネーションのお気に入りリストをUIに描画します。
- **removeIntonationFavorite (src/intonation.ts)**: イントネーションのお気に入りから項目を削除します。
- **applyIntonationFavorite (src/intonation.ts)**: お気に入りのイントネーション設定を現在の音声に適用します。
- **saveCurrentIntonationFavorite (src/intonation.ts)**: 現在のイントネーション設定をお気に入りとして保存します。
- **refreshIntonationChart (src/intonation.ts)**: イントネーショングラフを再描画します。
- **getPitchRange (src/intonationDisplay.ts)**: 表示するピッチの範囲を計算します。
- **calculateBasePadding (src/intonationDisplay.ts)**: イントネーション表示のベースとなるパディングを計算します。
- **getBaseDisplayRange (src/intonationDisplay.ts)**: 基本的な表示範囲を計算します。
- **calculateDisplayRange (src/intonationDisplay.ts)**: イントネーションの表示範囲を計算します。
- **clampRangeExtra (src/intonationDisplay.ts)**: 表示範囲の追加値をクランプ（制限）します。
- **applyRangeExtra (src/intonationDisplay.ts)**: 表示範囲にエクストラ値を適用します。
- **refreshDisplayRange (src/intonationDisplay.ts)**: 表示範囲を更新します。
- **clampPitchToDisplayRange (src/intonationDisplay.ts)**: ピッチ値を表示範囲にクランプします。
- **calculateStepSize (src/intonationDisplay.ts)**: イントネーションのステップサイズを計算します。
- **calculateLetterKeyAdjustment (src/intonationDisplay.ts)**: キーボード操作時のピッチ調整量を計算します。
- **handleIntonationWheel (src/intonationDisplay.ts)**: イントネーショングラフ上でのホイールイベント（ズームなど）を処理します。
- **ensureWheelHandler (src/intonationDisplay.ts)**: ホイールイベントハンドラが確実に設定されていることを確認します。
- **updateInitialRangeFromPoints (src/intonationDisplay.ts)**: イントネーションポイントに基づいて初期表示範囲を更新します。
- **initializeIntonationCanvas (src/intonationDisplay.ts)**: イントネーション表示用のキャンバスを初期化します。
- **buildIntonationPointsFromQuery (src/intonationDisplay.ts)**: 音声クエリからイントネーション表示用のポイントデータを構築します。
- **renderIntonationLabels (src/intonationDisplay.ts)**: イントネーショングラフのラベルを描画します。
- **drawIntonationChart (src/intonationDisplay.ts)**: イントネーションのピッチカーブを描画します。
- **adjustIntonationScale (src/intonationDisplay.ts)**: イントネーションの表示スケールを調整します。
- **pitchFromY (src/intonationDisplay.ts)**: キャンバスのY座標からピッチ値を計算します。
- **findNearestIntonationPoint (src/intonationDisplay.ts)**: 指定された座標に最も近いイントネーションポイントを見つけます。
- **scheduleIntonationPlayback (src/intonationPlayback.ts)**: イントネーションの再生をスケジュールします。
- **replayCachedIntonationAudio (src/intonationPlayback.ts)**: キャッシュされたイントネーション音声を再生します。
- **showPlaybackStatus (src/intonationPlayback.ts)**: 再生ステータスをUIに表示します。
- **playUpdatedIntonation (src/intonationPlayback.ts)**: 更新されたイントネーションで音声を再生します。
- **fetchAndRenderIntonation (src/intonationPlayback.ts)**: イントネーションデータをフェッチし、グラフにレンダリングします。
- **resetIntonationToInitial (src/intonationPlayback.ts)**: イントネーションを初期状態にリセットします。
- **updateIntonationTiming (src/intonationState.ts)**: イントネーションのタイミング情報を更新します。
- **isValidAudioQueryShape (src/intonationUtils.ts)**: 音声クエリの形状が有効かどうかを検証します。
- **cloneAudioQuery (src/intonationUtils.ts)**: 音声クエリをディープコピーします。
- **applyStyleSelection (src/main.ts)**: ユーザーが選択したスタイルをアプリケーションに適用します。
- **applyRandomStyleSelection (src/main.ts)**: ランダムな音声スタイルを選択し適用します。
- **saveDelimiter (src/main.ts)**: 区切り文字設定を保存します。
- **scheduleSaveDelimiter (src/main.ts)**: 区切り文字設定の保存をスケジュールします。
- **updateSpectrogramScaleLabel (src/main.ts)**: スペクトログラムのスケール表示を更新します。
- **updateIntonationKeyboardToggle (src/main.ts)**: イントネーションキーボードのトグルボタンの状態を更新します。
- **setLoopCheckboxElement (src/playback.ts)**: ループ再生チェックボックスの状態を設定します。
- **setPlayButtonAppearance (src/playback.ts)**: 再生ボタンの表示状態（再生中、停止など）を更新します。
- **isPlayRequestPending (src/playback.ts)**: 再生リクエストが保留中かどうかを判定します。
- **stopPlaybackAndResetLoop (src/playback.ts)**: 音声再生を停止し、ループ設定をリセットします。
- **getAudioCacheKey (src/playback.ts)**: 音声キャッシュのためのキーを生成します。
- **setTextAndPlay (src/playback.ts)**: テキストを設定し、音声を再生します。
- **downloadLastAudio (src/playback.ts)**: 最後に再生された音声をダウンロードします。
- **scheduleAutoPlay (src/playback.ts)**: 自動再生をスケジュールします。
- **confirmResetIntonationBeforePlay (src/playback.ts)**: 再生前にイントネーションのリセットを確認するダイアログを表示します。
- **handlePlayButtonClick (src/playback.ts)**: 再生ボタンのクリックイベントを処理します。
- **handlePlay (src/playback.ts)**: 音声再生の主要なロジックを実行します。
- **clearRealtimeWaveformCanvas (src/playback.ts)**: リアルタイム波形表示用のキャンバスをクリアします。
- **triggerPlay (src/playback.ts)**: 音声再生をトリガーします。
- **cleanup (src/playback.ts)**: 再生後のクリーンアップ処理を行います。
- **handleReset (src/playback.ts)**: アプリケーションの状態をリセットするイベントを処理します。
- **handleCancel (src/playback.ts)**: 処理のキャンセルイベントを処理します。
- **showStatus (src/status.ts)**: ユーザーにステータスメッセージを表示します。
- **hideStatus (src/status.ts)**: 表示されているステータスメッセージを非表示にします。
- **scheduleHideStatus (src/status.ts)**: ステータスメッセージを指定時間後に非表示にするようスケジュールします。
- **invalidateColorVariableCache (src/status.ts)**: 色変数のキャッシュを無効にします。
- **getColorVariable (src/status.ts)**: CSSカスタムプロパティから色変数の値を取得します。
- **getSelectedStyleId (src/styleManager.ts)**: 現在選択されているスタイルIDを取得します。
- **setSelectedStyleId (src/styleManager.ts)**: 選択するスタイルIDを設定します。
- **selectRandomStyleId (src/styleManager.ts)**: ランダムなスタイルIDを選択します。
- **getStyleLabel (src/styleManager.ts)**: スタイルIDに対応するラベルを取得します。
- **getStyleById (src/styleManager.ts)**: スタイルIDに基づいてスタイル情報を取得します。
- **getSpeakerStylesByStyleId (src/styleManager.ts)**: 指定されたスタイルIDに紐づく話者スタイルを取得します。
- **resolveStyleMarker (src/styleManager.ts)**: スタイルマーカー（例：文字色）を解決します。
- **parseDelimiterConfig (src/styleManager.ts)**: 区切り文字の設定をパースします。
- **addSegment (src/styleManager.ts)**: テキストセグメントを追加します。
- **buildTextSegments (src/styleManager.ts)**: テキスト入力から音声合成に適したセグメントを構築します。
- **populateStyleSelect (src/styleManager.ts)**: スタイル選択ドロップダウンメニューにオプションを生成します。
- **populateSpeakerStyleSelect (src/styleManager.ts)**: 話者スタイル選択ドロップダウンメニューにオプションを生成します。
- **fetchVoiceStyles (src/styleManager.ts)**: VOICEVOXサーバーから利用可能な音声スタイルの一覧を取得します。
- **loadStoredList (src/textLists.ts)**: ローカルストレージから保存されたテキストリストを読み込みます。
- **persistList (src/textLists.ts)**: 指定されたテキストリストをローカルストレージに保存します。
- **persistLists (src/textLists.ts)**: 複数のテキストリストをローカルストレージに保存します。
- **dedupeAndLimit (src/textLists.ts)**: テキストリストの重複を排除し、項目数を制限します。
- **renderList (src/textLists.ts)**: テキストリストをUIに描画します。
- **renderTextLists (src/textLists.ts)**: お気に入りや履歴などのテキストリスト全体をUIに描画します。
- **moveToFavorites (src/textLists.ts)**: テキストを履歴からお気に入りリストに移動します。
- **moveToHistory (src/textLists.ts)**: テキストをお気に入りから履歴リストに移動します。
- **addToHistory (src/textLists.ts)**: 新しいテキストを履歴リストに追加します。
- **initializeTextLists (src/textLists.ts)**: テキストリスト機能を初期化します。
- **updateExportButtonState (src/uiControls.ts)**: 音声のエクスポートボタンの有効/無効状態を更新します。
- **prepareCanvas (src/visualization/canvas.ts)**: キャンバス要素を準備し、描画コンテキストを取得します。
- **getHannWindow (src/visualization/fft.ts)**: ハン窓関数を生成します。
- **fftRadix2 (src/visualization/fft.ts / fftMaxFreq.ts)**: ラディックス2FFTアルゴリズムを実行します。
- **getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)**: 特定の閾値に基づいて最大周波数を見つけます。
- **drawRealtimeFFT (src/visualization/fftOverlay.ts)**: リアルタイムFFTデータをキャンバスに描画します。
- **getTopFreqInfo (src/visualization/fftOverlay.ts)**: 最上位の周波数情報（ピークなど）を取得します。
- **findPeakPosition (src/visualization/fftOverlay.ts)**: FFTデータからピークの位置を見つけます。
- **drawPeakLine (src/visualization/fftOverlay.ts)**: FFTピークを示す線をキャンバスに描画します。
- **drawFFTLine (src/visualization/fftOverlay.ts)**: FFTスペクトルを示す線をキャンバスに描画します。
- **drawTopBinLine (src/visualization/fftOverlay.ts)**: 最上位のビン（周波数帯）を示す線をキャンバスに描画します。
- **drawPeakLabel (src/visualization/fftOverlay.ts)**: ピークの周波数ラベルをキャンバスに描画します。
- **xToFreq (src/visualization/fftUtils.ts)**: キャンバスのX座標を周波数に変換します。
- **freqToBinF (src/visualization/fftUtils.ts)**: 周波数をFFTのビン（周波数帯）のインデックスに変換します。
- **getInterpolatedValue (src/visualization/fftUtils.ts)**: 補間されたFFT値を取得します。
- **fftValueToY (src/visualization/fftUtils.ts)**: FFTの振幅値をキャンバスのY座標に変換します。
- **lerpColor (src/visualization/spectrogram.ts)**: 2つの色の間で線形補間を行います。
- **mapIntensityToSpectrogramColor (src/visualization/spectrogram.ts)**: 音声強度をスペクトログラムの色にマッピングします。
- **determineSpectrogramCeiling (src/visualization/spectrogram.ts)**: スペクトログラムの天井（最大値）を決定します。
- **analyzeSpectrogramFrames (src/visualization/spectrogram.ts)**: スペクトログラム用のフレームを分析します。
- **drawSpectrogram (src/visualization/spectrogram.ts)**: スペクトログラム全体を描画します。
- **drawSpectrogramColumn (src/visualization/spectrogram.ts)**: スペクトログラムの1列（1時点の周波数データ）を描画します。
- **drawOfflineSpectrogram (src/visualization/spectrogram.ts)**: オフラインで計算されたスペクトログラムを描画します。
- **computeAudioContentHash (src/visualization/spectrogram.ts)**: 音声コンテンツのハッシュ値を計算します。
- **buildSpectrogramSignature (src/visualization/spectrogram.ts)**: スペクトログラムの署名を構築します。
- **processChunk (src/visualization/spectrogram.ts)**: 音声データをチャンク単位で処理します。
- **formatTimeLabel (src/visualization/timeAxis.ts)**: 時間表示用のラベルを整形します。
- **buildTimeTicks (src/visualization/timeAxis.ts)**: 時間軸の目盛りを構築します。
- **drawTimeTicks (src/visualization/timeAxis.ts)**: 時間軸の目盛りとラベルをキャンバスに描画します。
- **computeSegmentStats (src/visualization/waveform.ts)**: 音声セグメントの統計情報を計算します。
- **computeSegmentCorrelation (src/visualization/waveform.ts)**: 音声セグメント間の相関を計算します。
- **extractAlignedRealtimeSegment (src/visualization/waveform.ts)**: リアルタイム波形からアライメントされたセグメントを抽出します。
- **drawRenderedWaveform (src/visualization/waveform.ts)**: レンダリングされた（合成済みの）音声波形を描画します。
- **drawRealtimeWaveformBackground (src/visualization/waveform.ts)**: リアルタイム波形表示の背景を描画します。
- **drawRealtimeWaveformOnly (src/visualization/waveform.ts)**: リアルタイム波形のみをキャンバスに描画します。
- **getSpectrogramScale (src/visualization.ts)**: スペクトログラムの現在のスケールを取得します。
- **setSpectrogramScale (src/visualization.ts)**: スペクトログラムのスケールを設定します。
- **requestSpectrogramReset (src/visualization.ts)**: スペクトログラムのリセットを要求します。
- **isPlaybackActive (src/visualization.ts)**: 現在音声が再生中かどうかを判定します。
- **stopActivePlayback (src/visualization.ts)**: 現在アクティブな再生を停止します。
- **initializeVisualizationCanvases (src/visualization.ts)**: 視覚化に使用するキャンバスを初期化します。
- **clearWaveformCanvas (src/visualization.ts)**: 波形表示用のキャンバスをクリアします。
- **createSpectrogramImageCache (src/visualization.ts)**: スペクトログラム画像のキャッシュを作成します。
- **analyzeAndCacheSpectrogram (src/visualization.ts)**: スペクトログラムを分析し、キャッシュします。
- **handleSpectrogramInitialization (src/visualization.ts)**: スペクトログラムの初期化処理を管理します。
- **playAudio (src/visualization.ts)**: 音声ファイルを再生します。
- **setProgressPosition (src/visualization.ts)**: 再生プログレスバーの位置を設定します。
- **updateProgressLines (src/visualization.ts)**: プログレスラインを更新します。
- **clearProgressLines (src/visualization.ts)**: プログレスラインをクリアします。
- **drawRealtimeVisuals (src/visualization.ts)**: リアルタイムの視覚化要素（波形、FFTなど）を描画します。
- **handleSpectrogramDraw (src/visualization.ts)**: スペクトログラムの描画処理を管理します。
- **cleanupPlayback (src/visualization.ts)**: 視覚化と関連する再生のクリーンアップを行います。
- **requestSpectrogramDraw (src/visualization.ts)**: スペクトログラムの描画を要求します。
- **render (src/visualization.ts)**: 視覚化の描画ループを実行します。
- **finalize (src/visualization.ts)**: 視覚化の最終処理を行います。
- **stopPlayback (src/visualization.ts)**: 音声再生を停止し、視覚化も停止します。

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
  - catch (src/audio.ts)
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
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)
```

---
Generated at: 2026-02-17 07:03:57 JST
