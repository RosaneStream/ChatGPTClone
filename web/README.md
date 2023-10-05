# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Iniciando o projeto

- Crie as pastas
  Chatgpt-clone
  Server
  Web

- Mude para a pasta do servidor
  Cd server

- Inicie o node 
  Npm init -y

- Indique que deseja iniciar a codificação 
  "Code ." --> abrirá a pasta do projeto no VsCode

- Abra o terminal com "CTRL “"

- Instale os pacotes
  Npm i cors dotenv express openai

- No projeto, fora das pastas, crie 2 arquivos: o .env e o .gitignore

  - Em .env escreva
    OPEN_AI_KEY=""
    PORT=5555

  - Em .gitignore escreva
    node_modules/
    .env

# Criando o servidor

- Em app.js
  const express = require ("express")
  const cors = require("cors")

  require("dotenv").config()

  const app = express()

  app.use(express.json())
  app.use(cors())

  module.exports = app

- Em server.js
  const app = require("./app")
  const port = process.env.PORT || 3000

  app.listen(port, ()=>{
  console.log(`Server listening on port ${port}`)
  } )

- Execute
  node src/server

- Logo que verificar a execução, saia com "CTRL C", e depois execute
  node --watch src/server

- No site openai.com selecione View API Keys , create new API Key e copie a chave
  Atualize o arquivo .env com a chave gerada
  OPEN_AI_KEY="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"
  PORT=5555

- Crie a past config e o arquivo openai.js

- No site do chatgpt entre na aba playground e set as configurações

  - Entre em “view code” e selecione o código na linguagem que você está utilizando
  - Cole no arquivo openai.js
  - import OpenAI from "openai";

    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: "",
    temperature: 0.3,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    });

- Modifique o código de forma que seja criada uma classe no export e possa ser chamado por fora

  const {Configuration, OpenAIApi} = require("openai")

  module.exports = class openai{

      static configuration(){
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        })
        return new OpenAIApi(configuration)

      }

      static textCompletion({prompt}){
        return{
          model: "text-davinci-003",
          prompt: `${prompt}`,
          temperature: 0.3,
          max_tokens: 4000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }
      }

  }

- Criando um controller

  - Crie a pasta controllers e routers
  - Crie em controllers o arquivo prompt-controller.js e codifique

    const openai = require("../config/openai")

    module.exports ={
    async sendText(req,res){
    const openaiAPI = openai.configuration()

        try {
          const response = await openaiAPI.createCompletion(
            //openai.textCompletion(`${prompt}`)
            openai.textCompletion("What is the name of the Jesus' parents?")
          )
          return res.status(200).json({
            sucess: true,
            data: response.data.choices[0].text
          })
        } catch (error) {
          return res.status(400).json({
            sucess: false,
            data: error.response ? error.response:
            "There was an issue on the server"
          })

        }

    }
    }

- Configurando as rotas

  - Crie a pasta models e o arquivo input-prompt.js
  - Atualize o código do prompt-controller.js chamando o input-prompt
    const inputPrompt = require("../models/input-prompt")
    const openai = require("../config/openai")

    module.exports ={
    async sendText(req,res){
    const openaiAPI = openai.configuration()
    const inputModel = new inputPrompt(req.body)
    try {
    const response = await openaiAPI.createCompletion(
    openai.textCompletion(inputModel)
    )
    return res.status(200).json({
    sucess: true,
    data: response.data.choices[0].text
    })
    } catch (error) {
    return res.status(400).json({
    sucess: false,
    data: error.response ? error.response:
    "There was an issue on the server"
    })

        }

    }
    }

- Codifique o arquivo routers.js na pasta routers
  const express = require("express")
  const promptController = require("./controllers/prompt-controller")
  const { sendText } = require("../controllers/prompt-controller")
  const routers = express.Router()

  routers.post('api/prompt', promptController.sendText)

  module.exports = routers

# Criando o Front-End

- Instale o react para criar o front end
  npm install -g create-react-app
- Crie o app
  npx create-react-app gpt-front
- Coloque o conteudo dessa pasta na pasta web e apague a pasta gpt-front
- Apague os arquivos com “test” , “report...”
- Apague referencias dos arquivos apagados em index.js
- Mude para a pasta web com o comando
  cd web
- Execute o comando
  npm start
- Pare o projeto com "CTRL C"
- Instale o axios para consumir os recursos HTTP
  npm i axios
- Crie a pasta styles e o arquivo reset.css
  Copie o código do site https://meyerweb.com/eric/tools/css/reset/
  e cole no arquivo reset.css
