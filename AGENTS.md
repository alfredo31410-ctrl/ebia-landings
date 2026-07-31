# AGENTS.md

## Flujo Git autorizado

- El trabajo de producción se realiza directamente sobre `main`.
- Antes de modificar, confirmar el estado limpio y actualizar `main` con `git pull --ff-only origin main`.
- No crear ramas de feature ni Pull Requests para correcciones de este repositorio.
- No usar `git reset --hard`, `git rebase`, `git stash` ni `git push --force`.
- No hacer merge de ramas locales o remotas sin autorización explícita.
- Antes de publicar, ejecutar las validaciones del proyecto y revisar el diff completo.
- No incluir secretos, archivos `.env*`, credenciales, tokens, URLs privadas ni archivos temporales.
