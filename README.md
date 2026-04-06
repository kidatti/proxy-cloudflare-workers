# Proxy Cloudflare Workers

任意の URL を Cloudflare Workers 経由で取得するプロキシ API です。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kidatti/proxy-cloudflare-workers)

> Worker 名はデプロイ時に任意に変更できます。

## 前提条件

- [Node.js](https://nodejs.org/) (v18 以上)
- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up)

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Workers CLI) は `devDependencies` に含まれているため、`npm install` で自動的にインストールされます。グローバルインストールは不要です。

## API Key の設定

シークレットとして `API_KEY` を設定すると、キーなしのリクエストを拒否します。

```bash
npx wrangler secret put API_KEY
```

設定しなければ認証なしで動作します。

## Usage

```
# クエリパラメータで渡す
GET /?url=https://example.com&key=YOUR_API_KEY

# または Authorization ヘッダーで渡す
GET /?url=https://example.com
Authorization: Bearer YOUR_API_KEY
```

レスポンスは対象 URL のコンテンツがそのまま返ります（CORS ヘッダー付き）。

## Local Development

```bash
npm install
npx wrangler dev
```

ローカルで API_KEY を試す場合は `.dev.vars` を作成してください。

```
API_KEY=your-secret-key
```

## Deploy

```bash
npm install
npx wrangler deploy
npx wrangler secret put API_KEY
```
