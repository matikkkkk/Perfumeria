# Luxury Perfumeria - ejecutar desde PowerShell: .\iniciar-perfumeria.ps1
param([switch]$SinNavegador)
$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
Set-Location $raiz
foreach ($cmd in @('java','mvn','npm')) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "Falta '$cmd' en PATH. Instalalo y abre otra terminal." }
}
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
if (-not (Test-Path 'node_modules')) { Write-Host 'Instalando dependencias npm...'; npm ci; if ($LASTEXITCODE -ne 0) { throw 'npm ci fallo' } }
# H2 se crea automaticamente en cada microservicio; no requiere MySQL.
foreach ($puerto in 8080,8081,8082,8083,5173) {
  if (Get-NetTCPConnection -LocalPort $puerto -State Listen -ErrorAction SilentlyContinue) {
    throw "El puerto $puerto ya esta ocupado. Deten el proceso anterior antes de iniciar otra copia."
  }
}
# Configuracion opcional de Gmail para enviar comprobantes PDF.
# Las credenciales se introducen en cada ejecucion y no se escriben en archivos.
$respuestaCorreo = Read-Host 'Activar correos Gmail (boletas, seguimiento, stock y bienvenida)? (S/N, por defecto N)'
if ($respuestaCorreo -match '^[sS]$') {
  $env:SMTP_HOST = 'smtp.gmail.com'
  $env:SMTP_PORT = '587'
  $env:SMTP_AUTH = 'true'
  $env:SMTP_STARTTLS = 'true'
  $correoRemitente = (Read-Host 'Direccion Gmail remitente').Trim()
  if ($correoRemitente -notmatch '^[^@\s]+@(?:gmail\.com|googlemail\.com)$') {
    throw 'Indica una direccion Gmail valida. Para otros proveedores usa variables SMTP externas.'
  }
  $claveSegura = Read-Host 'Contrasena de aplicacion de Google (NO tu contrasena normal)' -AsSecureString
  $clavePtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($claveSegura)
  try { $claveCorreo = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($clavePtr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($clavePtr) }
  $claveCorreo = $claveCorreo -replace '\s',''
  if ([string]::IsNullOrWhiteSpace($claveCorreo)) { throw 'Falta la contrasena de aplicacion.' }
  $env:SMTP_USER = $correoRemitente
  $env:SMTP_PASSWORD = $claveCorreo
  $env:MAIL_FROM = $correoRemitente
  $env:MAIL_ENABLED = 'true'
  $claveCorreo = $null
  Write-Host 'Gmail SMTP habilitado para los microservicios (incluye ms-usuarios) (smtp.gmail.com:587 / STARTTLS).'
} else {
  $env:MAIL_ENABLED = 'false'
  Write-Host 'Envio por correo desactivado para esta ejecucion.'
}
foreach ($svc in @('ms-catalogo','ms-usuarios','ms-ordenes','gateway')) {
  Write-Host "Iniciando $svc..."
  Start-Process -FilePath 'powershell.exe' -WorkingDirectory (Join-Path $raiz "backend/$svc") -ArgumentList @('-NoExit','-Command','mvn spring-boot:run')
}
Write-Host 'Iniciando frontend...'
Start-Process -FilePath 'powershell.exe' -WorkingDirectory $raiz -ArgumentList @('-NoExit','-Command','npm run dev')
Write-Host 'Espera unos segundos a que los 5 procesos arranquen. Luego abre http://localhost:5173'
if (-not $SinNavegador) { Start-Sleep -Seconds 14; Start-Process 'http://localhost:5173' }
# Limitar vida de las credenciales en la terminal principal. Los procesos Java ya las heredaron.
Remove-Item Env:SMTP_PASSWORD -ErrorAction SilentlyContinue
