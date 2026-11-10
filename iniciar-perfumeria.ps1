# Iniciar Maison Luxury desde PowerShell: .\iniciar-perfumeria.ps1
param([switch]$SinNavegador, [switch]$Firebase)
$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
Set-Location $raiz

foreach ($cmd in @('java', 'mvn', 'npm')) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    throw "Falta '$cmd' en PATH. Instalalo y vuelve a abrir la terminal."
  }
}

if (-not (Test-Path -LiteralPath (Join-Path $raiz '.env'))) {
  Copy-Item -LiteralPath (Join-Path $raiz '.env.example') -Destination (Join-Path $raiz '.env')
}

# Cargar las opciones SMTP privadas del .env compartido en todos los procesos Java.
# Solo se leen nombres concretos; nunca se imprimen contrasenas en la consola.
$clavesCorreo = @('SMTP_HOST', 'SMTP_PORT', 'SMTP_AUTH', 'SMTP_STARTTLS', 'SMTP_USER', 'SMTP_PASSWORD', 'MAIL_FROM', 'MAIL_ENABLED')
foreach ($linea in (Get-Content -LiteralPath (Join-Path $raiz '.env') -Encoding UTF8)) {
  $texto = $linea.Trim()
  if ($texto -match '^([A-Za-z_][A-Za-z_0-9]*)\s*=\s*(.*)$') {
    $nombre = $Matches[1]
    if ($clavesCorreo -contains $nombre) {
      $valor = $Matches[2].Trim()
      if ($valor.Length -ge 2 -and (($valor.StartsWith('"') -and $valor.EndsWith('"')) -or ($valor.StartsWith("'") -and $valor.EndsWith("'")))) {
        $valor = $valor.Substring(1, $valor.Length - 2)
      }
      [Environment]::SetEnvironmentVariable($nombre, $valor, 'Process')
    }
  }
}

$correoRemitente = [string]$env:SMTP_USER
$claveAplicacion = [string]$env:SMTP_PASSWORD
if ($env:SMTP_HOST -eq 'smtp.gmail.com') {
  $claveAplicacion = $claveAplicacion -replace '\s', ''
  if ($claveAplicacion -and $claveAplicacion.Length -ne 16) {
    Write-Warning 'Gmail requiere una clave de aplicacion de 16 caracteres en SMTP_PASSWORD.'
    $claveAplicacion = ''
  }
}
if ($correoRemitente -match '^[^@\s]+@[^@\s]+\.[^@\s]+$' -and
    $claveAplicacion.Length -gt 0 -and $env:MAIL_ENABLED -ne 'false') {
  $env:SMTP_PASSWORD = $claveAplicacion
  if ([string]::IsNullOrWhiteSpace($env:MAIL_FROM)) { $env:MAIL_FROM = $correoRemitente }
  $env:MAIL_ENABLED = 'true'
  Write-Host "Correo transaccional habilitado para Catalogo, Usuarios y Ordenes ($correoRemitente)."
} else {
  $env:MAIL_ENABLED = 'false'
  Write-Warning 'Correo desactivado: completa SMTP_USER y SMTP_PASSWORD en .env y vuelve a iniciar el proyecto.'
}
$claveAplicacion = $null

if (-not (Test-Path 'node_modules')) {
  Write-Host 'Instalando dependencias npm...'
  npm.cmd ci
  if ($LASTEXITCODE -ne 0) { throw 'npm ci fallo' }
}

# No iniciar servicios duplicados: las credenciales/configuracion solo se leen al arrancar.
foreach ($puerto in 8080,8081,8082,8083,5173) {
  if (Get-NetTCPConnection -LocalPort $puerto -State Listen -ErrorAction SilentlyContinue) {
    throw "El puerto $puerto ya esta ocupado. Deten los procesos anteriores y reinicia el proyecto."
  }
}

if ($Firebase) {
  $env:SPRING_PROFILES_ACTIVE = 'firebase'
  Write-Host 'Iniciando los servicios con el perfil Firebase PostgreSQL.'
}
foreach ($svc in @('ms-catalogo', 'ms-usuarios', 'ms-ordenes', 'gateway')) {
  Write-Host "Iniciando $svc..."
  Start-Process -FilePath 'powershell.exe' -WorkingDirectory (Join-Path $raiz "backend/$svc") -ArgumentList @('-NoExit', '-Command', 'mvn spring-boot:run')
}
Write-Host 'Iniciando frontend...'
Start-Process -FilePath 'powershell.exe' -WorkingDirectory $raiz -ArgumentList @('-NoExit', '-Command', 'npm.cmd run dev')
Write-Host 'Abre http://localhost:5173 despues de que arranquen los servicios.'
if (-not $SinNavegador) { Start-Sleep -Seconds 14; Start-Process 'http://localhost:5173' }

# Los procesos Java ya heredaron la configuracion al iniciarse.
Remove-Item Env:SMTP_PASSWORD -ErrorAction SilentlyContinue
