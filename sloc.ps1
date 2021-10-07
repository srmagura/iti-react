# https://github.com/boyter/scc
scc -i ts,tsx,js,cjs,scss,cs,yml `
    --exclude-dir .git,.yarn,wwwroot,Models\Generated,docs `
    --no-size --no-cocomo --no-complexity -s code
    | Out-String 
    | ForEach-Object {$_ -replace "ΓöÇ", "—"}
    | Out-File sloc.txt