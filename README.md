# Molecule

**Clone e execute para ter acesso ao codigo fonte do Molecule.**

O Molecule é uma aplicação de gestão de vendas multiplataforma open source que utiliza o [Electron](http://electronjs.org/) e o [Vue](http://vuejs.org/).

**Esta é a versão Open Source para desenvolvedores. Caso queira instalar o Molecule em seu sistema, vá para o [meu site](http://danielbonifacio.com.br/) e baixe a versão para o seu sistema.**

Você precisa prestar atenção nestes 3 arquivos:

- `package.json` - Aponta informações e dependências do app.
- `main.js` - Inicia toda a aplicação (janelas e comunicação com o SO).
- `index.html` - A página do app renderizada.

Você pode aprender um pouco mais sobre o electron neste link: [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

## Como usar

Para clonar este repositório e iniciar o desenvolvimento, você precisa do [Git](https://git-scm.com) e do [Node](https://nodejs.org/en/download/) (e instalar o npm [npm](http://npmjs.com)) no seu computador. Digite no seu terminal:

```bash
# Clone o repositório
git clone https://github.com/danielbonifacio/molecule
# Entre na pasta do repositório
cd molecule
# Instale as dependencias
npm install
# Execute o programa
npm start
```

Nota: Se você está utilizando o Linux Bash for Windows, [veja este artigo](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) ou use `node` no prompt de comando.

## Links que podem ser úteis

- [electronjs.org/docs](http://electronjs.org/docs) - Documentação do Electron
- [v1.vuejs.org/guide/](https://v1.vuejs.org/guide/) - Documentação do VueJS (v1)
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - um starter básico de aplicação com Electron

## Licença

[GNU General Public License (GPL)](LICENSE.md)