- Adicione o seguinte código no arquivo
  html{
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  font-size: 16px;
  }

  img{
  max-width: 100%;
  height: auto;
  }

  _, _:before,\*:after{
  box-sizing: inherit;
  }

- Transfira todos os outros arquivos css para a pasta styles

- Atualize o código do arquivo App.js
  import './styles/App.css';
  import './styles/reset.css';
  import { MakeRequest } from './api/api';
  import { useState } from 'react';

  function App() {
  return (
  <div className="App">
  <h1>App works</h1>
  </div>
  );
  }
  export default App;

- Crie a pasta componentes, a pasta SideMenu, e os arquivos SideMenu.js e SideMenu.css
- Codifique SideMenu.js
  import React from 'react'
  import './SideMenu.css'

  export const SideMenu = () =>{
  return(
  <aside className='sidemenu'>
  <div className ='sidemenu-button'>
  <span> +
  </span>
  Novo chat
  </div>
  </aside>
  )
  }

- Codifique SideMenu.css
  .sidemenu{
  width: 260px;
  padding: 10px;
  background-color: #202123;
  }

  .sidemenu-button{
  padding: 15px;
  border-radius: 5px;
  text-align: left;
  transition: ease 0.25 all;
  }

  .sidemenu-button:hover{
  background-color: rgba(255,255,255,0.1);
  }

  .sidemenu-button span{
  padding-left: 6px;
  padding-right: 12px;
  }

- Atualize App.css
  .App {
  text-align: center;
  position: absolute;
  top: 0;
  bottom:0;
  left:0;
  right:0;
  display: flex;
  color:white;
  background-color: #282c34;
  }

- Em src, crie a pasta assets e o arquivo avatar.js
  import React from "react";

  const Avatar = (props) =>{
  return(
  <svg>

        </svg>
      )

  }

  export default Avatar

- Adicione em chatMessage.js o Código importando o Avatar
  import React from "react";
  import './ChatMessage.css'
  import Avatar from "../../assets/avatar";
  //user (user ou chatgpt)
  // message- where the prompt is

  // {
  // user:'gpt'
  // message:"Create a name for an article"
  // }
  export const ChatMessage =({message}) =>{
  <div className = {`chat-message ${message.user === 'gpt' && "chatgpt"}`}>
  <div className = "chat-message-center">
  <div className = {
  `avatar 
          ${message.user === 'gpt' && "chatgpt"}`}>
  {message.user === 'gpt' && (
  <Avatar>
  </Avatar>
  )}
  </div>

          <div className = "message">
            message.message
          </div>
        </div>

      </div>

  }

- Atualize o chatMessage.css
  .chat-message.chatgpt{
  background-color: #444654;

  }

  .chat-message.center{
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  padding: 12px;
  padding-left: 24px;
  padding-right: 24px;
  }

  message{
  padding-left: 40px;
  padding-right: 40px;
  }

# Usand o SVG real do ChatGPT

- Abra o site oficial e entre no chat, clique no logo, selecione inspecionar elemento e copiar elemento. Atualize o código de avatar.js com o path copiado.
  import React from "react";

  const Avatar = (props) =>{
  return(
  <svg>
  <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path>
  </svg>
  )
  }

  export default Avatar

# Definindo os hooks dos estados que vamos utilizar

- Atualize a App.js
  import { useState } from 'react';
  import './styles/App.css';
  import './styles/reset.css';
  import { MakeRequest } from './api/api';
  import { SideMenu } from './components/SideMenu/SideMenu';

  function App() {
  const[input, setInput] = useState("")
  const[chatlog, setChatLog] = useState([{
  user: "gpt",
  message: "How can I help you today?"
  }])

      return (
        <div className="App">
          <SideMenu></SideMenu>
          <h1>App works</h1>
        </div>
      );

  }

  export default App;

# Implementando o log de chat

- Atualize o App.js

  import { useState } from 'react';
  import './styles/App.css';
  import './styles/reset.css';
  import { MakeRequest } from './api/api';
  import { SideMenu } from './components/SideMenu/SideMenu';
  import { ChatMessage } from './components/ChatMessage/ChatMessage';

  function App() {
  const[input, setInput] = useState("")
  const[chatlog, setChatLog] = useState([{
  user: "gpt",
  message: "How can I help you today?"
  }])

  async function handleSubmit(e){
  //ToDo
  }
  return (
  <div className="App">
  <SideMenu></SideMenu>
  <section className ='chatbox'>
  <div className = 'chat-log'>
  {chatlog.map((message, index) => (
  <ChatMessage key={index} message = {message}>
  </ChatMessage>))
  }
  </div>
  <div className = 'chat-input-holder'>
  <form onSubmit = {handleSubmit}>
  <input
  rows='1'
  className = 'chat-input-textarea'  
   value={input}
  onChange={e=> setInput(e.target.value)} >

              </input>
            </form>

          </div>

        </section>
        <h1>App works</h1>
      </div>

  );
  }

  export default App;

