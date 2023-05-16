# chat_app_FE

<br />

<div align="center"><strong>Start your next react project in seconds</strong></div>
<div align="center">A highly scalable, offline-first foundation with the best DX and a focus on performance and best practices</div>

<br />

<div align="center">
  <!-- Build Status -->
  <a href="https://travis-ci.org/react-boilerplate/react-boilerplate">
    <img src="https://travis-ci.org/react-boilerplate/react-boilerplate.svg" alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/react-boilerplate/react-boilerplate">
    <img src="https://coveralls.io/repos/github/react-boilerplate/react-boilerplate/badge.svg" alt="Test Coverage" />
  </a>
  <a href="https://spectrum.chat/react-boilerplate">
  <img alt="Chat with us on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a>

</div>
<div align="center">
    <!-- Backers -->
  <a href="#backers">
    <img src="https://opencollective.com/react-boilerplate/backers/badge.svg" alt="Backers" />
  </a>
      <!-- Sponsors -->
  <a href="#sponsors">
    <img src="https://opencollective.com/react-boilerplate/sponsors/badge.svg" alt="Sponsors" />
  </a>
  <a href="http://thinkmill.com.au/?utm_source=github&utm_medium=badge&utm_campaign=react-boilerplate">
    <img alt="Supported by Thinkmill" src="https://thinkmill.github.io/badge/heart.svg" />
  </a>
</div>

<br />

<div align="center">
  <sub>Created by <a href="https://twitter.com/mxstbr">Max Stoiber</a> and maintained with ❤️ by an amazing <a href="https://github.com/orgs/react-boilerplate/people">team of developers</a>.</sub>
</div>

## Features

Account Test :
test01/1
test02/1

<dl>
  <dt>Quick scaffolding</dt>
  <dd>Create components, containers, routes, selectors and sagas - and their tests - right from the CLI!</dd>

  <dt>Instant feedback</dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes to the CSS and JS are reflected instantaneously without refreshing the page. Preserve application state even when you update something in the underlying code!</dd>

  <dt>Predictable state management</dt>
  <dd>Unidirectional data flow allows for change logging and time travel debugging.</dd>

  <dt>Next generation JavaScript</dt>
  <dd>Use template strings, object destructuring, arrow functions, JSX syntax and more.</dd>

  <dt>Next generation CSS</dt>
  <dd>Write composable CSS that's co-located with your components for complete modularity. Unique generated class names keep the specificity low while eliminating style clashes. Ship only the styles that are on the page for the best performance.</dd>

  <dt>Industry-standard routing</dt>
  <dd>It's natural to want to add pages (e.g. `/about`) to your application, and routing makes this possible.</dd>

  <dt>Industry-standard i18n internationalization support</dt>
  <dd>Scalable apps need to support multiple languages, easily add and support multiple languages with `react-intl`.</dd>

  <dt>Offline-first</dt>
  <dd>The next frontier in performant web apps: availability without a network connection from the instant your users load the app.</dd>

  <dt>Static code analysis</dt>
  <dd>Focus on writing new features without worrying about formatting or code quality. With the right editor setup, your code will automatically be formatted and linted as you work.</dd>

  <dt>SEO</dt>
  <dd>We support SEO (document head tags management) for search engines that support indexing of JavaScript content. (eg. Google)</dd>
</dl>

But wait... there's more!

- _The best test setup:_ Automatically guarantee code quality and non-breaking
  changes. (Seen a react app with 100% test coverage before?)
- _Native web app:_ Your app's new home? The home screen of your users' phones.
- _The fastest fonts:_ Say goodbye to vacant text.
- _Stay fast_: Profile your app's performance from the comfort of your command
  line!
- _Catch problems:_ AppVeyor and TravisCI setups included by default, so your
  tests get run automatically on Windows and Unix.

There’s also a <a href="https://vimeo.com/168648012">fantastic video</a> on how to structure your React.js apps with scalability in mind. It provides rationale for the majority of boilerplate's design decisions.

<sub><i>Keywords: React.js, Redux, Hot Reloading, ESNext, Babel, react-router, Offline First, ServiceWorker, `styled-components`, redux-saga, FontFaceObserver</i></sub>

## Quick Install

1.  Make sure that you have Node.js v8.15.1 and npm v5 or above installed.
2.  Clone this repo using `git clone --depth=1 git@github.com:duyanh4788/chat_app_FE.git || https://github.com/duyanh4788/chat_app_FE.git`
3.  Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.<br />
4.  Copy file `example.env.dev` to `.env`
5.  Run `npm run install & yarn install` in order to install dependencies.<br />
6.  Run `npm start & yarn start` in order to install dependencies.<br />
    _At this point you can see the example app at `http://localhost:3000`._
    Now you're ready to rumble!

> You can run with docker or docker-compose <br
> `$ docker build -t sample:dev .` <br> > `$ docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true sample:dev` <br>
> or
> `$ docker-compose up -d --build` <br> > `$ docker-compose stop` <br>

## Deployment

1.  Make sure that you have Node.js v8.15.1 and npm v5 or above installed.
2.  Clone this repo using `git clone --depth=1 git@github.com:duyanh4788/chat_app_FE.git || https://github.com/duyanh4788/chat_app_FE.git`
3.  Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.<br />
4.  Copy file `example.env.prod` to `.env`
5.  Run `npm run install` & `yarn install` in order to install dependencies.
6.  Run `npm run build` & `yarn build` in order to build productions.

> Config IIS Service to deployment as link below https://inthetechpit.com/2019/06/13/handle-client-side-routes-with-iis-on-page-refresh-react-app/

Quick scaffolding First install the URL Rewrite module on the IIS Server. Then create a web.config file for your App or create a new one with code as shown below:

```
  <?xml version="1.0" encoding="UTF-8"?>
  <configuration>
    <system.webServer>
    <rewrite>
      <rules>
      <rule name="ReactRouter Routes" stopProcessing="true">
        <match url=".*" />
        <conditions logicalGrouping="MatchAll">
        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
        </conditions>
        <action type="Rewrite" url="index.html" />
      </rule>

      </rules>
    </rewrite>
    </system.webServer>
  </configuration>
```

> Dockerizing Production Mode <br> > `$ docker build -f Dockerfile.prod -t sample:prod .`<br> > `$ docker run -it --rm -p 1337:80 sample:prod` <br>
> or
> `$ docker-compose -f docker-compose.prod.yml up -d --build`

## Release Production URL Reference

  <div align="left">
    <strong>
      <a href="https://chat-app-fe.vercel.app/">https://chat-app-fe.vercel.app/</a>
    </strong>
  </div>

## Documentation

- [**The Hitchhiker's Guide to `react-boilerplate`**](docs/general/introduction.md): An introduction for newcomers to this boilerplate.
- [Overview](docs/general): A short overview of the included tools
- [**Commands**](docs/general/commands.md): Getting the most out of this boilerplate
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.
- [**Troubleshooting**](docs/general/gotchas.md): Solutions to common problems faced by developers.

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
