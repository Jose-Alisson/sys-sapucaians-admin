import { app, BrowserWindow } from 'electron';
import path from 'path'
import { port } from './server.js';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // desativa a integração do Node.js para maior segurança ao carregar URLs externas
        },
    });

    // Carrega uma URL na janela do Electron
    mainWindow.loadURL(`http://localhost:${port}`);
}
function runApp(){
    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
}

export default runApp