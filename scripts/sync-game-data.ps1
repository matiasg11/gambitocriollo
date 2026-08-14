$projectRoot = Split-Path -Parent $PSScriptRoot
$functionRoot = Join-Path $projectRoot 'supabase\functions\game-api'

Copy-Item -LiteralPath (Join-Path $projectRoot 'game-config.js') -Destination (Join-Path $functionRoot 'game-config.js') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'career-events.js') -Destination (Join-Path $functionRoot 'career-events.js') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'achievements.js') -Destination (Join-Path $functionRoot 'achievements.js') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'exercises.js') -Destination (Join-Path $functionRoot 'exercises.js') -Force

Write-Host 'Reglas, dilemas, logros y ejercicios sincronizados con la funcion game-api.'
