$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot "artifacts"
$package = Get-Content -Raw (Join-Path $projectRoot "package.json") | ConvertFrom-Json
$dateTag = Get-Date -Format "yyyyMMdd"
$archiveName = "$($package.name)-v$($package.version)-$dateTag.zip"
$archivePath = Join-Path $outputDirectory $archiveName

Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

if (Test-Path -LiteralPath $archivePath) {
  Remove-Item -LiteralPath $archivePath -Force
}

$excludedTopLevelEntries = @(".git", "node_modules", ".next", "bun.lock", "artifacts")
$projectRootPrefix = "$projectRoot\"
$sourceFiles = Get-ChildItem -LiteralPath $projectRoot -File -Recurse -Force |
  Where-Object {
    $relativePath = $_.FullName.Substring($projectRootPrefix.Length)
    $topLevelEntry = ($relativePath -split "[\\/]")[0]
    $topLevelEntry -notin $excludedTopLevelEntries -and $_.Name -notlike ".env*"
  } |
  ForEach-Object { $_.FullName.Substring($projectRootPrefix.Length).Replace("\", "/") }

$archive = $null
try {
  $archive = [System.IO.Compression.ZipFile]::Open(
    $archivePath,
    [System.IO.Compression.ZipArchiveMode]::Create
  )

  foreach ($sourceFile in $sourceFiles) {
    $sourcePath = Join-Path $projectRoot $sourceFile
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive,
      $sourcePath,
      $sourceFile,
      [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
} finally {
  if ($null -ne $archive) {
    $archive.Dispose()
  }
}

Write-Host "Created source package: $archivePath"
