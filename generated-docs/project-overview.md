Last updated: 2026-02-13

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストから音声を生成・再生するWebアプリケーションです。
- 音声のイントネーションやピッチを調整できる高度な機能と、波形・スペクトログラム表示を提供します。
- Vite、TypeScript、Tone.js v15を利用し、GitHub Pagesへ自動デプロイされます。

## 技術スタック
- フロントエンド: **Vite** (高速な開発サーバーとビルドツールを提供)、**TypeScript** (型安全なJavaScript開発を可能にし、コードの品質と保守性を向上させます)
- 音楽・オーディオ: **Tone.js v15** (Web Audio APIを抽象化し、ブラウザ上での高度な音声処理や再生を容易にします)、**VOICEVOX API** (ローカルで動作するVOICEVOXエンジンと連携し、テキスト音声合成機能を提供します)
- 開発ツール: **Vite** (開発サーバーの起動、ホットモジュールリロードなど、効率的な開発体験を提供します)
- テスト: (プロジェクト情報からは特定のテストフレームワークは確認できませんでした)
- ビルドツール: **Vite** (ソースコードのバンドル、トランスパイル、最適化を行い、本番環境向けの静的ファイルを生成します)
- 言語機能: **TypeScript** (JavaScriptに静的型付けを追加し、大規模アプリケーション開発における堅牢性と可読性を高めます)
- 自動化・CI/CD: **GitHub Actions** (GitHub Pagesへの自動デプロイ、およびREADMEの多言語化（英語翻訳）を自動化するワークフローを提供します)
- 開発標準: (プロジェクト情報からは特定の開発標準やLinterは確認できませんでした)

## ファイル階層ツリー
```
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
  📖 44.md
  📖 45.md
  📖 50.md
  📖 51.md
  📖 54.md
  📖 56.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📘 intonation.ts
  📘 main.ts
  📘 state.ts
  📘 status.ts
  📘 styleManager.ts
  📘 textLists.ts
  📘 uiControls.ts
  📘 visualization.ts
📊 tsconfig.json
📘 vite.config.ts
```

## ファイル詳細説明
- **`.gitignore`**: Gitがバージョン管理の対象としないファイルやディレクトリを指定します。
- **`LICENSE`**: プロジェクトのライセンス情報が記述されています。
- **`README.ja.md` / `README.md`**: プロジェクトの概要、機能、セットアップ方法、使い方などが記述されたドキュメント（日本語版と英語版）です。
- **`generated-docs/`**: 自動生成されたドキュメントや関連ファイルが格納されるディレクトリです。
- **`index.html`**: WebアプリケーションのエントリポイントとなるHTMLファイルで、UIの骨格とスクリプトの読み込みを定義します。
- **`issue-notes/`**: GitHub Issuesに関連するメモや自動生成されたドキュメントが格納されます。
- **`package-lock.json`**: `package.json`に記述された依存関係の正確なバージョンを記録し、ビルドの一貫性を保証します。
- **`package.json`**: プロジェクトのメタデータ（名前、バージョン、スクリプトなど）と、依存するnpmパッケージを定義します。
- **`src/audio.ts`**: VOICEVOX APIへのリクエスト送信、音声データの取得、合成、オーディオバッファの結合、WAV形式へのエンコードなど、音声関連のコア処理を担当します。
- **`src/config.ts`**: アプリケーション全体で使用される定数や設定値（例: VOICEVOXサーバーのURL、UI要素のセレクタ）を定義します。
- **`src/intonation.ts`**: VOICEVOXのイントネーション（ピッチやタイミング）を視覚的に調整するためのUIとロジックを実装しています。イントネーションの描画、操作、お気に入り保存、再生などに関わります。
- **`src/main.ts`**: アプリケーションの主要なロジックを管理するエントリポイントです。再生ボタンの制御、テキスト入力処理、音声のキャッシュ、ダウンロード、自動再生、イベントハンドリングなどが含まれます。
- **`src/state.ts`**: アプリケーションのグローバルな状態（例: 再生状態、UI要素の状態）を定義および管理します。
- **`src/status.ts`**: UI上にユーザーへのステータスメッセージ（エラー、成功など）を表示・非表示にする機能や、UIの色変数を管理します。
- **`src/styleManager.ts`**: VOICEVOXの音声スタイル（話者）の選択、管理、UIへの反映、およびテキストのセグメント分割ロジックを扱います。
- **`src/textLists.ts`**: ユーザーが入力したテキストの履歴やお気に入りリストを管理し、それらの永続化（ローカルストレージへの保存）とUIへの表示を行います。
- **`src/uiControls.ts`**: エクスポートボタンの状態更新など、特定のUI要素の有効/無効化や表示状態を制御する関数を提供します。
- **`src/visualization.ts`**: 再生中の音声の波形やスペクトログラムをCanvas要素に描画し、視覚的に表現する機能を提供します。プログレスラインの更新も行います。
- **`tsconfig.json`**: TypeScriptコンパイラのオプションと、プロジェクトのTypeScriptファイルを指定します。
- **`vite.config.ts`**: Viteビルドツールの設定ファイルで、開発サーバーの挙動やビルド方法などを定義します。

