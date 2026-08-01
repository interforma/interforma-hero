# Instrucciones para iniciar con Claude Code

## 1. Copia este paquete al repositorio

La raíz debe quedar así:

```text
AGENTS.md
CLAUDE_START_HERE.md
.interforma/
prompts/
src/                  # cuando comience la implementación
```

## 2. Abre Claude Code en la raíz

Antes de pedir desarrollo, solicita:

> Lee `AGENTS.md` y todos los archivos de `.interforma/`. Resume las reglas que debes respetar, identifica contradicciones y confirma que todavía no modificarás archivos.

## 3. Ejecuta PROMPT-001

Luego indica:

> Ejecuta las instrucciones de `prompts/PROMPT-001-product-architect.md`. En esta etapa no escribas código ni modifiques el repositorio. Guarda tu propuesta final en `docs/01-product-architecture.md` solo después de mostrarla y recibir mi aprobación.

## 4. Revisa el resultado

Comprueba especialmente:

- claridad del hero;
- centralidad del Método Interforma;
- recorrido del lead;
- diagnóstico;
- CTA;
- WhatsApp;
- eventos de tracking;
- arquitectura SEO/GEO;
- alcance del MVP.

## 5. Aprobación

Cuando el documento esté correcto, responde:

> Arquitectura aprobada. Actualiza `.interforma/DECISIONS.md` con las decisiones confirmadas y crea el backlog técnico del MVP. No implementes todavía.

## 6. Próxima etapa

Después corresponde crear y ejecutar PROMPT-002 para UX/UI.

## Regla urgente

Como el sitio actual está caído, Claude debe priorizar un MVP publicable, pero no debe saltarse:

- arquitectura;
- QA;
- preview de Vercel;
- respaldo DNS;
- rollback de Firebase.

## Comandos conversacionales útiles

### Revisar cambios antes de aplicarlos

> Muéstrame el plan y los archivos que cambiarías. No edites todavía.

### Implementar una etapa aprobada

> Implementa únicamente el alcance aprobado. No agregues funcionalidades futuras.

### Verificar cumplimiento

> Revisa el trabajo contra `AGENTS.md` y entrega una tabla con Cumple / Parcial / Pendiente.

### Evitar expansión del alcance

> Todo lo que no pertenezca al MVP debe registrarse en `.interforma/ROADMAP.md`, no implementarse.
