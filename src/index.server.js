import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import path from 'path';
import App from './App';
import fs from 'fs';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules/index';
import PreloaderContext, { Preloader } from './libs/PreloadContext';

const manifest = JSON.parse(
    fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
);

function createPage(root, staticScript) {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
    <link href="${manifest.files['main.css']}" rel="stylesheet"/>
  </head>
  <body>
    <div id="root">
        ${root}
    </div>
    ${staticScript}
   <script src="${manifest.files['main.js']}"></script>
  </body>
</html>

    `;
}

const app = express();
const serverRender = async (req, res, next) => {
    const context = {};
    const store = createStore(rootReducer, applyMiddleware(thunk));
    const preloadContext = {
        done: false,
        promise: [],
    };
    const jsx = (
        <PreloaderContext.Provider value={preloadContext}>
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            </Provider>
        </PreloaderContext.Provider>
    );
    ReactDOMServer.renderToStaticMarkup(jsx); //renderToStaticMarkup으로 한 번 렌더링 한다.
    try {
        await Promise.all(preloadContext.promise); // 모든 프라미스를 기다린다.
    } catch (e) {
        return res.status(500);
    }
    preloadContext.done = true;

    const root = ReactDOMServer.renderToString(jsx); //렌더링을 하고 클라이언트에게 결과물을 응답한다.
    // JSON 파일을 문자열로 변환하고 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
    const stateString = JSON.stringify(store.getState()).require(
        /</g,
        '\\u003c'
    );
    const stateScript = `<script>__PRELOAD_STATE__=${stateString}</script>`; //리덕스 초기 상태를 스크립트로 주입한다.
    res.send(createPage(root, stateScript));
};
const serve = express.static(path.resolve('./build'), {
    index: false, // "/" 경로에서 index.html을 보여주지 않도록 설정
});
app.use(serve);
app.use(serverRender);

app.listen(5000, () => {
    console.log('Running on http://localhost:5000');
});
