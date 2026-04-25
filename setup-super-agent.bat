@echo off
title UPGRADE MULTI-AGENTES DEVIN-LIKE

echo ================================
echo ATUALIZANDO SISTEMA COM MULTI-AGENTES
echo ================================

cd super-agent-pro\backend

:: Instalar dependências extras
npm install fs-extra

:: Criar pastas
mkdir agents
mkdir core

:: ========================
:: CORE AI
:: ========================
echo import OpenAI from "openai";> core\ai.js
echo const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });>> core\ai.js
echo export async function runAgent(role, prompt) {>> core\ai.js
echo  const res = await openai.chat.completions.create({>> core\ai.js
echo    model: "gpt-4o-mini",>> core\ai.js
echo    messages: [{role:"system",content:role},{role:"user",content:prompt}]>> core\ai.js
echo  });>> core\ai.js
echo  return res.choices[0].message.content;>> core\ai.js
echo }>> core\ai.js

:: ========================
:: ANALYZER
:: ========================
echo import fs from "fs";> agents\analyzer.js
echo export function analyzeProject() {>> agents\analyzer.js
echo  if (!fs.existsSync("../output")) return {exists:false};>> agents\analyzer.js
echo  return {exists:true, files:fs.readdirSync("../output")};>> agents\analyzer.js
echo }>> agents\analyzer.js

:: ========================
:: REVIEWER
:: ========================
echo import { runAgent } from "../core/ai.js";> agents\reviewer.js
echo import fs from "fs";>> agents\reviewer.js
echo export async function reviewer() {>> agents\reviewer.js
echo  let content="";>> agents\reviewer.js
echo  const files=fs.readdirSync("../output");>> agents\reviewer.js
echo  for(const f of files){content+=fs.readFileSync("../output/"+f,"utf-8");}>> agents\reviewer.js
echo  return await runAgent("engenheiro senior","Analise e sugira melhorias seguras:"+content);>> agents\reviewer.js
echo }>> agents\reviewer.js

:: ========================
:: IMPROVER
:: ========================
echo import { runAgent } from "../core/ai.js";> agents\improver.js
echo import fs from "fs";>> agents\improver.js
echo export async function improver(review) {>> agents\improver.js
echo  const result=await runAgent("especialista em refatoração","Melhore sem quebrar:"+review);>> agents\improver.js
echo  fs.writeFileSync("../output/improvements.txt",result);>> agents\improver.js
echo }>> agents\improver.js

:: ========================
:: BACKUP
:: ========================
echo import fs from "fs-extra";> core\backup.js
echo export function backupProject(){fs.copySync("../output","../backup");}>> core\backup.js

:: ========================
:: ORCHESTRATOR
:: ========================
echo import { analyzeProject } from "./agents/analyzer.js";> orchestrator.js
echo import { reviewer } from "./agents/reviewer.js";>> orchestrator.js
echo import { improver } from "./agents/improver.js";>> orchestrator.js
echo import { backupProject } from "./core/backup.js";>> orchestrator.js
echo.>> orchestrator.js
echo export async function runProject(input,log){>> orchestrator.js
echo  const analysis=analyzeProject();>> orchestrator.js
echo  if(!analysis.exists){>> orchestrator.js
echo    log("Projeto novo (modo criação)");>> orchestrator.js
echo  }else{>> orchestrator.js
echo    log("Projeto existente detectado");>> orchestrator.js
echo    backupProject();>> orchestrator.js
echo    log("Backup criado");>> orchestrator.js
echo    const review=await reviewer();>> orchestrator.js
echo    log("Análise concluída");>> orchestrator.js
echo    await improver(review);>> orchestrator.js
echo    log("Melhorias aplicadas");>> orchestrator.js
echo  }>> orchestrator.js
echo }>> orchestrator.js

echo ================================
echo UPGRADE CONCLUIDO!
echo ================================
echo.
echo Configure sua API da OpenAI:
echo setx OPENAI_API_KEY "SUA_CHAVE"
echo.
pause