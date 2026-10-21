$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$rootPrefix = $root.TrimEnd('\') + '\'
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse('127.0.0.1'), 4173)
$listener.Start()
Write-Host 'Local preview: http://127.0.0.1:4173/  (Ctrl+C to stop)'
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.svg'='image/svg+xml' }
$utf8 = [System.Text.Encoding]::UTF8
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $stream.ReadTimeout = 5000
      $reader = [System.IO.StreamReader]::new($stream, $utf8, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      if (!$requestLine) { continue }
      $parts = $requestLine.Split(' ')
      $method = $parts[0]
      $urlPath = if ($parts.Length -gt 1) { $parts[1].Split('?')[0] } else { '/' }
      while ($reader.ReadLine() -ne '') { }
      $relative = [Uri]::UnescapeDataString($urlPath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
      $target = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
      $isAllowed = ($target -eq (Join-Path $root 'index.html')) -or ($target -eq (Join-Path $root '404.html')) -or $target.StartsWith(($rootPrefix + 'assets\'), [System.StringComparison]::OrdinalIgnoreCase) -or $target.StartsWith(($rootPrefix + 'src\'), [System.StringComparison]::OrdinalIgnoreCase) -or $target.StartsWith(($rootPrefix + 'dist\'), [System.StringComparison]::OrdinalIgnoreCase)
      if ($method -notin @('GET','HEAD')) { $status = '405 Method Not Allowed'; $body = $utf8.GetBytes('Method not allowed'); $mime='text/plain; charset=utf-8' }
      elseif (!$target.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -or !$isAllowed -or !(Test-Path -LiteralPath $target -PathType Leaf)) { $status = '404 Not Found'; $body = $utf8.GetBytes('Not found'); $mime='text/plain; charset=utf-8' }
      else { $status = '200 OK'; $ext=[System.IO.Path]::GetExtension($target).ToLowerInvariant(); $mime=$types[$ext]; if(!$mime){$mime='application/octet-stream'}; $body=[System.IO.File]::ReadAllBytes($target) }
      $head = "HTTP/1.1 $status`r`nContent-Type: $mime`r`nContent-Length: $($body.Length)`r`nX-Content-Type-Options: nosniff`r`nConnection: close`r`n`r`n"
      $headerBytes = $utf8.GetBytes($head)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      if ($method -ne 'HEAD' -and $body.Length) { $stream.Write($body, 0, $body.Length) }
      $stream.Flush()
    } catch { }
    finally { $client.Close() }
  }
} finally { $listener.Stop() }
