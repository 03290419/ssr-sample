import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import path from 'path';
import App from './App';
import fs from 'fs';

const manifest = JSON.parse(
    fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
);

function createPage(root) {
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
   <script src="${manifest.files['main.js']}"></script>
  </body>
</html>

    `;
}

const app = express();
const serverRender = (req, res, next) => {
    const context = {};
    const jsx = (
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx); //렌더링을 하고 클라이언트에게 결과물을 응답한다.
    res.send(createPage(root));
};
const serve = express.static(path.resolve('./build'), {
    index: false, // "/" 경로에서 index.html을 보여주지 않도록 설정
});
app.use(serve);
app.use(serverRender);

app.listen(5000, () => {
    console.log('Running on http://localhost:5000');
});