# Trabalhando com formularios e prevenção de eventos

    import { useState } from 'react';
    import './styles/App.css';
    import './styles/reset.css';
    import { MakeRequest } from './api/api';
    import { SideMenu } from './components/SideMenu/SideMenu';
    import { ChatMessage } from './components/ChatMessage/ChatMessage';

    function App() {
      const[input, setInput] = useState("")
      const[chatlog, setChatLog] = useState([{
        user: "gpt",
        message: "How can I help you today?"
      }])

      async function handleSubmit(e){
        e.preventDefault()
        let response = await MakeRequest({prompt:input})
        response = response.data.split('\n').map(line =>
          <p>{line}</p>)

        setChatLog([...chatlog, {
          user:'me',
          message:`${input}`
        },
        {
          user:'gpt',
          message:response
        }
        ])
        setInput("")
      }
      return (
        <div className="App">
          <SideMenu></SideMenu>
          <section className ='chatbox'>
            <div className = 'chat-log'>
              {chatlog.map((message, index) => (
                    <ChatMessage key={index} message = {message}>
                    </ChatMessage>))
              }
            </div>
            <div className = 'chat-input-holder'>
              <form onSubmit = {handleSubmit}>
                <input
                  rows='1'
                  className = 'chat-input-textarea'
                  value={input}
                  onChange={e=> setInput(e.target.value)} >

                </input>
              </form>

            </div>

          </section>
          <h1>App works</h1>
        </div>
      );
    }

    export default App;

# Estilizando a tela principal

- Atualize o codifique do arquivo App.css
  .App {
  text-align: center;
  display: flex;
  background-color: #282c34;
  color:white;
  position: absolute;
  top:0;
  bottom: 0;
  right: 0;
  left: 0;
  }

  .App-logo {
  height: 40vmin;
  pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
  .App-logo {
  animation: App-logo-spin infinite 20s linear;
  }
  }

  .App-header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  }

  .App-link {
  color: #61dafb;
  }

  @keyframes App-logo-spin {
  from {
  transform: rotate(0deg);
  }
  to {
  transform: rotate(360deg);
  }
  }

  /_ chat css _/

  .chatbox{
  flex: 1;
  /_ border:1px solid white; _/
  background-color: #353541;
  position: relative;
  overflow-y:auto;
  }

  .chat-input-holder{
  padding:24px;
  position:absolute;
  bottom: 0;
  left:0;
  right: 0;
  }

  .chat-input-textarea{
  background-color: #40414f;
  width: 90%;
  padding: 12px;
  color:white;
  font-size: 1.5em;
  border-radius: 5px;
  border: none;
  border-color: none;
  margin:12px;
  outline: none;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0.25);
  resize: none;
  }

  .chat-log{
  text-align: left;
  white-space: "pre-wrap";
  }

  .chat-message.chatgpt{
  background-color: #444654;
  }

  .chat-message-center{
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  display: flex;

  padding: 12px;

  padding-left: 24px;
  padding-right: 24px;
  }

  .message{
  padding-left: 40px;
  padding-right: 40px;
  }

  .avatar{
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  }

  .avatar.chatgpt{
  background: #0da37f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  }

# Atualizando o watch do node

- Em server, insira o watch atualizando o código de package.json
  Assim, ele roda o projeto com o CTRL S
  {
  "name": "openai",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
  "start": "node --watch src/server.js",
  "dev": "nodemon src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "express": "^4.18.2",
  "openai": "^3.1.0"
  },
  "devDependencies": {
  "nodemon": "^2.0.20"
  }
  }

# Atualize o chatMessage.js inserindo o return para renderizar o conteúdo

    import React from "react";
    import './ChatMessage.css'
    import Avatar from "../../assets/avatar";
    //user (user ou chatgpt)
    // message- where the prompt is

    // {
    // user:'gpt'
    // message:"Create a name for an article"
    // }
    export const ChatMessage =({message}) =>{
    return(
    <div className = {`chat-message ${message.user === 'gpt' && "chatgpt"}`}>
    <div className = "chat-message-center">
    <div className = {
    `avatar
              ${message.user === 'gpt' && "chatgpt"}`}>
    {message.user === 'gpt' && (<Avatar></Avatar>)}
    </div>

            <div className = "message">
              message.message
            </div>
          </div>

        </div>

    )
    }
