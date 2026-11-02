# WORLD SIGNAL — Local Console

世界時計、昼夜マップ、ブラウザ・端末情報を一覧表示する静的ダッシュボード。英語学習サイトとは独立したプロジェクトです。

## 起動
index.html をブラウザで開くか、このフォルダで `python -m http.server 8080` を実行して http://localhost:8080 を開きます。ビルド・依存ライブラリ不要。

## 機能と制限
- 東京、ロンドン、ニューヨーク、UTC、シンガポール、シドニーの世界時計。端末時計と Intl API を使用し、夏時間に対応。
- 世界地図は試作HTML由来の装飾用模式図。昼夜境界は太陽赤緯とUTCによる概算で、航法・観測用途には不適。
- CPU論理数、RAM目安、画面情報はブラウザが公開する値のみ。使用率ではなく、非対応時は不明と表示。
- 接続状態は navigator.onLine の推定値。インターネット到達性や速度の測定ではありません。
- 公開IPはボタン操作時のみ https://api.ipify.org?format=json に問い合わせます。取得先には通信元IPが伝わります。6秒でタイムアウトし再試行できます。
- 天気と日の出・日の入りをlocalStorageに保存します。分析・追跡処理はありません。GitHub Pagesや外部取得先のアクセスログは各サービスの管理下です。
- 初期表示時に東京の天気をOpen-Meteoから取得します。APIキー不要。無料APIは非商用向け。天気は30分保存、日の出・日の入りは東京の日付ごとに取得。非表示中の定期通信は停止。月齢は東京正午を基準に平均朔望月から概算（精密な天文暦ではありません）。現在位置の取得はありません。データ帰属: https://open-meteo.com/ / CC BY 4.0。

## 構成
- index.html: 画面
- assets/css/style.css: スタイル
- assets/js/app.js: 表示・取得処理

## GitHub Pages
専用リポジトリに登録後、Settings → Pages → Deploy from a branch → main / (root) を選択します。
公開URL: https://seikoubon.github.io/world-signal-local-console/
公式手順: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 素材とライセンス
依頼者提供の cyber_world_dashboard.html をベースに整備。地図は元HTMLに含まれるSVG図形です。外部ライブラリ・画像・フォントの同梱はありません。再配布ライセンスは未設定です。

## 今後の拡張
都市の選択、表示設定の端末内保存、地図の精度向上。外部APIは必要性とプライバシーを確認して追加します。

## 検証記録（2026-11-02）
- JavaScript構文チェック通過。
- 昼夜判定は夏至・冬至・赤緯0度を含む40,500地点で数値検証済み。
- 公開ページで6都市の時計更新・日付・タイムゾーンを確認。
- BraveでPC画面とスマートフォン相当の表示領域375pxを確認。横はみ出しなし。
- 公開IPの任意取得成功とボタンの再操作を確認。
- 確認中のコンソール警告・エラーなし。
- 実機スマートフォン、別ブラウザ、オフライン・取得失敗時は未確認。