## 関数詳細説明
- **`getAudioQuery(src/audio.ts)`**: VOICEVOXローカルサーバーにテキストを送信し、音声合成のためのオーディオクエリデータを取得します。
- **`synthesize()`**: 取得したオーディオクエリを基に、VOICEVOXローカルサーバーで実際に音声を合成し、音声データを取得します。
- **`combineAudioBuffers()`**: 複数のAudioBufferを一つに結合し、連続した音声データを作成します。
- **`encodeAudioBufferToWav()`**: AudioBuffer形式の音声データをWAVファイル形式にエンコードします。
- **`writeString()`**: 文字列データを特定の形式でバッファに書き込みます。
- **`clamp()`**: 数値を指定された最小値と最大値の範囲内に制限します。
- **`isValidAudioQueryShape(src/intonation.ts)`**: 渡されたオーディオクエリのデータ構造が期待される形式と一致するかを検証します。
- **`cloneAudioQuery()`**: オーディオクエリオブジェクトをディープコピーして、元のデータに影響を与えずに操作できるようにします。
- **`dedupeIntonationFavorites()`**: イントネーションのお気に入りリストから重複エントリを削除します。
- **`loadIntonationFavorites()`**: ローカルストレージからイントネーションのお気に入りリストを読み込みます。
- **`persistIntonationFavorites()`**: 現在のイントネーションのお気に入りリストをローカルストレージに保存します。
- **`updateIntonationTiming()`**: イントネーションのタイミング情報（発話速度など）を更新します。
- **`disableLoopOnIntonationEdit()`**: イントネーション編集中に音声のループ再生を一時的に無効にします。
- **`resetIntonationState()`**: イントネーション関連のUIや内部状態を初期値にリセットします。
- **`setStyleChangeHandler()`**: スタイル変更時のイベントハンドラを設定します。
- **`initializeIntonationElements()`**: イントネーション調整UIのDOM要素を初期化します。
- **`isIntonationDirty()`**: イントネーションが最後に保存されてから変更されたかどうかを判定します。
- **`setIntonationKeyboardEnabled()`**: イントネーション調整のためのキーボード操作の有効/無効を切り替えます。
- **`getIntonationKeyboardEnabled()`**: イントネーション調整のキーボード操作が現在有効であるかを取得します。
- **`initializeIntonationCanvas()`**: イントネーション表示用のCanvas要素を初期化し、描画準備を行います。
- **`buildIntonationPointsFromQuery()`**: オーディオクエリからイントネーションの描画点データを構築します。
- **`renderIntonationLabels()`**: イントネーションチャート上にピッチやタイミングのラベルを描画します。
- **`drawIntonationChart()`**: イントネーションのピッチカーブやタイミング情報をCanvas上に描画します。
- **`adjustIntonationScale()`**: イントネーションチャートのスケール（表示範囲）を調整します。
- **`pitchFromY()`**: CanvasのY座標をピッチ値に変換します。
- **`findNearestIntonationPoint()`**: 指定された座標に最も近いイントネーションポイントを検出します。
- **`applyPitchToQuery()`**: ユーザーが操作したピッチ値をオーディオクエリに適用します。
- **`scheduleIntonationPlayback()`**: イントネーション調整の結果を反映して音声再生をスケジュールします。
- **`playUpdatedIntonation()`**: 更新されたイントネーション設定で音声を再生します。
- **`fetchAndRenderIntonation()`**: イントネーションデータを取得し、チャートに描画します。
- **`handleIntonationPointerDown()`**: イントネーションチャート上でのマウス/タッチダウンイベントを処理します。
- **`handleIntonationPointerMove()`**: イントネーションチャート上でのマウス/タッチムーブイベントを処理します。
- **`handleIntonationPointerUp()`**: イントネーションチャート上でのマウス/タッチアップイベントを処理します。
- **`handleIntonationKeyDown()`**: イントネーション調整に関連するキーボード入力イベントを処理します。
- **`renderIntonationFavoritesList()`**: イントネーションのお気に入りリストをUIに描画します。
- **`removeIntonationFavorite()`**: イントネーションのお気に入りリストから項目を削除します。
- **`applyIntonationFavorite()`**: 選択されたお気に入りイントネーション設定を現在のオーディオクエリに適用します。
- **`saveCurrentIntonationFavorite()`**: 現在のイントネーション設定をお気に入りとして保存します。
- **`refreshIntonationChart()`**: イントネーションチャートを再描画して最新の状態を反映します。
- **`showStatus(src/status.ts)`**: 指定されたメッセージをUI上のステータス表示領域に表示します。
- **`hideStatus()`**: UI上のステータス表示を非表示にします。
- **`scheduleHideStatus()`**: 指定時間後にステータス表示を自動的に非表示にするようスケジュールします。
- **`invalidateColorVariableCache()`**: UIの色変数キャッシュを無効化します。
- **`getColorVariable()`**: CSSカスタムプロパティから色変数の値を取得します。
- **`setPlayButtonAppearance(src/main.ts)`**: 再生ボタンの見た目を現在の再生状態（再生中、一時停止など）に応じて更新します。
- **`stopPlaybackAndResetLoop()`**: 現在の音声再生を停止し、ループ設定をリセットします。
- **`getAudioCacheKey()`**: 現在のテキストと設定に基づいた音声キャッシュのキーを生成します。
- **`setTextAndPlay()`**: 指定されたテキストを設定し、音声を再生します。
- **`downloadLastAudio()`**: 最後に再生された音声データをダウンロードします。
- **`scheduleAutoPlay()`**: 条件が満たされた場合に音声の自動再生をスケジュールします。
- **`confirmResetIntonationBeforePlay()`**: イントネーションのリセットをユーザーに確認するダイアログを表示します。
- **`handlePlayButtonClick()`**: 再生ボタンがクリックされた際のイベントを処理します。
- **`handlePlay()`**: 音声再生の開始ロジックを処理します。
- **`triggerPlay()`**: プログラム的に音声再生をトリガーします。
- **`cleanup()`**: アプリケーション終了時やリセット時に必要なクリーンアップ処理を実行します。
- **`handleReset()`**: アプリケーションの状態を初期値にリセットするイベントを処理します。
- **`handleCancel()`**: 現在の処理（例: 音声合成）をキャンセルするイベントを処理します。
- **`saveDelimiter()`**: テキスト分割区切り文字の設定を保存します。
- **`scheduleSaveDelimiter()`**: 区切り文字設定の保存を遅延してスケジュールします。
- **`updateSpectrogramScaleLabel()`**: スペクトログラムのスケール表示ラベルを更新します。
- **`updateIntonationKeyboardToggle()`**: イントネーションキーボードの有効/無効を切り替えるUIを更新します。
- **`getSelectedStyleId(src/styleManager.ts)`**: 現在選択されているVOICEVOXスタイルのIDを取得します。
- **`setSelectedStyleId()`**: VOICEVOXスタイルを選択し、UIに反映させます。
- **`getStyleLabel()`**: スタイルIDから表示用のラベルを取得します。
- **`getStyleById()`**: 指定されたIDのスタイル情報を取得します。
- **`resolveStyleMarker()`**: スタイルマーカー（話者識別子）を解決します。
- **`parseDelimiterConfig()`**: 区切り文字の設定をパースします。
- **`addSegment()`**: テキストセグメントを追加します。
- **`buildTextSegments()`**: 入力テキストを区切り文字に基づいてセグメントに分割します。
- **`populateStyleSelect()`**: スタイル選択ドロップダウンリストにVOICEVOXスタイルを読み込みます。
- **`fetchVoiceStyles()`**: VOICEVOXローカルサーバーから利用可能な音声スタイルの一覧を取得します。
- **`loadStoredList(src/textLists.ts)`**: ローカルストレージから保存されたテキストリスト（履歴やお気に入り）を読み込みます。
- **`persistList()`**: 現在のテキストリストをローカルストレージに保存します。
- **`persistLists()`**: 複数のテキストリストをまとめてローカルストレージに保存します。
- **`dedupeAndLimit()`**: テキストリストから重複を削除し、指定された数に制限します。
- **`renderList()`**: 指定されたテキストリストをUIに描画します。
- **`renderTextLists()`**: 複数のテキストリスト（履歴、お気に入り）をUIに描画します。
- **`moveToFavorites()`**: テキストを履歴からお気に入りリストに移動します。
- **`moveToHistory()`**: テキストをお気に入りから履歴リストに移動します。
- **`addToHistory()`**: 新しいテキストを履歴リストに追加します。
- **`initializeTextLists()`**: テキストリスト（履歴、お気に入り）のUIを初期化し、イベントハンドラを設定します。
- **`updateExportButtonState(src/uiControls.ts)`**: エクスポートボタンの有効/無効状態を更新します。
- **`getSpectrogramScale(src/visualization.ts)`**: スペクトログラムの現在のスケール値を取得します。
- **`setSpectrogramScale()`**: スペクトログラムの表示スケールを設定します。
- **`requestSpectrogramReset()`**: スペクトログラムの表示リセットを要求します。
- **`isPlaybackActive()`**: 現在音声が再生中であるかを判定します。
- **`stopActivePlayback()`**: アクティブな音声再生を停止します。
- **`prepareCanvas()`**: 視覚化用のCanvas要素を準備し、初期設定を行います。
- **`fftRadix2()`**: 高速フーリエ変換 (FFT) のラディックス2アルゴリズムを実装します。
- **`getHannWindow()`**: 音声処理に使用するHann窓関数を生成します。
- **`estimateFrequencySeries()`**: 周波数系列を推定します。
- **`drawRenderedWaveform()`**: 既にレンダリングされた音声の波形をCanvasに描画します。
- **`drawRealtimeWaveform()`**: リアルタイムで入力される音声の波形をCanvasに描画します。
- **`determineSpectrogramCeiling()`**: スペクトログラム表示の天井（最大周波数）を決定します。
- **`estimateFundamentalFrequency()`**: 基本周波数（F0）を推定します。
- **`computeSegmentStats()`**: 音声セグメントの統計情報を計算します。
- **`computeSegmentCorrelation()`**: 音声セグメント間の相関を計算します。
- **`extractAlignedRealtimeSegment()`**: リアルタイム音声からアライメントされたセグメントを抽出します。
- **`drawSpectrogram()`**: 音声の周波数スペクトルを時間軸に沿って色で表現するスペクトログラムをCanvasに描画します。
- **`initializeVisualizationCanvases()`**: 音声視覚化用の複数のCanvas要素を初期化します。
- **`playAudio()`**: 取得した音声データをブラウザで再生します。
- **`updateProgressLines()`**: 再生進行状況を示すプログレスラインをCanvas上で更新します。
- **`clearProgressLines()`**: Canvas上のプログレスラインをクリアします。
- **`render()`**: 視覚化Canvasの描画処理をフレームごとに実行します。
- **`finalize()`**: 視覚化処理の最終的なクリーンアップを行います。
- **`stopPlayback()`**: 音声の再生を停止します。

