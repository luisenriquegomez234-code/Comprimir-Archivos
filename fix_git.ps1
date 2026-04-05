git reset --soft f925172
git rm -r --cached dist/
git rm -r --cached build/
git rm --cached *.log
git rm --cached git_log* err.txt
git add .
git commit -m "docs/chore: actualizar diagramas de arquitectura y obviar binarios pesados"
git push
