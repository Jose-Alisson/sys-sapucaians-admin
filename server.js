import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import { exec } from 'child_process'
import { generateOrderToText } from './utils.js'
import fs from 'fs';
import os from 'os';
import { Server } from 'socket.io'
import http from 'http'
import { createProxyMiddleware } from 'http-proxy-middleware';
import httpProxy from 'http-proxy'
import runApp from './main.js';

dotenv.config()

export const port = 5050;

// Servir arquivos estáticos da pasta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const proxy = httpProxy.createProxyServer({
  target: 'wss://pizzariasapucaians.com.br',
  changeOrigin: true,
  ws: true
})
const httpServer = http.createServer(app)
const wsServer = new Server(httpServer, {
  transports: ['websocket']
})

app.use(express.static(path.join(__dirname, '/dist/joliny-admin/browser/')));

app.use('/pedidos', createProxyMiddleware({
  target: 'https://pizzariasapucaians.com.br/pedidos',
  changeOrigin: true,
}));

app.use('/main', createProxyMiddleware({
  target: 'https://pizzariasapucaians.com.br/main',
  changeOrigin: true,
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/joliny-admin/browser/', 'index.html'));
});

httpServer.on('upgrade', function (req, socket, head) {
  if(req.url.startsWith('/main/')){
    req.url = req.url.replace('/main/', 'socket.io/')
    console.log(req.url)
    proxy.ws(req, socket, head, () => {
    })
  }
})

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  runApp()
});

let impressoras = []

let config_ = {
  printer: '',
  width: 58,
  height: 210
}

exec(`jl list`, (error, stdout, stderr) => {
  impressoras = stdout.split("\r\n")
  wsServer.sockets.emit("listar-impressoras", stdout.split("\r\n"))
})

exec(`jl list`, (error, stdout, stderr) => {
  impressoras = stdout.split("\r\n")
  wsServer.sockets.emit("listar-impressoras", stdout.split("\r\n"))
})

wsServer.on('connection', (socket) => {
  console.log(socket.id)
  socket.emit('listar-impressoras', impressoras)

  socket.on('obter-impressoras', () => {
      socket.emit("listar-impressoras", impressoras)
  })

  socket.on('preview', (config, order) => {
      config_ = config
      const tempFileName = path.join(os.tmpdir(), 'jlPrinterFile.jl');
      fs.writeFileSync(tempFileName, generateOrderToText(order), 'utf8');
      exec(`jl view ${config.width} ${config.height} ${tempFileName}`, (error, stdout, stderr) => {
          if (error) {
              console.error(`${error.message}`);
              return;
          }

          if (stderr) {
              console.error(`Erro na saída do comando: ${stderr}`);
              return;
          }

          if (fs.existsSync(tempFileName)) {
              fs.unlinkSync(tempFileName);
          }

          const bytesArray = stdout.trim().split(',').map(byte => parseInt(byte.trim(), 10));
          const buffer = Buffer.from(bytesArray);
          socket.emit('view', buffer.toString('base64'));
      });

  })

  socket.on('imprimir', (config, order) => {
      print(config, generateOrderToText(order))
  })
})

wsServer.on('imprimir', (texto) => {
  print(config_, generateOrderToText(texto))
})

function print(config, text){
  config_ = config
  const tempFileName = path.join(os.tmpdir(), 'jlPrinterFile.jl');

  fs.writeFileSync(tempFileName, text, 'utf8');

  exec(`jl print ${config.width} ${config.height} ${tempFileName} --print='${config.printer}'`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Erro ao executar o comando: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Erro na saída do comando: ${stderr}`);
          return;
      }
      if (fs.existsSync(tempFileName)) {
          fs.unlinkSync(tempFileName);
      }
  });
}