## 関数呼び出し階層ツリー
```
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
    - playUpdatedIntonation ()
    - fetchAndRenderIntonation ()
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
- setPlayButtonAppearance (src/main.ts)
  - stopPlaybackAndResetLoop ()
    - getAudioCacheKey ()
    - setTextAndPlay ()
    - downloadLastAudio ()
    - scheduleAutoPlay ()
    - confirmResetIntonationBeforePlay ()
    - handlePlayButtonClick ()
    - handlePlay ()
    - cleanup ()
    - handleCancel ()
    - updateSpectrogramScaleLabel ()
    - updateIntonationKeyboardToggle ()
    - getSelectedStyleId ()
    - setSelectedStyleId ()
    - parseDelimiterConfig ()
    - buildTextSegments ()
    - populateStyleSelect ()
    - fetchVoiceStyles ()
    - addToHistory ()
    - initializeTextLists ()
    - getSpectrogramScale ()
    - setSpectrogramScale ()
    - requestSpectrogramReset ()
    - isPlaybackActive ()
    - stopActivePlayback ()
- hideStatus ()
  - invalidateColorVariableCache ()
- getStyleLabel ()
  - getStyleById ()
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
- triggerPlay (src/main.ts)
- handleReset (src/main.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- stopPlayback (src/visualization.ts)

---
Generated at: 2026-02-13 07:05:47 JST
