$projectRoot = Split-Path -Parent $PSScriptRoot
$utf8Strict = New-Object System.Text.UTF8Encoding($false, $true)
$textExtensions = @('.js', '.mjs', '.ts', '.html', '.css', '.json', '.md', '.sql', '.ps1')
$errors = [System.Collections.Generic.List[string]]::new()

Get-ChildItem -LiteralPath $projectRoot -Recurse -File | Where-Object {
  $_.Extension -in $textExtensions -and
  $_.FullName -notmatch '[\\/](\.git|work)[\\/]'
} | ForEach-Object {
  try {
    $text = $utf8Strict.GetString([IO.File]::ReadAllBytes($_.FullName))
    if ($text.Contains([char]0xFFFD) -or $text.Contains([char]0x00C3) -or $text.Contains([char]0x00C2)) {
      $errors.Add("Posible texto mal decodificado: $($_.FullName)")
    }
  } catch {
    $errors.Add("No es UTF-8 valido: $($_.FullName)")
  }
}

if ($errors.Count -gt 0) {
  $errors | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Host 'Todos los archivos de texto son UTF-8 valido y no se detecto texto mal decodificado.'
