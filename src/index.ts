import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(async () => {
  const app = express();
  const port: number = 3000;

  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  
  app.use('/js', express.static(path.join(__dirname, './js')))
  app.use('/css', express.static(path.join(__dirname, './css')))
  app.use('/tictactoe', express.static(path.join(__dirname, './main.html')))
  

  app.listen(process.env.PORT || port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });

})();
