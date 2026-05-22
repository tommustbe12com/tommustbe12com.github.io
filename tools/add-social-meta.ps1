$ErrorActionPreference = "Stop"

Set-StrictMode -Version Latest

function Get-ThemeColorHex {
  param(
    [Parameter(Mandatory = $true)][string]$Key
  )

  # colors are fine ig 
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Key)
  $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
  $h = ($hash[0] + ($hash[1] * 256)) % 360
  $s = 70
  $l = 45

  function Hue2Rgb([double]$p, [double]$q, [double]$t) {
    if ($t -lt 0) { $t += 1 }
    if ($t -gt 1) { $t -= 1 }
    if ($t -lt (1.0/6.0)) { return $p + ($q - $p) * 6 * $t }
    if ($t -lt 0.5) { return $q }
    if ($t -lt (2.0/3.0)) { return $p + ($q - $p) * ((2.0/3.0) - $t) * 6 }
    return $p
  }

  $hd = $h / 360.0
  $sd = $s / 100.0
  $ld = $l / 100.0

  if ($sd -eq 0) {
    $r = $ld; $g = $ld; $b = $ld
  } else {
    $q = if ($ld -lt 0.5) { $ld * (1 + $sd) } else { $ld + $sd - ($ld * $sd) }
    $p = 2 * $ld - $q
    $r = Hue2Rgb $p $q ($hd + (1.0/3.0))
    $g = Hue2Rgb $p $q $hd
    $b = Hue2Rgb $p $q ($hd - (1.0/3.0))
  }

  $ri = [int][Math]::Round($r * 255)
  $gi = [int][Math]::Round($g * 255)
  $bi = [int][Math]::Round($b * 255)
  return ('#{0:X2}{1:X2}{2:X2}' -f $ri, $gi, $bi)
}

function Get-CanonicalUrl {
  param(
    [Parameter(Mandatory = $true)][string]$SiteBase,
    [Parameter(Mandatory = $true)][string]$RelPath
  )

  $p = $RelPath -replace "\\", "/"
  $p = $p.TrimStart("./")
  if ($p -match "/index\.html$") { $p = $p -replace "/index\.html$", "/" }
  if ($p -eq "index.html") { $p = "/" }
  if (-not $p.StartsWith("/")) { $p = "/" + $p }
  return ($SiteBase.TrimEnd("/") + $p)
}

function Ensure-SocialMeta {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string]$RepoRoot,
    [Parameter(Mandatory = $true)][string]$SiteBase,
    [Parameter(Mandatory = $true)][string]$DefaultOgImage
  )

  $rel = Resolve-Path $FilePath | ForEach-Object {
    $_.Path.Substring($RepoRoot.Length).TrimStart("\","/")
  }

  $html = Get-Content -Raw -Encoding UTF8 $FilePath

  if ($html -notmatch '<head[\s>]' ) { return $false }
  if ($html -match 'property=["'']og:' ) { return $false } #already og tag

  $title = $null
  if ($html -match '<title[^>]*>(?<t>[\s\S]*?)</title>') {
    $title = ($Matches["t"] -replace "\\s+", " ").Trim()
  }
  if ([string]::IsNullOrWhiteSpace($title)) {
    $title = "tommustbe12.com"
  }

  $description = $null
  if ($html -match '<meta[^>]+name=["'']description["''][^>]+content=["''](?<d>[^"'']+)["''][^>]*>') {
    $description = $Matches["d"].Trim()
  } else {
    $cleanTitle = ($title -replace "\\s+", " ").Trim()
    $description = "Info about $cleanTitle on tommustbe12.com."
  }

  $canonical = Get-CanonicalUrl -SiteBase $SiteBase -RelPath $rel
  $theme = Get-ThemeColorHex -Key $rel

  $metaBlock = @"
  <meta name="description" content="$description">
  <link rel="canonical" href="$canonical">

  <meta property="og:site_name" content="tommustbe12.com">
  <meta property="og:type" content="website">
  <meta property="og:title" content="$title">
  <meta property="og:description" content="$description">
  <meta property="og:url" content="$canonical">
  <meta property="og:image" content="$DefaultOgImage">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="$title">
  <meta name="twitter:description" content="$description">
  <meta name="twitter:image" content="$DefaultOgImage">

  <meta name="theme-color" content="$theme">
"@

  # insert afte title
  if ($html -match '</title>') {
    $updated = [Regex]::Replace($html, '(</title>)', "`$1`r`n`r`n$metaBlock", 1)
  } else {
    $updated = [Regex]::Replace($html, '(<head[^>]*>)', "`$1`r`n`r`n$metaBlock", 1)
  }

  if ($updated -ne $html) {
    Set-Content -Encoding UTF8 -NoNewline -Path $FilePath -Value $updated
    return $true
  }
  return $false
}

$repoRoot = (Resolve-Path ".").Path

# cname first line if possible
$siteBase = "https://tommustbe12.com"
if (Test-Path "CNAME") {
  $first = (Get-Content "CNAME" -ErrorAction SilentlyContinue | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 1)
  if ($first) { $siteBase = "https://$($first.Trim())" }
}

$defaultOgImage = "$($siteBase.TrimEnd('/'))/assets/logo.png"

$files = rg --files --glob "*.html"
$changed = 0
$scanned = 0
foreach ($f in $files) {
  $scanned++
  $full = Join-Path $repoRoot $f
  if (Ensure-SocialMeta -FilePath $full -RepoRoot $repoRoot -SiteBase $siteBase -DefaultOgImage $defaultOgImage) {
    $changed++
  }
}

Write-Host "Scanned: $scanned"
Write-Host "Updated: $changed"
