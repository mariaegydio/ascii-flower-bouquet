# Git & GitHub — Guia de Consulta

Este arquivo reúne os principais comandos Git utilizados no desenvolvimento do projeto ASCII Flower Bouquet.

## 1. Configuração inicial

Verificar a versão instalada:

```bash
git --version
```

Configurar nome de usuário:

```bash
git config --global user.name "Seu Nome"
```

Configurar e-mail:

```bash
git config --global user.email "seu-email@email.com"
```

## 2. Inicialização do projeto

Inicializar o Git na pasta:

```bash
git init
```

Verificar o estado dos arquivos:

```bash
git status
```

## 3. Registrar alterações

Adicionar todos os arquivos modificados à área de preparação:

```bash
git add .
```

Registrar uma versão no histórico:

```bash
git commit -m "Descrição da alteração"
```

Exemplos de commits:

```bash
git commit -m "Initial project structure"
git commit -m "Add canvas drawing area"
git commit -m "Implement flower petals"
git commit -m "Add flower animation"
```

## 4. Conectar ao GitHub

Definir a branch principal:

```bash
git branch -M main
```

Adicionar o repositório remoto:

```bash
git remote add origin URL_DO_REPOSITORIO
```

Enviar o projeto pela primeira vez:

```bash
git push -u origin main
```

Nos próximos envios:

```bash
git push
```

## 5. Consultar histórico

Visualizar os commits:

```bash
git log
```

Visualizar o histórico resumido:

```bash
git log --oneline
```

Verificar os repositórios remotos:

```bash
git remote -v
```

## 6. Atualizar o projeto

Buscar e integrar alterações do repositório remoto:

```bash
git pull
```

## 7. Fluxo diário de trabalho

Sempre que finalizar uma alteração:

1. Verificar os arquivos modificados.
2. Adicionar as alterações.
3. Criar um commit.
4. Enviar as alterações ao GitHub.

```bash
git status
git add .
git commit -m "Descrição da alteração"
git push
```

## 8. Conceitos importantes

- **Repository:** local onde o projeto e seu histórico são armazenados.
- **Commit:** registro de uma versão do projeto.
- **Branch:** linha independente de desenvolvimento.
- **Main:** branch principal do projeto.
- **Remote:** repositório hospedado em uma plataforma externa, como GitHub.
- **Push:** envio de commits para o repositório remoto.
- **Pull:** busca e integração de atualizações remotas.
- **Working directory:** diretório onde trabalhamos nos arquivos.
- **Staging area:** área onde selecionamos as alterações que entrarão no próximo commit.

---

Projeto: ASCII Flower Bouquet

Tecnologias: HTML, CSS, JavaScript e Canvas API.

Objetivo: desenvolver uma arte generativa de flores enquanto estudo programação, geometria, matemática e controle de versão.