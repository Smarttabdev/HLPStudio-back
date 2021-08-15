# HLP-studio

## How to deploy in HostGator cpanel

## Frontend setup

```
cd HLP-studio-front
npm run build
```

## Backend push to GitHub.com

```
git add .
git commit -M "deploy"
git push
```

## Connect shared host via ssh

### Run putty.exe then input [gator3148.hostgator.com](gator3148.hostgator.com) into host and set port 22

### then click open

![](https://github.com/AnnaAn117/HLPStudio-back/blob/main/putty_setting.png)

### input username and password in putty terminal

![](https://github.com/AnnaAn117/HLPStudio-back/blob/main/putty_terminal_login.png)

`Clone repository from` [github.com/AnnaAn117](https://github.com/AnnaAn117/HLPStudio-back)

```
cd ~/HLP-Studio
git clone https://github.com/AnnaAn117/HLPStudio-back.git
```

`Install dependency and run`

```
cd HLP-studio-back/
npm install
npm start --production
```

`Run with process`

```
nohup npm start --production &
```

`Kill process`

```
pkill node
```

See [Deployed here](http://hlpstudio.net/login).
