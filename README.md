# loogs.tf
## Embed logs.tf data on Discord

Inspired by [TweetFix](https://github.com/FixTweet/FixTweet), adding an o to a logs.tf url embeds a screenshot of the log page.

![Sample Log](/sample_log.png)

Uses Next.js, while also using Express to serve static images.

Currently deployed on [Railway](https://railway.app), and not Vercel due to its 50MB server page limit, restricting the use of puppeteer.
